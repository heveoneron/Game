// ================= DAFTAR KARTU & BAHASA CINTA (LOVE LANGUAGES) =================
// Total Kartu: 550 (5 Love Languages @ 100 kartu + General Deck @ 50 kartu = 550 kartu)
// Mode Permainan:
// - ONLINE: Khusus LDR / Video Call (tidak butuh kontak fisik langsung)
// - OFFLINE: Khusus Ketemu Langsung (tatap muka dan kontak fisik)
// - BOTH: Fleksibel untuk keduanya

const PLAY_MODES = [
    { code: 'ONLINE', name: 'Video Call / LDR', icon: '📹', description: 'Tantangan visual, verbal, & remote tanpa kontak fisik langsung' },
    { code: 'OFFLINE', name: 'Ketemu Langsung', icon: '💑', description: 'Tantangan tatap muka, sentuhan, & interaksi fisik intim' },
    { code: 'ALL', name: 'Semua Mode (Campuran)', icon: '🔄', description: 'Gabungan kartu online dan offline' }
];

const LOVE_LANGUAGES = [
  {
    "code": "WORDS_OF_AFFIRMATION",
    "name": "Words of Affirmation",
    "subtitle": "Pujian \u0026 Kata-kata Penguat Hati",
    "icon": "💬",
    "color": "#FEF3C7",
    "borderColor": "#F59E0B",
    "truthCount": 50,
    "dareCount": 50,
    "totalCards": 100
  },
  {
    "code": "QUALITY_TIME",
    "name": "Quality Time",
    "subtitle": "Waktu Berkualitas \u0026 Obrolan Mendalam",
    "icon": "⏳",
    "color": "#D1FAE5",
    "borderColor": "#10B981",
    "truthCount": 50,
    "dareCount": 50,
    "totalCards": 100
  },
  {
    "code": "RECEIVING_GIFTS",
    "name": "Receiving Gifts",
    "subtitle": "Penerimaan Hadiah \u0026 Kejutan Berkesan",
    "icon": "🎁",
    "color": "#FCE7F3",
    "borderColor": "#EC4899",
    "truthCount": 50,
    "dareCount": 50,
    "totalCards": 100
  },
  {
    "code": "ACTS_OF_SERVICE",
    "name": "Acts of Service",
    "subtitle": "Tindakan Pelayanan \u0026 Bukti Nyata Kasih",
    "icon": "🤝",
    "color": "#E0F2FE",
    "borderColor": "#0284C7",
    "truthCount": 50,
    "dareCount": 50,
    "totalCards": 100
  },
  {
    "code": "PHYSICAL_TOUCH",
    "name": "Physical Touch",
    "subtitle": "Sentuhan Fisik, Pelukan, \u0026 Keintiman",
    "icon": "🫂",
    "color": "#EDE9FE",
    "borderColor": "#8B5CF6",
    "truthCount": 50,
    "dareCount": 50,
    "totalCards": 100
  },
  {
    "code": "GENERAL",
    "name": "General Deck",
    "subtitle": "Kartu Dasar, Icebreaker \u0026 Landmark (21 \u0026 57)",
    "icon": "🎲",
    "color": "#F3F4F6",
    "borderColor": "#6B7280",
    "truthCount": 25,
    "dareCount": 25,
    "totalCards": 50
  }
];

