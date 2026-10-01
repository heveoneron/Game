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
)

type QuestionCard struct {
	ID       int    `json:"id"`
	Type     string `json:"type"`     // "TRUTH" atau "DARE"
	Category string `json:"category"` // "Romantis", "Deep Talk", "Konyol", "Spicy", "Memori"
	Prompt   string `json:"prompt"`
	IsCustom bool   `json:"isCustom"`
}

type TileData struct {
	Number   int    `json:"number"`
	Type     string `json:"type"`     // "MYSTERY", "START", "FINISH"
	Category string `json:"category"`
	Prompt   string `json:"prompt"`
	JumpTo   int    `json:"jumpTo"` // Tangga (naik) atau Ular (turun)
}

type PlayerInfo struct {
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Color  string `json:"color"`
}

type ActiveCardPayload struct {
	Tile     int    `json:"tile"`
	Type     string `json:"type"` // "TRUTH" / "DARE"
	Category string `json:"category"`
	Prompt   string `json:"prompt"`
	TargetP  int    `json:"targetP"`
}

type HistoryEntry struct {
	ID         int    `json:"id"`
	TurnNumber int    `json:"turnNumber"`
	PlayerNum  int    `json:"playerNum"`
	PlayerName string `json:"playerName"`
	Avatar     string `json:"avatar"`
	Dice       int    `json:"dice"`
	FromPos    int    `json:"fromPos"`
	ToPos      int    `json:"toPos"`
	FinalPos   int    `json:"finalPos"`
	JumpType   string `json:"jumpType"` // "LADDER", "SNAKE", or ""
	JumpDest   int    `json:"jumpDest"`
	Choice     string `json:"choice"`   // "TRUTH", "DARE", "RANDOM"
	CardType   string `json:"cardType"` // "TRUTH", "DARE", "FINISH"
	Category   string `json:"category"`
	Prompt     string `json:"prompt"`
	TimeStr    string `json:"timeStr"`
}

type GameState struct {
	P1Pos      int                `json:"p1Pos"`
	P2Pos      int                `json:"p2Pos"`
	P1Info     PlayerInfo         `json:"p1Info"`
	P2Info     PlayerInfo         `json:"p2Info"`
	Turn       int                `json:"turn"` // 1 atau 2
	LastDice   int                `json:"lastDice"`
	ActiveCard *ActiveCardPayload `json:"activeCard,omitempty"`
	RpsResult  string             `json:"rpsResult"`
	CustomDeck []QuestionCard     `json:"customDeck"`
	History    []HistoryEntry     `json:"history"`
}

