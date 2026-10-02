// ================= SKILL SYSTEM & RULES CONTROLLER =================

// 1. DAFTAR MASTER SKILL DENGAN PENJELASAN LENGKAP
const AVAILABLE_SKILLS = [
    {
        id: "skip",
        name: "Bebas Hukuman (Skip)",
        shortName: "Skip",
        icon: "⏭️",
        maxUses: 1,
        phase: "Saat Buka Kartu",
        desc: "Lewati 1x kartu Truth/Dare tanpa harus menjalankan tantangan dan tanpa penalti!",
        detail: "Gunakan tombol 'Lewati Tantangan' di pop-up kartu jika pasangan menolak menjawab atau tantangan dirasa terlalu sensitif untuk saat ini. Giliran lanjut seperti biasa tanpa hukuman."
    },
    {
        id: "reroll_plus",
        name: "Master Acak (+2 Kuota)",
        shortName: "Acak+2",
        icon: "🔄",
        maxUses: 2,
        phase: "Pasif Tiap Putaran",
        desc: "Tambah +2 kuota acak kartu pilihanmu (total 5x acak kartu per game)!",
        detail: "Memberikan tambahan 2 kali jatah acak ulang kartu di pop-up tantangan. Jika kuota standar adalah 3x, pemain dengan skill ini memiliki 5x kesempatan mengacak pertanyaan baru."
    },
    {
        id: "double_roll",
        name: "Dadu Ganda (Double Roll)",
        shortName: "Double",
        icon: "🎲",
        maxUses: 3,
        phase: "Sebelum Lempar Dadu",
        desc: "Lempar dadu 2x berturut-turut dalam 1 giliran (bisa dipakai 3x per game)!",
        detail: "Aktifkan sebelum menekan Kocok Dadu. Setelah pion selesai melangkah pada lemparan pertama, giliran TIDAK berpindah ke lawan, melainkan pemain berhak melempar dadu sekali lagi!"
    },
    {
        id: "snake_shield",
        name: "Perisai Kebal Ular",
        shortName: "Perisai",
        icon: "🛡️",
        maxUses: 1,
        phase: "Pasif Otomatis",
        desc: "1x kebal saat menginjak kepala ular! Pion tidak merosot ke bawah.",
        detail: "Bekerja secara otomatis saat pionmu mendarat tepat di kepala ular. Efek gigitan ular dinetralkan dan pion tetap aman bertengger di kotak atas tanpa harus melorot ke ekor ular."
    },
    {
        id: "lucky_dice",
        name: "Dadu Sakti (Pilih 1-6)",
        shortName: "Dadu Sakti",
        icon: "✨",
        maxUses: 1,
        phase: "Sebelum Lempar Dadu",
        desc: "1x bebas memilih angka dadu sendiri (1-6) daripada diacak takdir!",
        detail: "Membuka panel pemilih angka 1 sampai 6. Sangat berguna untuk langsung menginjak petak tangga naik 🪜 atau menghindari jebakan ular berbisa 🐍 yang ada di depanmu."
    },
    {
        id: "uno_reverse",
        name: "Balikkan Serang (Reverse)",
        shortName: "Reverse",
        icon: "🔁",
        maxUses: 1,
        phase: "Saat Buka Kartu",
        desc: "1x lemparkan kartu Truth/Dare yang didapat ke pasangan untuk dijawab!",
        detail: "Merasa kartu Truth/Dare yang terbuka terlalu seru atau menantang? Tekan tombol 'Lempar ke Pasangan' di modal kartu untuk membalikkan tantangan tersebut agar dijawab oleh pasanganmu!"
    }
];

// 2. STATE SKILL PEMAIN
let baseRerollQuota = parseInt(localStorage.getItem('couple_ut_reroll_quota') || '3');
let isDoubleRollActive = false;

