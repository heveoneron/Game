package deck

import (
	mathrand "math/rand"
	"time"

	"ulartangga/models"
)

// Konstanta Love Language (5 Bahasa Cinta + General)
const (
	LoveLanguageGeneral            = "GENERAL"
	LoveLanguageWordsOfAffirmation = "WORDS_OF_AFFIRMATION"
	LoveLanguageQualityTime        = "QUALITY_TIME"
	LoveLanguageReceivingGifts     = "RECEIVING_GIFTS"
	LoveLanguageActsOfService      = "ACTS_OF_SERVICE"
	LoveLanguagePhysicalTouch      = "PHYSICAL_TOUCH"
)

// Konstanta Mode Permainan (Online vs Offline)
const (
	ModeOnline  = "ONLINE"  // Khusus Video Call / LDR (tidak membutuhkan kehadiran fisik langsung)
	ModeOffline = "OFFLINE" // Khusus saat ketemu langsung / barengan (interaksi fisik langsung)
	ModeBoth    = "BOTH"    // Fleksibel (bisa dimainkan online maupun offline)
	ModeAll     = "ALL"     // Campuran semua kartu
)

// LoveLanguageMeta menyimpan metadata untuk tampilan UI dan filter
type LoveLanguageMeta struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Subtitle    string `json:"subtitle"`
	Icon        string `json:"icon"`
	Color       string `json:"color"`
	BorderColor string `json:"borderColor"`
	TruthCount  int    `json:"truthCount"`
	DareCount   int    `json:"dareCount"`
	TotalCards  int    `json:"totalCards"`
}

// AvailableLoveLanguages mendefinisikan daftar 5 Bahasa Cinta + General
var AvailableLoveLanguages = []LoveLanguageMeta{
	{
		Code:        LoveLanguageWordsOfAffirmation,
		Name:        "Words of Affirmation",
		Subtitle:    "Pujian & Kata-kata Penguat Hati",
		Icon:        "💬",
		Color:       "#FEF3C7", // amber-100
		BorderColor: "#F59E0B", // amber-500
		TruthCount:  50,
		DareCount:   50,
		TotalCards:  100,
	},
	{
		Code:        LoveLanguageQualityTime,
		Name:        "Quality Time",
		Subtitle:    "Waktu Berkualitas & Obrolan Mendalam",
		Icon:        "⏳",
		Color:       "#D1FAE5", // emerald-100
		BorderColor: "#10B981", // emerald-500
		TruthCount:  50,
		DareCount:   50,
		TotalCards:  100,
	},
	{
		Code:        LoveLanguageReceivingGifts,
		Name:        "Receiving Gifts",
		Subtitle:    "Penerimaan Hadiah & Kejutan Berkesan",
		Icon:        "🎁",
		Color:       "#FCE7F3", // pink-100
		BorderColor: "#EC4899", // pink-500
		TruthCount:  50,
		DareCount:   50,
		TotalCards:  100,
	},
	{
		Code:        LoveLanguageActsOfService,
		Name:        "Acts of Service",
		Subtitle:    "Tindakan Pelayanan & Bukti Nyata Kasih",
		Icon:        "🤝",
		Color:       "#E0F2FE", // sky-100
		BorderColor: "#0284C7", // sky-600
		TruthCount:  50,
		DareCount:   50,
		TotalCards:  100,
	},
	{
		Code:        LoveLanguagePhysicalTouch,
		Name:        "Physical Touch",
		Subtitle:    "Sentuhan Fisik, Pelukan, & Keintiman",
		Icon:        "🫂",
		Color:       "#EDE9FE", // violet-100
		BorderColor: "#8B5CF6", // violet-500
		TruthCount:  50,
		DareCount:   50,
		TotalCards:  100,
	},
	{
		Code:        LoveLanguageGeneral,
		Name:        "General Deck",
		Subtitle:    "Kartu Dasar, Icebreaker & Landmark (21 & 57)",
		Icon:        "🎲",
		Color:       "#F3F4F6", // gray-100
		BorderColor: "#6B7280", // gray-500
		TruthCount:  25,
		DareCount:   25,
		TotalCards:  50,
	},
}

