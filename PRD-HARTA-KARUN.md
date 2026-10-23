# Product Requirements Document (PRD): Game 3D Petualangan Harta Karun (Matematika SD)

## 1. Overview & Product Vision
**Petualangan Mencari Harta Karun 3D** adalah web-based 3D educational game interaktif yang dirancang untuk siswa Sekolah Dasar (SD Kelas 1–6). Game ini mengubah latihan soal Matematika menjadi petualangan eksplorasi pulau bajak laut 3D yang seru, di mana setiap rintangan, jembatan, dan peti harta karun hanya bisa dibuka dengan memecahkan teka-teki Matematika.

## 2. Target Audience
* **Primary User:** Siswa SD (Usia 6–12 tahun).
* **Secondary User (Facilitator):** Guru SD (sebagai media pembelajaran interaktif di kelas/proyektor) dan Orang Tua (sebagai teman belajar di rumah).

## 3. Core Game Loop
1. **Pilih Pulau / Tingkatan Kelas:** Pemain memilih karakter Kapten Cilik dan tingkat kesulitan (Kelas 1–2, 3–4, atau 5–6).
2. **Eksplorasi Pulau 3D:** Pemain menggerakkan karakter menyusuri jalur pulau menuju titik-titik *Checkpoint* (Jembatan Rusak, Gerbang Batu, atau Peti Harta Karun).
3. **Math Challenge Encounter:** Saat berinteraksi dengan objek/peti, muncul *Pop-up Tantangan Matematika*.
4. **Reward & Progression:** Jawaban benar membuka kunci peti (memberikan Koin Emas, Bintang, atau *Item Clue*). Jawaban salah mengaktifkan fitur *Teropong Petunjuk (Scaffolding Hint)*.
5. **Final Boss & Treasure Chest:** Mengalahkan Penjaga Harta Karun di ujung pulau dengan *Combo Question* untuk membuka Harta Karun Utama.

---

## 4. Key Features & Improvements Roadmap

### 4.1. Kurikulum & Sistem Soal (Math Engine)
* **Dynamic Question Generator:** Soal di-generate secara dinamis (bukan sekadar *hardcoded*) menggunakan algoritma pengacak angka sesuai parameter kelas agar tidak hafalan.
* **3 Kategori Tingkat Kesulitan:**
  * *Level 1 (Kelas 1–2):* Penjumlahan/pengurangan < 100, pola bilangan sederhana, pengenalan bangun datar.
  * *Level 2 (Kelas 3–4):* Perkalian & pembagian, pecahan sederhana, konversi satuan panjang/berat.
  * *Level 3 (Kelas 5–6):* Operasi campuran, desimal, kecepatan/jarak/waktu, serta volume kubus & balok (terintegrasi visual 3D).
* **Visual Hint System (Teropong Bantuan):** Memberikan langkah cara menghitung secara bertahap jika pemain menjawab salah di percobaan pertama.

### 4.2. Fitur Eksplorasi & Interaksi 3D
* **Guided 3D Pathfinding / Waypoints:** Kamera 3D menyorot jalur petualangan dengan jelas menggunakan jejak kaki bercahaya atau garis kompas agar anak tidak tersesat di map 3D.
* **Interactive 3D Props:**
  * *Peti Harta Karun (Chest):* Animasi tutup peti terbuka + partikel koin emas berhamburan saat soal terjawab benar.
  * *Jembatan Kayu:* Jembatan tersusun secara animasi 3D setelah pemain menyelesaikan soal berhitung.
* **Avatar & Ship Customization:** Koin hasil belajar disimpan di `localStorage` dan dapat ditukar dengan atribut bajak laut (Topi Kapten, Burung Beo, Warna Kapal).

### 4.3. Fitur Evaluasi (Guru & Orang Tua)
* **Rapor Petualang (Learning Analytics):** Menampilkan akurasi jawaban berdasarkan kategori soal, waktu rata-rata menjawab, dan rekomendasi materi yang perlu diulang.
* **Custom Question Mode (Mode Guru):** Guru dapat memasukkan 5–10 soal kustom melalui form sederhana (atau URL parameter) untuk dimainkan siswa di kelas.

---

## 5. Non-Functional & Technical Requirements
* **Performance (Low-End Device Friendly):** Target minimal **30–60 FPS** di HP Android entry-level dan Chromebook sekolah (gunakan *low-poly 3D assets* atau *procedural geometry*, batasi *draw calls*, dan sediakan tombol *Mode Hemat Baterai / Low Graphics*).
* **Audio Feedback:** Efek suara ceria (suara ombak laut, koin gemerincing, suara terompet kemenangan, dan suara *boing* lucu saat salah) dengan tombol *Mute* yang mudah dijangkau.
* **Zero-Login Accessibility:** Langsung bisa dimainkan tanpa registrasi rumit; progres tersimpan otomatis di `localStorage`.