function initPlayerSkillsState(selected, defaultReroll = 3) {
    if (!selected || selected.length === 0) {
        selected = ["skip", "double_roll", "snake_shield"];
    }
    let rerolls = defaultReroll;
    const uses = {
        skip: 0,
        double_roll: 0,
        snake_shield: 0,
        lucky_dice: 0,
        uno_reverse: 0,
        reroll_plus: 0
    };
    selected.forEach(s => {
        if (s === 'skip') uses.skip = 1;
        else if (s === 'double_roll') uses.double_roll = 3;
        else if (s === 'snake_shield') uses.snake_shield = 1;
        else if (s === 'lucky_dice') uses.lucky_dice = 1;
        else if (s === 'uno_reverse') uses.uno_reverse = 1;
        else if (s === 'reroll_plus') {
            rerolls += 2;
            uses.reroll_plus = 2;
        }
    });
    return {
        selected: selected,
        uses: uses,
        rerollCount: rerolls
    };
}

let p1Skills = JSON.parse(localStorage.getItem('couple_ut_p1_skills') || 'null') || initPlayerSkillsState(["skip", "double_roll", "snake_shield"], baseRerollQuota);
let p2Skills = JSON.parse(localStorage.getItem('couple_ut_p2_skills') || 'null') || initPlayerSkillsState(["skip", "double_roll", "snake_shield"], baseRerollQuota);

function savePlayerSkillsLocally() {
    localStorage.setItem('couple_ut_p1_skills', JSON.stringify(p1Skills));
    localStorage.setItem('couple_ut_p2_skills', JSON.stringify(p2Skills));
    localStorage.setItem('couple_ut_reroll_quota', baseRerollQuota.toString());
}

function resetPlayerSkillsToFull() {
    p1Skills = initPlayerSkillsState(p1Skills.selected, baseRerollQuota);
    p2Skills = initPlayerSkillsState(p2Skills.selected, baseRerollQuota);
    isDoubleRollActive = false;
    savePlayerSkillsLocally();
    renderSkillsUI();
}

// 3. HOVER TOOLTIP SYSTEM UNTUK SKILL DI SEBELAH KIRI
function showSkillTooltip(event, skillId, customSub = "") {
    const tooltip = document.getElementById('skillTooltip');
    if (!tooltip) return;

    const sk = AVAILABLE_SKILLS.find(s => s.id === skillId);
    if (!sk) return;

    document.getElementById('tooltipIcon').innerText = sk.icon;
    document.getElementById('tooltipName').innerText = sk.name;
    document.getElementById('tooltipPhase').innerText = sk.phase;
    document.getElementById('tooltipDesc').innerText = sk.desc;
    document.getElementById('tooltipDetail').innerText = sk.detail;
    document.getElementById('tooltipQuota').innerText = customSub || `Batas: ${sk.maxUses}x tiap game`;

    // Posisi Tooltip mengikuti kursor
    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;

    // Boundary check agar tidak terpotong layar
    if (left + 280 > window.innerWidth) {
        left = window.innerWidth - 290;
    }
    if (top + 160 > window.innerHeight) {
        top = rect.top - 150;
    }

    tooltip.style.top = `${Math.max(10, top)}px`;
    tooltip.style.left = `${Math.max(10, left)}px`;
    tooltip.classList.add('show');
}

function hideSkillTooltip() {
    const tooltip = document.getElementById('skillTooltip');
    if (tooltip) tooltip.classList.remove('show');
}

