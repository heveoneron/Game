package models

// QuestionCard merepresentasikan kartu Truth atau Dare
type QuestionCard struct {
	ID           int    `json:"id"`
	Type         string `json:"type"`         // "TRUTH" atau "DARE"
	LoveLanguage string `json:"loveLanguage"` // "WORDS_OF_AFFIRMATION", "QUALITY_TIME", "RECEIVING_GIFTS", "ACTS_OF_SERVICE", "PHYSICAL_TOUCH", "GENERAL"
	Mode         string `json:"mode"`         // "ONLINE" (Video Call / LDR), "OFFLINE" (Ketemu Langsung), "BOTH" (Keduanya)
	Category     string `json:"category"`     // "Deep Talk", "Romantis", "Konyol", "Spicy", "Memori", "Intim", "Pujian", dll.
	Prompt       string `json:"prompt"`
	IsCustom     bool   `json:"isCustom"`
}

// PlayerInfo menyimpan metadata pemain (nama, avatar emoji, warna tema)
type PlayerInfo struct {
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Color  string `json:"color"`
}

// PlayerSkills menyimpan skill yang dipilih dan sisa kuota penggunaan tiap pemain
type PlayerSkills struct {
	SelectedSkills []string       `json:"selected"`
	SkillUses      map[string]int `json:"uses"`
	RerollCount    int            `json:"rerollCount"`
}

// ActiveCardPayload adalah payload kartu yang sedang terbuka di modal permainan
type ActiveCardPayload struct {
	Tile         int    `json:"tile"`
	Type         string `json:"type"`
	LoveLanguage string `json:"loveLanguage"`
	Mode         string `json:"mode"`
	Category     string `json:"category"`
	Prompt       string `json:"prompt"`
	TargetP      int    `json:"targetP"`
}

// HistoryEntry mencatat setiap langkah pion, kartu yang dijawab, dan pemakaian skill
type HistoryEntry struct {
	ID         int64  `json:"id"`
	TurnNumber int    `json:"turnNumber"`
	PlayerNum  int    `json:"playerNum"`
	PlayerName string `json:"playerName"`
	Avatar     string `json:"avatar"`
	Dice       int    `json:"dice"`
	FromPos    int    `json:"fromPos"`
	ToPos      int    `json:"toPos"`
	FinalPos   int    `json:"finalPos"`
	JumpType   string `json:"jumpType"` // "LADDER", "SNAKE", "SKILL"
	JumpDest   int    `json:"jumpDest"`
	SkillUsed  string `json:"skillUsed,omitempty"`
	Choice     string `json:"choice"`   // "TRUTH", "DARE", "RANDOM", "SKIP", "REVERSE"
	CardType   string `json:"cardType"` // "TRUTH", "DARE", "SKILL"
	Category   string `json:"category"`
	Prompt     string `json:"prompt"`
	TimeStr    string `json:"timeStr"`
}

// GameState adalah state utama permainan yang disinkronkan ke seluruh klien
type GameState struct {
	P1Pos      int                `json:"p1Pos"`
	P2Pos      int                `json:"p2Pos"`
	P1Info     PlayerInfo         `json:"p1Info"`
	P2Info     PlayerInfo         `json:"p2Info"`
	P1Skills   PlayerSkills       `json:"p1Skills"`
	P2Skills   PlayerSkills       `json:"p2Skills"`
	Turn       int                `json:"turn"` // 1 atau 2
	LastDice   int                `json:"lastDice"`
	ActiveCard    *ActiveCardPayload `json:"activeCard,omitempty"`
	RpsResult     string             `json:"rpsResult"`
	PlayMode      string             `json:"playMode"`      // "ONLINE" (Video Call / LDR), "OFFLINE" (Ketemu Langsung), "ALL" (Semua)
	SelectedDecks []string           `json:"selectedDecks"` // Tipe Love Language yang diaktifkan (mis: "WORDS_OF_AFFIRMATION", "PHYSICAL_TOUCH")
	CustomDeck    []QuestionCard     `json:"customDeck"`
	History       []HistoryEntry     `json:"history"`
	MysteryTiles  []int              `json:"mysteryTiles"` // 20 petak takdir acak rahasia (Forced Random)
}
