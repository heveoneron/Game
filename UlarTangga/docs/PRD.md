# Product Requirement Document (PRD)
## Ular Tangga Cinta — Real-time Couple Dating & LDR Game

---

### 1. Ringkasan Eksekutif & Visi Produk
**Ular Tangga Cinta** adalah platform game papan interaktif berbasis web yang dirancang khusus untuk pasangan (baik pasangan kencan, LDR/jarak jauh, maupun suami-istri). Game ini menggabungkan nostalgia permainan klasik ular tangga dengan dinamika tantangan **Truth or Dare**, sistem skill taktis, petak takdir rahasia, serta sinkronisasi multi-room real-time berlatar tema kayu hangat dan romantis.

### 2. Persona & Target Audiens
1. **Pasangan LDR (Long Distance Relationship):** Membutuhkan aktivitas interaktif dan seru saat video call malam minggu agar obrolan tidak monoton.
2. **Pasangan Kencan / Suami-Istri:** Sarana deeptalk intim, saling mengenal lebih dalam, dan menciptakan tawa bersama lewat tantangan seru.
3. **Komunitas Pasangan Muda:** Ingin permainan yang instan tanpa perlu install aplikasi berat di Play Store/App Store.

---

### 3. Fitur Utama & Spesifikasi Fungsional

#### A. Papan Permainan Interaktif (100 Petak Boustrophedon)
- Papan 10x10 dengan penomoran zig-zag dari petak 1 (START) hingga petak 100 (FINISH).
- **7 Jalur Tangga 🪜 (Naik):** Petak 4➔25, 13➔46, 33➔49, 42➔63, 50➔69, 62➔81, 74➔92.
- **8 Jebakan Ular 🐍 (Turun):** Petak 27➔5, 40➔3, 43➔18, 54➔31, 66➔45, 76➔58, 89➔53, 99➔41.
- **Pion Melompat Real-Time:** Animasi melompat smooth diiringi Web Audio synthesizer.
- **Kondisi Menang (FINISH 🏆):** Pemain pertama yang menginjak/melampaui petak 100 dinyatakan menang dan berhak meminta 1 permintaan romantis yang wajib dituruti pasangan.

#### B. 20 Petak Takdir Rahasia (Forced Random) 🔮
- Di setiap sesi/game baru, sistem secara acak memilih **20 petak unik** antara 2–99 (tidak menimpa petak landmark 21 dan 57).
- **Tampilan Papan 100% Rahasia:** Tampilan visual ke-20 petak takdir ini sama persis dengan petak biasa lainnya di papan (tidak dibedakan), sehingga tidak bisa ditebak dari awal.
- **Mekanisme Takdir Mutlak:** Saat pion mendarat di petak ini, pemain **TIDAK BISA MEMILIH** Truth atau Dare. Sistem langsung memutar efek suara kejutan, menampilkan banner takdir, dan mengundi tantangan secara otomatis (50% Truth / 50% Dare).

#### C. Mode Tantangan Non-Static (Truth, Dare, Random)
Pada petak biasa di luar 20 petak takdir, pemain diberikan kebebasan memilih:
1. **💬 TRUTH:** Pertanyaan deeptalk, kejujuran hati, romantis, atau memori masa lalu.
2. **⚡ DARE:** Tantangan seru, gombalan kreatif, atau kemesraan dengan countdown timer 30 detik.
3. **🎲 RANDOM:** Menyerahkan pilihan tantangan pada roda takdir.

#### D. Master Deck 550+ Kartu & 5 Bahasa Cinta (Love Languages) 💘
Game mengadopsi konsep psikologi hubungan **5 Love Languages (Bahasa Cinta)** dengan total katalog master sebanyak **550 kartu**:
1. **💬 Words of Affirmation (Pujian lewat Kata-kata):**
   - **100 Kartu:** 50 Truth + 50 Dare (ID 201–300).
   - Fokus: Pujian paras & karakter, kalimat penguat jiwa, pengakuan cinta, apresiasi perjuangan, pesan suara romantis, gombalan tulus.
2. **⏳ Quality Time (Waktu Berkualitas):**
   - **100 Kartu:** 50 Truth + 50 Dare (ID 301–400).
   - Fokus: Obrolan mendalam (late night talk), kenangan kencan terindah, tatap mata intens (di kamera/tatap muka), detoks gadget bersama, refleksi impian masa depan.
3. **🎁 Receiving Gifts (Penerimaan Hadiah):**
   - **100 Kartu:** 50 Truth + 50 Dare (ID 401–500).
   - Fokus: Memori kado pertama/terbaik, voucher romantis virtual, pesanan makanan kejutan online (GoFood/GrabFood), cinderamata berkesan.
4. **🤝 Acts of Service (Tindakan Pelayanan):**
   - **100 Kartu:** 50 Truth + 50 Dare (ID 501–600).
   - Fokus: Tindakan nyata saling merawat, pijat bahu lelah, pembuatan playlist lagu berdua, pesankan sarapan, inisiatif bantuan tanpa diminta.
5. **🫂 Physical Touch (Sentuhan Fisik & Keintiman Gestur):**
   - **100 Kartu:** 50 Truth + 50 Dare (ID 601–700).
   - Fokus Offline: Genggaman jemari mengunci, pelukan hangat/backhug, usapan rambut, ciuman kening, kehangatan sentuhan intim tatap muka.
   - Fokus Online/LDR: Gestur tempel telapak tangan di layar video call, flying kiss, peluk bantal/guling di depan kamera, screenshot pose love.