// 4. RENDER UI BADGE & ACTION BAR
function renderSkillsUI() {
    // Badges Pemain 1
    const p1Container = document.getElementById('p1SkillBadges');
    if (p1Container) {
        p1Container.innerHTML = '';
        p1Skills.selected.forEach(sId => {
            const sk = AVAILABLE_SKILLS.find(item => item.id === sId);
            if (!sk) return;
            let count = p1Skills.uses[sId];
            if (sId === 'reroll_plus') count = p1Skills.rerollCount;
            const isZero = count <= 0;
            const badge = document.createElement('span');
            badge.className = `inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md cursor-help transition-transform hover:scale-105 ${isZero ? 'bg-stone-200 text-stone-400 line-through' : 'bg-sky-200 text-sky-900 border border-sky-300'}`;
            badge.innerHTML = `${sk.icon} ${sk.shortName} <b>${count}</b>`;
            badge.onmouseenter = (e) => showSkillTooltip(e, sk.id, `Sisa Kuota P1: ${count}x`);
            badge.onmouseleave = hideSkillTooltip;
            p1Container.appendChild(badge);
        });
    }

    // Badges Pemain 2
    const p2Container = document.getElementById('p2SkillBadges');
    if (p2Container) {
        p2Container.innerHTML = '';
        p2Skills.selected.forEach(sId => {
            const sk = AVAILABLE_SKILLS.find(item => item.id === sId);
            if (!sk) return;
            let count = p2Skills.uses[sId];
            if (sId === 'reroll_plus') count = p2Skills.rerollCount;
            const isZero = count <= 0;
            const badge = document.createElement('span');
            badge.className = `inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md cursor-help transition-transform hover:scale-105 ${isZero ? 'bg-stone-200 text-stone-400 line-through' : 'bg-orange-200 text-orange-950 border border-orange-300'}`;
            badge.innerHTML = `${sk.icon} ${sk.shortName} <b>${count}</b>`;
            badge.onmouseenter = (e) => showSkillTooltip(e, sk.id, `Sisa Kuota P2: ${count}x`);
            badge.onmouseleave = hideSkillTooltip;
            p2Container.appendChild(badge);
        });
    }

    // Active Turn Skill Bar
    const activePNum = gameState.turn;
    const activeSkills = activePNum === 1 ? p1Skills : p2Skills;
    const activePInfo = activePNum === 1 ? gameState.p1Info : gameState.p2Info;

    const turnNameEl = document.getElementById('activeSkillTurnName');
    if (turnNameEl) {
        turnNameEl.innerText = `${activePInfo.name} ${activePInfo.avatar}`;
    }

    const activeBtnContainer = document.getElementById('activeSkillButtons');
    if (activeBtnContainer) {
        activeBtnContainer.innerHTML = '';

        // Double Roll
        if (activeSkills.selected.includes('double_roll')) {
            const count = activeSkills.uses.double_roll;
            const btn = document.createElement('button');
            if (isDoubleRollActive) {
                btn.className = "wood-btn bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-md ring-2 ring-amber-500 animate-pulse";
                btn.innerHTML = "<span>⚡</span> Dadu Ganda (AKTIF!)";
            } else {
                btn.className = `wood-btn ${count > 0 ? 'bg-amber-200 hover:bg-amber-300 text-amber-950' : 'bg-stone-200 text-stone-400 cursor-not-allowed'} text-xs font-black py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-xs`;
                btn.innerHTML = `<span>🎲</span> Double Roll (${count}x)`;
            }
            btn.onclick = toggleDoubleRoll;
            btn.onmouseenter = (e) => showSkillTooltip(e, 'double_roll', `Status: ${count}x tersisa`);
            btn.onmouseleave = hideSkillTooltip;
            activeBtnContainer.appendChild(btn);
        }

        // Lucky Dice
        if (activeSkills.selected.includes('lucky_dice')) {
            const count = activeSkills.uses.lucky_dice;
            const btn = document.createElement('button');
            btn.className = `wood-btn ${count > 0 ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-950' : 'bg-stone-200 text-stone-400 cursor-not-allowed'} text-xs font-black py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-xs`;
            btn.innerHTML = `<span>✨</span> Dadu Sakti (${count}x)`;
            btn.onclick = toggleLuckyDicePicker;
            btn.onmouseenter = (e) => showSkillTooltip(e, 'lucky_dice', `Status: ${count}x tersisa`);
            btn.onmouseleave = hideSkillTooltip;
            activeBtnContainer.appendChild(btn);
        }

        // Snake Shield
        if (activeSkills.selected.includes('snake_shield')) {
            const count = activeSkills.uses.snake_shield;
            const chip = document.createElement('span');
            chip.className = `inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl cursor-help ${count > 0 ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' : 'bg-stone-200 text-stone-400 line-through'}`;
            chip.innerHTML = `<span>🛡️</span> Perisai Ular (${count > 0 ? count + 'x Siap' : 'Habis'})`;
            chip.onmouseenter = (e) => showSkillTooltip(e, 'snake_shield', `Status: ${count}x kebal ular`);
            chip.onmouseleave = hideSkillTooltip;
            activeBtnContainer.appendChild(chip);
        }

        // Skip
        if (activeSkills.selected.includes('skip')) {
            const count = activeSkills.uses.skip;
            const chip = document.createElement('span');
            chip.className = `inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl cursor-help ${count > 0 ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-stone-200 text-stone-400 line-through'}`;
            chip.innerHTML = `<span>⏭️</span> Skip (${count > 0 ? count + 'x' : 'Habis'})`;
            chip.onmouseenter = (e) => showSkillTooltip(e, 'skip', `Status: ${count}x lewati kartu`);
            chip.onmouseleave = hideSkillTooltip;
            activeBtnContainer.appendChild(chip);
        }

        // Uno Reverse
        if (activeSkills.selected.includes('uno_reverse')) {
            const count = activeSkills.uses.uno_reverse;
            const chip = document.createElement('span');
            chip.className = `inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl cursor-help ${count > 0 ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-stone-200 text-stone-400 line-through'}`;
            chip.innerHTML = `<span>🔁</span> Reverse (${count > 0 ? count + 'x' : 'Habis'})`;
            chip.onmouseenter = (e) => showSkillTooltip(e, 'uno_reverse', `Status: ${count}x lempar ke pasangan`);
            chip.onmouseleave = hideSkillTooltip;
            activeBtnContainer.appendChild(chip);
        }

        // Master Acak
        const rerollChip = document.createElement('span');
        rerollChip.className = "inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-stone-100 text-slate-700 border border-stone-300 cursor-help";
        rerollChip.innerHTML = `<span>🔄</span> Kuota Acak: <b>${activeSkills.rerollCount}x</b>`;
        rerollChip.onmouseenter = (e) => showSkillTooltip(e, 'reroll_plus', `Sisa Acak: ${activeSkills.rerollCount}x`);
        rerollChip.onmouseleave = hideSkillTooltip;
        activeBtnContainer.appendChild(rerollChip);
    }
}

