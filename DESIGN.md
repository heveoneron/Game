# Design System & UI/UX Specification (DESIGN.md)

## 1. Design Philosophy & Aesthetic Direction
* **Vibe:** Playful, Warm, Intimate, dan Modern Board Game.
* **Prinsip Utama:** Mengurangi beban kognitif (cognitive load) agar pemain fokus pada interaksi dengan pasangannya, bukan bingung dengan kontrol antarmuka.

---

## 2. Color Palette & Theming
Gunakan kombinasi warna hangat namun tetap memiliki kontras tinggi untuk keterbacaan kartu dan papan:

* **Background Primary:** `#FFF8F6` (Warm Soft Cream - untuk mode terang) atau `#1A1625` (Cozy Midnight Purple - untuk mode malam/intimate).
* **Primary Accent (Romantic Rose):** `#F43F5E` (Digunakan untuk CTA utama seperti tombol *Kocok Dadu* dan badge penting).
* **Secondary Accent (Playful Amber/Gold):** `#F59E0B` (Digunakan untuk indikator *Skill*, *Perisai Ular*, dan *Landmark Tiles* 21 & 57).
* **Truth Card Theme:** `#3B82F6` (Calm Blue / Deep Talk).
* **Dare Card Theme:** `#EC4899` (Energetic Pink / Action).
* **Destiny Tile (Petak Takdir):** `#8B5CF6` (Mystic Violet).
* **Ladder / Positive State:** `#10B981` (Emerald Green).
* **Snake / Danger State:** `#EF4444` (Crimson Red).

---

## 3. Typography
* **Heading & Display (Judul, Angka Kotak, Modal Header):** `Plus Jakarta Sans` atau `Fredoka` (Bold/ExtraBold) — memberikan kesan ramah dan *game-like*.
* **Body & Card Prompt (Pertanyaan Truth/Dare):** `Inter` atau `DM Sans` (Regular/Medium) — memastikan pertanyaan panjang mudah dibaca saat video call.
* **Monospace (Countdown Timer & Room Code):** `JetBrains Mono`.

---

## 4. Layout Architecture

### 4.1. Desktop View (2-Column Split Layout)
* **Left Panel (Control & Status Hub - 35% Width):**
  1. **Active Turn Banner:** Highlight jelas siapa yang sedang jalan (`P1` atau `P2`) + tombol utama **Kocok Dadu**.
  2. **Player Status Cards:** Menampilkan posisi kotak saat ini dan *cooldown/availability* Skill.
  3. **Active Skills Drawer:** Pilihan *Langkah Pasti* (angka 1–6).
  4. **Game Log & Emoji Bar:** Compact scrollable log (maksimal tinggi `180px`) dan deretan tombol reaksi emoji.
* **Right Panel (The Board Canvas - 65% Width):**
  1. **10x10 Grid Board:** Rasio `1:1` (Square) yang responsif terhadap tinggi *viewport* (`max-height: 82vh`) agar tidak perlu *scroll* naik-turun saat bermain di laptop.
  2. **Board Legend Bar:** Informasi ringkas di bawah papan (7 Tangga, 8 Ular, Kotak 21 & 57, Finish 100).

### 4.2. Mobile View (Responsive Single-Column)
* **Sticky Top Bar:** Giliran pemain + posisi kotak P1 & P2 secara ringkas.
* **Center Viewport:** Papan Ular Tangga.
* **Bottom Sheet / Sticky Action Bar:** Tombol **Kocok Dadu**, tombol **Pakai Skill**, dan tombol **Emoji** berada di area jangkauan jempol (*thumb zone*). Info sekunder (Riwayat Permainan & Mode Tantangan) dimasukkan ke dalam *tab* atau *collapsible drawer*.

---

## 5. Key Component & Micro-Interaction Specs

### 5.1. Papan & Pergerakan Pion
* **Tile Stepping Animation:** Pion tidak langsung *teleport* dari kotak asal ke kotak tujuan, melainkan melompat dari kotak ke kotak (`150ms` per langkah) agar terasa ketegangan mendekati kepala ular atau tangga.
* **Landmark Highlight (Kotak 21 & 57):** Berikan efek *subtle pulse glow* dan ikon khusus (🎬 dan 📞) langsung di atas grid kotak tersebut.

### 5.2. Challenge Modal (Truth / Dare / Destiny)
* **2-Stage Reveal Animation:**
  * *Stage 1:* Modal pilihan jalur (Truth / Dare / Random) muncul dengan efek *scale-up*.
  * *Stage 2:* Saat jalur dipilih, lakukan animasi *3D Card Flip* (`transform: rotateY(180deg)`) untuk menampilkan isi pertanyaan, kategori Love Language, dan Timer 30 detik.
* **Timer Visual Feedback:** Ketika waktu tersisa kurang dari 10 detik, warna teks timer berubah menjadi merah (`#EF4444`) dengan animasi *heartbeat pulse*.

### 5.3. Snake Shield Modal (Perisai Ular)
* Muncul otomatis sebagai *interrupter* sebelum animasi pion merosot turun.
* Berikan efek *screen shake* halus (`300ms`) saat kepala ular terinjak untuk meningkatkan efek kejutan.

### 5.4. Header & Navigation Cleanup
* Simpan tombol **Kelola Deck Truth or Dare** dan **Mode Permainan (Video Call / Offline)** di *Header* utama.
* Pindahkan link eksternal lintas-genre (`/harta-karun.html`) ke area *Footer* atau menu *More Projects* agar konsistensi tema pasangan tetap terjaga.