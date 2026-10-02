package deck_test

import (
	"testing"

	"ulartangga/deck"
	"ulartangga/models"
)

func TestMasterDeckCatalog(t *testing.T) {
	allCards := deck.GetAllCards()
	expectedTotal := 550
	if len(allCards) != expectedTotal {
		t.Fatalf("Expected %d total cards, got %d", expectedTotal, len(allCards))
	}

	// Cek jumlah per bahasa cinta
	counts := make(map[string]map[string]int)
	for _, c := range allCards {
		if counts[c.LoveLanguage] == nil {
			counts[c.LoveLanguage] = make(map[string]int)
		}
		counts[c.LoveLanguage][c.Type]++
	}

	// 5 Love Languages masing-masing wajib 50 Truth & 50 Dare = 100
	loveLangs := []string{
		deck.LoveLanguageWordsOfAffirmation,
		deck.LoveLanguageQualityTime,
		deck.LoveLanguageReceivingGifts,
		deck.LoveLanguageActsOfService,
		deck.LoveLanguagePhysicalTouch,
	}

	for _, lang := range loveLangs {
		truthCount := counts[lang]["TRUTH"]
		dareCount := counts[lang]["DARE"]
		total := truthCount + dareCount
		if total != 100 {
			t.Errorf("Love Language %s: expected 100 cards, got %d (Truth: %d, Dare: %d)", lang, total, truthCount, dareCount)
		}
		if truthCount != 50 || dareCount != 50 {
			t.Errorf("Love Language %s: expected 50 Truth and 50 Dare, got %d Truth, %d Dare", lang, truthCount, dareCount)
		}
	}

	// General deck wajib 25 Truth & 25 Dare = 50
	genTruth := counts[deck.LoveLanguageGeneral]["TRUTH"]
	genDare := counts[deck.LoveLanguageGeneral]["DARE"]
	if genTruth+genDare != 50 {
		t.Errorf("General Deck: expected 50 cards, got %d", genTruth+genDare)
	}
}

func TestBuildGameDeck_PlayModeFiltering(t *testing.T) {
	// Mode ONLINE: Kartu OFFLINE (kontak fisik langsung) sama sekali tidak boleh muncul
	onlineDeck := deck.BuildGameDeck(
		[]string{deck.LoveLanguagePhysicalTouch, deck.LoveLanguageWordsOfAffirmation},
		deck.ModeOnline,
		150,
		nil,
	)

	for _, c := range onlineDeck {
		if c.Mode == deck.ModeOffline {
			t.Errorf("Mode ONLINE contains an OFFLINE card: ID=%d, Prompt=%s", c.ID, c.Prompt)
		}
	}

	// Mode OFFLINE: Kartu ONLINE tidak boleh muncul
	offlineDeck := deck.BuildGameDeck(
		[]string{deck.LoveLanguagePhysicalTouch, deck.LoveLanguageWordsOfAffirmation},
		deck.ModeOffline,
		150,
		nil,
	)

	for _, c := range offlineDeck {
		if c.Mode == deck.ModeOnline {
			t.Errorf("Mode OFFLINE contains an ONLINE card: ID=%d, Prompt=%s", c.ID, c.Prompt)
		}
	}

	// Max default limit 150 + custom cards
	customCards := []models.QuestionCard{
		{ID: 9999, Type: "TRUTH", LoveLanguage: "CUSTOM", Mode: deck.ModeBoth, Prompt: "Custom 1", IsCustom: true},
		{ID: 9998, Type: "DARE", LoveLanguage: "CUSTOM", Mode: deck.ModeBoth, Prompt: "Custom 2", IsCustom: true},
	}
	deckWithCustom := deck.BuildGameDeck(
		[]string{deck.LoveLanguageWordsOfAffirmation, deck.LoveLanguageQualityTime},
		deck.ModeAll,
		150,
		customCards,
	)

	if len(deckWithCustom) != 150+len(customCards) {
		t.Errorf("Expected %d cards (150 default + %d custom), got %d", 150+len(customCards), len(customCards), len(deckWithCustom))
	}
}