// 5. MODAL SKILL & ATURAN DENGAN 3 TAB INTERAKTIF
function openRulesSkillsModal() {
    document.getElementById('rulesP1Avatar').innerText = gameState.p1Info.avatar;
    document.getElementById('rulesP1Name').innerText = gameState.p1Info.name;
    document.getElementById('rulesP2Avatar').innerText = gameState.p2Info.avatar;
    document.getElementById('rulesP2Name').innerText = gameState.p2Info.name;

    const rerollSelect = document.getElementById('rulesRerollQuotaSelect');
    if (rerollSelect) rerollSelect.value = baseRerollQuota.toString();

    switchRulesTab('config');
    renderRulesModalLists();
    renderSkillGuideTab();

    const modal = document.getElementById('rulesSkillsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    playSynthSound('card');
}

function closeRulesSkillsModal() {
    const modal = document.getElementById('rulesSkillsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchRulesTab(tab) {
    const btnConfig = document.getElementById('rulesTabBtnConfig');
    const btnGuide = document.getElementById('rulesTabBtnGuide');
    const btnRules = document.getElementById('rulesTabBtnRules');

    const tabConfig = document.getElementById('rulesTabConfig');
    const tabGuide = document.getElementById('rulesTabGuide');
    const tabRules = document.getElementById('rulesTabRules');

    [btnConfig, btnGuide, btnRules].forEach(b => {
        if (b) b.className = "px-4 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition font-bold text-xs";
    });
    [tabConfig, tabGuide, tabRules].forEach(t => {
        if (t) t.classList.add('hidden');
    });

    if (tab === 'config') {
        if (btnConfig) btnConfig.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white font-bold text-xs shadow-xs";
        if (tabConfig) tabConfig.classList.remove('hidden');
    } else if (tab === 'guide') {
        if (btnGuide) btnGuide.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white font-bold text-xs shadow-xs";
        if (tabGuide) tabGuide.classList.remove('hidden');
        renderSkillGuideTab();
    } else if (tab === 'rules') {
        if (btnRules) btnRules.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white font-bold text-xs shadow-xs";
        if (tabRules) tabRules.classList.remove('hidden');
    }
}

function renderSkillGuideTab() {
    const container = document.getElementById('skillsGuideContainer');
    if (!container) return;

    container.innerHTML = '';
    AVAILABLE_SKILLS.forEach(sk => {
        container.innerHTML += `
            <div class="p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-xs flex flex-col gap-2">
                <div class="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${sk.icon}</span>
                        <div>
                            <h4 class="font-extrabold text-slate-800 text-xs">${sk.name}</h4>
                            <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">${sk.phase}</span>
                        </div>
                    </div>
                    <span class="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                        Batas: ${sk.maxUses}x / game
                    </span>
                </div>
                <p class="text-xs text-slate-700 font-semibold leading-relaxed">
                    ${sk.desc}
                </p>
                <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-slate-600 leading-normal">
                    💡 <b>Cara Kerja & Tips:</b> ${sk.detail}
                </div>
            </div>
        `;
    });
}

function renderRulesModalLists() {
    const p1Container = document.getElementById('p1SkillsSelectorList');
    const p2Container = document.getElementById('p2SkillsSelectorList');
    const p1Count = document.getElementById('p1SkillSelectedCount');
    const p2Count = document.getElementById('p2SkillSelectedCount');

    if (p1Count) p1Count.innerText = p1Skills.selected.length;
    if (p2Count) p2Count.innerText = p2Skills.selected.length;

    if (p1Container) {
        p1Container.innerHTML = '';
        AVAILABLE_SKILLS.forEach(sk => {
            const isChecked = p1Skills.selected.includes(sk.id);
            p1Container.innerHTML += `
                <label class="flex items-start gap-2.5 p-2 rounded-xl border ${isChecked ? 'bg-sky-100/90 border-sky-400 font-bold' : 'bg-white border-stone-200'} cursor-pointer hover:bg-sky-50 transition">
                    <input type="checkbox" onchange="toggleSkillSelection(1, '${sk.id}')" ${isChecked ? 'checked' : ''} class="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                            <span class="text-sm">${sk.icon}</span>
                            <span class="text-xs font-black text-slate-800">${sk.name}</span>
                        </div>
                        <p class="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">${sk.desc}</p>
                    </div>
                </label>
            `;
        });
    }

    if (p2Container) {
        p2Container.innerHTML = '';
        AVAILABLE_SKILLS.forEach(sk => {
            const isChecked = p2Skills.selected.includes(sk.id);
            p2Container.innerHTML += `
                <label class="flex items-start gap-2.5 p-2 rounded-xl border ${isChecked ? 'bg-orange-100/90 border-orange-400 font-bold' : 'bg-white border-stone-200'} cursor-pointer hover:bg-orange-50 transition">
                    <input type="checkbox" onchange="toggleSkillSelection(2, '${sk.id}')" ${isChecked ? 'checked' : ''} class="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4 h-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                            <span class="text-sm">${sk.icon}</span>
                            <span class="text-xs font-black text-slate-800">${sk.name}</span>
                        </div>
                        <p class="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">${sk.desc}</p>
                    </div>
                </label>
            `;
        });
    }
}

function toggleSkillSelection(playerNum, skillId) {
    const currentList = playerNum === 1 ? p1Skills.selected : p2Skills.selected;
    const idx = currentList.indexOf(skillId);

    if (idx >= 0) {
        if (currentList.length <= 1) {
            showToast("Pemain minimal harus memiliki 1 skill aktif!", "⚠️");
            renderRulesModalLists();
            return;
        }
        currentList.splice(idx, 1);
    } else {
        if (currentList.length >= 3) {
            showToast("Maksimal hanya boleh memilih 3 skill per pemain!", "⚠️");
            renderRulesModalLists();
            return;
        }
        currentList.push(skillId);
    }
    renderRulesModalLists();
}

function applySkillPreset(preset) {
    let selected = [];
    if (preset === 'balanced') {
        selected = ["skip", "double_roll", "snake_shield"];
    } else if (preset === 'tactical') {
        selected = ["double_roll", "lucky_dice", "uno_reverse"];
    } else if (preset === 'romantic') {
        selected = ["skip", "reroll_plus", "snake_shield"];
    }

    p1Skills.selected = [...selected];
    p2Skills.selected = [...selected];
    renderRulesModalLists();
    showToast(`Preset '${preset.toUpperCase()}' berhasil dipasang!`, "⚡");
}

function saveSkillsAndRules() {
    const rerollSelect = document.getElementById('rulesRerollQuotaSelect');
    if (rerollSelect) {
        baseRerollQuota = parseInt(rerollSelect.value) || 3;
    }

    p1Skills = initPlayerSkillsState(p1Skills.selected, baseRerollQuota);
    p2Skills = initPlayerSkillsState(p2Skills.selected, baseRerollQuota);
    savePlayerSkillsLocally();
    renderSkillsUI();
    closeRulesSkillsModal();
    showToast("Aturan & Skill berhasil disimpan & siap digunakan! ⚡", "✅");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "CONFIG_SKILLS",
            p1Skills: p1Skills.selected,
            p2Skills: p2Skills.selected,
            rerollQuota: baseRerollQuota
        }));
    }
}

