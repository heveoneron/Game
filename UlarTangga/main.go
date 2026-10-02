package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"ulartangga/deck"
	"ulartangga/models"
	"ulartangga/rooms"
	"ulartangga/skills"
)

var (
	upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

	snakesAndLadders = map[int]int{
		4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92, // Tangga 🪜 (Naik)
		27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41, // Ular 🐍 (Turun)
	}
)

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func getLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "localhost"
	}
	var fallbackIP string
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ipStr := ipnet.IP.String()
				// Abaikan APIPA (Disconnected adapter)
				if strings.HasPrefix(ipStr, "169.254.") {
					continue
				}
				// Prioritaskan IP lokal rumahan / Wi-Fi umum
				if strings.HasPrefix(ipStr, "192.168.") || strings.HasPrefix(ipStr, "10.") {
					return ipStr
				}
				if fallbackIP == "" {
					fallbackIP = ipStr
				}
			}
		}
	}
	if fallbackIP != "" {
		return fallbackIP
	}
	return "localhost"
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Gagal upgrade websocket:", err)
		return
	}
	defer conn.Close()

	// Dapatkan atau buat room berdasarkan query param '?room=CODE'
	roomCode := r.URL.Query().Get("room")
	room := rooms.Manager.GetOrCreateRoom(roomCode)
	room.AddClient(conn)
	defer room.RemoveClient(conn)

	// Kirim state awal room kepada pemain yang baru bergabung
	conn.WriteJSON(map[string]interface{}{
		"type":     "STATE_UPDATE",
		"roomCode": room.Code,
		"state":    room.State,
	})

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		var action map[string]interface{}
		if err := json.Unmarshal(message, &action); err != nil {
			continue
		}

		aType, _ := action["type"].(string)

		var broadcastPayload interface{}
		var shouldBroadcastState bool

		room.Mutex.Lock()
		state := room.State

		switch aType {
		case "ROLL_DICE":
			if state.IsGameOver {
				room.Mutex.Unlock()
				continue
			}

			pNum := state.Turn

			// Cek apakah angka dadu ditentukan oleh Skill Dadu Sakti
			dice := rand.Intn(6) + 1
			if fixed, ok := action["fixedDice"].(float64); ok && fixed >= 1 && fixed <= 6 {
				dice = int(fixed)
			}
			state.LastDice = dice

			fromPos := state.P1Pos
			if pNum == 2 {
				fromPos = state.P2Pos
			}

			nextPos := min(100, fromPos+dice)
			jumpDest := snakesAndLadders[nextPos]
			finalPos := nextPos

			isShielded := false
			if jumpDest > 0 {
				if jumpDest < nextPos { // Ular
					if shield, ok := action["useShield"].(bool); ok && shield {
						isShielded = true
						finalPos = nextPos
						jumpDest = 0
					} else {
						finalPos = jumpDest
					}
				} else { // Tangga
					finalPos = jumpDest
				}
			}

			// Cek apakah pemain mencapai garis FINISH (Kotak 100)
			if finalPos >= 100 {
				finalPos = 100
				state.IsGameOver = true
				state.WinnerNum = pNum
			}

			// Cek apakah Double Roll aktif
			isDoubleRoll, _ := action["isDoubleRoll"].(bool)
			nextTurn := 1
			if pNum == 1 {
				state.P1Pos = finalPos
				if isDoubleRoll {
					nextTurn = 1
					state.Turn = 1
				} else {
					nextTurn = 2
					state.Turn = 2
				}
			} else {
				state.P2Pos = finalPos
				if isDoubleRoll {
					nextTurn = 2
					state.Turn = 2
				} else {
					nextTurn = 1
					state.Turn = 1
				}
			}
			state.ActiveCard = nil // Tutup kartu sebelumnya

			broadcastPayload = map[string]interface{}{
				"type":         "DICE_ROLLED",
				"player":       pNum,
				"dice":         dice,
				"fromPos":      fromPos,
				"nextPos":      nextPos,
				"jumpDest":     jumpDest,
				"finalPos":     finalPos,
				"nextTurn":     nextTurn,
				"isDoubleRoll": isDoubleRoll,
				"isShielded":   isShielded,
				"isGameOver":   state.IsGameOver,
				"winnerNum":    state.WinnerNum,
			}

		case "CONFIG_SKILLS":
			rerolls := 3
			if r, ok := action["rerollQuota"].(float64); ok && r > 0 {
				rerolls = int(r)
			}
			if p1s, ok := action["p1Skills"].([]interface{}); ok {
				var list []string
				for _, v := range p1s {
					if s, ok := v.(string); ok {
						list = append(list, s)
					}
				}
				state.P1Skills = skills.InitSkills(list, rerolls)
			}
			if p2s, ok := action["p2Skills"].([]interface{}); ok {
				var list []string
				for _, v := range p2s {
					if s, ok := v.(string); ok {
						list = append(list, s)
					}
				}
				state.P2Skills = skills.InitSkills(list, rerolls)
			}
			shouldBroadcastState = true

		case "USE_SKILL":
			player := int(action["player"].(float64))
			skillName, _ := action["skill"].(string)

			pSkills := &state.P1Skills
			if player == 2 {
				pSkills = &state.P2Skills
			}

			if skillName == "reroll_card" {
				if pSkills.RerollCount > 0 {
					pSkills.RerollCount--
				}
			} else if count, exists := pSkills.SkillUses[skillName]; exists && count > 0 {
				pSkills.SkillUses[skillName]--
			}

			broadcastPayload = map[string]interface{}{
				"type":   "SKILL_ACTIVATED",
				"player": player,
				"skill":  skillName,
				"state":  state,
			}

		case "SHOW_CARD":
			tile := 1
			if t, ok := action["tile"].(float64); ok {
				tile = int(t)
			}
			cType, _ := action["cardType"].(string)
			cat, _ := action["category"].(string)
			prompt, _ := action["prompt"].(string)
			targetP := 1
			if tp, ok := action["targetP"].(float64); ok {
				targetP = int(tp)
			}

			if cid, ok := action["cardId"].(float64); ok && cid > 0 {
				state.UsedCardIds = append(state.UsedCardIds, int(cid))
			}

			loveLang, _ := action["loveLanguage"].(string)
			if loveLang == "" {
				loveLang = deck.LoveLanguageGeneral
			}
			cardMode, _ := action["mode"].(string)
			if cardMode == "" {
				cardMode = deck.ModeBoth
			}

			state.ActiveCard = &models.ActiveCardPayload{
				Tile:         tile,
				Type:         cType,
				LoveLanguage: loveLang,
				Mode:         cardMode,
				Category:     cat,
				Prompt:       prompt,
				TargetP:      targetP,
			}

			broadcastPayload = map[string]interface{}{
				"type": "CARD_REVEALED",
				"card": state.ActiveCard,
			}

		case "CLOSE_MODAL":
			state.ActiveCard = nil
			broadcastPayload = map[string]interface{}{
				"type": "MODAL_CLOSED",
			}

		case "MOVE_PAWN":
			player := int(action["player"].(float64))
			pos := int(action["pos"].(float64))
			if player == 1 {
				state.P1Pos = pos
			} else {
				state.P2Pos = pos
			}
			shouldBroadcastState = true

		case "SUIT":
			opts := []string{
				"✊ Batu vs ✌️ Gunting (Pemain 1 Menang & Jalan Duluan! 🚀)",
				"✋ Kertas vs ✊ Batu (Pemain 1 Menang & Jalan Duluan! 🚀)",
				"✌️ Gunting vs ✋ Kertas (Pemain 1 Menang & Jalan Duluan! 🚀)",
				"✌️ Gunting vs ✊ Batu (Pemain 2 Menang & Jalan Duluan! 🚀)",
				"✊ Batu vs ✋ Kertas (Pemain 2 Menang & Jalan Duluan! 🚀)",
				"✋ Kertas vs ✌️ Gunting (Pemain 2 Menang & Jalan Duluan! 🚀)",
				"🤝 Seri! Batu vs Batu (Suit sekali lagi yuk!)",
			}
			res := opts[rand.Intn(len(opts))]
			state.RpsResult = res
			broadcastPayload = map[string]interface{}{
				"type":   "SUIT_RESULT",
				"result": res,
			}

		case "UPDATE_PLAYERS":
			if p1, ok := action["p1"].(map[string]interface{}); ok {
				if n, ok := p1["name"].(string); ok && n != "" {
					state.P1Info.Name = n
				}
				if a, ok := p1["avatar"].(string); ok && a != "" {
					state.P1Info.Avatar = a
				}
			}
			if p2, ok := action["p2"].(map[string]interface{}); ok {
				if n, ok := p2["name"].(string); ok && n != "" {
					state.P2Info.Name = n
				}
				if a, ok := p2["avatar"].(string); ok && a != "" {
					state.P2Info.Avatar = a
				}
			}
			shouldBroadcastState = true

		case "ADD_CUSTOM_CARD":
			cType, _ := action["cardType"].(string)
			cat, _ := action["category"].(string)
			prompt, _ := action["prompt"].(string)
			loveLang, _ := action["loveLanguage"].(string)
			if loveLang == "" {
				loveLang = deck.LoveLanguageGeneral
			}
			cMode, _ := action["mode"].(string)
			if cMode == "" {
				cMode = deck.ModeBoth
			}
			if prompt != "" {
				newCard := models.QuestionCard{
					ID:           len(deck.GetAllCards()) + len(state.CustomDeck) + 1,
					Type:         cType,
					LoveLanguage: loveLang,
					Mode:         cMode,
					Category:     cat,
					Prompt:       prompt,
					IsCustom:     true,
				}
				state.CustomDeck = append(state.CustomDeck, newCard)
				shouldBroadcastState = true
			}

		case "UPDATE_DECK_SELECTION":
			if mode, ok := action["playMode"].(string); ok && mode != "" {
				state.PlayMode = mode
			}
			if list, ok := action["selectedDecks"].([]interface{}); ok {
				var langs []string
				for _, item := range list {
					if s, ok := item.(string); ok && s != "" {
						langs = append(langs, s)
					}
				}
				if len(langs) > 0 {
					state.SelectedDecks = langs
				}
			}
			shouldBroadcastState = true

		case "UPDATE_PLAY_MODE":
			if mode, ok := action["playMode"].(string); ok && mode != "" {
				state.PlayMode = mode
				shouldBroadcastState = true
			}

		case "RECORD_HISTORY":
			if entryData, ok := action["entry"].(map[string]interface{}); ok {
				newEntry := models.HistoryEntry{
					ID:         int64(entryData["id"].(float64)),
					TurnNumber: int(entryData["turnNumber"].(float64)),
					PlayerNum:  int(entryData["playerNum"].(float64)),
					PlayerName: entryData["playerName"].(string),
					Avatar:     entryData["avatar"].(string),
					Dice:       int(entryData["dice"].(float64)),
					FromPos:    int(entryData["fromPos"].(float64)),
					ToPos:      int(entryData["toPos"].(float64)),
					FinalPos:   int(entryData["finalPos"].(float64)),
					Choice:     entryData["choice"].(string),
					CardType:   entryData["cardType"].(string),
					Category:   entryData["category"].(string),
					Prompt:     entryData["prompt"].(string),
					TimeStr:    entryData["timeStr"].(string),
				}
				if jt, ok := entryData["jumpType"].(string); ok {
					newEntry.JumpType = jt
				}
				if jd, ok := entryData["jumpDest"].(float64); ok {
					newEntry.JumpDest = int(jd)
				}
				if sk, ok := entryData["skillUsed"].(string); ok {
					newEntry.SkillUsed = sk
				}
				state.History = append(state.History, newEntry)
				broadcastPayload = map[string]interface{}{
					"type":  "HISTORY_UPDATED",
					"entry": newEntry,
				}
			}

		case "RESET":
			room.Reset()
			shouldBroadcastState = true

		case "REACTION":
			emoji, _ := action["emoji"].(string)
			sender, _ := action["sender"].(string)
			broadcastPayload = map[string]interface{}{
				"type":   "FLOATING_REACTION",
				"emoji":  emoji,
				"sender": sender,
			}
		}
		room.Mutex.Unlock()

		if shouldBroadcastState {
			room.BroadcastState()
		} else if broadcastPayload != nil {
			room.BroadcastMessage(broadcastPayload)
		}
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	// Static File Server
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	// WebSocket Sync Endpoint (multi-room via ?room=CODE)
	http.HandleFunc("/ws", wsHandler)

	// REST API: Buat Room Baru
	http.HandleFunc("/api/create-room", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		newRoom := rooms.Manager.CreateUniqueRoom()
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"roomCode": newRoom.Code,
		})
	})

	// REST API: Cek Info Room
	http.HandleFunc("/api/room-info", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		code := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("room")))
		rooms.Manager.RLock()
		room, exists := rooms.Manager.Rooms[code]
		rooms.Manager.RUnlock()

		if !exists {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"exists": false,
			})
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"exists":   true,
			"roomCode": room.Code,
			"players":  room.ClientCount(),
			"turn":     room.State.Turn,
			"p1Name":   room.State.P1Info.Name,
			"p2Name":   room.State.P2Info.Name,
			"selectedDecks": room.State.SelectedDecks,
		})
	})

	// REST API: Daftar Metadata Bahasa Cinta
	http.HandleFunc("/api/love-languages", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":       true,
			"loveLanguages": deck.AvailableLoveLanguages,
			"totalCards":    len(deck.GetAllCards()),
			"maxPerGame":    150,
		})
	})

	// REST API: Ambil Seluruh Kartu Sesuai Filter
	http.HandleFunc("/api/deck-cards", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		all := deck.GetAllCards()
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"count":   len(all),
			"cards":   all,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	localIP := getLocalIP()
	log.Println("================================================================")
	log.Println("🎲 SERVER ULAR TANGGA TRUTH OR DARE PASANGAN (MULTI-ROOM) 🎲")
	log.Printf("👉 Buka di Browser Laptop:  http://localhost:%s\n", port)
	log.Printf("👉 Buka dari HP Pasangan:   http://%s:%s\n", localIP, port)
	log.Printf("👉 Format Link Room:        http://%s:%s/?room=KODE\n", localIP, port)
	log.Println("================================================================")

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Server gagal berjalan: %v", err)
	}
}