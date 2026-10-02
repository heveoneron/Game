# Metadata Repositori & Panduan Maintenance
## Ular Tangga Cinta

---

### 1. Struktur Repositori & Peta Folder

```text
UlarTangga/
├── docs/                      # Dokumentasi Teknis & Produk
│   ├── PRD.md                 # Product Requirement Document lengkap
│   ├── ARCHITECTURE.md        # Arsitektur sistem, WebSocket protocol & analisis PostgreSQL
│   └── METADATA.md            # Metadata file ini (struktur kode & panduan maintenance)
├── models/                    # Data Contract / Struct Models (Go)
│   └── models.go              # QuestionCard (LoveLanguage), GameState (SelectedDecks), HistoryEntry
├── deck/                      # Master Data Kartu Resmi & 5 Love Languages (Go)
│   ├── deck.go                # Agregator deck, konstanta bahasa cinta, metadata, mode permainan & BuildGameDeck
│   ├── deck_test.go           # Unit test verifikasi 550 kartu, 100 per bahasa cinta & filter mode
│   ├── words_of_affirmation.go# 100 Kartu Words of Affirmation (50 Truth + 50 Dare)
│   ├── quality_time.go        # 100 Kartu Quality Time (50 Truth + 50 Dare)
│   ├── receiving_gifts.go     # 100 Kartu Receiving Gifts (50 Truth + 50 Dare)
│   ├── acts_of_service.go     # 100 Kartu Acts of Service (50 Truth + 50 Dare)
│   ├── physical_touch.go      # 100 Kartu Physical Touch (50 Truth + 50 Dare, adaptasi LDR & offline)
│   └── general.go             # 50 Kartu General (25 Truth + 25 Dare termasuk landmark 21 & 57)
├── skills/                    # Master Sistem Skill Taktis (Go)
│   └── skills.go              # Definisi 6 skill, fase aktivasi, kuota, dan inisialisasi state
├── rooms/                     # Multi-Room Session Management (Go)
│   └── rooms.go               # RoomManager, pembuatan room unik, isolasi broadcast, auto-clean
├── tools/                     # Utility Generator & Build Tools (Go)
│   └── export_deck.go         # Generator pengekspor master deck Go ke public/js/deck.js
├── public/                    # Frontend Web Assets (HTML, CSS, JS)
│   ├── index.html             # UI Markup semantik, modal pop-up, header & board container
│   ├── css/
│   │   └── style.css          # Styling tema kayu, animasi dadu 3D, pion, tooltip hover
│   └── js/
│       ├── deck.js            # 550 kartu client-side, 5 bahasa cinta, pool sampler, mode filter
│       ├── skills.js          # Tooltip controller, modal 3-tab, trigger aksi skill
│       └── game.js            # Engine game, SVG tangga & ular, audio synth, WebSocket sync, multi-room
├── main.go                    # Entrypoint Server (HTTP file server, REST API, WebSocket handler)
├── Dockerfile                 # Multi-stage Docker build untuk Google Cloud Run
├── go.mod                     # Go module definition
└── go.sum                     # Checksum dependencies (Gorilla WebSocket)
```

---

### 2. Tanggung Jawab Modul (Module Responsibilities)

| Modul | File Terkait | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Data Contracts** | `models/models.go` | Mendefinisikan struktur data bersama antara backend Go dan payload JSON WebSocket (termasuk atribut `mode` dan `playMode`). |
| **Room Manager** | `rooms/rooms.go` | Mengelola sesi room banyak pemain secara terisolasi dan thread-safe dengan `sync.RWMutex`. |
| **Skill Engine** | `skills/skills.go` | Menyimpan kuota dan logika 6 skill taktis (Skip, Double Roll, Snake Shield, Lucky Dice, Uno Reverse, Master Acak). |
| **Love Language Deck**| `deck/*.go` & `public/js/deck.js` | 550 kartu resmi terbagi atas 5 Love Languages @ 100 kartu + 50 General kartu, dengan pemisahan mode Online (LDR/video call) & Offline (tatap muka) dan aturan capping maksimal 150 kartu pilihan per game. |
| **Server Engine** | `main.go` | Menjalankan server HTTP port 8080/`$PORT`, upgrade WebSocket `/ws?room=CODE`, dan REST endpoints. |
| **Client Engine** | `public/js/game.js` | Logika dadu, pathing pion melompat, kalkulasi tangga/ular, deteksi 20 petak takdir, audio synth, log riwayat, toggle mode permainan. |
| **UI Presentation** | `public/index.html` & `style.css` | Tampilan responsif tema kayu, layout papan 10x10, quick button mode permainan, dan 7 modal pop-up. |

---

### 3. Daftar Endpoint API

| Method | Endpoint | Query Param / Body | Response JSON | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | - | HTML | Menyajikan aplikasi web utama. |
| `GET` | `/ws` | `?room=KODE` | WebSocket Upgrade | Menghubungkan client ke room tertentu secara real-time. |
| `GET` | `/api/create-room` | - | `{"success": true, "roomCode": "ABC123"}` | Membuat room baru dengan kode 6 karakter acak unik. |
| `GET` | `/api/room-info` | `?room=KODE` | `{"exists": true, "players": 2, ...}` | Memeriksa ketersediaan dan status room. |
| `GET` | `/api/love-languages` | - | `{"success": true, "loveLanguages": [...], "totalCards": 550, "maxPerGame": 150}` | Mengambil metadata 5 bahasa cinta & aturan limit deck. |
| `GET` | `/api/deck-cards` | - | `{"success": true, "count": 550, "cards": [...]}` | Mengambil seluruh 550 kartu resmi sistem. |

---

### 4. Panduan Menjalankan & Maintenance Lokal

#### A. Menjalankan Server Lokal:
```powershell
# Jalankan langsung dengan Go:
go run main.go

# Atau tentukan port kustom:
$env:PORT="8081"; go run main.go
```

#### B. Menguji Kompilasi Binary:
```powershell
go build -v .
```

#### C. Validasi Sintaks JavaScript:
```powershell
node -c public/js/deck.js public/js/skills.js public/js/game.js
```

#### D. Membuka Game di Browser:
- **Laptop Host:** `http://localhost:8080` (atau `http://localhost:8080/?room=KODEROOM`)
- **HP Pasangan:** `http://<IP-Laptop>:8080/?room=KODEROOM`