// 6. AKSI GAMEPLAY SKILL
function toggleDoubleRoll() {
    const pNum = gameState.turn;
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    if (pSkills.uses.double_roll <= 0) {
        showToast("Skill Double Roll sudah habis untuk permainan ini!", "⚠️");
        return;
    }

    isDoubleRollActive = !isDoubleRollActive;
    playSynthSound('dice');
    if (isDoubleRollActive) {
        showToast("⚡ DADU GANDA AKTIF! Kamu akan melempar dadu 2x beruntun di giliran ini!", "🎲");
    } else {
        showToast("Double roll dibatalkan.", "↩️");
    }
    renderSkillsUI();
}

function toggleLuckyDicePicker() {
    const picker = document.getElementById('luckyDicePicker');
    if (picker) picker.classList.toggle('hidden');
}

function rollWithFixedDice(fixedNum) {
    if (isRolling) return;
    const pNum = gameState.turn;
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    if (pSkills.uses.lucky_dice <= 0) {
        showToast("Skill Dadu Sakti sudah habis!", "⚠️");
        return;
    }

    pSkills.uses.lucky_dice--;
    savePlayerSkillsLocally();
    const picker = document.getElementById('luckyDicePicker');
    if (picker) picker.classList.add('hidden');

    showToast(`✨ Dadu Sakti Digunakan! Angka pasti: ${fixedNum}!`, "🎯");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "ROLL_DICE",
            fixedDice: fixedNum,
            isDoubleRoll: isDoubleRollActive,
            useShield: pSkills.uses.snake_shield > 0
        }));
        ws.send(JSON.stringify({
            type: "USE_SKILL",
            player: pNum,
            skill: "lucky_dice"
        }));
        isDoubleRollActive = false;
    } else {
        executeFixedDiceOffline(fixedNum);
    }
    renderSkillsUI();
}

