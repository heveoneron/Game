# Design System & 3D UI/UX Specification: Harta Karun Matematika SD

## 1. Aesthetic Direction & Visual Style
* **3D Art Style:** **Stylized Low-Poly Toy / Voxel Island** (terinspirasi dari *Captain Toad: Treasure Tracker* atau *Animal Crossing*). Warna cerah, sudut objek membulat (*rounded edges*), dan pencahayaan hangat (*warm sunlight*).
* **2D HUD Style:** **Pirate Parchment & Chunky Wood UI** — menggabungkan tekstur peta kertas tua, bingkai kayu ramah anak, dan tombol 3D mengkilap (*glossy tactile buttons*).

---

## 2. Color Palette (Kid-Friendly & High Contrast)
* **Ocean Turquoise (Background / Water):** `#06B6D4` hingga `#0284C7`
* **Sandy Island Gold (Ground / Warmth):** `#FDE68A` & `#F59E0B`
* **Pirate Parchment (Modal Background):** `#FEFCE8` (Kertas terang agar teks soal Matematika sangat jelas dibaca)
* **Treasure Gold (Primary CTA & Coins):** `#EAB308` (Shadow: `#A16207`)
* **Jungle Emerald (Correct Answer / Go):** `#22C55E` (Shadow: `#15803D`)
* **Coral Red (Wrong / Danger / Kraken):** `#EF4444` (Shadow: `#B91C1C`)
* **Deep Wood Brown (Borders & Text):** `#451A03`

---

## 3. Typography (Mudah Dibaca Anak SD)
* **Heading, Angka Soal, & Tombol Utama:** `Fredoka` atau `Baloo 2` (Bold 700) — angka `1, 4, 7, 9` harus memiliki bentuk yang tegas dan tidak membingungkan bagi anak kelas 1 SD.
* **Teks Soal Cerita & Instruksi:** `Nunito` atau `Plus Jakarta Sans` (SemiBold 600) — ukuran font minimal `18px` di mobile dan `22px` di desktop.

---

## 4. 3D Viewport & HUD Layout Architecture

### 4.1. Fullscreen 3D Canvas (`100vw x 100vh`)
Kanvas 3D menjadi latar utama sepenuhnya, sementara seluruh elemen UI mengambang (*floating HUD*) di tepi layar agar tidak menghalangi pemandangan pulau.

### 4.2. Floating HUD Zones
1. **Top-Left (Player & Progress Badge):**
   * Avatar Kapten Cilik + Nama Pemain.
   * Indikator Progres Pulau: `🗺️ Pos 3 dari 5 Peti`.
2. **Top-Right (Currency & Utility):**
   * Counter Koin Emas (`🪙 120`) & Bintang (`⭐ 9/15`).
   * Tombol Audio (`🔊`), Reset Kamera (`🎥`), dan kembali ke Menu Utama (`🏠`).
3. **Bottom-Left (Movement Control - Mobile/Tablet):**
   * Virtual Joystick / Tombol Arah D-Pad transparan (atau *Hidden* jika menggunakan mode klik-titik/waypoint).
4. **Bottom-Right (Context Action Button):**
   * Tombol besar kontekstual yang membesar (*pop-in*) saat pemain dekat dengan objek: **`🗝️ BUKA PETI!`** atau **`🔨 PERBAIKI JEMBATAN!`**.

---

## 5. Math Challenge Modal (Pop-Up Soal Peti Harta Karun)

Ketika anak menekan tombol **Buka Peti**, kamera 3D melakukan *zoom-in* ke arah peti, lalu muncul Modal Kertas Peta:

* **Header Modal:** Ikon Peti + Tingkat Kesulitan (misal: `🏴‍☠️ Teka-Teki Kapten #3 • Hadiah: +50 🪙`).
* **Area Soal Visual:**
  * Jika soal hitungan murni (`12 x 4 = ?`), tampilkan dalam ukuran ekstra besar (`2.5rem`).
  * Jika soal bangun ruang/pecahan, tampilkan ilustrasi SVG atau objek 3D berputar kecil di samping soal.
* **4 Pilihan Jawaban (2x2 Grid Buttons):**
  * Gunakan tombol 3D besar (minimal tinggi `64px`) dengan label warna berbeda atau ikon kompas (`A`, `B`, `C`, `D`) agar mudah ditekan di layar sentuh maupun menggunakan *keyboard* angka (`1, 2, 3, 4`).
* **Fitur Bantuan (Scaffolding):**
  * Tombol **`🔭 Intip Petunjuk`** di pojok bawah modal. Saat diklik, menampilkan langkah penyelesaian visual (misal garis bilangan atau pengelompokan gambar apel/koin).

---

## 6. Micro-Interactions & Kid-Friendly Feedback
* **Saat Jawaban Benar:**
  * Tombol berubah hijau zamrud, peti 3D di latar belakang melompat dan terbuka, keluar semburan partikel koin emas + konfeti, diiringi teks motivasi acak (*"Hebat Kapten!", "Luar Biasa!", "Matematikamu Jago Banget!"*).
* **Saat Jawaban Salah:**
  * Modal bergoyang halus (*gentle horizontal shake*), tombol yang salah berubah abu-abu (tidak langsung menutup soal), dan karakter Burung Beo di pojok memberikan semangat: *"Hampir tepat! Coba hitung sekali lagi atau pakai Teropong Petunjuk ya!"*