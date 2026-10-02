# Arsitektur Sistem & Rekomendasi Database (PostgreSQL)
## Ular Tangga Cinta — Real-time Multiplayer Engine

---

### 1. Arsitektur Tingkat Tinggi (High-Level Architecture)

```mermaid
graph TD
    Client1[📱 HP Pasangan 1 / Browser] <--> |WebSocket & HTTP| Server[🚀 Go Backend Server]
    Client2[💻 Laptop Pasangan 2 / Browser] <--> |WebSocket & HTTP| Server
    
    subgraph Go Backend Server
        Router[HTTP Router & Static File Server]
        RoomMgr[Room Manager (Thread-Safe)]
        
        subgraph In-Memory Room Concurrency
            RoomA[Room: LOVE88<br/>• GameState<br/>• 20 Petak Takdir<br/>• Clients Set<br/>• Mutex]
            RoomB[Room: K9X2B7<br/>• GameState<br/>• 20 Petak Takdir<br/>• Clients Set<br/>• Mutex]
            RoomPublic[Room: PUBLIC<br/>• Default Session]
        end
        
        RoomMgr --> RoomA
        RoomMgr --> RoomB
        RoomMgr --> RoomPublic
    end
    
    subgraph Opsional: Persistent Storage Layer
        Postgres[(🐘 PostgreSQL Database)]
        RoomA -.-> |Archive & Auth| Postgres
        RoomB -.-> |Archive & Auth| Postgres
    end
```

---

### 2. Analisis & Jawaban: "Perlukah Menggunakan Database PostgreSQL?"

Pertanyaan user:
> *"karna project ini menurut gw aga lumayan gede jadi menurut lu data" nya ditaro di database postgree ga ya? tapi tetep ikutin peraturan kemaren bro"*

#### 💡 Rekomendasi Arsitektur Senior: **Hybrid Architecture (In-Memory Hot Path + Optional DB Cold Path)**

#### A. Kenapa State Game Real-Time **JANGAN** Ditulis ke PostgreSQL di Setiap Langkah?
1. **Latensi & Responsivitas (Sub-Millisecond vs Disk I/O):**
   - Setiap lemparan dadu, animasi lompatan pion per petak (1➔2➔3), toggle audio, atau emoji melayang (flying reaction) membutuhkan latensi < 10ms.
   - Jika setiap pergerakan kecil harus melakukan `UPDATE game_state SET p1_pos = ... WHERE room_id = ...`, koneksi database akan menjadi bottleneck, meningkatkan latensi WebSocket dan memboroskan pool connection.
2. **Efisiensi Memori Go (RAM Sangat Murah & Cepat):**
   - 1 room permainan lengkap hanya memakan memori RAM sekitar **~15 KB**.
   - Server dengan RAM 512 MB (spesifikasi minimum Cloud Run gratis) sanggup menampung **lebih dari 15.000 room aktif secara bersamaan** dengan kecepatan maksimal tanpa database sama sekali.
3. **Portabilitas & Kemudahan Menjalankan:**
   - Tanpa PostgreSQL, siapapun cukup menjalankan `go run main.go` atau mendistribusikan single binary `.exe` dan langsung bermain tanpa perlu install PostgreSQL server, konfigurasi user/password, atau menjalankan Docker.

---

#### B. Kapan PostgreSQL **BENAR-BENAR DIBUTUHKAN**?
Gunakan PostgreSQL saat game ini diperluas ke **fase produksi komersial (SaaS/Public App)** dengan fitur-fitur berikut:
1. **Sistem Akun & Autentikasi Pengguna:**
   - Login dengan Google/Apple ID atau Nomor WhatsApp.
   - Profil pasangan (tanggal jadian/anniversary, foto berdua).
2. **Penyimpanan Custom Deck di Cloud:**
   - Pasangan yang membuat kartu pertanyaan rahasia sendiri dapat menyimpannya secara permanen di akun mereka, sehingga tidak hilang saat membersihkan cache browser.
3. **Arsip Nostalgia & Riwayat Permainan (Memory Vault):**
   - Rangkuman jawaban Truth or Dare yang telah diselesaikan disimpan bertahun-tahun, sehingga pasangan bisa membaca ulang memori kencan mereka di masa lalu.
4. **Langganan Premium (Monetisasi):**
   - Pembelian deck eksklusif, tema visual papan khusus, atau slot room permanen.

---

### 3. Desain Skema Database PostgreSQL (Siap Pakai / Ready-to-Implement)

Jika kamu ingin menghubungkan PostgreSQL di masa depan, gunakan rancangan skema relasional berikut:

```sql
-- 1. Tabel Akun Pengguna
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Profil Pasangan (Relasi 2 Akun)
CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_one_id UUID REFERENCES users(id) ON DELETE SET NULL,
    partner_two_id UUID REFERENCES users(id) ON DELETE SET NULL,
    anniversary_date DATE,
    custom_nickname VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Sesi Room
CREATE TABLE game_rooms (
    code VARCHAR(10) PRIMARY KEY,
    couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'FINISHED', 'ARCHIVED'
    play_mode VARCHAR(10) DEFAULT 'ONLINE', -- 'ONLINE' (Video Call/LDR), 'OFFLINE' (Ketemu Langsung), 'ALL' (Campuran)
    selected_decks JSONB DEFAULT '["WORDS_OF_AFFIRMATION", "QUALITY_TIME", "RECEIVING_GIFTS", "ACTS_OF_SERVICE", "PHYSICAL_TOUCH"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Master & Custom Card Deck (550 Master Kartu & 5 Love Languages)
CREATE TABLE question_cards (
    id BIGSERIAL PRIMARY KEY,
    owner_couple_id UUID REFERENCES couples(id) ON DELETE CASCADE, -- NULL jika kartu default bawaan sistem
    type VARCHAR(10) NOT NULL, -- 'TRUTH' atau 'DARE'
    love_language VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- 'WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH', 'GENERAL'
    mode VARCHAR(10) NOT NULL DEFAULT 'BOTH', -- 'ONLINE' (Video Call/LDR), 'OFFLINE' (Ketemu Langsung), 'BOTH' (Fleksibel)
    category VARCHAR(50) NOT NULL, -- 'Pujian', 'Romantis', 'Deep Talk', 'Intim', 'Konyol', 'Pelayanan', 'Hadiah', 'Spicy'
    prompt TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Arsip Riwayat Permainan (Memory Journal Pasangan)
CREATE TABLE game_histories (
    id BIGSERIAL PRIMARY KEY,
    room_code VARCHAR(10) REFERENCES game_rooms(code) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    player_num INT NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    dice_rolled INT NOT NULL,
    from_tile INT NOT NULL,
    to_tile INT NOT NULL,
    final_tile INT NOT NULL,
    jump_type VARCHAR(20), -- 'LADDER', 'SNAKE', 'SKILL', NULL
    choice_type VARCHAR(50) NOT NULL, -- 'TRUTH', 'DARE', 'TAKDIR RAHASIA (RANDOM)', 'SKIP'
    love_language VARCHAR(50),
    card_prompt TEXT,
    skill_used VARCHAR(50),
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing untuk query cepat
CREATE INDEX idx_game_histories_room ON game_histories(room_code);
CREATE INDEX idx_cards_love_language ON question_cards(love_language);
CREATE INDEX idx_cards_mode ON question_cards(mode);
CREATE INDEX idx_cards_category ON question_cards(category);
```

---

### 4. Protokol Pesan WebSocket (Room-Scoped Message Flow)

Semua komunikasi data terbungkus dalam payload JSON terisolasi per room:

| Action Type | Pengirim | Arah | Payload Penting | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `STATE_UPDATE` | Server | S ➔ C | `state`, `roomCode` | Sinkronisasi menyeluruh (posisi pion, giliran, petak takdir, riwayat, selectedDecks, playMode). |
| `ROLL_DICE` | Klien | C ➔ S | `fixedDice`, `isDoubleRoll`, `useShield` | Request lempar dadu normal atau dengan skill. |
| `DICE_ROLLED` | Server | S ➔ C | `player`, `dice`, `finalPos`, `nextTurn` | Menjalankan animasi kocok dadu dan lompatan pion di layar lawan. |
| `UPDATE_PLAY_MODE` | Klien | C ➔ S | `playMode` (`ONLINE`/`OFFLINE`/`ALL`) | Mengubah mode permainan dan menyaring deck fisik vs video call. |
| `UPDATE_DECK_SELECTION` | Klien | C ➔ S | `selectedDecks`, `playMode` | Memperbarui daftar Love Language & mode yang diaktifkan (Max 150 kartu bawaan + custom). |
| `SHOW_CARD` | Klien | C ➔ S | `tile`, `cardType`, `category`, `loveLanguage`, `mode`, `prompt` | Membuka pop-up kartu Truth/Dare di layar kedua pemain secara serentak. |
| `CLOSE_MODAL` | Klien | C ➔ S | - | Menutup modal kartu di kedua perangkat. |
| `ADD_CUSTOM_CARD` | Klien | C ➔ S | `cardType`, `loveLanguage`, `mode`, `category`, `prompt` | Menambahkan kartu custom buatan pemain ke room. |
| `RECORD_HISTORY` | Klien | C ➔ S | `entry` | Mencatat langkah, dadu, dan jawaban kartu ke riwayat room. |
| `SUIT` | Klien | C ➔ S | - | Mengundi suit batu-gunting-kertas untuk menentukan giliran pertama. |
| `REACTION` | Klien | C ➔ S | `emoji`, `sender` | Menembakkan balon emoji melayang di layar pasangan. |
| `RESET` | Klien | C ➔ S | - | Reset posisi ke petak 1, undi 20 petak takdir baru, isi kuota skill. |