function executeFixedDiceOffline(fixedNum) {
    if (isRolling) return;
    isRolling = true;
    document.getElementById('rollDiceBtn').disabled = true;

    const pNum = gameState.turn;
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    const fromPos = pNum === 1 ? gameState.p1Pos : gameState.p2Pos;
    const nextPos = Math.min(100, fromPos + fixedNum);
    let jumpDest = snakesAndLadders[nextPos] || 0;
    let finalPos = nextPos;
    let isShielded = false;

    if (jumpDest > 0) {
        if (jumpDest < nextPos) {
            if (pSkills.uses.snake_shield > 0) {
                isShielded = true;
                pSkills.uses.snake_shield--;
                savePlayerSkillsLocally();
                finalPos = nextPos;
                jumpDest = 0;
            } else {
                finalPos = jumpDest;
            }
        } else {
            finalPos = jumpDest;
        }
    }

    const isDouble = isDoubleRollActive;
    if (isDoubleRollActive) {
        pSkills.uses.double_roll--;
        savePlayerSkillsLocally();
    }
    isDoubleRollActive = false;
    const nextTurn = isDouble ? pNum : (pNum === 1 ? 2 : 1);

    handleDiceRollSequence({
        player: pNum,
        dice: fixedNum,
        fromPos: fromPos,
        nextPos: nextPos,
        jumpDest: jumpDest,
        finalPos: finalPos,
        nextTurn: nextTurn,
        isShielded: isShielded,
        isDoubleRoll: isDouble
    });
}

