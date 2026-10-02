package deck

import "ulartangga/models"

// GeneralDeck berisi 50 kartu umum, icebreaker, memori, dan petak khusus (termasuk landmark 21 & 57)
// Mendukung mode ONLINE (Video Call / LDR), OFFLINE (Ketemu Langsung), dan BOTH (Bisa Keduanya)
var GeneralDeck = []models.QuestionCard{
	// 25 TRUTH UMUM (ID 1 - 25)
	{1, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Apa hal pertama yang kamu pikirkan waktu pertama kali kita ketemu atau kenalan?", false},
	{2, "TRUTH", "GENERAL", "ONLINE", "Memori", "Momen apa selama kita LDR / berjauhan yang paling bikin kamu kangen berat dan gak bisa tidur?", false},
	{3, "TRUTH", "GENERAL", "BOTH", "Romantis", "Apa hal kecil dariku yang paling sering bikin kamu diam-diam tersenyum sendiri?", false},
	{4, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Kapan terakhir kali kamu merasa cemburu, tapi kamu memilih untuk memendamnya sendiri?", false},
	{5, "TRUTH", "GENERAL", "BOTH", "Romantis", "Sebutkan 3 sifat atau kebiasaan dariku yang paling bikin kamu merasa nyaman dan aman!", false},
	{6, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Menurutmu, apa tantangan terbesar dalam hubungan kita saat ini dan bagaimana cara kita melaluinya?", false},
	{7, "TRUTH", "GENERAL", "BOTH", "Konyol", "Hal konyol atau memalukan apa yang pernah kamu lakuin demi menarik perhatianku waktu awal kenal?", false},
	{8, "TRUTH", "GENERAL", "BOTH", "Romantis", "Lagu apa yang setiap kali kamu dengar, otomatis langsung membuatmu mengingat diriku?", false},
	{9, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Pernahkah kamu merasa overthinking tentang masa depan hubungan kita? Apa yang kamu cemaskan?", false},
	{10, "TRUTH", "GENERAL", "BOTH", "Memori", "Kalau kita bisa mengulang kembali satu hari terindah dalam hubungan kita, hari mana yang kamu pilih?", false},
	{11, "TRUTH", "GENERAL", "BOTH", "Romantis", "Apa panggilan sayang atau kalimat gombalan dariku yang paling bikin kamu salting brutal?", false},
	{12, "TRUTH", "GENERAL", "ONLINE", "Konyol", "Pernah gak kamu pura-pura sudah tidur atau pura-pura sibuk padahal masih asik scroll sosmed saat kita chat?", false},
	{13, "TRUTH", "GENERAL", "BOTH", "Romantis", "Outfit atau gaya penampilan seperti apa dariku yang menurutmu paling memikat hati?", false},
	{14, "TRUTH", "GENERAL", "ONLINE", "Deep Talk", "Apa ketakutan terbesarmu saat sedang tidak saling memberi kabar lebih dari setengah hari?", false},
	{15, "TRUTH", "GENERAL", "BOTH", "Memori", "Kapan momen pertama kalinya kamu yakin dalam hati: 'Kayaknya dia memang orang yang tepat buat aku'?", false},
	{16, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Hal apa dari dirimu sendiri yang paling ingin kamu perbaiki demi kebaikan hubungan kita berdua?", false},
	{17, "TRUTH", "GENERAL", "BOTH", "Romantis", "Jika kita punya waktu 24 jam bebas tanpa gadget dan pekerjaan, apa saja hal yang ingin kamu lakukan bersamaku?", false},
	{18, "TRUTH", "GENERAL", "OFFLINE", "Spicy", "Bagian wajah atau tubuhku mana yang paling sering membuatmu gemas dan ingin kamu peluk/cubit saat ketemu?", false},
	{19, "TRUTH", "GENERAL", "BOTH", "Konyol", "Siapa di antara kita yang menurutmu paling gengsian dan paling sulit buat minta maaf duluan?", false},
	{20, "TRUTH", "GENERAL", "BOTH", "Deep Talk", "Apa harapan atau impian terbesar yang ingin kamu wujudkan bersama denganku 3 tahun ke depan?", false},
	{21, "TRUTH", "GENERAL", "ONLINE", "Deep Talk", "Pernah gak kamu menangis diam-diam sendirian di kamar karena merindukan kehadiranku? Ceritakan momennya!", false},
	{22, "TRUTH", "GENERAL", "BOTH", "Romantis", "Hal apa yang aku lakukan yang tanpa kusadari selalu berhasil meluluhkan hatimu saat kamu lagi bad mood?", false},
	{23, "TRUTH", "GENERAL", "BOTH", "Konyol", "Kebiasaan aneh atau random apa dariku yang menurutmu lucu banget tapi gak kamu temuin di orang lain?", false},
	{24, "TRUTH", "GENERAL", "ONLINE", "Memori", "Ceritakan obrolan larut malam (late night talk) kita via telpon yang paling berkesan dan menyentuh hatimu!", false},
	{57, "TRUTH", "GENERAL", "ONLINE", "Deep Talk", "Siapa yang paling suka bikin janji 'nanti telpon / video call' tapi kadang PHP alias ternyata ketiduran duluan?", false}, // Landmark petak 57

	// 25 DARE UMUM (ID 26 - 50, dan landmark 21)
	{26, "DARE", "GENERAL", "BOTH", "Konyol", "Tatap mata pasanganku lekat-lekat selama 30 detik tanpa boleh tersenyum atau tertawa!", false},
	{27, "DARE", "GENERAL", "ONLINE", "Romantis", "Kirim voice note 15 detik nyanyiin reff lagu cinta paling romantis khusus buat aku sekarang juga!", false},
	{28, "DARE", "GENERAL", "BOTH", "Konyol", "Tirukan suara kucing manja yang lagi minta makan sambil nengok ke kamera/pasangan!", false},
	{29, "DARE", "GENERAL", "BOTH", "Romantis", "Gombalin aku dengan menggunakan 3 kata acak: 'Kulkas', 'Ular Tangga', dan 'Masa Depan'!", false},
	{30, "DARE", "GENERAL", "BOTH", "Konyol", "Kirim/tunjukkan foto selfie dengan ekspresi wajah paling jelek & konyol di galeri HP kamu!", false},
	{31, "DARE", "GENERAL", "BOTH", "Romantis", "Berikan 5 pujian tulus tentang fisik dan kepribadianku berturut-turut tanpa jeda berpikir!", false},
	{32, "DARE", "GENERAL", "ONLINE", "Spicy", "Bisikkan kata-kata paling menggoda atau manis ke speaker HP / telinga pasangan selama 10 detik!", false},
	{33, "DARE", "GENERAL", "BOTH", "Konyol", "Joget lucu tanpa musik selama 20 detik di depan pasangan / kamera dengan penuh percaya diri!", false},
	{34, "DARE", "GENERAL", "ONLINE", "Romantis", "Tulis pesan 1 paragraf berisi alasan kenapa kamu bersyukur punya aku, lalu kirim ke chat kita sekarang!", false},
	{35, "DARE", "GENERAL", "BOTH", "Konyol", "Tahan napas sambil bilang 'Aku sayang banget sama kamu dan gak mau kehilangan kamu!' sebanyak 3 kali!", false},
	{36, "DARE", "GENERAL", "ONLINE", "Romantis", "Pasang foto kita berdua jadi wallpaper HP kamu sampai sesi permainan ini selesai!", false},
	{37, "DARE", "GENERAL", "BOTH", "Konyol", "Peragakan cara aku berjalan atau cara aku waktu lagi ngambek dengan akting terbaikmu!", false},
	{38, "DARE", "GENERAL", "BOTH", "Spicy", "Tatap kamera/pasangan dengan tatapan paling memikat selama 15 detik tanpa berkedip!", false},
	{39, "DARE", "GENERAL", "ONLINE", "Romantis", "Kirimkan flying kiss paling heboh dan suara kecupan termanis ke arah kamera video call!", false},
	{40, "DARE", "GENERAL", "BOTH", "Konyol", "Buat pantun cinta lucu 4 baris yang rima akhirnya berakhiran namaku!", false},
	{41, "DARE", "GENERAL", "BOTH", "Deep Talk", "Ucapkan satu permintaan maaf tulus untuk hal kecil di masa lalu yang mungkin pernah menyakiti hatiku!", false},
	{42, "DARE", "GENERAL", "OFFLINE", "Romantis", "Pegang kedua tanganku erat-erat, tatap mataku, dan katakan: 'Masa depanku adalah bersamamu'!", false},
	{43, "DARE", "GENERAL", "OFFLINE", "Spicy", "Kecup kening pasanganku dengan sangat lembut dan tahan selama 5 detik penuh penghayatan!", false},
	{44, "DARE", "GENERAL", "BOTH", "Konyol", "Tirukan ekspresi wajah emoji yang dipilihkan oleh pasanganmu!", false},
	{45, "DARE", "GENERAL", "BOTH", "Romantis", "Ceritakan kembali detik-detik pertama kali kamu menembakku atau menyatakan perasaanmu padaku!", false},
	{46, "DARE", "GENERAL", "OFFLINE", "Spicy", "Pijat lembut pundak atau leher pasanganmu selama 1 menit penuh perhatian!", false},
	{47, "DARE", "GENERAL", "BOTH", "Konyol", "Bicara dengan logat bayi (baby talk) selama 2 putaran ke depan!", false},
	{48, "DARE", "GENERAL", "BOTH", "Romantis", "Sebutkan 3 hal dari diriku yang membuatmu jatuh cinta setiap hari berulang kali!", false},
	{49, "DARE", "GENERAL", "ONLINE", "Konyol", "Kirimkan stiker chat WA paling cringe dan aneh yang ada di koleksimu ke pasangan!", false},
	{21, "DARE", "GENERAL", "ONLINE", "Konyol", "Impersonate kata-kata yang sering aku ucapin waktu videocall pakai gaya suaraku!", false}, // Landmark petak 21
}