const defaultTruthsList = [
  {
    "category": "Deep Talk",
    "id": 1,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Apa hal pertama yang kamu pikirkan waktu pertama kali kita ketemu atau kenalan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 2,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Momen apa selama kita LDR / berjauhan yang paling bikin kamu kangen berat dan gak bisa tidur?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 3,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Apa hal kecil dariku yang paling sering bikin kamu diam-diam tersenyum sendiri?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 4,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Kapan terakhir kali kamu merasa cemburu, tapi kamu memilih untuk memendamnya sendiri?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 5,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 sifat atau kebiasaan dariku yang paling bikin kamu merasa nyaman dan aman!",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 6,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Menurutmu, apa tantangan terbesar dalam hubungan kita saat ini dan bagaimana cara kita melaluinya?",
    "type": "TRUTH"
  },
  {
    "category": "Konyol",
    "id": 7,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Hal konyol atau memalukan apa yang pernah kamu lakuin demi menarik perhatianku waktu awal kenal?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 8,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Lagu apa yang setiap kali kamu dengar, otomatis langsung membuatmu mengingat diriku?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 9,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa overthinking tentang masa depan hubungan kita? Apa yang kamu cemaskan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 10,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Kalau kita bisa mengulang kembali satu hari terindah dalam hubungan kita, hari mana yang kamu pilih?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 11,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Apa panggilan sayang atau kalimat gombalan dariku yang paling bikin kamu salting brutal?",
    "type": "TRUTH"
  },
  {
    "category": "Konyol",
    "id": 12,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Pernah gak kamu pura-pura sudah tidur atau pura-pura sibuk padahal masih asik scroll sosmed saat kita chat?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 13,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Outfit atau gaya penampilan seperti apa dariku yang menurutmu paling memikat hati?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 14,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Apa ketakutan terbesarmu saat sedang tidak saling memberi kabar lebih dari setengah hari?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 15,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Kapan momen pertama kalinya kamu yakin dalam hati: 'Kayaknya dia memang orang yang tepat buat aku'?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 16,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Hal apa dari dirimu sendiri yang paling ingin kamu perbaiki demi kebaikan hubungan kita berdua?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 17,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Jika kita punya waktu 24 jam bebas tanpa gadget dan pekerjaan, apa saja hal yang ingin kamu lakukan bersamaku?",
    "type": "TRUTH"
  },
  {
    "category": "Spicy",
    "id": 18,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "OFFLINE",
    "prompt": "Bagian wajah atau tubuhku mana yang paling sering membuatmu gemas dan ingin kamu peluk/cubit saat ketemu?",
    "type": "TRUTH"
  },
  {
    "category": "Konyol",
    "id": 19,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Siapa di antara kita yang menurutmu paling gengsian dan paling sulit buat minta maaf duluan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 20,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Apa harapan atau impian terbesar yang ingin kamu wujudkan bersama denganku 3 tahun ke depan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 21,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Pernah gak kamu menangis diam-diam sendirian di kamar karena merindukan kehadiranku? Ceritakan momennya!",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 22,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Hal apa yang aku lakukan yang tanpa kusadari selalu berhasil meluluhkan hatimu saat kamu lagi bad mood?",
    "type": "TRUTH"
  },
  {
    "category": "Konyol",
    "id": 23,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Kebiasaan aneh atau random apa dariku yang menurutmu lucu banget tapi gak kamu temuin di orang lain?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 24,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Ceritakan obrolan larut malam (late night talk) kita via telpon yang paling berkesan dan menyentuh hatimu!",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 57,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Siapa yang paling suka bikin janji 'nanti telpon / video call' tapi kadang PHP alias ternyata ketiduran duluan?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 201,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Pujian tulus apa dariku yang pernah kamu dengar dan paling membuat hatimu berbunga-bunga sampai sekarang?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 202,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Kalimat penyemangat apa dariku yang paling ampuh menenangkanmu saat kamu sedang merasa gagal atau tertekan?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 203,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa panggilan sayang dariku yang paling membuatmu merasa dicintai dan istimewa?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 204,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sebutkan satu kelebihan fisik dan satu kelebihan karakter dariku yang paling membuatmu bangga memilikiku!",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 205,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Kapan terakhir kali kata-kataku tanpa sengaja membuatmu tersentuh hingga meneteskan air mata haru?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 206,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa hal yang paling ingin kamu dengar dariku ketika suasana hatimu sedang sangat buruk?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 207,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Jika ada satu kalimat yang bisa kurangkai untuk selalu mengingatkanmu bahwa kamu berharga, kalimat apa itu?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 208,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa bakat atau kemampuan unik dariku yang menurutmu sangat keren dan menginspirasimu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 209,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa kekurangan kata-kata pujian atau apresiasi dariku? Di momen apa itu terjadi?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 210,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Apa pesan chat terpanjang dariku saat LDR yang paling berkesan dan masih sering kamu baca ulang di HP-mu?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 211,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Bagian mana dari caraku menyapa lewat telepon/video call yang paling kamu rindukan setiap harinya?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 212,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Usaha kecil apa yang pernah kulakukan yang sangat kamu syukuri namun belum sempat kamu ucapkan terima kasih?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 213,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Jika suaraku diibaratkan melodi lagu, melodi seperti apa yang paling menggambarkan rasa nyamanmu bersamaku?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 214,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bagaimana caraku bersabar menghadapimu yang membuatmu merasa sangat dimengerti dan dihargai?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 215,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Kalimat apa yang paling kamu takuti keluar dari mulutku dalam hubungan kita?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 216,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Di layar video call ini, bagian wajah atau senyumanku mana yang terlihat paling manis hari ini?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 217,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa pengakuan cinta pertamaku yang paling membuat jantungmu berdebar hebat?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 218,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa satu nasihat bijak dariku yang selalu kamu ingat dan kamu terapkan dalam kehidupan sehari-harimu?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 219,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Menurutmu, apa hal paling menarik dari caraku memandang dan merespons kehidupan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 220,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Seberapa besar arti ucapan 'Aku bangga sama kamu' dariku bagi rasa percaya dirimu?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 221,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa gombalan paling receh dariku yang awalnya bikin kamu geleng-geleng tapi ujungnya bikin salting?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 222,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Saat kamu berhasil mencapai suatu impian, kenapa ucapan selamat dariku terasa paling berharga?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 223,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Hal apa dari senyuman atau tawaku yang paling sering membuat harimu yang redup menjadi cerah?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 224,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apakah kamu merasa sudah cukup mendengar kata 'Terima kasih' dan 'Maaf' dariku? Jelaskan rasanya!",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 225,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa tiga kata sifat yang menurutmu paling mendeskripsikan kebaikan hatiku?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 226,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Ceritakan momen di mana satu voice note atau chat 'Semangat ya sayang' dariku benar-benar menyelamatkan harimu saat LDR!",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 227,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa keputusan terbesar yang pernah kuambil yang membuatmu semakin menaruh rasa hormat padaku?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 228,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Saat kita duduk berdekatan seperti ini, aroma atau wangi parfumku mana yang paling bikin kamu betah?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 229,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bagaimana caraku menegurmu saat salah yang paling bisa kamu terima tanpa merasa tersinggung?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 230,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Apa kalimat penutup telepon atau 'good night' dariku sebelum tidur yang paling bikin kamu tidur nyenyak?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 231,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa hal yang paling kamu sukai dari caraku memperkenalkanmu kepada orang lain?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 232,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Kapan kamu merasa diriku terlihat paling dewasa, bijaksana, dan bisa diandalkan?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 233,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Saat kita bertatapan langsung di ruangan ini, apa yang paling terpancar dari mataku yang membuatmu luluh?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 234,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu meragukan ketulusan kata cintaku? Kapan itu dan apa yang mengembalikan keyakinanmu?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 235,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Jika kamu harus menulis surat cinta singkat untukku sekarang, kalimat pembuka apa yang akan kamu tulis?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 236,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sebutkan satu pengorbananku yang menurutmu sangat besar dan tak ternilai harganya!",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 237,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa ketabahan atau ketegaran dariku yang paling membuatmu terpukau dan termotivasi?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 238,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Kenapa kamu merasa kata-kata cintaku berbeda dari siapapun yang pernah hadir di masa lalumu?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 239,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Kata-kata apa dariku yang paling sering kamu baca ulang saat kamu merasa kesepian di perantauan?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 240,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Ketika kita berjalan berdampingan di tempat umum, pujian apa yang paling ingin kamu dengar dariku?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 241,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apakah ada kalimat masa lalu yang pernah melukai hatimu dan ingin kamu dengar kata maafnya lagi sekarang?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 242,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Apa pesan penyemangat pertama yang paling kamu tunggu setiap kali membuka HP di pagi hari?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 243,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Jika cinta kita diibaratkan satu kalimat slogan, slogan apa yang paling pas?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 244,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Apa hal yang paling kamu sukai dari suaraku ketika aku berbisik langsung tepat di sebelahmu?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 245,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Seberapa besar arti telepon rutin di sela jam istirahat untuk menjaga hatimu tetap tenang?",
    "type": "TRUTH"
  },
  {
    "category": "Apresiasi",
    "id": 246,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bagian mana dari kejujuran dan keterbukaanku yang paling membuatmu merasa aman?",
    "type": "TRUTH"
  },
  {
    "category": "Kagum",
    "id": 247,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Pernahkah caraku membela dirimu di hadapan orang lain membuatmu merasa sangat dihargai?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 248,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Saat kita saling berhadapan tanpa layar, apa kalimat pertama yang selalu terbersit di dalam benakmu?",
    "type": "TRUTH"
  },
  {
    "category": "Pujian",
    "id": 249,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Apa ekspresi wajahku di kamera video call yang paling sering bikin kamu gemas sendiri?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 250,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Apa janji masa depan yang pernah kuucapkan yang paling kamu jaga erat di dalam hatimu?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 301,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Momen kencan berdua mana yang paling berkesan dan ingin sekali kamu ulang kembali dari awal?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 302,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa definisi 'Quality Time' paling ideal bagimu ketika kita sedang menghabiskan waktu bersama?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 303,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika kita punya akhir pekan penuh tanpa gangguan HP dan pekerjaan, kegiatan apa yang paling ingin kamu lakukan bersamaku?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 304,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ceritakan obrolan larut malam (late night talk) kita yang paling membuatmu merasa terkoneksi secara mendalam!",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 305,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa kita sedang bersama tapi pikiran atau perhatian kita terasa berjauhan? Kapan itu?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 306,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tempat atau kota impian mana yang paling ingin kamu jelajahi berdua denganku suatu saat nanti?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 307,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apakah kamu lebih menyukai kencan jalan-jalan keluar yang ramai atau sekadar duduk santai di rumah sambil mengobrol?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 308,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa hal yang paling sering mengalihkan perhatianmu saat kita sedang berbicara berdua?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 309,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Perjalanan atau liburan bersama mana yang menurutmu paling penuh tawa dan cerita tak terduga?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 310,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Kapan momen di mana keheningan di antara kita berdua tetap terasa sangat nyaman dan tidak canggung?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 311,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Hal baru apa yang ingin kamu pelajari atau coba lakukan bersama denganku tahun ini?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 312,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika kita merencanakan 'staycation' romantis, apa 3 hal wajib yang harus ada di agenda kita?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 313,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Kapan pertama kali kita menghabiskan waktu seharian penuh berdua dan apa yang kamu rasakan saat pulang?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 314,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa film atau serial yang pernah kita tonton bersama dan paling banyak meninggalkan kenangan seru?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 315,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Seberapa sering kamu merasa rindu hanya untuk sekadar bertatapan mata langsung tanpa terhalang layar HP?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 316,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Makanan kaki lima atau warung pinggir jalan mana yang paling memiliki nilai nostalgia manis untuk kita berdua saat jalan bareng?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 317,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Apakah kamu masih ingat momen saat kita terjebak hujan bersama di perjalanan? Ceritakan kenangan itu!",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 318,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Topik obrolan apa yang paling kamu sukai saat kita berdiskusi santai larut malam?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 319,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika kita hanya memiliki waktu 1 jam sebelum berpisah lama, bagaimana kamu ingin menghabiskan 1 jam tersebut?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 320,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ide kencan sederhana tanpa biaya apa yang menurutmu paling menyenangkan untuk kita lakukan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 321,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa cemburu pada kesibukan atau hobi yang menyita waktu kebersamaan kita?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 322,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa foto di galeri HP-mu yang paling menangkap kehangatan momen saat kita sedang berduaan?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 323,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Bagi kamu saat LDR, apakah sesi video call sambil menemani masing-masing beraktivitas sudah terasa menenangkan?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 324,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika kita bisa camping di bawah bintang-bintang semalaman, apa rahasia yang ingin kamu ceritakan padaku?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 325,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bagaimana caramu menyampaikan padaku saat kamu sedang sangat butuh kehadiran dan waktuku?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 326,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Kapan momen di mana kehadiran fisikku di sampingmu terasa benar-benar menyembuhkan rasa lelahmu?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 327,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ritual harian berdua apa yang paling ingin kamu pertahankan sampai kita tua nanti?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 328,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Pernahkah kita memiliki rencana kencan yang gagal total tapi justru berakhir menjadi momen yang sangat lucu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 329,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apakah ada impian masa kecilmu yang ingin sekali kamu wujudkan bersama denganku?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 330,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa kencan pertama kita yang paling membuatmu deg-degan dari sebelum berangkat sampai tiba di rumah?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 331,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Lagu apa yang paling cocok menjadi soundtrack untuk setiap momen kebersamaan kita?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 332,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bagaimana perasaanmu saat kita harus menjalani rutinitas harian yang padat dan jarang punya waktu luang?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 333,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika kita bisa makan malam romantis di atas kapal pesiar atau di puncak gunung, mana yang kamu pilih?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 334,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Obrolan paling konyol apa yang pernah kita bicarakan berjam-jam sampai tidak sadar waktu sudah larut?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 335,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa hal yang paling kamu rindukan dari caraku menatapmu saat kita sedang duduk berhadapan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 336,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa satu hal yang bisa kita perbaiki agar waktu kebersamaan kita terasa lebih bermakna dan berkualitas?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 337,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apakah kamu lebih suka kencan petualangan outdoor atau kencan museum date / nonton film di bioskop?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 338,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Kenapa waktu rasanya selalu berputar terlalu cepat setiap kali kita sedang bersama?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 339,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Sesi nonton bareng secara virtual (watch party) mana yang paling seru pernah kita lakukan saat berjauhan?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 340,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Ketika kita jalan-jalan di mall atau pasar malam, stan mana yang paling sering membuat kita berhenti berlama-lama?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 341,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Bagaimana caramu membunuh rasa bosan saat video call kita sedang sama-sama hening tapi tetap ingin tersambung?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 342,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Seberapa penting menurutmu bagi kita untuk memiliki jadwal kencan rutin mingguan tanpa gangguan kerjaan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 343,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Momen naik motor atau naik mobil berdua sambil bernyanyi bersama di jalan, lagu apa yang paling berkesan?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 344,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Apa hal pertama yang paling ingin kamu lakukan bersamaku tepat pada hari pertama kita bertemu setelah LDR lama?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 345,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Jika ada kesempatan liburan berdua selama 3 hari tanpa gadget sama sekali, apakah kamu siap melakukannya?",
    "type": "TRUTH"
  },
  {
    "category": "Kencan",
    "id": 346,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Kapan terakhir kali kita duduk berdua di bangku taman atau pinggir pantai menikmati pemandangan matahari tenggelam?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 347,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Berapa lama rekor video call terlama yang pernah kita lakukan dan topik apa saja yang kita obrolkan saat itu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 348,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa tanda-tanda yang paling terlihat dariku saat aku sedang lelah dan butuh ditemani secara intensif?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 349,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Makanan apa yang proses memasak atau mencarinya bersama-sama paling meninggalkan kenangan seru?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 350,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Apa arti 'hadir seutuhnya' untuk pasangan bagimu di era di mana semua orang terpaku pada layar ponsel?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 401,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kado atau hadiah pertama apa yang pernah kuberikan padamu dan masih kamu simpan rapi sampai sekarang?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 402,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bagi kamu, apakah nilai sebuah hadiah dilihat dari harganya atau dari perhatian dan makna di baliknya?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 403,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kejutan kecil apa yang pernah kuberikan tanpa hari spesial yang paling membuat hatimu tersentuh?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 404,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Jika kamu bisa meminta satu hadiah impian dariku tanpa memikirkan budget, hadiah apa yang paling kamu inginkan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 405,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Barang apa pemberianku yang paling sering kamu pakai atau bawa ke mana-mana dalam keseharianmu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 406,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apakah kamu lebih menyukai kado buatan tangan (DIY / surat cinta) atau kado barang fungsional yang langsung bisa dipakai?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 407,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu diam-diam menginginkan suatu barang dan berharap aku bisa peka membelikannya untukmu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 408,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bagaimana perasaanmu ketika menerima hadiah yang dibungkus dengan penuh usaha dan kartu ucapan tulisan tangan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 409,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kado ulang tahun mana dariku yang menurutmu paling tidak terduga dan paling sukses membuatmu terharu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 410,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apa arti cinderamata atau oleh-oleh kecil yang kubawakan saat aku pulang dari bepergian jauh bagimu?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 411,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Jika kita memiliki rumah sendiri, pernak-pernik atau hadiah apa yang ingin kamu pajang sebagai simbol cinta kita?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 412,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Pernahkah aku salah membelikan hadiah atau memilih warna yang kurang kamu sukai? Bagaimana reaksimu saat itu?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 413,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bunga, cokelat, atau makanan apa yang pernah kuberikan yang rasanya paling manis di ingatanmu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 414,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apakah kamu masih menyimpan tiket bioskop, struk belanja, atau pembungkus kado kencan masa lalu kita?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 415,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kenapa menurutmu memberi hadiah adalah bentuk bahasa kasih yang menguatkan memori hubungan?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 416,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Hadiah pengalaman (seperti tiket konser berdua atau tiket liburan) apa yang paling ingin kamu dapatkan dariku?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 417,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kapan terakhir kali kamu merasa sangat senang saat tiba-tiba ada kurir paket datang mengantarkan makanan/kado dariku saat LDR?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 418,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Hadiah apa yang pernah kamu persiapkan untukku yang persiapannya paling menguras tenaga dan pikiranmu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 419,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Benda kecil apa yang jika kamu lihat di suatu toko, langsung membuatmu teringat padaku?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 420,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bagaimana caramu menunjukkan apresiasi ketika pasangan memberikan sesuatu yang sangat kamu sukai?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 421,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Buku, perhiasan, atau aksesoris couple apa yang paling ingin kita miliki bersama?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 422,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apakah kamu tipe orang yang suka kejutan mendadak atau lebih suka ditanya dulu sebelum dibelikan hadiah?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 423,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Hadiah paling lucu atau konyol apa yang pernah kita saling tukarkan selama berhubungan?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 424,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Seberapa berharga surat cinta atau sticky note kecil yang diselipkan di tas atau barang bawaanmu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 425,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa canggung atau tidak enak hati saat menerima hadiah yang terlalu mewah dariku?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 426,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Jika kamu bisa mendesain kado anniversary impian untuk kita, wujud kado itu seperti apa?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 427,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Makanan manis atau minuman apa yang jika kupesankan lewat ojek online langsung ampuh memperbaiki mood-mu saat suntuk?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 428,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apa barang termurah yang pernah kuberikan tapi memiliki tempat paling istimewa di hatimu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 429,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Jika terjadi musibah dan kamu hanya bisa menyelamatkan 1 barang pemberianku, barang mana yang kamu selamatkan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 430,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apakah menerima hadiah membuatmu merasa aku selalu memikirkanmu bahkan saat sedang berjauhan?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 431,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Tanaman atau hewan peliharaan apa yang ingin kita rawat bersama sebagai hadiah kehidupan di hubungan kita?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 432,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Ceritakan ekspresi wajahmu saat pertama kali membuka kotak kado dariku!",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 433,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Baju atau jaket milikku yang pernah kamu pinjam/minta saat ketemu dan sampai sekarang masih kamu simpan?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 434,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Pernahkah aroma parfum dari kado yang kuberikan membuatmu langsung merasa aman dan tenang?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 435,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apa tradisi tukar kado yang ingin kita lestarikan setiap perayaan ulang tahun hubungan kita?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 436,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Parfum dengan aroma seperti apa yang paling kamu inginkan kusemprotkan saat kita bertemu?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 437,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apa jenis kejutan anniversary yang paling membuatmu terpesona sepanjang ingatanmu?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 438,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kenapa setiap kado dariku selalu terasa memiliki jiwa dan cinta di dalamnya?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 439,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kado virtual apa (playlist, video kompilasi foto, atau surat digital) yang paling membuatmu terharu saat LDR?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 440,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Ketika kita jalan bersama di toko souvenir, cinderamata apa yang paling ingin kamu beli untuk dipajang di kamar?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 441,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Bagaimana perasaanmu ketika paket kirimanku tiba dan kamu membukanya sambil video call bersamaku?",
    "type": "TRUTH"
  },
  {
    "category": "Impian",
    "id": 442,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Gadget atau barang penunjang hobi apa yang paling ingin kamu belikan untuk pasanganmu jika gajian berlebih?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 443,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apakah kamu masih ingat kartu ucapan pertama yang pernah kuberikan dan kata-kata apa yang tertulis di situ?",
    "type": "TRUTH"
  },
  {
    "category": "Kejutan",
    "id": 444,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Pernahkah aku menyembunyikan kado di saku bajumu atau di dalam tasmu tanpa kamu sadari?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 445,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Seberapa sering kamu mengirimkan link barang di marketplace sambil memberikan kode 'Lucu ya sayang'?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 446,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Menurutmu, apa hadiah emosional terbaik yang bisa kita berikan satu sama lain setiap hari?",
    "type": "TRUTH"
  },
  {
    "category": "Sentimental",
    "id": 447,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Benda apa milik pasanganmu yang baunya paling sering kamu hirup saat sedang dilanda rindu?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 448,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Bunga mawar atau bunga jenis apa yang pernah kamu terima langsung dari tanganku?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 449,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kado digital apa yang paling ingin kamu dapatkan untuk merayakan hari jadian kita bulan ini?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 450,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Apa arti sebuah cincin atau gelang komitmen di jarimu sebagai lambang cinta kita berdua?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 501,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bantuan kecil apa dariku yang tanpa kuminta paling sering membuat harimu terasa jauh lebih ringan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 502,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Momen saat aku merawatmu ketika kamu sedang sakit atau kelelahan, apa yang paling kamu ingat dari caraku menjagamu?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 503,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tindakan nyata apa dariku yang paling membuatmu yakin bahwa aku benar-benar tulus menyayangimu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 504,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Pekerjaan rumah atau urusan sehari-hari apa yang paling ingin kamu bagi bersamaku agar kamu tidak merasa sendirian?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 505,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Ceritakan satu pengorbanan waktu atau tenagaku yang pernah membuatmu merasa sangat diperjuangkan!",
    "type": "TRUTH"
  },
  {
    "category": "Makanan",
    "id": 506,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Makanan atau minuman apa buatan/pesananku yang paling terasa seperti kehangatan rumah bagimu?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 507,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apakah kamu lebih merasa dicintai saat aku mendengarkan keluh kesahmu atau saat aku langsung mencarikan solusinya?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 508,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa lelah mengurus segala hal sendirian dan berharap aku lebih berinisiatif membantu?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 509,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kapan momen saat LDR di mana aku tiba-tiba berinisiatif memesankan makanan/obat saat kamu sakit yang paling bikin terharu?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 510,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Bagi kamu saat ketemu, apakah tindakan membukakan pintu, membawakan tas, atau memakaikan helm terasa sangat manis?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 511,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Hal sederhana apa yang kulakukan di pagi hari atau malam hari yang paling kamu rindukan saat kita berjauhan?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 512,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bagaimana caramu menunjukkan rasa terima kasih ketika pasangan berusaha keras membantumu menyelesaikan masalah?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 513,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bantuan darurat apa yang pernah kuberikan padamu saat kamu sedang panik atau terjebak dalam masalah?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 514,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Apa kebiasaan baik dariku yang selalu memastikan kamu aman (misal: berjalan di sisi jalan yang aman / mengecek kendaraan)?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 515,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Saat kamu sedang suntuk bekerja, gestur perhatian kecil apa yang paling bisa mengembalikan fokus dan senyummu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 516,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apakah kamu tipe orang yang gengsi meminta tolong atau gampang mengekspresikan kebutuhan bantuanmu ke pasangan?",
    "type": "TRUTH"
  },
  {
    "category": "Makanan",
    "id": 517,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pernahkah aku menyuapimu makanan saat tanganmu sedang repot? Bagaimana perasaanmu saat itu?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 518,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apa hal paling merepotkan yang pernah kulakukan demi membuatmu merasa nyaman dan senang?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 519,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Jika kamu sedang lelah sekali saat kita bersama, apakah kamu lebih ingin dipijat, dibuatkan makanan, atau ditemani tidur dalam hening?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 520,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Seberapa besar rasa lega yang kamu rasakan saat aku menawarkan diri: 'Biar ini aku aja yang urus ya'?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 521,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tindakan pelayanan apa yang menurutmu menjadi bukti nyata cinta sejati dibanding ribuan kata manis?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 522,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Momen perjalanan atau urusan bersama mana di mana kita saling bahu-membahu mengatasi kendala?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 523,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Apakah kamu merasa nyaman jika aku membantu merapikan barang-barang pribadi atau pakaianmu saat ketemu?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 524,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Kapan kamu merasa aku benar-benar melindungi martabat dan perasaanmu di depan orang banyak?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 525,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apa kompromi terbesar yang pernah kulakukan demi menyesuaikan dengan kebutuhan atau kebiasaanmu?",
    "type": "TRUTH"
  },
  {
    "category": "Makanan",
    "id": 526,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Jika kita lelah sepulang kerja, masakan sederhana apa yang ingin kita masak bersama secara cepat di dapur?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 527,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pernahkah aku mengantarmu pulang dalam keadaan cuaca buruk atau larut malam? Apa yang kamu rasakan saat sampai di rumah?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 528,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bagaimana caraku merawatmu ketika kamu sedang mengalami bad mood akibat PMS atau lelah pekerjaan?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 529,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu memperhatikan hal-hal detail yang kuselesaikan agar kamu tidak perlu khawatir?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 530,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apa satu hal tentang pembagian peran rumah tangga masa depan yang paling ingin kita sepakati sejak sekarang?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 531,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Ceritakan saat aku membantumu memilihkan barang atau menyelesaikan tugas sulit yang membuatmu bangga!",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 532,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Apakah kamu lebih menyukai dijemput tepat waktu atau disiapkan bekal makanan saat bepergian?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 533,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Gestur refleks apa dariku yang tanpa kusadari selalu membuktikan rasa peduliku kepadamu?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 534,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa perbuatan baikmu tidak dihargai olehku? Bagaimana kita bisa memperbaikinya?",
    "type": "TRUTH"
  },
  {
    "category": "Makanan",
    "id": 535,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apa camilan favoritmu yang jika kubawakan/kupesankan tanpa diminta langsung membuat harimu bahagia?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 536,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Menurutmu, siapa di antara kita yang paling telaten dan sabar saat mengurus kebutuhan pasangan?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 537,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bantuan apa yang pernah kuberikan kepada keluargamu yang membuatmu semakin yakin pada komitmenku?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 538,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Kenapa tindakan nyata selalu terasa seribu kali lebih menenangkan bagimu dibanding janji di masa depan?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 539,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Seberapa sering aku menelpon untuk membangunkanmu di pagi hari agar kamu tidak telat bangun saat LDR?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 540,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Bantuan daring apa (misal: carikan info tiket, proofreading tulisan, edit file) yang pernah kuberikan yang paling berguna bagimu?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 541,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ketika kamu memakai sepatu bertali atau membawa payung di tengah hujan, apa yang biasa kulakukan untukmu?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 542,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Apakah kamu merasa terbantu saat aku mengingatkan jadwal minum obat atau vitamin lewat chat harian?",
    "type": "TRUTH"
  },
  {
    "category": "Deep Talk",
    "id": 543,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bantuan seperti apa yang paling kamu butuhkan dariku saat pikiranmu sedang buntu dan kalut?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 544,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ketika kita makan di restoran ramai, hal apa yang kulakukan yang membuatmu tidak perlu repot sama sekali?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 545,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Pernahkah aku begadang menemanimu lewat telepon sampai tugas atau skripsimu selesai semalaman?",
    "type": "TRUTH"
  },
  {
    "category": "Pelayanan",
    "id": 546,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Menurutmu, tindakan pelayanan apa yang paling ingin kamu persembahkan untuk pasanganmu setiap pagi?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 547,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Saat kamu ketiduran di mobil atau di ruang tamu, bagaimana caraku memperlakukanmu agar tidurmu nyaman?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 548,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Apa playlist lagu fokus atau pengantar tidur yang pernah kubuatkan untuk membantumu beristirahat?",
    "type": "TRUTH"
  },
  {
    "category": "Perhatian",
    "id": 549,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Bagaimana caraku merespons ketika kamu mengeluh capek dengan rutinitas harianmu?",
    "type": "TRUTH"
  },
  {
    "category": "Komitmen",
    "id": 550,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Apa wujud pengabdian dan pelayanan cinta terbesar yang ingin kamu baktikan untuk masa depan rumah tangga kita?",
    "type": "TRUTH"
  },
  {
    "category": "Intim",
    "id": 601,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa yang kamu rasakan di dalam hatimu saat jemari tangan kita saling menggenggam erat waktu berjalan berdua?",
    "type": "TRUTH"
  },
  {
    "category": "Pelukan",
    "id": 602,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bentuk pelukan seperti apa dariku yang paling membuatmu merasa damai, tenang, dan terlindungi dari lelahnya dunia?",
    "type": "TRUTH"
  },
  {
    "category": "Genggaman",
    "id": 603,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Kapan momen di mana kamu merasa sangat membutuhkan genggaman tanganku tanpa perlu mengucapkannya lewat kata-kata?",
    "type": "TRUTH"
  },
  {
    "category": "Sentuhan",
    "id": 604,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Sentuhan fisik lembut apa dariku (mengelus rambut, memegang pipi, atau menggandeng tangan) yang paling bikin kamu meleleh?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 605,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Jika kita sedang duduk bersandar berdua dalam hening tanpa gadget, sentuhan apa yang paling membuatmu merasa aman?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 606,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Ceritakan apa yang terlintas di pikiranmu saat pertama kali tangan kita bersentuhan tanpa sengaja di awal pertemuan!",
    "type": "TRUTH"
  },
  {
    "category": "Pelukan",
    "id": 607,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Saat kamu sedang sedih atau lelah, apakah kamu lebih memilih untuk didekap erat dalam diam atau diajak bercerita?",
    "type": "TRUTH"
  },
  {
    "category": "Sentuhan",
    "id": 608,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bagian mana dari kebiasaan fisik kita berdua saat bersama yang paling membuatmu selalu rindu saat pulang?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 609,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu diam-diam memperhatikan wajahku saat aku sedang tertidur lelap di dekatmu? Apa rasanya?",
    "type": "TRUTH"
  },
  {
    "category": "Genggaman",
    "id": 610,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa arti sentuhan tangan pasangan bagimu dalam menguatkan komitmen dan rasa percaya di antara kita?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 611,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Jika kita sedang jalan berdua di tempat ramai, gestur mesra apa yang paling membuatmu merasa bangga menjadi pasanganku?",
    "type": "TRUTH"
  },
  {
    "category": "Pelukan",
    "id": 612,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Seberapa sering kamu mendambakan pelukan hangat dariku saat seharian menghadapi hari yang berat?",
    "type": "TRUTH"
  },
  {
    "category": "Tatap Mata",
    "id": 613,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bagaimana perasaanmu saat aku menatap matamu dari jarak sangat dekat tanpa sepatah kata pun terucap?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 614,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa satu hal tentang keintiman emosional dan fisik di antara kita yang menurutmu paling istimewa dibanding siapapun?",
    "type": "TRUTH"
  },
  {
    "category": "Genggaman",
    "id": 615,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Ketika tangan kita saling bertaut erat, pesan atau rasa apa yang paling kuat tersampaikan ke dalam jiwamu?",
    "type": "TRUTH"
  },
  {
    "category": "Debaran",
    "id": 616,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Pernahkah kamu merasa detak jantungmu berdegup sangat kencang hanya karena aku mendekatkan wajahku padamu?",
    "type": "TRUTH"
  },
  {
    "category": "Bisikan",
    "id": 617,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa bisikan paling mesra dariku saat berada di dekatmu yang selalu terngiang-ngiang manis di kepalamu?",
    "type": "TRUTH"
  },
  {
    "category": "Keamanan",
    "id": 618,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apakah kamu merasa aman dan bebas menjadi diri sendiri seutuhnya saat berada di dalam dekapanku? Mengapa?",
    "type": "TRUTH"
  },
  {
    "category": "Canggung",
    "id": 619,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa satu hal tentang kemesraan atau sentuhan fisik yang dulu membuatmu malu/canggung, tapi kini sangat kamu sukai?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 620,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Momen mesra apa di antara kita yang menurutmu paling berharga dan tak akan pernah bisa kamu lupakan seumur hidup?",
    "type": "TRUTH"
  },
  {
    "category": "Sentuhan",
    "id": 621,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bagian mana dari caraku memperlakukan fisik dan perasaanmu yang paling membuatmu merasa sangat dihargai?",
    "type": "TRUTH"
  },
  {
    "category": "Ritual",
    "id": 622,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Jika kamu bisa meminta satu sentuhan kasih sayang dariku setiap hari sebelum tidur, sentuhan apa yang paling kamu pilih?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 623,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa konsep kencan berdua yang paling tenang, intim, dan bebas dari gangguan orang lain yang ingin kita wujudkan?",
    "type": "TRUTH"
  },
  {
    "category": "Tatap Mata",
    "id": 624,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Kapan kamu merasa tatapan mataku benar-benar menyampaikan rasa sayang yang begitu dalam tanpa kata-kata?",
    "type": "TRUTH"
  },
  {
    "category": "Ciuman",
    "id": 625,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Di mana ciuman manis dariku (kening, pipi, atau tangan) yang paling terasa tulus dan menyejukkan hatimu?",
    "type": "TRUTH"
  },
  {
    "category": "Sandaran",
    "id": 626,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Apakah menyandarkan kepala di bahu atau dadaku adalah tempat peristirahatan ternyamanmu di dunia saat kita bersama?",
    "type": "TRUTH"
  },
  {
    "category": "Sensasi",
    "id": 627,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Pernahkah elusan lembut di rambut atau lehermu membuat rasa kantuk dan ketenanganmu datang seketika?",
    "type": "TRUTH"
  },
  {
    "category": "Kehangatan",
    "id": 628,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bagaimana caramu menyampaikan bahwa kamu sedang butuh dipeluk tanpa harus merasa malu atau gengsi?",
    "type": "TRUTH"
  },
  {
    "category": "Memori",
    "id": 629,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apakah kamu masih ingat sensasi hangat saat pertama kali jari-jari tangan kita saling mengunci di kencan awal?",
    "type": "TRUTH"
  },
  {
    "category": "Backhug",
    "id": 630,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Apa yang terlintas di benakmu saat aku memelukmu tiba-tiba dari belakang (backhug) saat kamu sedang sibuk?",
    "type": "TRUTH"
  },
  {
    "category": "Sentuhan",
    "id": 631,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Jika cuaca sedang dingin dan hujan deras, posisi duduk berdua seperti apa yang paling kamu impikan bersamaku?",
    "type": "TRUTH"
  },
  {
    "category": "Spicy",
    "id": 632,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Bagian mana dari tubuh atau aromaku yang paling sering membuatmu gemas ingin memeluk lebih erat?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 633,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Seberapa besar pengaruh sentuhan fisik pasangan dalam meredakan rasa cemas atau rasa takutmu?",
    "type": "TRUTH"
  },
  {
    "category": "Tatap Mata",
    "id": 634,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Momen tatap-tatapan mata paling intens mana yang pernah membuatmu sampai tersipu merah dan menutup wajah?",
    "type": "TRUTH"
  },
  {
    "category": "Sentuhan",
    "id": 635,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apakah kamu lebih menyukai usapan lembut di punggung atau belaian di telapak tangan saat kita berbincang?",
    "type": "TRUTH"
  },
  {
    "category": "Keintiman",
    "id": 636,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apa arti pelukan perpisahan saat kita harus kembali ke tempat masing-masing bagimu?",
    "type": "TRUTH"
  },
  {
    "category": "Romantis",
    "id": 637,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Kapan kamu merasa debaran fisik kita berdua menyatu menjadi satu ritme yang begitu tenang?",
    "type": "TRUTH"
  },
  {
    "category": "Cinta",
    "id": 638,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Kenapa berada dalam dekapanmu selalu terasa seperti pulang ke rumah ternyaman di muka bumi?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 639,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Bagian mana dari tubuhmu yang paling merindukan pelukan hangat saat kita terpisah jarak dan hanya bisa saling menatap di layar?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 640,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Apakah kamu pernah memeluk guling atau bantal sambil membayangkan itu adalah aku saat kamu sangat merindukan kehadiranku?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 641,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Ketika aku meniupkan ciuman ke kamera di akhir video call, apakah kamu merasakan kehangatannya sampai ke hatimu?",
    "type": "TRUTH"
  },
  {
    "category": "Kemesraan",
    "id": 642,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Gestur fisik kecil apa (seperti mencubit hidung, merapikan poni) yang paling sering kulakukan saat kita berdekatan?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 643,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Apa hal pertama yang ingin kamu sentuh (tangan, pipi, atau langsung mendekap tubuhku) saat hari pertama kita bertemu nanti?",
    "type": "TRUTH"
  },
  {
    "category": "Sandaran",
    "id": 644,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Bagaimana rasanya ketika tangan kita saling bertaut di dalam saku jaket saat berjalan di udara malam yang dingin?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 645,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Seberapa sering kamu menyentuh foto kita berdua di layar HP saat sedang rindu berat di malam hari?",
    "type": "TRUTH"
  },
  {
    "category": "Sensasi",
    "id": 646,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Pernahkah ciuman di kening membuat air matamu menetes karena merasa begitu dimuliakan dan disayangi?",
    "type": "TRUTH"
  },
  {
    "category": "LDR",
    "id": 647,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Apa gestur di video call (misal: meletakkan tangan di dada, senyum dekat kamera) yang paling bisa menggantikan rasa rindu fisikmu?",
    "type": "TRUTH"
  },
  {
    "category": "Keamanan",
    "id": 648,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Kenapa sentuhan fisik dari orang yang kita cintai memiliki kekuatan menyembuhkan luka batin lebih cepat dari apapun?",
    "type": "TRUTH"
  },
  {
    "category": "Intim",
    "id": 649,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Kapan momen di mana kamu merasa pelukan kita berdua berlangsung begitu lama dan tak ingin berakhir?",
    "type": "TRUTH"
  },
  {
    "category": "Komitmen",
    "id": 650,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Apakah kamu percaya bahwa keintiman fisik yang dilandasi rasa saling menghormati adalah pondasi kebahagiaan hubungan jangka panjang?",
    "type": "TRUTH"
  }
];

