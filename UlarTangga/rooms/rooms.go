package rooms

import (
	"crypto/rand"
	"encoding/json"
	"log"
	"math/big"
	mathrand "math/rand"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"ulartangga/deck"
	"ulartangga/models"
	"ulartangga/skills"
)

// Room merepresentasikan satu sesi permainan berdua yang terisolasi
type Room struct {
	Code       string                   `json:"code"`
	State      *models.GameState        `json:"state"`
	Clients    map[*websocket.Conn]bool `json:"-"`
	Mutex      sync.Mutex               `json:"-"`
	CreatedAt  time.Time                `json:"createdAt"`
	LastActive time.Time                `json:"lastActive"`
}

// RoomManager mengelola kumpulan seluruh room aktif secara thread-safe
type RoomManager struct {
	sync.RWMutex
	Rooms map[string]*Room
}

var Manager = NewRoomManager()

func NewRoomManager() *RoomManager {
	rm := &RoomManager{
		Rooms: make(map[string]*Room),
	}
	// Buat default public room
	rm.GetOrCreateRoom("PUBLIC")

	// Background worker pembersih room tidak aktif (> 24 jam)
	go func() {
		ticker := time.NewTicker(30 * time.Minute)
		for range ticker.C {
			rm.CleanupInactiveRooms(24 * time.Hour)
		}
	}()

	return rm
}

// GenerateMysteryTiles mengundi 20 nomor petak unik acak antara 2 - 99 (tanpa 21 & 57)
func GenerateMysteryTiles() []int {
	mathrand.Seed(time.Now().UnixNano())
	candidates := make([]int, 0, 96)
	for i := 2; i <= 99; i++ {
		if i == 21 || i == 57 {
			continue
		}
		candidates = append(candidates, i)
	}
	mathrand.Shuffle(len(candidates), func(i, j int) {
		candidates[i], candidates[j] = candidates[j], candidates[i]
	})
	tiles := make([]int, 20)
	copy(tiles, candidates[:20])
	sort.Ints(tiles)
	return tiles
}

// GenerateRoomCode membuat 6 digit kode room acak yang mudah dibaca (misal: "LOVE99", "UT4782")
func GenerateRoomCode() string {
	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	b := make([]byte, 6)
	for i := range b {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			b[i] = charset[mathrand.Intn(len(charset))]
		} else {
			b[i] = charset[n.Int64()]
		}
	}
	return string(b)
}

// GetOrCreateRoom mengembalikan room yang sudah ada atau membuat yang baru jika belum terdaftar
func (rm *RoomManager) GetOrCreateRoom(code string) *Room {
	code = strings.ToUpper(strings.TrimSpace(code))
	if code == "" {
		code = "PUBLIC"
	}

	rm.Lock()
	defer rm.Unlock()

	if room, exists := rm.Rooms[code]; exists {
		room.LastActive = time.Now()
		return room
	}

	initialState := &models.GameState{
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
		P1Skills:     skills.InitSkills(nil, 3),
		P2Skills:     skills.InitSkills(nil, 3),
		Turn:         1,
		LastDice:     1,
		ActiveCard:   nil,
		RpsResult:    "",
		PlayMode:      deck.ModeAll,
		SelectedDecks: []string{
			deck.LoveLanguageWordsOfAffirmation,
			deck.LoveLanguageQualityTime,
			deck.LoveLanguageReceivingGifts,
			deck.LoveLanguageActsOfService,
			deck.LoveLanguagePhysicalTouch,
		},
		CustomDeck:   []models.QuestionCard{},
		History:      []models.HistoryEntry{},
		MysteryTiles: GenerateMysteryTiles(),
		UsedCardIds:  []int{},
		IsGameOver:   false,
		WinnerNum:    0,
	}

	newRoom := &Room{
		Code:       code,
		State:      initialState,
		Clients:    make(map[*websocket.Conn]bool),
		CreatedAt:  time.Now(),
		LastActive: time.Now(),
	}

	rm.Rooms[code] = newRoom
	log.Printf("🏠 Room baru dibuat: [%s] (Total Room: %d)\n", code, len(rm.Rooms))
	return newRoom
}

// CreateUniqueRoom membuat room baru dengan kode acak yang belum pernah dipakai
func (rm *RoomManager) CreateUniqueRoom() *Room {
	for {
		code := GenerateRoomCode()
		rm.RLock()
		_, exists := rm.Rooms[code]
		rm.RUnlock()
		if !exists {
			return rm.GetOrCreateRoom(code)
		}
	}
}

// AddClient mendaftarkan koneksi WebSocket pemain ke dalam room
func (r *Room) AddClient(conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	r.Clients[conn] = true
	r.LastActive = time.Now()
}

// RemoveClient melepaskan koneksi WebSocket pemain dari room
func (r *Room) RemoveClient(conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	delete(r.Clients, conn)
	r.LastActive = time.Now()
}

// ClientCount menghitung jumlah pemain/klien yang sedang aktif terhubung ke room ini
func (r *Room) ClientCount() int {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	return len(r.Clients)
}

// BroadcastState menyiarkan state permainan terbaru hanya ke seluruh klien di room ini
func (r *Room) BroadcastState() {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	msg, err := json.Marshal(map[string]interface{}{
		"type":     "STATE_UPDATE",
		"roomCode": r.Code,
		"state":    r.State,
	})
	if err != nil {
		log.Printf("[%s] Gagal marshal state: %v\n", r.Code, err)
		return
	}

	for client := range r.Clients {
		err := client.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			client.Close()
			delete(r.Clients, client)
		}
	}
	r.LastActive = time.Now()
}

// BroadcastMessage menyiarkan event khusus (dadu, animasi, suit, suara) hanya ke klien di room ini
func (r *Room) BroadcastMessage(payload interface{}) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	msg, err := json.Marshal(payload)
	if err != nil {
		log.Printf("[%s] Gagal marshal payload: %v\n", r.Code, err)
		return
	}

	for client := range r.Clients {
		err := client.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			client.Close()
			delete(r.Clients, client)
		}
	}
	r.LastActive = time.Now()
}

// Reset mengembalikan posisi pion room ke petak 1, mengundi ulang 20 petak takdir, dan isi penuh kuota skill
func (r *Room) Reset() {
	r.State.P1Pos = 1
	r.State.P2Pos = 1
	r.State.Turn = 1
	r.State.ActiveCard = nil
	r.State.History = []models.HistoryEntry{}
	r.State.P1Skills = skills.InitSkills(r.State.P1Skills.SelectedSkills, 3)
	r.State.P2Skills = skills.InitSkills(r.State.P2Skills.SelectedSkills, 3)
	r.State.MysteryTiles = GenerateMysteryTiles()
	r.State.UsedCardIds = []int{}
	r.State.IsGameOver = false
	r.State.WinnerNum = 0
	r.LastActive = time.Now()
}

// CleanupInactiveRooms membersihkan room yang sudah ditinggalkan lebih dari batas durasi
func (rm *RoomManager) CleanupInactiveRooms(maxIdle time.Duration) {
	rm.Lock()
	defer rm.Unlock()

	now := time.Now()
	for code, room := range rm.Rooms {
		if code == "PUBLIC" {
			continue // Room publik utama tidak dihapus
		}
		if len(room.Clients) == 0 && now.Sub(room.LastActive) > maxIdle {
			delete(rm.Rooms, code)
			log.Printf("🧹 Room [%s] dibersihkan karena tidak aktif > %v\n", code, maxIdle)
		}
	}
}
