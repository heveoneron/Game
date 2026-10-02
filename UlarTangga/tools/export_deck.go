package main

import (
	"encoding/json"
	"fmt"
	"os"

	"ulartangga/deck"
)

func main() {
	allCards := deck.GetAllCards()
	fmt.Printf("Total cards loaded from deck package: %d\n", len(allCards))

	// Group into Truths & Dares
	var truths []interface{}
	var dares []interface{}
	for _, c := range allCards {
		m := map[string]interface{}{
			"id":           c.ID,
			"type":         c.Type,
			"loveLanguage": c.LoveLanguage,
			"category":     c.Category,
			"prompt":       c.Prompt,
			"mode":         c.Mode,
			"isCustom":     c.IsCustom,
		}
		if c.Type == "TRUTH" {
			truths = append(truths, m)
		} else {
			dares = append(dares, m)
		}
	}

	truthsJSON, _ := json.MarshalIndent(truths, "", "  ")
	daresJSON, _ := json.MarshalIndent(dares, "", "  ")
	metaJSON, _ := json.MarshalIndent(deck.AvailableLoveLanguages, "", "  ")

	jsContent := fmt.Sprintf(`// ================= DAFTAR KARTU & BAHASA CINTA (LOVE LANGUAGES) =================
// Total Kartu: %d (5 Love Languages @ 100 kartu + General Deck @ 50 kartu = 550 kartu)
// Mode Permainan:
// - ONLINE: Khusus LDR / Video Call (tidak butuh kontak fisik langsung)
// - OFFLINE: Khusus Ketemu Langsung (tatap muka dan kontak fisik)
// - BOTH: Fleksibel untuk keduanya

const PLAY_MODES = [
    { code: 'ONLINE', name: 'Video Call / LDR', icon: '📹', description: 'Tantangan visual, verbal, & remote tanpa kontak fisik langsung' },
    { code: 'OFFLINE', name: 'Ketemu Langsung', icon: '💑', description: 'Tantangan tatap muka, sentuhan, & interaksi fisik intim' },
    { code: 'ALL', name: 'Semua Mode (Campuran)', icon: '🔄', description: 'Gabungan kartu online dan offline' }
];

const LOVE_LANGUAGES = %s;

const defaultTruthsList = %s;

const defaultDaresList = %s;

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
    const masterList = type === 'TRUTH' ? defaultTruthsList : defaultDaresList;

    let filtered = masterList.filter(c => {
        if (!activeSet.has(c.loveLanguage)) return false;
        if (playMode === 'ONLINE') {
            if (c.mode === 'OFFLINE') return false;
        } else if (playMode === 'OFFLINE') {
            if (c.mode === 'ONLINE') return false;
            // Filter ketat: cegah prompt kamera/video call/virtual masuk ke mode ketemu langsung
            const promptLower = (c.prompt || '').toLowerCase();
            if (promptLower.includes('kamera') || 
                promptLower.includes('video call') || 
                promptLower.includes('virtual') || 
                promptLower.includes('lensa') || 
                promptLower.includes('layar hp') || 
                promptLower.includes('lewat chat') ||
                promptLower.includes('eskimo kiss virtual') ||
                promptLower.includes('raga kita mungkin berjarak') ||
                promptLower.includes('di depan kamera')) {
                return false;
            }
        }
        return true;
    });

    // Fallback keamanan jika filter terlalu ketat sehingga kosong
    if (filtered.length === 0) {
        filtered = [...masterList];
    }

    // Jika kandidat default melebihi 75 per tipe (total 150 per game), acak dan potong tepat 75
    let selectedDefaults = [...filtered];
    if (selectedDefaults.length > 75) {
        selectedDefaults.sort(() => 0.5 - Math.random());
        selectedDefaults = selectedDefaults.slice(0, 75);
    }

    // Gabungkan dengan kartu kustom yang cocok dengan mode
    const customMatching = customCardsList.filter(c => {
        if (c.type !== type) return false;
        if (playMode === 'ONLINE' && c.mode === 'OFFLINE') return false;
        if (playMode === 'OFFLINE') {
            if (c.mode === 'ONLINE') return false;
            const promptLower = (c.prompt || '').toLowerCase();
            if (promptLower.includes('kamera') || promptLower.includes('video call') || promptLower.includes('virtual')) return false;
        }
        return true;
    });

    return selectedDefaults.concat(customMatching);
}
`, len(allCards), string(metaJSON), string(truthsJSON), string(daresJSON))

	err := os.WriteFile("public/js/deck.js", []byte(jsContent), 0644)
	if err != nil {
		fmt.Printf("Gagal menulis public/js/deck.js: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Sukses mengekspor %d kartu ke public/js/deck.js!\n", len(allCards))
}
