package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"ulartangga/deck"
	"ulartangga/models"
	"ulartangga/skills"
)

var (
	upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
	clients  = make(map[*websocket.Conn]bool)
	mutex    = &sync.Mutex{}

	snakesAndLadders = map[int]int{
		4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92, // Tangga 🪜 (Naik)
		27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41, // Ular 🐍 (Turun)
	}

	state = models.GameState{
		P1Pos: 1,
		P2Pos: 1,
		P1Info: models.PlayerInfo{
			Name:   "Pemain 1 (Cowok)",
			Avatar: "👦",
			Color:  "#38BDF8",
		},
		P2Info: models.PlayerInfo{
			Name:   "Pemain 2 (Cewek)",
			Avatar: "🧕",
			Color:  "#FB923C",
		},
		P1Skills:   skills.InitSkills(nil, 3),
		P2Skills:   skills.InitSkills(nil, 3),
		Turn:       1,
		LastDice:   1,
		ActiveCard: nil,
		RpsResult:  "",
		CustomDeck: []models.QuestionCard{},
		History:    []models.HistoryEntry{},
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
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return "localhost"
}

func broadcastState() {
	msg, err := json.Marshal(map[string]interface{}{
		"type":  "STATE_UPDATE",
		"state": state,
	})
	if err != nil {
		log.Println("Gagal marshal state:", err)
		return
	}
	for client := range clients {
		err := client.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			client.Close()
			delete(clients, client)
		}
	}
}

func broadcastMessage(payload interface{}) {
	msg, err := json.Marshal(payload)
	if err != nil {
		log.Println("Gagal marshal payload:", err)
		return
	}
	for client := range clients {
		err := client.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			client.Close()
			delete(clients, client)
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Gagal upgrade websocket:", err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	clients[conn] = true
	// Kirim state saat ini ke klien yang baru terhubung
	conn.WriteJSON(map[string]interface{}{
		"type":  "STATE_UPDATE",
		"state": state,
	})
	mutex.Unlock()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			break
		}

		var action map[string]interface{}
		if err := json.Unmarshal(message, &action); err != nil {
			continue
		}

		aType, _ := action["type"].(string)

		mutex.Lock()
		switch aType {
		case "ROLL_DICE":
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

			broadcastMessage(map[string]interface{}{
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
			})

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
			broadcastState()

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

			broadcastMessage(map[string]interface{}{
				"type":   "SKILL_ACTIVATED",
				"player": player,
				"skill":  skillName,
				"state":  state,
			})

		case "SHOW_CARD":
			tile := int(action["tile"].(float64))
			cType, _ := action["cardType"].(string)
			cat, _ := action["category"].(string)
			prompt, _ := action["prompt"].(string)
			targetP := int(action["targetP"].(float64))

			state.ActiveCard = &models.ActiveCardPayload{
				Tile:     tile,
				Type:     cType,
				Category: cat,
				Prompt:   prompt,
				TargetP:  targetP,
			}

			broadcastMessage(map[string]interface{}{
				"type": "CARD_REVEALED",
				"card": state.ActiveCard,
			})

		case "CLOSE_MODAL":
			state.ActiveCard = nil
			broadcastMessage(map[string]interface{}{
				"type": "MODAL_CLOSED",
			})

		case "MOVE_PAWN":
			player := int(action["player"].(float64))
			pos := int(action["pos"].(float64))
			if player == 1 {
				state.P1Pos = pos
			} else {
				state.P2Pos = pos
			}
			broadcastState()

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
			broadcastMessage(map[string]interface{}{
				"type":   "SUIT_RESULT",
				"result": res,
			})

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
			broadcastState()

		case "ADD_CUSTOM_CARD":
			cType, _ := action["cardType"].(string)
			cat, _ := action["category"].(string)
			prompt, _ := action["prompt"].(string)
			if prompt != "" {
				newCard := models.QuestionCard{
					ID:       len(deck.DefaultTruths) + len(deck.DefaultDares) + len(state.CustomDeck) + 1,
					Type:     cType,
					Category: cat,
					Prompt:   prompt,
					IsCustom: true,
				}
				state.CustomDeck = append(state.CustomDeck, newCard)
				broadcastState()
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
				broadcastMessage(map[string]interface{}{
					"type":  "HISTORY_UPDATED",
					"entry": newEntry,
				})
			}

		case "RESET":
			state.P1Pos = 1
			state.P2Pos = 1
			state.Turn = 1
			state.ActiveCard = nil
			state.History = []models.HistoryEntry{}
			// Reset kuota skill kedua pemain kembali penuh
			state.P1Skills = skills.InitSkills(state.P1Skills.SelectedSkills, 3)
			state.P2Skills = skills.InitSkills(state.P2Skills.SelectedSkills, 3)
			broadcastState()

		case "REACTION":
			emoji, _ := action["emoji"].(string)
			sender, _ := action["sender"].(string)
			broadcastMessage(map[string]interface{}{
				"type":   "FLOATING_REACTION",
				"emoji":  emoji,
				"sender": sender,
			})
		}
		mutex.Unlock()
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	// Static File Server
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	// WebSocket Sync Endpoint
	http.HandleFunc("/ws", wsHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	localIP := getLocalIP()
	log.Println("================================================================")
	log.Println("🎲 SERVER ULAR TANGGA TRUTH OR DARE PASANGAN AKTIF! 🎲")
	log.Printf("👉 Buka di Browser Laptop:  http://localhost:%s\n", port)
	log.Printf("👉 Buka dari HP Pasangan:   http://%s:%s\n", localIP, port)
	log.Println("================================================================")

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Server gagal berjalan: %v", err)
	}
}