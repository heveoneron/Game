# Product Requirements Document (PRD): Ular Tangga Pasangan

## 1. Overview & Product Vision
**Ular Tangga Pasangan** adalah web-based interactive board game yang dirancang khusus untuk pasangan (baik yang sedang menjalani Long Distance Relationship / LDR maupun bertemu langsung / Dating). Aplikasi ini menggabungkan mekanik klasik Ular Tangga dengan kartu **Truth or Dare** berbasis **5 Love Languages** serta sistem **Active/Passive Skills** untuk menciptakan momen *deeptalk*, keintiman, dan keseruan bersama.

## 2. Target Audience & Use Cases
* **Pasangan LDR (Online Mode):** Bermain sambil melakukan Video Call untuk memecah kebosanan komunikasi harian.
* **Pasangan Dating (Offline Mode):** Dimainkan di satu perangkat (pass-and-play) atau dua perangkat saat sedang *quality time* di kafe, taman, atau rumah.

## 3. Core Features (Current v1.0)
### 3.1. Board & Core Movement
* **100-Tile Board:** Papan permainan kotak 1 hingga 100.
* **Ladders (7 Titik):** Mempercepat langkah pemain menuju finish.
* **Snakes (8 Titik):** Menurunkan posisi pemain.
* **Landmark Destiny Tiles (Kotak 21 🎬 & Kotak 57 📞):** Petak takdir rahasia di mana pemain tidak bisa memilih tipe tantangan (ditentukan mutlak oleh sistem).

### 3.2. Non-Static Challenge System (Truth / Dare / Random)
* Setiap mendarat di kotak, pemain dapat memilih jalur tantangan: **Truth** (Deeptalk), **Dare** (Aksi seru), atau **Random**.
* Dilengkapi dengan **Countdown Timer (00:30)** di dalam modal kartu tantangan.

### 3.3. 5 Love Languages Deck Manager (Master Catalog: 550 Cards)
* **General Deck:** 50 kartu pondasi (selalu aktif, mencakup kartu khusus kotak 21 & 57).
* **5 Love Language Decks:** *Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch* (masing-masing 100 kartu: 50 Truth & 50 Dare).
* **Deck Cap & Filtering:** Maksimal 150 kartu bawaan aktif per sesi permainan, dapat difilter berdasarkan konteks (`ONLINE` / Video Call, `OFFLINE` / Ketemu Langsung, atau `BOTH`).
* **Custom Deck Builder:** Fitur tambah kartu kustom serta ekspor/impor deck ke pasangan.

### 3.4. Player Skills System
* **Perisai Ular (Snake Shield):** Skill reaktif untuk menahan gigitan ular (1x per game).
* **Langkah Pasti (Deterministic Roll):** Skill aktif untuk memilih angka dadu pasti (1-6) guna mengincar tangga atau menghindari ular (1x per game).

### 3.5. Interactive & Social Elements
* **Game History Log:** Mencatat riwayat langkah dan kejadian setiap giliran.
* **Quick Emoji Reactions:** Mengirim reaksi emoji cepat ke layar.

---

## 4. Proposed Roadmap (v2.0 Improvements)

| Prioritas | Fitur | Deskripsi Teknis & User Value |
| :--- | :--- | :--- |
| **P0 (High)** | **Realtime Multiplayer Room** | Sinkronisasi state permainan (giliran, posisi pion, kartu aktif, timer, dan emoji) antar 2 device menggunakan Room Code 4-6 karakter. |
| **P0 (High)** | **Custom Profile & Pre-Game Stakes** | Input nama panggilan pasangan & input "Janji/Hadiah Pemenang" sebelum game dimulai yang akan muncul otomatis di Victory Modal. |
| **P1 (Med)** | **Skip/Forfeit Challenge Mechanic** | Opsi melewati kartu tantangan dengan penalti mundur sejumlah kotak atau menukar dengan tantangan penalti. |
| **P1 (Med)** | **Audio & BGM Ambience** | Efek suara kocok dadu, naik tangga, kena ular, detak timer, serta opsi Lo-Fi/Romantic BGM yang bisa di-mute. |
| **P2 (Low)** | **End-Game Memory Card** | Generator gambar ringkasan sesi permainan (statistik langkah, pemenang, dan highlight pertanyaan malam itu). |

## 5. Success Metrics
* **Session Completion Rate:** Persentase permainan yang berhasil mencapai Kotak 100.
* **Custom Card Creation:** Rata-rata jumlah kartu custom yang dibuat pasangan per sesi.
* **Average Session Duration:** Durasi bermain ideal di rentang 20–45 menit per game.