var (
	upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
	clients  = make(map[*websocket.Conn]bool)
	mutex    = &sync.Mutex{}

	snakesAndLadders = map[int]int{
		4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92, // Tangga 🪜 (Naik)
		27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41, // Ular 🐍 (Turun)
	}

	defaultTruths = []QuestionCard{
		{1, "TRUTH", "Deep Talk", "Apa hal pertama yang kamu pikirkan waktu pertama kali kita ketemu atau kenalan?", false},
		{2, "TRUTH", "Memori", "Momen apa selama kita bersama/LDR yang paling bikin kamu kangen berat dan gak bisa tidur?", false},
		{3, "TRUTH", "Romantis", "Apa hal kecil dariku yang paling sering bikin kamu diam-diam tersenyum sendiri?", false},
		{4, "TRUTH", "Deep Talk", "Kapan terakhir kali kamu merasa cemburu, tapi kamu memilih untuk memendamnya sendiri?", false},
		{5, "TRUTH", "Romantis", "Sebutkan 3 sifat atau kebiasaan dariku yang paling bikin kamu merasa nyaman dan aman!", false},
		{6, "TRUTH", "Deep Talk", "Menurutmu, apa tantangan terbesar dalam hubungan kita saat ini dan bagaimana cara kita melaluinya?", false},
		{7, "TRUTH", "Konyol", "Hal konyol atau memalukan apa yang pernah kamu lakuin demi menarik perhatianku waktu awal kenal?", false},
		{8, "TRUTH", "Romantis", "Lagu apa yang setiap kali kamu dengar, otomatis langsung membuatmu mengingat diriku?", false},
		{9, "TRUTH", "Deep Talk", "Pernahkah kamu merasa overthinking tentang masa depan hubungan kita? Apa yang kamu cemaskan?", false},
		{10, "TRUTH", "Memori", "Kalau kita bisa mengulang kembali satu hari terindah dalam hubungan kita, hari mana yang kamu pilih?", false},
		{11, "TRUTH", "Romantis", "Apa panggilan sayang atau kalimat gombalan dariku yang paling bikin kamu salting brutal?", false},
		{12, "TRUTH", "Konyol", "Pernah gak kamu pura-pura sudah tidur atau pura-pura sibuk padahal masih asik scroll sosmed?", false},
		{13, "TRUTH", "Romantis", "Outfit atau gaya penampilan seperti apa dariku yang menurutmu paling memikat hati?", false},
		{14, "TRUTH", "Deep Talk", "Apa ketakutan terbesarmu saat sedang tidak saling memberi kabar lebih dari setengah hari?", false},
		{15, "TRUTH", "Memori", "Kapan momen pertama kalinya kamu yakin dalam hati: 'Kayaknya dia memang orang yang tepat buat aku'?", false},
		{16, "TRUTH", "Deep Talk", "Hal apa dari dirimu sendiri yang paling ingin kamu perbaiki demi kebaikan hubungan kita berdua?", false},
		{17, "TRUTH", "Romantis", "Jika kita punya waktu 24 jam bebas tanpa gadget dan pekerjaan, apa saja hal yang ingin kamu lakukan bersamaku?", false},
		{18, "TRUTH", "Spicy", "Bagian wajah atau tubuhku mana yang paling sering membuatmu gemas dan ingin kamu peluk/cubit?", false},
		{19, "TRUTH", "Konyol", "Siapa di antara kita yang menurutmu paling gengsian dan paling sulit buat minta maaf duluan?", false},
		{20, "TRUTH", "Deep Talk", "Apa topik deeptalk yang selama ini ingin kamu tanyakan ke aku tapi masih ragu atau sungkan?", false},
		{21, "TRUTH", "Memori", "Apa chat atau pesan dariku yang pernah kamu screenshot atau selalu kamu ingat sampai sekarang?", false},
		{22, "TRUTH", "Romantis", "Apa hal yang paling kamu syukuri dari caraku memperlakukanmu selama ini?", false},
		{23, "TRUTH", "Konyol", "Pernah gak kamu stalking akun media sosialku diam-diam sebelum kita resmi jadian?", false},
		{24, "TRUTH", "Romantis", "Apa Love Language utama yang paling membuatmu merasa benar-benar dicintai olehku?", false},
		{25, "TRUTH", "Deep Talk", "Saat kita sedang berselisih paham, perlakuan seperti apa yang paling bisa meluluhkan hatimu?", false},
		{26, "TRUTH", "Memori", "Apa kenangan kencan atau video call kita yang paling berkesan dan bikin kamu terbahak-bahak?", false},
		{27, "TRUTH", "Konyol", "Kalau wajah atau tingkah lakuku diibaratkan karakter kartun, menurutmu aku mirip siapa dan kenapa?", false},
		{28, "TRUTH", "Romantis", "Apa satu kalimat dari aku yang paling berhasil bikin hatimu meleleh dan berbunga-bunga?", false},
		{29, "TRUTH", "Deep Talk", "Pernahkah kamu merasa insecure saat baru pertama kali mengenalku? Insecure tentang apa?", false},
		{30, "TRUTH", "Memori", "Makanan atau jajanan apa yang paling identik dengan momen kebersamaan kita berdua?", false},
		{31, "TRUTH", "Spicy", "Apa hal paling romantis atau manis yang pernah kulakukan yang bikin detak jantungmu berdegup kencang?", false},
		{32, "TRUTH", "Deep Talk", "Seberapa yakin kamu bahwa kita berdua bisa terus bersama dan saling menemani sampai tua nanti?", false},
		{33, "TRUTH", "Konyol", "Pernah gak kamu bohong kecil ke aku cuma demi menghindari perdebatan atau bikin aku senang?", false},
		{34, "TRUTH", "Romantis", "Jika hubungan kita diibaratkan cuaca, cuaca apa yang paling menggambarkan kita saat ini?", false},
		{35, "TRUTH", "Deep Talk", "Apa mimpi atau cita-cita terbesarmu yang ingin kita wujudkan bersama di masa depan?", false},
		{36, "TRUTH", "Memori", "Hal apa yang paling kamu rindukan saat kita sedang berjauhan dan tidak bisa bertemu langsung?", false},
		{37, "TRUTH", "Romantis", "Apa barang atau kado pemberian dariku yang paling berharga dan selalu kamu jaga baik-baik?", false},
		{38, "TRUTH", "Konyol", "Kebiasaan burukku apa yang menurutmu paling aneh tapi anehnya tetap kamu sayangi?", false},
		{39, "TRUTH", "Spicy", "Kapan momen terakhir kali kamu membayangkan kita berdua berduaan di tempat yang sunyi dan romantis?", false},
		{40, "TRUTH", "Deep Talk", "Apakah ada rahasia kecil di masa lalu yang belum pernah kamu ceritakan ke siapapun termasuk aku?", false},
		{41, "TRUTH", "Romantis", "Kalau kamu harus mendeskripsikan diriku dalam 3 kata saja, kata apa yang akan kamu pilih?", false},
		{42, "TRUTH", "Memori", "Apa momen di mana kamu merasa paling bangga bisa menjadi pasangan dari diriku?", false},
		{43, "TRUTH", "Konyol", "Pernah gak kamu merasa ilfeel sesaat sama aku karena tingkah konyolku? Ceritain!", false},
		{44, "TRUTH", "Romantis", "Apa doa atau harapan terbaik yang paling sering kamu panjatkan untuk hubungan kita berdua?", false},
		{45, "TRUTH", "Deep Talk", "Menurutmu, apa kelebihan terbesar dari hubungan kita yang jarang dimiliki pasangan lain?", false},
		{46, "TRUTH", "Spicy", "Hal apa yang paling bisa membuatmu langsung baper atau terpikat dalam sekejap?", false},
		{47, "TRUTH", "Memori", "Ceritakan kembali momen saat pertama kali kita menyatakan perasaan atau resmi jadian!", false},
		{48, "TRUTH", "Romantis", "Kalau kamu punya kekuatan magis untuk mengubah satu hal di dunia ini untuk kita, apa yang ingin kamu ubah?", false},
		{49, "TRUTH", "Deep Talk", "Seandainya hari ini adalah hari terakhir kita bisa berbicara bebas, apa pesan paling tulus yang ingin kamu sampaikan?", false},
		{50, "TRUTH", "Romantis", "Apa satu janji tulus dari hatimu yang ingin kamu pegang teguh untukku selamanya?", false},
		{57, "TRUTH", "Konyol", "Siapa yang paling suka bikin janji 'nanti telpon' tapi kadang PHP alias ternyata gak jadi?", false},
	}

	defaultDares = []QuestionCard{
		{51, "DARE", "Konyol", "Tatap mata pasanganku lekat-lekat selama 30 detik tanpa boleh tersenyum atau tertawa!", false},
		{52, "DARE", "Romantis", "Kirim voice note 15 detik nyanyiin reff lagu cinta paling romantis khusus buat aku sekarang juga!", false},
		{53, "DARE", "Konyol", "Tirukan suara kucing manja yang lagi minta makan sambil nengok ke kamera/pasangan!", false},
		{54, "DARE", "Romantis", "Gombalin aku dengan menggunakan 3 kata acak: 'Kulkas', 'Ular Tangga', dan 'Masa Depan'!", false},
		{55, "DARE", "Konyol", "Kirim/tunjukkan foto selfie dengan ekspresi wajah paling jelek & konyol di galeri HP kamu!", false},
		{56, "DARE", "Romantis", "Berikan 5 pujian tulus tentang fisik dan kepribadianku berturut-turut tanpa jeda berpikir!", false},
		{57, "DARE", "Spicy", "Bisikkan kata-kata paling menggoda atau manis ke telinga pasangan / speaker HP selama 10 detik!", false},
		{58, "DARE", "Konyol", "Joget lucu tanpa musik selama 20 detik di depan pasangan / kamera dengan penuh percaya diri!", false},
		{59, "DARE", "Romantis", "Tulis pesan 1 paragraf berisi alasan kenapa kamu bersyukur punya aku, lalu kirim ke chat kita sekarang!", false},
		{60, "DARE", "Konyol", "Tahan napas sambil bilang 'Aku sayang banget sama kamu dan gak mau kehilangan kamu!' sebanyak 3 kali!", false},
		{61, "DARE", "Romantis", "Pasang foto kita berdua jadi wallpaper HP kamu sampai sesi permainan ini selesai!", false},
		{62, "DARE", "Konyol", "Peragakan cara aku berjalan atau cara aku waktu lagi ngambek dengan akting terbaikmu!", false},
		{63, "DARE", "Spicy", "Tatap kamera/pasangan dengan tatapan paling memikat selama 15 detik tanpa berkedip!", false},
		{64, "DARE", "Romantis", "Berikan kecupan manis bertubi-tubi (jika dekat) atau kirim flying kiss paling heboh ke kamera!", false},
		{65, "DARE", "Konyol", "Nyanyikan lagu anak-anak (misal: Balonku) tapi liriknya diganti rayuan gombal buat aku!", false},
		{66, "DARE", "Deep Talk", "Ceritakan dongeng cinta fiksi 1 menit tentang kisah kita berdua di sebuah kerajaan ajaib!", false},
		{67, "DARE", "Romantis", "Pijat pundak/tangan pasanganmu selama 1 menit (jika dekat) atau senam wajah lucu 20 detik (jika LDR)!", false},
		{68, "DARE", "Konyol", "Bacakan 3 riwayat pencarian terakhir di YouTube atau Instagram kamu tanpa ada yang dihapus!", false},
		{69, "DARE", "Spicy", "Peluk erat pasanganmu selama 1 menit penuh (jika dekat) atau peluk bantal sambil sebut namaku dengan manja!", false},
		{70, "DARE", "Konyol", "Bicara dengan logat daerah atau gaya bahasa robot selama 2 putaran ke depan!", false},
		{71, "DARE", "Konyol", "Impersonate kata kata yang sering aku ucapin waktu videocall pakai gaya suaraku!", false},
		{72, "DARE", "Romantis", "Bikin janji manis yang wajib kamu tepati minggu ini (misal: traktir makanan favoritku)!", false},
		{73, "DARE", "Konyol", "Tunjukkan 3 foto paling terakhir yang tersimpan di galeri HP kamu tanpa sensor!", false},
		{74, "DARE", "Romantis", "Buat pantun romantis spontan yang berakhiran namaku dan bacakan dengan penuh penghayatan!", false},
		{75, "DARE", "Konyol", "Tulis inisial namaku di secarik kertas lalu foto sambil tempel di jidatmu dan kirim ke aku!", false},
		{76, "DARE", "Spicy", "Berikan rayuan paling berani yang belum pernah kamu ucapkan sebelumnya ke aku!", false},
		{77, "DARE", "Konyol", "Katakan 'Kamu adalah jodoh terbaikku' dengan 3 suara berbeda (suara kakek, anak kecil, penyanyi opera)!", false},
		{78, "DARE", "Romantis", "Kirim 15 emoji love dan cium secara beruntun di ruang obrolan kita sekarang juga!", false},
		{79, "DARE", "Konyol", "Akting seperti pelayan restoran bintang lima yang melayani pasanganmu layaknya seorang bangsawan!", false},
		{80, "DARE", "Romantis", "Minum segelas air putih tanpa jeda, lalu katakan 'Manisnya kalah sama senyumanmu'!", false},
		{81, "DARE", "Konyol", "Lakukan pose model majalah fashion paling heboh selama 15 detik tanpa boleh bergerak!", false},
		{82, "DARE", "Deep Talk", "Pejamkan mata dan biarkan pasanganmu mengajukan 1 pertanyaan bebas apa saja yang wajib kamu jawab jujur!", false},
		{83, "DARE", "Romantis", "Gambarkan wajah pasanganmu di secarik kertas dalam waktu 30 detik dan perlihatkan hasilnya!", false},
		{84, "DARE", "Konyol", "Akting pura-pura jadi fans fanatik yang histeris waktu pertama kali ketemu idolanya (yaitu pasanganmu)!", false},
		{85, "DARE", "Spicy", "Sentuh lembut pipi pasanganmu sambil tatap matanya dan ucapkan 'Aku milikmu selamanya'!", false},
		{86, "DARE", "Konyol", "Tirukan suara bayi yang lagi merajuk manja minta digendong sekarang juga!", false},
		{87, "DARE", "Romantis", "Tulis bio singkat di medsosmu dengan kata-kata romantis untukku selama 1 jam ke depan!", false},
		{88, "DARE", "Konyol", "Lakukan push-up atau squat 5 kali sambil di setiap hitungan menyebutkan satu alasan kamu cinta aku!", false},
		{89, "DARE", "Deep Talk", "Berikan pengakuan tulus tentang satu hal yang selama ini selalu membuatmu bersyukur memilikiku!", false},
		{90, "DARE", "Romantis", "Nyanyikan satu bait lagu yang pertama kali mengingatkanmu padaku dengan suara termerdu!", false},
		{91, "DARE", "Konyol", "Pasang muka cemberut paling dramatis seolah-olah baru saja ditolak cintanya!", false},
		{92, "DARE", "Spicy", "Bisikkan janji rahasia yang hanya boleh diketahui oleh kita berdua saja!", false},
		{93, "DARE", "Konyol", "Baca salah satu chat teratas di WhatsApp-mu dengan intonasi pembaca berita gosip selebriti!", false},
		{94, "DARE", "Romantis", "Buat janji kencan impian berikutnya dan tentukan tanggal serta lokasinya sekarang juga!", false},
		{95, "DARE", "Konyol", "Tiru ekspresi senyum pasanganmu waktu lagi salah tingkah atau malu-malu!", false},
		{96, "DARE", "Romantis", "Screenshot tampilan layar permainan ini sekarang dan kirimkan dengan caption ucapan sayang!", false},
		{97, "DARE", "Konyol", "Bikin suara tertawa paling aneh atau tertawa jahat ala villain film kartun!", false},
		{98, "DARE", "Spicy", "Berikan kecupan virtual di layar kamera tepat di tempat wajah pasanganmu berada!", false},
		{99, "DARE", "Romantis", "Berlutut dengan satu kaki (seperti melamar) dan sampaikan kata-kata manis dari hatimu!", false},
		{100, "DARE", "Romantis", "Letakkan tanganmu di dadamu, tatap pasanganmu, dan ucapkan 'Terima kasih sudah mencintaiku apa adanya'!", false},
		{21, "DARE", "Konyol", "Impersonate kata-kata yang sering aku ucapin waktu videocall pakai gaya suaraku!", false},
	}

	state = GameState{
		P1Pos: 1,
		P2Pos: 1,
		P1Info: PlayerInfo{
			Name:   "Pemain 1 (Cowok)",
			Avatar: "👦",
			Color:  "#38BDF8",
		},
		P2Info: PlayerInfo{
			Name:   "Pemain 2 (Cewek)",
			Avatar: "🧕",
			Color:  "#FB923C",
		},
		Turn:       1,
		LastDice:   1,
		ActiveCard: nil,
		CustomDeck: []QuestionCard{},
		History:    []HistoryEntry{},
	}
)

func getLocalIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "localhost"
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

func main() {
	rand.Seed(time.Now().UnixNano())

	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/api/board", getBoardHandler)
	http.HandleFunc("/api/deck", getDeckHandler)
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

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func getBoardHandler(w http.ResponseWriter, r *http.Request) {
	board := make([]TileData, 100)
	for i := 1; i <= 100; i++ {
		tType := "MYSTERY"
		category := "Misteri"
		prompt := ""

		if i == 1 {
			tType = "START"
			prompt = "Mulai petualangan cinta! Siap saling jujur & seru-seruan?"
		} else if i == 100 {
			tType = "FINISH"
			prompt = "🎉 SELAMAT! Kamu mencapai garis FINISH! Pasanganmu wajib mengabulkan 1 permintaan spesial darimu hari ini! ❤️"
		} else if i == 57 {
			category = "Konyol"
			prompt = "Siapa yang paling suka bikin janji 'nanti telpon' tapi kadang PHP alias ternyata gak jadi?"
		} else if i == 21 {
			category = "Konyol"
			prompt = "Impersonate kata-kata yang sering aku ucapin waktu videocall pakai gaya suaraku!"
		}

		board[i-1] = TileData{
			Number:   i,
			Type:     tType,
			Category: category,
			Prompt:   prompt,
			JumpTo:   snakesAndLadders[i],
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}

func getDeckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		allCards := append([]QuestionCard{}, defaultTruths...)
		allCards = append(allCards, defaultDares...)
		mutex.Lock()
		allCards = append(allCards, state.CustomDeck...)
		mutex.Unlock()
		json.NewEncoder(w).Encode(allCards)
		return
	}

	if r.Method == http.MethodPost {
		var newCards []QuestionCard
		if err := json.NewDecoder(r.Body).Decode(&newCards); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		mutex.Lock()
		state.CustomDeck = newCards
		broadcastState()
		mutex.Unlock()
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}
}

func broadcastState() {
	for c := range clients {
		c.WriteJSON(map[string]interface{}{
			"type":  "STATE_UPDATE",
			"state": state,
		})
	}
}

func broadcastMessage(msg map[string]interface{}) {
	for c := range clients {
		c.WriteJSON(msg)
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer ws.Close()

	mutex.Lock()
	clients[ws] = true
	ws.WriteJSON(map[string]interface{}{
		"type":  "STATE_UPDATE",
		"state": state,
	})
	mutex.Unlock()

	for {
		var action map[string]interface{}
		if err := ws.ReadJSON(&action); err != nil {
			mutex.Lock()
			delete(clients, ws)
			mutex.Unlock()
			break
		}

		mutex.Lock()
		actionType, _ := action["type"].(string)

		switch actionType {
		case "ROLL_DICE":
			dice := rand.Intn(6) + 1
			state.LastDice = dice
			pNum := state.Turn

			fromPos := 1
			if pNum == 1 {
				fromPos = state.P1Pos
			} else {
				fromPos = state.P2Pos
			}

			nextPos := min(100, fromPos+dice)
			jumpDest := snakesAndLadders[nextPos]
			finalPos := nextPos
			if jumpDest > 0 {
				finalPos = jumpDest
			}

			// Update state posisi
			if pNum == 1 {
				state.P1Pos = finalPos
				state.Turn = 2
			} else {
				state.P2Pos = finalPos
				state.Turn = 1
			}
			state.ActiveCard = nil // Tutup kartu sebelumnya

			// Broadcast action ROLL_DICE selesai dihitung server
			broadcastMessage(map[string]interface{}{
				"type":     "DICE_ROLLED",
				"player":   pNum,
				"dice":     dice,
				"fromPos":  fromPos,
				"nextPos":  nextPos,
				"jumpDest": jumpDest,
				"finalPos": finalPos,
				"nextTurn": state.Turn,
			})

		case "SHOW_CARD":
			tile := int(action["tile"].(float64))
			cType, _ := action["cardType"].(string)
			cat, _ := action["category"].(string)
			prompt, _ := action["prompt"].(string)
			targetP := int(action["targetP"].(float64))

			state.ActiveCard = &ActiveCardPayload{
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
				newCard := QuestionCard{
					ID:       len(defaultTruths) + len(defaultDares) + len(state.CustomDeck) + 1,
					Type:     cType,
					Category: cat,
					Prompt:   prompt,
					IsCustom: true,
				}
				state.CustomDeck = append(state.CustomDeck, newCard)
				broadcastState()
			}

		case "REACTION":
			emoji, _ := action["emoji"].(string)
			sender, _ := action["sender"].(string)
			broadcastMessage(map[string]interface{}{
				"type":   "FLOATING_REACTION",
				"emoji":  emoji,
				"sender": sender,
			})

		case "RECORD_HISTORY":
			var entry HistoryEntry
			data, _ := json.Marshal(action["entry"])
			if err := json.Unmarshal(data, &entry); err == nil {
				entry.ID = len(state.History) + 1
				entry.TurnNumber = len(state.History) + 1
				if entry.TimeStr == "" {
					entry.TimeStr = time.Now().Format("15:04")
				}
				state.History = append(state.History, entry)
				broadcastMessage(map[string]interface{}{
					"type":    "HISTORY_UPDATED",
					"entry":   entry,
					"history": state.History,
				})
			}

		case "RESET":
			state.P1Pos = 1
			state.P2Pos = 1
			state.Turn = 1
			state.LastDice = 1
			state.ActiveCard = nil
			state.History = []HistoryEntry{}
			broadcastMessage(map[string]interface{}{
				"type":  "STATE_UPDATE",
				"state": state,
			})
		}

		mutex.Unlock()
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}