const defaultDaresList = [
  {
    "category": "Konyol",
    "id": 26,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Tatap mata pasanganku lekat-lekat selama 30 detik tanpa boleh tersenyum atau tertawa!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 27,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Kirim voice note 15 detik nyanyiin reff lagu cinta paling romantis khusus buat aku sekarang juga!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 28,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Tirukan suara kucing manja yang lagi minta makan sambil nengok ke kamera/pasangan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 29,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Gombalin aku dengan menggunakan 3 kata acak: 'Kulkas', 'Ular Tangga', dan 'Masa Depan'!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 30,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Kirim/tunjukkan foto selfie dengan ekspresi wajah paling jelek \u0026 konyol di galeri HP kamu!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 31,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Berikan 5 pujian tulus tentang fisik dan kepribadianku berturut-turut tanpa jeda berpikir!",
    "type": "DARE"
  },
  {
    "category": "Spicy",
    "id": 32,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Bisikkan kata-kata paling menggoda atau manis ke speaker HP / telinga pasangan selama 10 detik!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 33,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Joget lucu tanpa musik selama 20 detik di depan pasangan / kamera dengan penuh percaya diri!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 34,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Tulis pesan 1 paragraf berisi alasan kenapa kamu bersyukur punya aku, lalu kirim ke chat kita sekarang!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 35,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Tahan napas sambil bilang 'Aku sayang banget sama kamu dan gak mau kehilangan kamu!' sebanyak 3 kali!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 36,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Pasang foto kita berdua jadi wallpaper HP kamu sampai sesi permainan ini selesai!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 37,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Peragakan cara aku berjalan atau cara aku waktu lagi ngambek dengan akting terbaikmu!",
    "type": "DARE"
  },
  {
    "category": "Spicy",
    "id": 38,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Tatap kamera/pasangan dengan tatapan paling memikat selama 15 detik tanpa berkedip!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 39,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Kirimkan flying kiss paling heboh dan suara kecupan termanis ke arah kamera video call!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 40,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Buat pantun cinta lucu 4 baris yang rima akhirnya berakhiran namaku!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 41,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Ucapkan satu permintaan maaf tulus untuk hal kecil di masa lalu yang mungkin pernah menyakiti hatiku!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 42,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "OFFLINE",
    "prompt": "Pegang kedua tanganku erat-erat, tatap mataku, dan katakan: 'Masa depanku adalah bersamamu'!",
    "type": "DARE"
  },
  {
    "category": "Spicy",
    "id": 43,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "OFFLINE",
    "prompt": "Kecup kening pasanganku dengan sangat lembut dan tahan selama 5 detik penuh penghayatan!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 44,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Tirukan ekspresi wajah emoji yang dipilihkan oleh pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 45,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Ceritakan kembali detik-detik pertama kali kamu menembakku atau menyatakan perasaanmu padaku!",
    "type": "DARE"
  },
  {
    "category": "Spicy",
    "id": 46,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut pundak atau leher pasanganmu selama 1 menit penuh perhatian!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 47,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Bicara dengan logat bayi (baby talk) selama 2 putaran ke depan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 48,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 hal dari diriku yang membuatmu jatuh cinta setiap hari berulang kali!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 49,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Kirimkan stiker chat WA paling cringe dan aneh yang ada di koleksimu ke pasangan!",
    "type": "DARE"
  },
  {
    "category": "Konyol",
    "id": 21,
    "isCustom": false,
    "loveLanguage": "GENERAL",
    "mode": "ONLINE",
    "prompt": "Impersonate kata-kata yang sering aku ucapin waktu videocall pakai gaya suaraku!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 251,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Tatap mata pasanganmu (lewat layar atau langsung) dan berikan 5 pujian spesifik tentang paras wajahnya tanpa jeda berpikir!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 252,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Kirim voice note 20 detik sekarang ke chat pasangan membacakan puisi cinta romantis yang kamu buat spontan!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 253,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Ucapkan terima kasih atas 3 hal kecil yang dilakukan pasanganmu hari ini dengan nada paling tulus!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 254,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Buat gombalan maut menggunakan kata: 'Bintang', 'WiFi', dan 'Jantung' lalu sampaikan ke pasangan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 255,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Bisikkan ke telinga pasanganmu kalimat: 'Kamu adalah anugerah terindah yang pernah Tuhan kasih buat aku' dengan sangat lembut!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 256,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Kecup microphone HP-mu sambil bisikkan kalimat 'I miss you so much' hingga suaranya terdengar jelas oleh pasangan!",
    "type": "DARE"
  },
  {
    "category": "Chat",
    "id": 257,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Tulis status WhatsApp atau status Instagram dengan 1 kalimat apresiasi termanis untuk pasanganmu sekarang!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 258,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Puji gaya pakaian atau penampilan pasanganmu hari ini layaknya seorang juri mode profesional yang terpesona!",
    "type": "DARE"
  },
  {
    "category": "Kagum",
    "id": 259,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 sifat kepribadian pasanganmu yang menurutmu paling langka dan patut dipertahankan seumur hidup!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 260,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan 'Aku sayang kamu' dalam 5 bahasa daerah atau bahasa asing berbeda dengan ekspresi paling manis!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 261,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Pegang kedua tangan pasangan, tatap matanya, dan katakan: 'Terima kasih sudah selalu sabar dan bertahan sama aku'!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 262,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Dekatkan wajahmu ke kamera video call (jarak 5 cm), tatap lurus dan katakan: 'Jarak ini gak akan pernah ngalahin rasa sayangku'!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 263,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Tirukan adegan drama romantis di mana kamu menyatakan cinta seolah-olah baru pertama kali bertemu!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 264,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 hal yang menurutmu membuat pasanganmu 100x lebih mempesona dibanding orang lain!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 265,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Tuliskan satu janji manis di telapak tangan pasangan menggunakan jari telunjukmu dan minta dia menebaknya!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 266,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Kirimkan pesan teks berisikan 5 alasan detail kenapa kamu memilih dia menjadi pendamping hidupmu!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 267,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Beri penghargaan imajiner (misal: 'Pasangan Paling Pengertian Sedunia') dan pidatokan pidato penyerahan penghargaannya!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 268,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Tatap mata pasanganmu selama 15 detik, lalu ungkapkan apa hal paling indah yang kamu lihat di bola matanya!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 269,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Keluarkan gombalan paling receh yang kamu tahu sampai pasanganmu tertawa atau menutup wajahnya!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 270,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Ucapkan doa terbaik untuk kesehatan dan kesuksesan pasanganmu secara lisan di hadapannya sekarang!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 271,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Dekatkan wajahmu dan puji aroma parfum atau wangi tubuh pasanganmu dengan kalimat paling puitis!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 272,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Screenshot layar video call kalian saat pasangan sedang tersenyum termanis, lalu jadikan wallpaper chat kalian!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 273,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bikin pantun gombal 4 baris yang menggunakan nama lengkap atau nama panggilan pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Kagum",
    "id": 274,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Ceritakan satu momen di mana pasanganmu terlihat sangat cerdas atau keren di matamu!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 275,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan kepada pasanganmu: 'Duniaku jauh lebih berwarna sejak ada kamu' dengan tatapan paling teduh!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 276,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Pura-pura jadi pembaca berita yang memberitakan kabar gembira bahwa pasanganmu adalah manusia paling memikat hari ini!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 277,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 bagian dari senyuman pasanganmu yang paling bisa meluluhkan rasa kesal atau capekmu!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 278,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Bikin rekaman video pendek 10 detik mengucapkan 'Selamat tidur sayang, mimpi indah ya' khusus untuk dia simpan!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 279,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan 1 permohonan maaf tulus atas ucapan yang mungkin pernah menyinggung perasaan pasanganmu belakangan ini!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 280,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bandingkan kecantikan / ketampanan pasanganmu dengan tokoh idola dan jelaskan kenapa pasanganmu menang telak!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 281,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Letakkan tanganmu di dadamu dan ucapkan: 'Detak jantungku ini berdetak lebih cepat setiap kali namamu disebut'!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 282,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Tanyakan tebak-tebakan romantis yang jawabannya adalah nama pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 283,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Puji masakan, selera musik, atau rekomendasi tontonan yang pernah diberikan oleh pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 284,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Panggil pasanganmu dengan 5 panggilan manja berbeda berturut-turut dalam satu tarikan napas!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 285,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan: 'Kalau aku disuruh memilih lagi seribu kali, aku tetap akan memilih kamu' dengan penuh penghayatan!",
    "type": "DARE"
  },
  {
    "category": "Kagum",
    "id": 286,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Uraikan dalam 30 detik kenapa masa depanmu terasa jauh lebih pasti dan tenang saat ada dirinya di sampingmu!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 287,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Tatap pasanganmu dan katakan apa yang paling membuatmu merasa beruntung menjadi pasangannya!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 288,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Bikin janji lisan: 'Mulai hari ini, aku akan lebih sering memuji dan mengapresiasi usahamu'!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 289,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Bisikkan gombalan maut tepat di telinga pasangan sampai bulu kuduknya merinding salting!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 290,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Kirim pesan suara menyanyikan bagian reff lagu cinta favorit kalian berdua dengan penuh penghayatan!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 291,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan kalimat penutup: 'Terima kasih sudah ada di dunia ini, dan terima kasih sudah memilihku'!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 292,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Ucapkan kalimat cinta dengan menggunakan bahasa daerah asal pasanganmu di depan kamera!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 293,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Berlutut di depan pasangan seperti seorang ksatria dan bacakan deklarasi cintamu dalam 3 kalimat!",
    "type": "DARE"
  },
  {
    "category": "Chat",
    "id": 294,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Ketik pesan 'I love you to the moon and back' dengan huruf kapital dan emoji hati sebanyak 10 buah!",
    "type": "DARE"
  },
  {
    "category": "Pujian",
    "id": 295,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Puji kemampuan pasanganmu dalam mendengarkan dan menjadi pendengar yang baik!",
    "type": "DARE"
  },
  {
    "category": "Gombalan",
    "id": 296,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "OFFLINE",
    "prompt": "Kecup tangan pasangan lalu katakan gombalan tentang betapa lembut dan berharganya genggamannya!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 297,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "ONLINE",
    "prompt": "Tatap layar video call tanpa berkedip selama 20 detik sambil tersenyum menatap bibir pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Apresiasi",
    "id": 298,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Katakan apa sifat terbaik pasanganmu yang membuat keluargamu atau teman-temanmu kagum padanya!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 299,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Sampaikan satu kalimat penenang yang ingin selalu diingat pasangan saat dia sedang panik atau stres!",
    "type": "DARE"
  },
  {
    "category": "Komitmen",
    "id": 300,
    "isCustom": false,
    "loveLanguage": "WORDS_OF_AFFIRMATION",
    "mode": "BOTH",
    "prompt": "Ucapkan sumpah setia romantis yang akan selalu kamu jaga apapun tantangan yang dihadapi hubungan ini!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 351,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tatap mata pasanganmu lekat-lekat selama 30 detik tanpa boleh berbicara, tertawa, atau mengalihkan pandangan!",
    "type": "DARE"
  },
  {
    "category": "Detoks",
    "id": 352,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tengkurapkan layar HP kalian berdua (jangan sentuh notifikasi sama sekali) selama 3 putaran game ke depan!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 353,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ceritakan kembali detik-detik kencan pertama kita secara mendetail mulai dari pakaian hingga obrolan pertama!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 354,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Putar satu lagu kenangan cinta kita di HP dan nikmati lagunya bersama sambil saling menatap hangat!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 355,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bikin rencana konkret untuk kencan berikutnya (tentukan hari, jam, tempat, dan outfit) sekarang juga!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 356,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tanyakan satu pertanyaan tentang masa kecil pasangan yang belum pernah kamu tanyakan sebelumnya!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 357,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Duduk berhadapan, pegang tangan pasangan (atau tatap di kamera), dan dengarkan dia bercerita selama 1 menit tanpa menyela!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 358,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Bikin teh atau kopi hangat dan nikmati berdua secara santai sambil duduk berdampingan!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 359,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Ambil cangkir minumanmu masing-masing, lakukan 'virtual toast' (tos cangkir ke kamera HP) dan minum bersamaan!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 360,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Buat daftar 'Bucket List 5 Tempat Kencan Impian' yang wajib kita kunjungi bersama dalam setahun ke depan!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 361,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Buka album foto di HP, cari foto berdua paling konyol atau paling romantis, lalu ceritakan kisah di balik foto itu!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 362,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Ajak pasangan berdansa lambat (slow dance) tanpa musik selama 30 detik di ruangan kalian berada!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 363,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Putar lagu romantis dan lakukan 'virtual slow dance' di depan kamera dengan gerakan lembut saling berhadapan!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 364,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ungkapkan satu ketakutan terbesarmu dalam hidup dan dengarkan respons penuh empati dari pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 365,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tutup matamu selama 20 detik dan sebutkan 3 hal tentang pasanganmu yang paling kamu syukuri hadir di hidupmu!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 366,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Simulasikan kencan kilat (speed dating): berpura-pura baru kenal dan saling merayu dalam waktu 45 detik!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 367,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 hal sederhana dalam keseharian yang selalu terasa jauh lebih indah saat dilakukan berdua dengannya!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 368,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tirukan percakapan lucu atau canggung saat pertama kali kalian saling bertukar kontak telepon/sosmed!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 369,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Lakukan sinkronisasi napas berdua: tarik dan hembuskan napas secara bersamaan sebanyak 5 kali putaran!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 370,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Rancang menu makan malam romantis yang akan kalian masak/makan bersama pada kencan akhir pekan nanti!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 371,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Sampaikan satu harapan paling tulus untuk kebersamaan kita 5 tahun dari sekarang!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 372,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Nyanyikan sepenggal lagu pengantar tidur yang lembut khusus untuk pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 373,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Sebutkan tempat makan favorit kita berdua dan urutkan 3 menu yang paling sering kita pesan bersama!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 374,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Letakkan kepalamu di pundak pasanganmu dan pejamkan mata selama 30 detik untuk merasakan kenyamanan!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 375,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Tempelkan pipimu ke layar HP seolah-olah sedang bersandar di bahu pasangan sambil tersenyum manja!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 376,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Buat janji temu kencan tanpa gadget sama sekali untuk hari libur terdekat!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 377,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bikin tebak-tebakan kenangan: tebak apa yang kamu kenakan saat kencan kedua kita!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 378,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ceritakan satu momen di mana kamu merasa sangat beruntung tidak melewatkan kesempatan mengenalnya!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 379,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Pegang pipi pasangan dengan kedua tanganmu dan katakan: 'Saat ini, duniaku cuma ada kamu'!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 380,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Letakkan kedua telapak tanganmu membingkai layar video call tepat di posisi wajah pasanganmu selama 15 detik!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 381,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Pilih satu film romantis di aplikasi streaming yang wajib kalian tonton bersama minggu ini!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 382,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Kisah ulang momen paling mendebarkan saat kamu menunggu kedatangan atau telepon pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 383,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bikin janji lisan: 'Aku akan selalu meluangkan waktu khusus untukmu di tengah kesibukanku'!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 384,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Diskusikan satu kebiasaan baru yang ingin kita mulai bersama untuk mempererat ikatan batin!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 385,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tatap pasanganmu dan ceritakan apa hal yang paling kamu kagumi dari ketenangannya!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 386,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Bikin jadwal 'jalan santai pagi atau sore' berdua keliling taman terdekat akhir pekan ini!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 387,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tirukan ekspresi wajah pasangan saat dia sedang asyik menonton sesuatu atau sedang lapar!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 388,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Sampaikan ucapan terima kasih karena pasangan selalu meluangkan waktunya untuk menemanimu!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 389,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ungkapkan impian rumah tinggal masa depan kita berdua (lokasi, suasana, dan ruangan favorit)!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 390,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tersenyumlah bersama sambil menatap wajah satu sama lain selama 20 detik penuh ketulusan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 391,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Katakan: 'Bersamamu, waktu yang berjam-jam selalu terasa seperti hitungan detik'!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 392,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Ajak pasangan main game tebak kata lewat chat/video call selama 1 menit sekarang juga!",
    "type": "DARE"
  },
  {
    "category": "Kencan",
    "id": 393,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Pegang erat tangan pasangan dan ajak dia berjalan berputar mengelilingi ruangan dengan langkah pelan!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 394,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Kirimkan foto pemandangan langit atau kamar tempatmu berada sekarang sebagai tanda kehadiran bersama!",
    "type": "DARE"
  },
  {
    "category": "Deep Talk",
    "id": 395,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Tanyakan 'Apa hal yang paling ingin kamu capai bersamaku sebelum tahun ini berganti?'!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 396,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ungkapkan 1 lagu yang paling ingin kamu nyanyikan bersama saat sedang perjalanan jauh berdua!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 397,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "ONLINE",
    "prompt": "Sepakati waktu 'Date Night Virtual' minggu ini lengkap dengan pakaian rapi dan lilin aroma!",
    "type": "DARE"
  },
  {
    "category": "Fokus",
    "id": 398,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "OFFLINE",
    "prompt": "Duduk bersandar berdua dalam hening selama 45 detik tanpa suara handphone!",
    "type": "DARE"
  },
  {
    "category": "Memori",
    "id": 399,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Sebutkan 3 tempat paling bersejarah bagi perjalanan cinta kita berdua!",
    "type": "DARE"
  },
  {
    "category": "Komitmen",
    "id": 400,
    "isCustom": false,
    "loveLanguage": "QUALITY_TIME",
    "mode": "BOTH",
    "prompt": "Ucapkan komitmen: 'Aku berjanji akan selalu hadir dengan hati seutuhnya saat bersamamu'!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 451,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Buat origami hati atau lipatan bunga dari kertas/tisu dalam waktu 60 detik dan berikan langsung ke pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Virtual",
    "id": 452,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirimkan 'Voucher Hadiah Cinta Virtual' lewat chat WA (misal: 'Voucher Traktir Kopi Online Besok Pagi') sekarang!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 453,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Janjikan satu traktiran makanan atau minuman kesukaan pasanganmu untuk kencan/pertemuan berikutnya (catat di notes)!",
    "type": "DARE"
  },
  {
    "category": "Musik",
    "id": 454,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Buatkan mini playlist 3 lagu di Spotify/YouTube yang liriknya mendeskripsikan hadiah perasaanmu padanya dan kirim linknya!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 455,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Cari satu benda kecil di sekitarmu, berikan kepada pasangan dengan cerita fiktif romantis seolah itu pusaka cinta!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 456,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirimkan saldo e-wallet (GoPay/OVO/ShopeePay) nominal berapapun dengan catatan: 'Buat beli jajan manis hari ini ya sayang'!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 457,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Lepaskan aksesoris kecil milikmu (cincin, gelang, atau kuncir rambut) dan kenakan pada pasanganmu sebagai tanda cinta!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 458,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Gambarkan sketsa wajah pasanganmu di secarik kertas dalam 1 menit, foto atau tunjukkan ke kamera video call!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 459,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bikin voucher virtual 'Bebas Ngambek 1 Kali' dan tanda tangani secara resmi lewat chat untuk pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 460,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Kumpulkan 3 barang di ruangan ini yang berwarna favorit pasanganmu dan persembahkan di hadapannya!",
    "type": "DARE"
  },
  {
    "category": "Surat",
    "id": 461,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Tuliskan satu surat cinta mini 3 baris di kertas/tisu, gulung rapi, dan masukkan ke kantong baju pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 462,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirimkan pesan panjang berisi 5 hal yang ingin kamu belikan untuk pasangan saat kita punya rezeki melimpah kelak!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 463,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Bikin cincin darurat dari kertas atau tangkai dan pasangkan di jari manis pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Marketplace",
    "id": 464,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Buka marketplace, cari barang yang paling diinginkan pasangan di wishlist-nya, screenshot dan katakan: 'Pasti akan kubeliin buat kamu'!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 465,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Berikan pasanganmu 'Hadiah Keheningan \u0026 Tatapan Penuh Kasih' selama 30 detik tanpa sepatah kata pun terucap!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 466,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kirimkan stiker kupon 'Satu Hari Bebas Pilih Tempat Makan' ke chat pribadi kalian!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 467,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Ciptakan pantun bertema hadiah yang berakhiran nama kado impian pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 468,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Suapkan satu camilan atau berikan minumanmu kepada pasanganmu seperti mempersembahkan jamuan istimewa!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 469,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirim foto selfie dengan pose membentuk simbol love besar dengan tanganmu khusus untuk pasanganmu simpan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 470,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Berikan satu kecupan lembut di kening pasangan sebagai 'hadiah terhangat' untuk menenangkan pikirannya!",
    "type": "DARE"
  },
  {
    "category": "Virtual",
    "id": 471,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirimkan stiker hadiah bergerak paling imut di WhatsApp ke pasanganmu sekarang!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 472,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Janjikan untuk membersihkan atau merapikan salah satu barang kesayangan pasanganmu akhir pekan ini!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 473,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Bungkus barang kecil di mejamu menggunakan tisu dengan pita darurat dan serahkan secara khidmat!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 474,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Bawakan jaket atau selimut untuk pasanganmu agar dia merasa hangat dan terlindungi!",
    "type": "DARE"
  },
  {
    "category": "Surat",
    "id": 475,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Tuliskan pesan terima kasih atas semua kado yang pernah kamu terima darinya di buku catatan atau chat!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 476,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Pegang tangan pasangan (atau tatap di kamera) dan katakan: 'Hadiah terindah dalam hidupku bukan benda, tapi keberadaanmu'!",
    "type": "DARE"
  },
  {
    "category": "Virtual",
    "id": 477,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Cari link video hewan lucu favoritnya di medsos dan kirimkan sebagai hadiah pencerah suasana hati!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 478,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Bikin janji tertulis: 'Voucher Nonton Film Apapun Pilihanmu Tanpa Protes'!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 479,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Tuliskan kata 'I LOVE YOU' di secarik kertas kecil lalu sembunyikan di dompet atau casing HP pasangan!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 480,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut telapak tangan pasanganmu sebagai hadiah relaksasi instan selama 1 menit!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 481,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirim pesanan makanan manis atau minuman kejutan via aplikasi pesan antar ke alamat pasangan sekarang juga!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 482,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Hadiahkan tatapan mata penuh rasa syukur selama 20 detik tanpa boleh tersenyum sinis!",
    "type": "DARE"
  },
  {
    "category": "Virtual",
    "id": 483,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Ganti nada dering kontak pasanganmu dengan lagu romantis dan buktikan dengan menelponnya!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 484,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Bikin tebak kado: minta pasangan menebak barang apa yang ada di kantong atau genggaman tanganmu!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 485,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Tuliskan kupon: 'Voucher Sarapan Pagi Dibuatkan / Dibelikan' untuk besok pagi!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 486,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Kecup punggung tangan pasangan dan ucapkan: 'Kado terbaik adalah senyuman manismu'!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 487,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Tiupkan kecupan manis ke arah kamera sambil membuat bentuk hati dengan kedua tanganmu!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 488,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Janjikan sebuah kado kejutan yang akan kamu kirimkan ke rumahnya sebelum akhir bulan ini!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 489,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Buat desain gambar lucu di aplikasi Instagram Stories/Canva bertuliskan nama kalian berdua dan kirimkan ke chat!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 490,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Semprotkan sedikit parfummu ke sapu tangan/tisu dan selipkan ke dalam tas pasangan agar dia selalu mengingatmu!",
    "type": "DARE"
  },
  {
    "category": "Virtual",
    "id": 491,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Kirimkan meme pasangan yang paling manis dan lucu yang bisa kamu temukan di galeri/internet!",
    "type": "DARE"
  },
  {
    "category": "Spontan",
    "id": 492,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Rapikan barang bawaan pasangan dan letakkan permen manis di dalam sakunya!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 493,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Kirim rekaman suara berbisik: 'Hadiah terbesarku adalah bisa mendengar suaramu setiap hari'!",
    "type": "DARE"
  },
  {
    "category": "Kreatif",
    "id": 494,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Tuliskan 'Surat Voucher Kencan Bebas Cemberut Selama 24 Jam' dan kirimkan ke pasangan!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 495,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Tanyakan 'Barang apa yang lagi paling kamu butuhin saat ini?' dan masukkan ke daftar belanjamu!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 496,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "ONLINE",
    "prompt": "Bikin video time-lapse 10 detik kamu sedang melambaikan tangan dengan senyum termanis untuk pasangan!",
    "type": "DARE"
  },
  {
    "category": "Romantis",
    "id": 497,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "OFFLINE",
    "prompt": "Kalungkan tanganmu di leher pasangan dan hadiahkan pelukan hangat selama 30 detik!",
    "type": "DARE"
  },
  {
    "category": "Kado Emosi",
    "id": 498,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Ungkapkan 3 alasan kenapa hadiah terindah yang pernah kamu terima adalah kehadiran dirinya!",
    "type": "DARE"
  },
  {
    "category": "Janji",
    "id": 499,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Sepakati kado anniversary yang akan kalian buat sendiri (handmade) untuk perayaan berikutnya!",
    "type": "DARE"
  },
  {
    "category": "Komitmen",
    "id": 500,
    "isCustom": false,
    "loveLanguage": "RECEIVING_GIFTS",
    "mode": "BOTH",
    "prompt": "Ucapkan komitmen: 'Aku akan selalu berusaha memberikan yang terbaik untuk kebahagiaanmu'!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 551,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut pundak dan tengkuk leher pasanganmu selama 1 menit penuh untuk melemaskan otot-ototnya yang tegang!",
    "type": "DARE"
  },
  {
    "category": "Minum",
    "id": 552,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ambilkan segelas air putih hangat/dingin untuk pasanganmu dan suapkan langsung ke bibirnya dengan penuh kasih!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 553,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kirimkan pesan pengingat minum air putih dan istirahat 5 menit sekarang juga lengkap dengan alasan kenapa kesehatannya sangat berharga!",
    "type": "DARE"
  },
  {
    "category": "Rapi",
    "id": 554,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Rapikan tatanan rambut, kerudung, atau kerah baju pasanganmu agar terlihat semakin rapi dan mempesona!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 555,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Bantu pasanganmu merancang to-do list 3 prioritas penting untuk harinya besok dan kirimkan dalam format rapi via chat!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 556,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tawarkan satu bantuan nyata yang bisa kamu selesaikan untuk pasanganmu malam ini atau besok pagi!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 557,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut jari-jemari tangan pasanganmu satu per satu dari pangkal hingga ke ujung kuku selama 45 detik!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 558,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Setel alarm di HP-mu sendiri untuk menelpon dan membangunkan pasanganmu besok pagi tepat waktu!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 559,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Bersihkan layar HP atau kacamata pasanganmu menggunakan kain halus sampai kinclong dan bersih!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 560,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Cari dan kirimkan artikel / tips relaksasi pereda stres terbaik di internet khusus untuk pasanganmu baca malam ini!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 561,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Kipaskan pasanganmu menggunakan buku/kipas selama 30 detik jika ruangan terasa hangat!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 562,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tanyakan 'Ada hal apa hari ini yang bikin kamu capek dan bisa aku bantu ringankan?' dan dengarkan baik-baik!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 563,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Lakukan pijatan ringan di area pelipis dahi pasanganmu untuk membantu menghilangkan stres selama 30 detik!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 564,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Pesankan camilan atau minuman kesukaan pasanganmu lewat aplikasi antar online ke alamatnya sekarang!",
    "type": "DARE"
  },
  {
    "category": "Rapi",
    "id": 565,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ambilkan barang yang sedang dibutuhkan pasangan di dekat kalian tanpa membiarkannya berdiri!",
    "type": "DARE"
  },
  {
    "category": "Makanan",
    "id": 566,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Suapkan satu gigitan makanan atau camilan manis ke mulut pasanganmu dengan tatapan penuh kelembutan!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 567,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kirimkan tutorial gerakan peregangan leher/punggung (stretching) lewat chat dan bimbing pasanganmu melakukannya bersama di video call!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 568,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ikatkan tali sepatu pasanganmu atau rapikan ujung celana/roknya dengan tulus!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 569,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Janji untuk membantu mencucikan piring atau merapikan meja makan setelah sesi bermain game ini selesai!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 570,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pasangkan jaket, sweater, atau selimut ke tubuh pasanganmu agar dia merasa hangat dan terlindungi!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 571,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Bikin rekaman audio petunjuk meditasi / pernapasan relaksasi 30 detik untuk didengarkan pasanganmu sebelum tidur!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 572,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut telapak kaki atau betis pasanganmu selama 1 menit jika kalian sedang duduk berdampingan santai!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 573,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Gendong pasanganmu (atau gandeng dan bimbing langkahnya dengan sangat hati-hati) melintasi ruangan!",
    "type": "DARE"
  },
  {
    "category": "Rapi",
    "id": 574,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Bantu rapikan barang-barang di tas atau meja belajar/kerja pasanganmu selama 1 menit!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 575,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Bantu cek prakiraan cuaca kota tempat tinggal pasangan untuk besok, lalu beri rekomendasi pakaian \u0026 payung yang perlu disiapkan!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 576,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tanyakan sisa persentase baterai HP pasangan, ingatkan untuk cas sebelum tidur dan jangan tidur di dekat colokan!",
    "type": "DARE"
  },
  {
    "category": "Minuman",
    "id": 577,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Bikin satu minuman hangat (teh manis, cokelat hangat, atau susu) khusus untuk pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 578,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kirimkan link playlist suara hujan / white noise di Spotify atau YouTube untuk menemaninya tidur nyenyak!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 579,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Buka dan tutupkan pintu ruangan atau tarikkan kursi saat pasanganmu hendak duduk layaknya pelayanan bintang lima!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 580,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Usap dan tepuk lembut punggung pasanganmu secara berirama untuk memberikan rasa tenang dan relaksasi!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 581,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tuliskan kupon: 'Voucher Cuci Motor / Mobil / Bantu Tugas Pasangan' yang bisa ditukar kapan saja!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 582,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tanyakan menu sarapan yang diinginkan pasangan untuk besok pagi dan catat baik-baik!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 583,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Bawakan barang bawaan pasanganmu jika dia sedang memegang sesuatu di tangannya!",
    "type": "DARE"
  },
  {
    "category": "Rapi",
    "id": 584,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Kuncir rambut pasanganmu (jika perempuan) atau rapikan rambut depannya dengan jari-jemarimu!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 585,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Buat rangkuman kalender jadwal janji temu penting pasanganmu minggu ini dan ingatkan hal-hal krusial!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 586,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Letakkan bantal di punggung atau kepala pasangan agar posisi duduknya menjadi lebih nyaman!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 587,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Pijat pelan pangkal lengan dan bahu pasangan sambil tanyakan apakah tekanan pijatannya sudah pas!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 588,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Ucapkan dengan tegas: 'Mulai sekarang, kalau kamu butuh bantuan apapun jangan ragu bilang ke aku ya'!",
    "type": "DARE"
  },
  {
    "category": "Makanan",
    "id": 589,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Potongkan buah atau kupaskan camilan untuk pasanganmu sampai siap langsung disantap!",
    "type": "DARE"
  },
  {
    "category": "Rapi",
    "id": 590,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Cek dan bersihkan debu atau helaian rambut yang menempel di baju pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 591,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tawarkan diri untuk mengantar/menemani pasangan mengurus keperluannya di luar rumah akhir pekan ini!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 592,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kirimkan pesan suara bernada alarm lembut: 'Bangun yuk sayang, hari yang hebat sudah menunggumu!' untuk diputar besok pagi!",
    "type": "DARE"
  },
  {
    "category": "Pelayanan",
    "id": 593,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Tundukkan badan sedikit dan tanyakan: 'Tuan Putri / Pangeran, ada lagi yang bisa saya bantu layani?'!",
    "type": "DARE"
  },
  {
    "category": "Pijat",
    "id": 594,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Kecup tangan pasangan yang baru saja kamu pijat sebagai tanda penghormatan atas perjuangannya!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 595,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Kirimkan kupon 'Voucher Bebas Curhat Tanpa Dihakimi Selama 1 Jam Penuh Kapan Saja' via chat!",
    "type": "DARE"
  },
  {
    "category": "Perhatian",
    "id": 596,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Ketikkan doa perlindungan khusus untuk keselamatan perjalanan pasanganmu saat beraktivitas besok!",
    "type": "DARE"
  },
  {
    "category": "Makanan",
    "id": 597,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "OFFLINE",
    "prompt": "Ambilkan sendok dan tisu makan untuk pasanganmu saat kalian hendak menikmati hidangan!",
    "type": "DARE"
  },
  {
    "category": "LDR",
    "id": 598,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "ONLINE",
    "prompt": "Cari informasi nomor kontak darurat atau layanan penting di kota tempat tinggal pasangan dan simpan di catatanmu!",
    "type": "DARE"
  },
  {
    "category": "Bantuan",
    "id": 599,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Tawarkan diri untuk membantu mencarikan barang atau solusi yang selama seminggu ini sedang dibingungkan pasangan!",
    "type": "DARE"
  },
  {
    "category": "Komitmen",
    "id": 600,
    "isCustom": false,
    "loveLanguage": "ACTS_OF_SERVICE",
    "mode": "BOTH",
    "prompt": "Katakan: 'Aku ingin selalu menjadi orang pertama yang ada di sampingmu untuk meringankan segala beban hidupmu'!",
    "type": "DARE"
  },
  {
    "category": "Genggaman",
    "id": 651,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Gandeng tangan pasanganmu erat-erat (jemari saling mengunci) dan jangan lepaskan sampai 2 putaran ke depan!",
    "type": "DARE"
  },
  {
    "category": "Virtual Touch",
    "id": 652,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Tempelkan telapak tanganmu ke layar kamera HP tepat di posisi telapak tangan pasanganmu selama 20 detik!",
    "type": "DARE"
  },
  {
    "category": "Cium Tangan",
    "id": 653,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Genggam kedua tangan pasanganmu, cium punggung tangannya dengan lembut, dan ucapkan terima kasih karena telah memilihmu!",
    "type": "DARE"
  },
  {
    "category": "Flying Kiss",
    "id": 654,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Kecup punggung tanganmu sendiri di depan kamera, lalu tiupkan kecupan hangat itu lurus ke lensa video call untuk pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Tatap Mata",
    "id": 655,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Tautkan jemari tanganmu dengan jemari pasangan sambil tatap matanya selama 20 detik tanpa boleh berkedip!",
    "type": "DARE"
  },
  {
    "category": "Eye Lock",
    "id": 656,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Dekatkan wajahmu ke layar video call (jarak 10 cm), kunci tatapan mata dengan pasangan selama 20 detik tanpa mengalihkan pandangan!",
    "type": "DARE"
  },
  {
    "category": "Detak Jantung",
    "id": 657,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Letakkan telapak tanganmu di dada pasanganmu, rasakan detak jantungnya dan katakan satu hal yang paling kamu cintai darinya!",
    "type": "DARE"
  },
  {
    "category": "Detak Jantung",
    "id": 658,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Letakkan telapak tanganmu di dadamu sendiri, pejamkan mata, dan ucapkan kata sayang seolah pasangan sedang berada di dekapanmu!",
    "type": "DARE"
  },
  {
    "category": "Elus Rambut",
    "id": 659,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Elus lembut rambut atau kepala pasanganmu dengan penuh kasih sayang selama 30 detik sambil berikan satu pujian tulus!",
    "type": "DARE"
  },
  {
    "category": "Self Elus",
    "id": 660,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Elus lembut kepalamu sendiri di depan kamera sambil tatap pasanganmu dan katakan: 'Anggap ini tanganmu yang lagi ngelus aku ya'!",
    "type": "DARE"
  },
  {
    "category": "Pelukan",
    "id": 661,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Peluk erat pasanganmu (bisa pelukan hangat atau backhug) selama 45 detik penuh kehangatan tanpa dilepas!",
    "type": "DARE"
  },
  {
    "category": "Self Hug",
    "id": 662,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Peluk dirimu sendiri seerat mungkin (dekap kedua lenganmu) di depan kamera sambil tatap matanya dengan ekspresi rindu yang dalam!",
    "type": "DARE"
  },
  {
    "category": "Kecupan",
    "id": 663,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Belai lembut pipi pasanganmu lalu berikan kecupan manis di keningnya dengan penuh penghayatan!",
    "type": "DARE"
  },
  {
    "category": "Virtual Kiss",
    "id": 664,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Dekatkan bibirmu ke lensa kamera HP dan berikan kecupan lembut 'Mmuaah' yang terdengar manis di speaker pasangan!",
    "type": "DARE"
  },
  {
    "category": "Pijat Tangan",
    "id": 665,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Pijat lembut telapak tangan dan jari-jemari pasanganmu satu per satu dengan penuh perhatian selama 1 menit!",
    "type": "DARE"
  },
  {
    "category": "Finger Touch",
    "id": 666,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Sentuh layar video call tepat di area wajah pasanganmu dan gerakkan jarimu seolah sedang membelai pipinya dengan lembut!",
    "type": "DARE"
  },
  {
    "category": "Eskimo Kiss",
    "id": 667,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Lakukan 'Eskimo Kiss' (saling menempelkan dan menggesekkan ujung hidung berdua secara lembut dan menggemaskan) selama 10 detik!",
    "type": "DARE"
  },
  {
    "category": "Nose Touch",
    "id": 668,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Dekatkan ujung hidungmu ke kamera HP dan buat ekspresi menggemaskan seolah sedang melakukan Eskimo Kiss virtual!",
    "type": "DARE"
  },
  {
    "category": "Sandaran",
    "id": 669,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Rebahkan kepalamu di bahu atau pangkuan pasanganmu selama 1 menit sambil mendengarkan detak suaranya!",
    "type": "DARE"
  },
  {
    "category": "Pillow Hug",
    "id": 670,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Ambil bantal atau guling di dekatmu, dekap erat di depan kamera dan letakkan dagumu di atasnya sambil tersenyum menatap pasangan!",
    "type": "DARE"
  },
  {
    "category": "Bisikan",
    "id": 671,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Bisikkan dengan sangat pelan di dekat telinga pasanganmu satu hal rahasia tentang dirimu yang belum pernah kamu akui sebelumnya!",
    "type": "DARE"
  },
  {
    "category": "Whisper Mic",
    "id": 672,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Dekatkan microphone HP tepat ke bibirmu dan bisikkan kalimat mesra dengan suara paling serak dan seksi selama 10 detik!",
    "type": "DARE"
  },
  {
    "category": "Pegang Dada",
    "id": 673,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Ambil kedua tangan pasanganmu, genggam hangat di dadamu, dan tatap matanya sambil bilang: 'Aku bangga banget punya kamu'!",
    "type": "DARE"
  },
  {
    "category": "Heart Shape",
    "id": 674,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Bentuk simbol hati besar menggunakan kedua tanganmu di dada, lalu dorong ke arah kamera seolah mempersembahkan hatimu!",
    "type": "DARE"
  },
  {
    "category": "Slow Hug",
    "id": 675,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Tarik pasanganmu perlahan ke dalam pelukan pelan (slow hug) tanpa suara selama 30 detik penuh kenyamanan!",
    "type": "DARE"
  },
  {
    "category": "Virtual Caress",
    "id": 676,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Belaikan tanganmu di udara di depan kamera HP dengan gerakan lembut seirama seakan sedang mengelus pipi pasangan!",
    "type": "DARE"
  },
  {
    "category": "Pipi",
    "id": 677,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Cium kedua pipi pasanganmu (kanan dan kiri) secara berurutan lalu cubit pipinya dengan gemas!",
    "type": "DARE"
  },
  {
    "category": "Cheek Pinch",
    "id": 678,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Cubit kedua pipimu sendiri di depan kamera dengan pose paling lucu dan manja sampai pasanganmu tersenyum!",
    "type": "DARE"
  },
  {
    "category": "Tebak Kata",
    "id": 679,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Tuliskan satu kata cinta dengan ujung jarimu di telapak tangan pasanganmu, dan biarkan pasanganmu menebak kata apa itu!",
    "type": "DARE"
  },
  {
    "category": "Air Draw",
    "id": 680,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Tuliskan satu kata cinta dengan jarimu di udara di depan kamera video call, dan minta pasanganmu menebak kata tersebut!",
    "type": "DARE"
  },
  {
    "category": "Slow Dance",
    "id": 681,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Berdansa pelan berdua (slow dance) tanpa musik selama 30 detik sambil saling berpegangan tangan erat!",
    "type": "DARE"
  },
  {
    "category": "Swaying",
    "id": 682,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Goyangkan tubuhmu perlahan ke kiri dan ke kanan di depan kamera mengikuti irama lagu romantis imajiner berdua!",
    "type": "DARE"
  },
  {
    "category": "Pundak",
    "id": 683,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Sentuh tengkuk leher atau pundak pasanganmu dengan lembut sambil katakan: 'Kamu udah berusaha hebat banget hari ini'!",
    "type": "DARE"
  },
  {
    "category": "Shoulder Tap",
    "id": 684,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Sentuh kedua pundakmu sendiri sambil tatap kamera dan katakan kalimat penyemangat terhangat untuk pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Pipi Tangan",
    "id": 685,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Gandeng tangan pasanganmu dan tempelkan di pipimu sendiri sambil tersenyum manis menatap matanya!",
    "type": "DARE"
  },
  {
    "category": "Screen Palm",
    "id": 686,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Letakkan pipimu di samping layar HP seolah sedang menempelkan pipi di tangan pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Dagu Bahu",
    "id": 687,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Sandarkan dagumu di bahu pasanganmu sambil tersenyum menatap layar/kaca bersama selama 20 detik!",
    "type": "DARE"
  },
  {
    "category": "Cute Pose",
    "id": 688,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Letakkan kedua tanganmu di bawah dagu membentuk bunga mekar dan tatap kamera dengan tatapan paling memikat!",
    "type": "DARE"
  },
  {
    "category": "Ujung Jari",
    "id": 689,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Berikan kecupan lembut di setiap ujung jari tangan pasanganmu satu per satu dengan penuh kasih!",
    "type": "DARE"
  },
  {
    "category": "Finger Kiss",
    "id": 690,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Kecup ujung jarimu satu per satu di depan kamera lalu tiupkan ke arah pasanganmu!",
    "type": "DARE"
  },
  {
    "category": "Bisikan",
    "id": 691,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Bisikkan dengan nada menggoda ke telinga pasanganmu satu hal yang paling ingin kamu lakukan saat kita berduaan nanti!",
    "type": "DARE"
  },
  {
    "category": "LDR Wish",
    "id": 692,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Katakan ke kamera satu sentuhan fisik pertama yang paling ingin kamu lakukan begitu kamu memeluknya saat tiba di bandara/stasiun!",
    "type": "DARE"
  },
  {
    "category": "Pegang Wajah",
    "id": 693,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Pegang kedua pipi pasanganmu dengan kedua tanganmu, tatap matanya lekat-lekat, lalu katakan: 'Jangan pernah ragu sama perasaanku ya'!",
    "type": "DARE"
  },
  {
    "category": "Frame Screen",
    "id": 694,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Tangkap layar video call dengan kedua tanganmu di sisi kiri-kanan HP sambil tersenyum lekat menatap pasangan!",
    "type": "DARE"
  },
  {
    "category": "Usap Punggung",
    "id": 695,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Usap pelan punggung pasanganmu dengan pola lingkaran lembut untuk membuatnya rileks dan merasa tenang!",
    "type": "DARE"
  },
  {
    "category": "Sleepy Voice",
    "id": 696,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Rebahkan kepalamu di meja/kasur sambil tetap menatap kamera video call dan bicaralah dengan nada lembut berbisik selama 20 detik!",
    "type": "DARE"
  },
  {
    "category": "Saku Jaket",
    "id": 697,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Genggam satu tangan pasanganmu dan masukkan ke dalam saku jaket/baju bersama selama 1 putaran!",
    "type": "DARE"
  },
  {
    "category": "Warm Breath",
    "id": 698,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "ONLINE",
    "prompt": "Hembuskan napas hangatmu ke arah kamera HP seolah sedang menghangatkan jemari pasangan di malam yang dingin!",
    "type": "DARE"
  },
  {
    "category": "Forehead Touch",
    "id": 699,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "OFFLINE",
    "prompt": "Tempelkan dahimu ke dahi pasanganmu (forehead touch) selama 15 detik sambil memejamkan mata merasakan napas berdua!",
    "type": "DARE"
  },
  {
    "category": "Kemesraan Penuh",
    "id": 700,
    "isCustom": false,
    "loveLanguage": "PHYSICAL_TOUCH",
    "mode": "BOTH",
    "prompt": "Katakan dengan penuh ketulusan: 'Raga kita mungkin berjarak, tapi jiwaku selalu memelukmu erat setiap detik'!",
    "type": "DARE"
  }
];