function useSkipSkill() {
    const pNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    const pInfo = pNum === 1 ? gameState.p1Info : gameState.p2Info;

    if (pSkills.uses.skip <= 0) {
        showToast("Skill Skip sudah habis!", "⚠️");
        return;
    }

    pSkills.uses.skip--;
    savePlayerSkillsLocally();
    playSynthSound('reaction');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    showToast(`⏭️ ${pInfo.name} menggunakan Skill SKIP! Bebas dari tantangan!`, "🎉");

    const historyEntry = {
        id: Date.now(),
        turnNumber: gameHistory.length + 1,
        playerNum: pNum,
        playerName: pInfo.name,
        avatar: pInfo.avatar,
        dice: currentMoveContext.dice || gameState.lastDice,
        fromPos: currentMoveContext.finalPos,
        toPos: currentMoveContext.finalPos,
        finalPos: currentMoveContext.finalPos,
        jumpType: "SKILL",
        jumpDest: 0,
        choice: "SKIP",
        cardType: "SKILL",
        category: "Bebas Hukuman",
        prompt: `${pInfo.name} mengaktifkan Skill Bebas Hukuman (Skip)! Bebas dari tantangan tanpa hukuman.`,
        timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    addHistoryEntry(historyEntry);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "USE_SKILL",
            player: pNum,
            skill: "skip"
        }));
        ws.send(JSON.stringify({
            type: "RECORD_HISTORY",
            entry: historyEntry
        }));
    }

    closeCardModal();
    renderSkillsUI();
}

function useReverseSkill() {
    const pNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    const pInfo = pNum === 1 ? gameState.p1Info : gameState.p2Info;
    const otherInfo = pNum === 1 ? gameState.p2Info : gameState.p1Info;

    if (pSkills.uses.uno_reverse <= 0) {
        showToast("Skill Reverse sudah habis!", "⚠️");
        return;
    }

    pSkills.uses.uno_reverse--;
    savePlayerSkillsLocally();
    playSynthSound('reaction');
    showToast(`🔁 UNO REVERSE! Tantangan dilempar balik ke ${otherInfo.name}!`, "🔥");

    const playerTargetEl = document.getElementById('modalPlayerTarget');
    if (playerTargetEl) {
        playerTargetEl.innerText = `🔁 DILEMPAR REVERSE KE: ${otherInfo.name} ${otherInfo.avatar}!`;
    }

    const reverseBtn = document.getElementById('modalReverseBtn');
    if (reverseBtn) reverseBtn.classList.add('hidden');

    const historyEntry = {
        id: Date.now(),
        turnNumber: gameHistory.length + 1,
        playerNum: pNum,
        playerName: pInfo.name,
        avatar: pInfo.avatar,
        dice: currentMoveContext.dice || gameState.lastDice,
        fromPos: currentMoveContext.finalPos,
        toPos: currentMoveContext.finalPos,
        finalPos: currentMoveContext.finalPos,
        jumpType: "SKILL",
        jumpDest: 0,
        choice: "REVERSE",
        cardType: "SKILL",
        category: "Uno Reverse",
        prompt: `${pInfo.name} menggunakan Skill UNO REVERSE! Melemparkan tantangan '${currentModalCard ? currentModalCard.prompt : ""}' ke ${otherInfo.name}!`,
        timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    addHistoryEntry(historyEntry);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "USE_SKILL",
            player: pNum,
            skill: "uno_reverse"
        }));
        ws.send(JSON.stringify({
            type: "RECORD_HISTORY",
            entry: historyEntry
        }));
    }

    renderSkillsUI();
}