// GetAllCards mengembalikan seluruh 550 kartu yang terdaftar di sistem
func GetAllCards() []models.QuestionCard {
	all := make([]models.QuestionCard, 0, 550)
	all = append(all, GeneralDeck...)
	all = append(all, WordsOfAffirmationDeck...)
	all = append(all, QualityTimeDeck...)
	all = append(all, ReceivingGiftsDeck...)
	all = append(all, ActsOfServiceDeck...)
	all = append(all, PhysicalTouchDeck...)
	return all
}

// Backward-compatibility: DefaultTruths & DefaultDares
var (
	DefaultTruths = filterByType("TRUTH")
	DefaultDares  = filterByType("DARE")
)

func filterByType(cType string) []models.QuestionCard {
	all := GetAllCards()
	var res []models.QuestionCard
	for _, c := range all {
		if c.Type == cType {
			res = append(res, c)
		}
	}
	return res
}

// BuildGameDeck menyaring kartu berdasarkan Love Language dan Mode Permainan (Online/LDR vs Offline Langsung).
// Aturan:
// 1. Deck General selalu disertakan.
// 2. Kartu dari Love Language yang dipilih dimasukkan ke dalam kandidat pool.
// 3. Jika playMode == "ONLINE", hanya ambil kartu dengan Mode == "ONLINE" atau "BOTH" (kartu sentuhan langsung dieliminasi).
// 4. Jika playMode == "OFFLINE", hanya ambil kartu dengan Mode == "OFFLINE" atau "BOTH".
// 5. Batas maksimal deck bawaan per game adalah maxDefaultLimit (default 150 kartu), seimbang antara TRUTH & DARE.
// 6. Kartu kustom pemain (customCards) ditambahkan di atas batas 150 kartu tersebut.
func BuildGameDeck(selectedLanguages []string, playMode string, maxDefaultLimit int, customCards []models.QuestionCard) []models.QuestionCard {
	if maxDefaultLimit <= 0 {
		maxDefaultLimit = 150
	}
	if playMode == "" {
		playMode = ModeAll
	}

	activeLangs := make(map[string]bool)
	activeLangs[LoveLanguageGeneral] = true // General selalu aktif
	for _, lang := range selectedLanguages {
		if lang != "" {
			activeLangs[lang] = true
		}
	}

	allCards := GetAllCards()
	var candTruths []models.QuestionCard
	var candDares []models.QuestionCard

	for _, card := range allCards {
		if !activeLangs[card.LoveLanguage] {
			continue
		}

		// Filter Mode (ONLINE vs OFFLINE)
		if playMode == ModeOnline && (card.Mode != ModeOnline && card.Mode != ModeBoth) {
			continue
		}
		if playMode == ModeOffline && (card.Mode != ModeOffline && card.Mode != ModeBoth) {
			continue
		}

		if card.Type == "TRUTH" {
			candTruths = append(candTruths, card)
		} else if card.Type == "DARE" {
			candDares = append(candDares, card)
		}
	}

	// Shuffle kandidat secara acak
	mathrand.Seed(time.Now().UnixNano())
	mathrand.Shuffle(len(candTruths), func(i, j int) { candTruths[i], candTruths[j] = candTruths[j], candTruths[i] })
	mathrand.Shuffle(len(candDares), func(i, j int) { candDares[i], candDares[j] = candDares[j], candDares[i] })

	// Target proporsi 50% Truth & 50% Dare
	targetTruth := maxDefaultLimit / 2
	targetDare := maxDefaultLimit - targetTruth

	if len(candTruths) < targetTruth {
		targetTruth = len(candTruths)
	}
	if len(candDares) < targetDare {
		targetDare = len(candDares)
	}

	result := make([]models.QuestionCard, 0, targetTruth+targetDare+len(customCards))
	result = append(result, candTruths[:targetTruth]...)
	result = append(result, candDares[:targetDare]...)

	// Tambahkan seluruh custom cards pemain di atas batas 150 kartu
	result = append(result, customCards...)

	return result
}