// Helper: Ambil metadata Love Language berdasarkan kode
function getLoveLanguageMeta(code) {
    return LOVE_LANGUAGES.find(l => l.code === code) || LOVE_LANGUAGES.find(l => l.code === 'GENERAL');
}

// Helper: Ambil metadata Mode Permainan
function getPlayModeMeta(code) {
    return PLAY_MODES.find(m => m.code === code) || PLAY_MODES[2];
}

// Helper: Ambil daftar seluruh kartu
function getAllMasterCards() {
    return [...defaultTruthsList, ...defaultDaresList];
}

// Helper: Mengambil kartu yang aktif berdasarkan Love Language & Mode yang dipilih
// Mengikuti aturan:
// 1. General Deck selalu aktif
// 2. Filter mode: ONLINE hanya ambil kartu ONLINE/BOTH, OFFLINE hanya ambil kartu OFFLINE/BOTH
// 3. Maksimal 150 kartu bawaan per sesi game (75 Truth + 75 Dare)
// 4. Custom deck pemain selalu ditambahkan di atas 150 kartu
function getGameActivePool(type, selectedDecks = null, customList = null, playMode = 'ALL') {
    if (!selectedDecks || selectedDecks.length === 0) {
        selectedDecks = ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'];
    }

    const activeSet = new Set(selectedDecks);
    activeSet.add('GENERAL'); // General selalu disertakan

    const customCardsList = customList || (typeof customCards !== 'undefined' ? customCards : []);

    let masterList = type === 'TRUTH' ? defaultTruthsList : defaultDaresList;
    let filtered = masterList.filter(c => {
        if (!activeSet.has(c.loveLanguage)) return false;
        if (playMode === 'ONLINE' && c.mode !== 'ONLINE' && c.mode !== 'BOTH') return false;
        if (playMode === 'OFFLINE' && c.mode !== 'OFFLINE' && c.mode !== 'BOTH') return false;
        return true;
    });

    // Jika kandidat default melebihi 75 per tipe (total 150 per game), acak dan potong tepat 75
    let selectedDefaults = [...filtered];
    if (selectedDefaults.length > 75) {
        selectedDefaults.sort(() => 0.5 - Math.random());
        selectedDefaults = selectedDefaults.slice(0, 75);
    }

    // Gabungkan dengan kartu kustom yang cocok dengan mode (atau jika kustom belum punya mode, sertakan langsung)
    const customMatching = customCardsList.filter(c => {
        if (c.type !== type) return false;
        if (c.mode && playMode === 'ONLINE' && c.mode !== 'ONLINE' && c.mode !== 'BOTH') return false;
        if (c.mode && playMode === 'OFFLINE' && c.mode !== 'OFFLINE' && c.mode !== 'BOTH') return false;
        return true;
    });

    return selectedDefaults.concat(customMatching);
}