function reRollCardPrompt() {
    if (!currentModalCard) return;

    const activePNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const activeSkills = activePNum === 1 ? p1Skills : p2Skills;

    if (activeSkills.rerollCount <= 0) {
        showToast("⚠️ Kuota acak ulang kartu sudah habis untuk game ini!", "❌");
        return;
    }

    activeSkills.rerollCount--;
    savePlayerSkillsLocally();

    const isTruth = currentModalCard.type === 'TRUTH';
    const activeSelectedDecks = (typeof gameState !== 'undefined' && gameState.selectedDecks) 
        ? gameState.selectedDecks 
        : ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'];
    const currentPlayMode = (typeof gameState !== 'undefined' && gameState.playMode) ? gameState.playMode : (localStorage.getItem('couple_ut_play_mode') || 'ONLINE');
    
    const pool = (typeof getGameActivePool === 'function')
        ? getGameActivePool(isTruth ? 'TRUTH' : 'DARE', activeSelectedDecks, customCards, currentPlayMode)
        : (isTruth ? defaultTruthsList.concat(customCards.filter(c => c.type === 'TRUTH')) : defaultDaresList.concat(customCards.filter(c => c.type === 'DARE')));

    const pick = pool[Math.floor(Math.random() * pool.length)];
    currentModalCard.prompt = pick.prompt;
    currentModalCard.category = pick.category;
    currentModalCard.loveLanguage = pick.loveLanguage || 'GENERAL';
    currentModalCard.mode = pick.mode || 'BOTH';

    document.getElementById('modalPromptText').innerText = `"${pick.prompt}"`;
    document.getElementById('modalCategoryBadge').innerText = pick.category;

    const loveLangBadge = document.getElementById('modalLoveLanguageBadge');
    if (loveLangBadge && typeof getLoveLanguageMeta === 'function') {
        const meta = getLoveLanguageMeta(pick.loveLanguage || 'GENERAL');
        loveLangBadge.innerHTML = `<span>${meta.icon}</span> ${meta.name}`;
    }

    const modeBadge = document.getElementById('modalModeBadge');
    if (modeBadge) {
        const cMode = pick.mode || 'BOTH';
        if (cMode === 'ONLINE') {
            modeBadge.className = "bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1";
            modeBadge.innerHTML = "<span>📹</span> Video Call";
        } else if (cMode === 'OFFLINE') {
            modeBadge.className = "bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-1";
            modeBadge.innerHTML = "<span>💑</span> Ketemu Langsung";
        } else {
            modeBadge.className = "bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1";
            modeBadge.innerHTML = "<span>✨</span> Online & Offline";
        }
    }

    const rerollBtnLabel = document.getElementById('reRollBtnLabel');
    if (rerollBtnLabel) {
        rerollBtnLabel.innerText = `Acak Lagi (${activeSkills.rerollCount})`;
    }

    playSynthSound('hop');
    showToast(`Pertanyaan diacak ulang! (Sisa kuota: ${activeSkills.rerollCount}x) 🔄`, "🎲");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "USE_SKILL",
            player: activePNum,
            skill: "reroll_card"
        }));
    }

    renderSkillsUI();
}