6. **🎲 General Deck (Pondasi Utama):**
   - **50 Kartu:** 25 Truth + 25 Dare (ID 1–50, termasuk landmark 21 & 57). Selalu aktif otomatis sebagai pondasi permainan.

#### E. Pemisahan Mode Permainan: Video Call (LDR) vs Ketemu Langsung (Offline) 🕹️
Untuk menjamin permainan tetap nyaman dan realistis saat dimainkan jarak jauh via video call maupun tatap muka langsung:
1. **📹 Mode Video Call / LDR (`ONLINE`):**
   - Mengeliminasi seluruh kartu yang mensyaratkan kontak fisik langsung (misal: "pegang tangan pasanganmu langsung", "pijat bahunya sekarang").
   - Menggantinya dengan adaptasi tantangan visual, verbal, ekspresi kamera, dan aksi digital (misal: telapak tangan sejajar di kamera, tatap mata lewat layar tanpa berkedip, pesan suara manis, kiriman kopi online).
   - Hanya kartu dengan tag `mode: "ONLINE"` atau `mode: "BOTH"` yang dimasukkan ke dalam game pool.
2. **💑 Mode Ketemu Langsung (`OFFLINE`):**
   - Mengutamakan interaksi fisik intim, sentuhan langsung, pelukan, pijatan relaksasi, dan gestur keintiman berdua.
   - Hanya kartu dengan tag `mode: "OFFLINE"` atau `mode: "BOTH"` yang dimasukkan ke dalam game pool.
3. **🔄 Semua Mode / Campuran (`ALL`):**
   - Menggabungkan seluruh 550 kartu tanpa batasan filter.
- **Sinkronisasi Mode:** Pemilihan mode dapat diganti langsung lewat Quick Header Button atau di Modal Deck dan otomatis tersinkronisasi antar pasangan via WebSocket (`UPDATE_PLAY_MODE`).

##### Aturan Pemilihan Deck & Batas Maksimal (Max 150 Kartu per Game):
- **Kombinasi Fleksibel:** Host/creator dapat memilih bahasa cinta apa saja yang ingin diaktifkan (misal: hanya Words of Affirmation + Physical Touch).
- **Filter Mode & Kompilasi Otomatis:** Kartu dari bahasa cinta terpilih yang sesuai dengan Mode Permainan digabungkan bersama General Deck.
- **Batas 150 Kartu Bawaan:** Jika total kartu kandidat melebihi 150 kartu, sistem mengacak dan membatasi tepat **150 kartu** seimbang (75 Truth & 75 Dare) agar alur permainan tetap variatif dan tidak berulang.
- **Custom Deck Tanpa Batas:** Seluruh kartu kustom buatan pemain (`customDeck`) ditambahkan **di atas batas 150 kartu tersebut** (`active pool = 150 + customCards`).
- **Custom Deck Manager:** Pemain dapat menambah kartu custom dengan atribut bahasa cinta dan mode berlaku (`BOTH`, `ONLINE`, `OFFLINE`), mengedit, menghapus, atau mengekspor/mengimpor JSON.

#### E. Sistem 6 Skill Taktikal Pemain
Setiap pemain dapat memilih 1–3 skill dengan kuota terisi kembali setiap kali game di-reset:
1. **Bebas Hukuman (Skip) [1x]:** Melewati 1x kartu Truth/Dare tanpa penalti.
2. **Master Acak (+2 Kuota) [Pasif]:** Menambah 2x jatah acak ulang kartu (total 5x acak per game).
3. **Dadu Ganda (Double Roll) [3x]:** Melempar dadu 2 kali berurutan dalam 1 giliran.
4. **Perisai Kebal Ular (Shield) [1x]:** Kebal otomatis saat menginjak kepala ular sehingga tidak melorot.
5. **Dadu Sakti (Lucky Dice) [1x]:** Memilih angka langkah pasti (1–6) sebelum melempar.
6. **Balikkan Serang (Uno Reverse) [1x]:** Membalikkan tantangan yang didapat agar dijawab oleh pasangan.
- **Preset Rekomendasi:** 🎮 Seimbang, 🔥 Taktis, 💕 Intim.
- **Hover Tooltip:** Kursor mouse di atas badge skill di sidebar kiri menampilkan penjelasan detail, fase aktivasi, dan sisa kuota.

#### F. Sistem Multi-Room & Session Sharing 🏠
- **Room Code Unik (6 Karakter):** Mendukung ribuan pasangan bermain secara bersamaan di room terpisah tanpa bentrok.
- **One-Click Share Link:** Pasangan cukup mengirimkan link `http://<host>/?room=KODE`, dan pasangan yang mengklik link otomatis masuk ke sesi yang sama.
- **Isolasi State:** Setiap room memiliki state pion, giliran, 20 petak takdir rahasia, dan riwayat langkahnya sendiri.

#### G. Catatan Riwayat Perjalanan (Travel History Log) 📜
- Mencatat setiap angka dadu, petak asal, petak tujuan, pemakaian skill, kartu yang dijawab, dan timestamp.
- Tombol **Salin Catatan** untuk menyalin seluruh rangkuman perjalanan cinta ke clipboard.

---

### 4. Non-Functional Requirements (NFR)
1. **Latency:** Broadcast WebSocket < 50ms untuk pengalaman responsif dua arah.
2. **Portabilitas:** Dapat dijalankan tanpa kompilasi berat (single Go binary atau langsung buka `index.html` mode offline).
3. **Zero Configuration:** Tidak membutuhkan dependensi database eksternal untuk sesi game live.
4. **Responsiveness:** Tampilan adaptif untuk smartphone (portrait) dan layar laptop/desktop.
