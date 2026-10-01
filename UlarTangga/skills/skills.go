package skills

import "ulartangga/models"

// SkillDefinition mendefinisikan detail, ikon, kuota bawaan, dan penjelasan skill
type SkillDefinition struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	MaxUses     int    `json:"maxUses"`
	Description string `json:"desc"`
}

// AvailableSkills adalah daftar skill spesial yang dapat dipilih oleh pasangan
var AvailableSkills = []SkillDefinition{
	{
		ID:          "skip",
		Name:        "Bebas Hukuman (Skip)",
		Icon:        "⏭️",
		MaxUses:     1,
		Description: "Lewati 1x kartu Truth/Dare tanpa harus menjalankan tantangan dan tanpa penalti!",
	},
	{
		ID:          "reroll_plus",
		Name:        "Master Acak (+2 Kuota)",
		Icon:        "🔄",
		MaxUses:     2,
		Description: "Menambah +2 kuota acak kartu pilihanmu (total 5x acak kartu per game)!",
	},
	{
		ID:          "double_roll",
		Name:        "Dadu Ganda (Double Roll)",
		Icon:        "🎲",
		MaxUses:     3,
		Description: "Lempar dadu 2x berturut-turut dalam 1 giliran (bisa dipakai 3x per game)!",
	},
	{
		ID:          "snake_shield",
		Name:        "Perisai Kebal Ular",
		Icon:        "🛡️",
		MaxUses:     1,
		Description: "1x kebal otomatis saat menginjak kepala ular! Pion tetap aman dan tidak merosot ke bawah.",
	},
	{
		ID:          "lucky_dice",
		Name:        "Dadu Sakti (Pilih 1-6)",
		Icon:        "✨",
		MaxUses:     1,
		Description: "1x bebas memilih angka dadu sendiri (1-6) daripada diacak takdir!",
	},
	{
		ID:          "uno_reverse",
		Name:        "Balikkan Serang (Reverse)",
		Icon:        "🔁",
		MaxUses:     1,
		Description: "1x lemparkan kartu Truth/Dare yang didapat ke pasangan untuk dijawab/dijalankan!",
	},
}

// InitSkills menginisialisasi kuota skill aktif untuk seorang pemain
func InitSkills(selected []string, defaultReroll int) models.PlayerSkills {
	if len(selected) == 0 {
		selected = []string{"skip", "double_roll", "snake_shield"}
	}
	uses := make(map[string]int)
	rerolls := defaultReroll
	if rerolls <= 0 {
		rerolls = 3
	}

	for _, s := range selected {
		switch s {
		case "skip":
			uses["skip"] = 1
		case "double_roll":
			uses["double_roll"] = 3
		case "snake_shield":
			uses["snake_shield"] = 1
		case "lucky_dice":
			uses["lucky_dice"] = 1
		case "uno_reverse":
			uses["uno_reverse"] = 1
		case "reroll_plus":
			rerolls += 2
			uses["reroll_plus"] = 2
		}
	}
	return models.PlayerSkills{
		SelectedSkills: selected,
		SkillUses:      uses,
		RerollCount:    rerolls,
	}
}
