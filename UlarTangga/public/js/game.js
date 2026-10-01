// ================= ULAR TANGGA PASANGAN - GAME ENGINE =================

// Snakes and Ladders Mapping
const snakesAndLadders = {
    4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92, // Tangga 🪜 (Naik)
    27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41  // Ular 🐍 (Turun)
};

// State Utama Permainan
let customCards = JSON.parse(localStorage.getItem('couple_ut_custom_cards') || '[]');
let gameHistory = JSON.parse(localStorage.getItem('couple_ut_history') || '[]');
let currentMoveContext = { player: 1, dice: 1, fromPos: 1, nextPos: 1, finalPos: 1, jumpDest: 0 };
let boardTiles = [];
let gameState = {
    p1Pos: 1,
    p2Pos: 1,
    turn: 1,
    lastDice: 1,
    p1Info: { name: "Pemain 1 (Cowok)", avatar: "👦", color: "#38BDF8" },
    p2Info: { name: "Pemain 2 (Cewek)", avatar: "🧕", color: "#FB923C" }
};

const savedP1 = localStorage.getItem('couple_ut_p1');
const savedP2 = localStorage.getItem('couple_ut_p2');
if (savedP1) gameState.p1Info = JSON.parse(savedP1);
if (savedP2) gameState.p2Info = JSON.parse(savedP2);

let isRolling = false;
let isAudioMuted = localStorage.getItem('couple_ut_muted') === 'true';
let ws = null;
let dareTimerInterval = null;
let dareSecondsLeft = 30;
let pendingTileNumber = 1;
let currentModalCard = null;

// TOAST NOTIFIKASI
let toastTimeout = null;
function showToast(msg, icon = '✨') {
    const toast = document.getElementById('toastNotif');
    if (!toast) return;
    document.getElementById('toastMsg').innerText = msg;
    document.getElementById('toastIcon').innerText = icon;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// WEB AUDIO SYNTHESIZER
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthSound(type) {
    if (isAudioMuted) return;
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;

        if (type === 'dice') {
            for (let i = 0; i < 4; i++) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(160 + Math.random() * 200, now + i * 0.07);
                gain.gain.setValueAtTime(0.12, now + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.05);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + i * 0.07);
                osc.stop(now + i * 0.07 + 0.06);
            }
        } else if (type === 'hop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'ladder') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.09);
                gain.gain.setValueAtTime(0.16, now + idx * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.09);
                osc.stop(now + idx * 0.09 + 0.23);
            });
        } else if (type === 'snake') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.32);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.33);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.34);
        } else if (type === 'card') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.14);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'reaction') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.17);
        }
    } catch(e) {}
}

function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    localStorage.setItem('couple_ut_muted', isAudioMuted);
    updateAudioUI();
    showToast(isAudioMuted ? "Suara Efek Dimatikan 🔇" : "Suara Efek Aktif 🔊");
}

function updateAudioUI() {
    const icon = document.getElementById('soundIcon');
    const text = document.getElementById('soundText');
    if (!icon || !text) return;
    if (isAudioMuted) {
        icon.innerText = '🔇';
        text.innerText = 'Sound OFF';
    } else {
        icon.innerText = '🔊';
        text.innerText = 'Sound ON';
    }
}

// INISIALISASI GAME & BOARD
async function initGame() {
    updateAudioUI();
    updatePlayerDisplays();

    // Bangun 100 kotak
    boardTiles = [];
    for (let i = 1; i <= 100; i++) {
        boardTiles.push({
            number: i,
            jumpTo: snakesAndLadders[i] || 0
        });
    }

    renderBoardUI();
    drawSnakesAndLaddersSVG();
    updatePawnsUI();
    updateDeckCountBadge();
    renderHistoryUI();
    renderSkillsUI();

    // Hubungkan WebSocket jika server aktif
    connectWebSocket();
}

// RENDER BOARD 10x10 (Boustrophedon)
function renderBoardUI() {
    const grid = document.getElementById('boardGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let row = 9; row >= 0; row--) {
        let isEvenRowFromBottom = (row % 2 === 0);
        for (let col = 0; col < 10; col++) {
            let num = isEvenRowFromBottom ? (row * 10 + col + 1) : (row * 10 + (10 - col));
            let tile = boardTiles[num - 1] || { number: num, jumpTo: 0 };
            let isRed = (row + col) % 2 === 0;

            let centerContent = '';
            if (num === 1) {
                centerContent = `
                    <div class="text-center font-black text-[10px] md:text-xs text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-lg border border-emerald-500 shadow-sm">
                        START 🚀
                    </div>
                `;
            } else if (num === 100) {
                centerContent = `
                    <div class="text-center font-black text-[10px] md:text-xs text-amber-950 bg-amber-300 px-2 py-0.5 rounded-lg border border-amber-600 shadow-sm animate-pulse">
                        FINISH 🏆
                    </div>
                `;
            } else if (num === 57) {
                centerContent = `
                    <div class="tile-mystery-badge bg-rose-500/20 text-rose-500 font-black text-xs border border-rose-400" title="Kotak 57: Landmark Deeptalk!">
                        📞 57
                    </div>
                `;
            } else if (num === 21) {
                centerContent = `
                    <div class="tile-mystery-badge bg-teal-500/20 text-teal-600 font-black text-xs border border-teal-400" title="Kotak 21: Landmark Impersonate!">
                        🎬 21
                    </div>
                `;
            } else {
                const mysteryIcons = ['❓', '✨', '💖', '🎁', '💬', '⚡'];
                const emblem = mysteryIcons[num % mysteryIcons.length];
                centerContent = `
                    <div class="tile-mystery-badge bg-amber-500/10 text-amber-600 font-bold text-sm">
                        ${emblem}
                    </div>
                `;
            }

            let jumpTag = '';
            if (tile.jumpTo > num) {
                jumpTag = `<span class="absolute top-1 left-1.5 text-[9px] md:text-[10px] bg-amber-300 text-stone-900 px-1 rounded font-extrabold z-15 shadow-xs">🪜↗${tile.jumpTo}</span>`;
            } else if (tile.jumpTo > 0 && tile.jumpTo < num) {
                jumpTag = `<span class="absolute top-1 left-1.5 text-[9px] md:text-[10px] bg-emerald-400 text-stone-900 px-1 rounded font-extrabold z-15 shadow-xs">🐍↘${tile.jumpTo}</span>`;
            }

            grid.innerHTML += `
                <div id="tile-${num}" onclick="handleTileClick(${num})" class="tile ${isRed ? 'tile-red' : 'tile-cream'}">
                    ${jumpTag}
                    ${centerContent}
                    <span class="absolute bottom-1 right-1.5 text-[10px] md:text-[11px] font-black opacity-60">${num}</span>
                    <div id="pawn-container-${num}" class="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none z-30"></div>
                </div>
            `;
        }
    }
}

function getTileCoordinates(num) {
    let r = Math.floor((num - 1) / 10);
    let c = (num - 1) % 10;
    let col = (r % 2 === 0) ? c : (9 - c);
    let row = 9 - r;

    let x = col * 100 + 50;
    let y = row * 100 + 50;
    return { x, y };
}

function drawSnakesAndLaddersSVG() {
    const laddersGroup = document.getElementById('laddersGroup');
    const snakesGroup = document.getElementById('snakesGroup');
    if (!laddersGroup || !snakesGroup) return;

    laddersGroup.innerHTML = '';
    snakesGroup.innerHTML = '';

    for (const [fromStr, to] of Object.entries(snakesAndLadders)) {
        const from = parseInt(fromStr);
        const pStart = getTileCoordinates(from);
        const pEnd = getTileCoordinates(to);

        if (to > from) {
            // TANGGA 🪜
            const dx = pEnd.x - pStart.x;
            const dy = pEnd.y - pStart.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = (-dy / dist) * 14;
            const ny = (dx / dist) * 14;

            const rail1Start = { x: pStart.x + nx, y: pStart.y + ny };
            const rail1End = { x: pEnd.x + nx, y: pEnd.y + ny };
            const rail2Start = { x: pStart.x - nx, y: pStart.y - ny };
            const rail2End = { x: pEnd.x - nx, y: pEnd.y - ny };

            let rungsSvg = '';
            const steps = Math.floor(dist / 38);
            for (let s = 1; s <= steps; s++) {
                const t = s / (steps + 1);
                const rx1 = rail1Start.x + (rail1End.x - rail1Start.x) * t;
                const ry1 = rail1Start.y + (rail1End.y - rail1Start.y) * t;
                const rx2 = rail2Start.x + (rail2End.x - rail2Start.x) * t;
                const ry2 = rail2Start.y + (rail2End.y - rail2Start.y) * t;
                rungsSvg += `<line x1="${rx1}" y1="${ry1}" x2="${rx2}" y2="${ry2}" stroke="#D97706" stroke-width="4.5" stroke-linecap="round" />`;
            }

            laddersGroup.innerHTML += `
                <g filter="url(#svgShadow)">
                    <line x1="${rail1Start.x}" y1="${rail1Start.y}" x2="${rail1End.x}" y2="${rail1End.y}" stroke="url(#ladderGrad)" stroke-width="6" stroke-linecap="round" />
                    <line x1="${rail2Start.x}" y1="${rail2Start.y}" x2="${rail2End.x}" y2="${rail2End.y}" stroke="url(#ladderGrad)" stroke-width="6" stroke-linecap="round" />
                    ${rungsSvg}
                </g>
            `;
        } else {
            // ULAR 🐍
            const midX = (pStart.x + pEnd.x) / 2;
            const midY = (pStart.y + pEnd.y) / 2;
            const curveOffset = ((from % 2 === 0) ? 1 : -1) * 70;
            const cp1X = midX + curveOffset;
            const cp1Y = midY - 30;

            const snakeGrads = ['url(#snakeGradGreen)', 'url(#snakeGradRed)', 'url(#snakeGradPurple)'];
            const snakeStroke = snakeGrads[from % snakeGrads.length];

            snakesGroup.innerHTML += `
                <g filter="url(#svgShadow)">
                    <path d="M ${pStart.x} ${pStart.y} Q ${cp1X} ${cp1Y} ${pEnd.x} ${pEnd.y}" fill="none" stroke="${snakeStroke}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M ${pStart.x} ${pStart.y} Q ${cp1X} ${cp1Y} ${pEnd.x} ${pEnd.y}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-dasharray="8,10" stroke-linecap="round" />
                    <!-- Kepala Ular -->
                    <circle cx="${pStart.x}" cy="${pStart.y}" r="15" fill="#EF4444" stroke="#7F1D1D" stroke-width="2.5" />
                    <!-- Mata Ular -->
                    <circle cx="${pStart.x - 4}" cy="${pStart.y - 4}" r="3.5" fill="#FFFFFF" />
                    <circle cx="${pStart.x - 4}" cy="${pStart.y - 4}" r="1.8" fill="#000000" />
                    <circle cx="${pStart.x + 4}" cy="${pStart.y - 4}" r="3.5" fill="#FFFFFF" />
                    <circle cx="${pStart.x + 4}" cy="${pStart.y - 4}" r="1.8" fill="#000000" />
                    <!-- Lidah Bercabang Ular -->
                    <path d="M ${pStart.x} ${pStart.y + 12} L ${pStart.x} ${pStart.y + 21} L ${pStart.x - 4} ${pStart.y + 25} M ${pStart.x} ${pStart.y + 21} L ${pStart.x + 4} ${pStart.y + 25}" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" />
                </g>
            `;
        }
    }
}

// UPDATE POSISI PION & STATUS
function updatePawnsUI() {
    document.querySelectorAll('[id^="pawn-container-"]').forEach(el => el.innerHTML = '');

    const p1Container = document.getElementById(`pawn-container-${gameState.p1Pos}`);
    const p2Container = document.getElementById(`pawn-container-${gameState.p2Pos}`);

    if (p1Container) {
        p1Container.innerHTML += `
            <div id="pawn-p1" class="pawn bg-sky-400 border-2 border-white shadow-md hover:scale-115" title="${gameState.p1Info.name}">
                ${gameState.p1Info.avatar}
            </div>
        `;
    }

    if (p2Container) {
        p2Container.innerHTML += `
            <div id="pawn-p2" class="pawn bg-orange-400 border-2 border-white shadow-md hover:scale-115" title="${gameState.p2Info.name}">
                ${gameState.p2Info.avatar}
            </div>
        `;
    }

    const p1PosNum = document.getElementById('p1PosNum');
    const p2PosNum = document.getElementById('p2PosNum');
    if (p1PosNum) p1PosNum.innerText = gameState.p1Pos;
    if (p2PosNum) p2PosNum.innerText = gameState.p2Pos;

    // Highlight petak aktif
    document.querySelectorAll('.tile-active-highlight').forEach(el => el.classList.remove('tile-active-highlight'));
    const activeTileNum = gameState.turn === 1 ? gameState.p1Pos : gameState.p2Pos;
    const currentTileEl = document.getElementById(`tile-${activeTileNum}`);
    if (currentTileEl) currentTileEl.classList.add('tile-active-highlight');

    // Turn Banner
    const isP1 = gameState.turn === 1;
    const turnBanner = document.getElementById('turnBanner');
    const turnAvatar = document.getElementById('currentTurnAvatar');
    const turnName = document.getElementById('currentTurnName');

    if (turnBanner && turnAvatar && turnName) {
        if (isP1) {
            turnBanner.className = "p-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center justify-between mb-3 shadow-md transition-all";
            turnAvatar.innerText = gameState.p1Info.avatar;
            turnName.innerText = gameState.p1Info.name;
        } else {
            turnBanner.className = "p-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white flex items-center justify-between mb-3 shadow-md transition-all";
            turnAvatar.innerText = gameState.p2Info.avatar;
            turnName.innerText = gameState.p2Info.name;
        }
    }

    // Refresh UI skill giliran aktif
    if (typeof renderSkillsUI === 'function') {
        renderSkillsUI();
    }
}

// KOCOK DADU (SYNCHRONIZED & GLITCH-FREE)
function rollDice() {
    if (isRolling) return;
    isRolling = true;
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = true;

    const pNum = gameState.turn;
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    const isDouble = isDoubleRollActive;
    const willUseShield = pSkills.uses.snake_shield > 0;

    if (ws && ws.readyState === WebSocket.OPEN) {
        if (isDoubleRollActive) {
            pSkills.uses.double_roll--;
            savePlayerSkillsLocally();
            ws.send(JSON.stringify({ type: "USE_SKILL", player: pNum, skill: "double_roll" }));
        }
        isDoubleRollActive = false;
        ws.send(JSON.stringify({
            type: "ROLL_DICE",
            isDoubleRoll: isDouble,
            useShield: willUseShield
        }));
        renderSkillsUI();
    } else {
        const dice = Math.floor(Math.random() * 6) + 1;
        const fromPos = pNum === 1 ? gameState.p1Pos : gameState.p2Pos;
        const nextPos = Math.min(100, fromPos + dice);
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

        if (isDoubleRollActive) {
            pSkills.uses.double_roll--;
            savePlayerSkillsLocally();
        }
        isDoubleRollActive = false;

        const nextTurn = isDouble ? pNum : (pNum === 1 ? 2 : 1);
        renderSkillsUI();

        handleDiceRollSequence({
            player: pNum,
            dice: dice,
            fromPos: fromPos,
            nextPos: nextPos,
            jumpDest: jumpDest,
            finalPos: finalPos,
            nextTurn: nextTurn,
            isShielded: isShielded,
            isDoubleRoll: isDouble
        });
    }
}

async function handleDiceRollSequence(data) {
    const diceFace = document.getElementById('diceFace');
    const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    if (diceFace) diceFace.classList.add('dice-rolling');
    playSynthSound('dice');

    let count = 0;
    const rollInterval = setInterval(() => {
        if (diceFace) diceFace.innerText = diceFaces[Math.floor(Math.random() * 6)];
        count++;
        if (count >= 7) {
            clearInterval(rollInterval);
            if (diceFace) {
                diceFace.classList.remove('dice-rolling');
                diceFace.innerText = diceFaces[data.dice - 1];
            }
            executePawnHopping(data);
        }
    }, 60);
}

async function executePawnHopping(data) {
    const pNum = data.player;
    const pInfo = pNum === 1 ? gameState.p1Info : gameState.p2Info;
    let current = data.fromPos;
    const target = data.nextPos;

    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.innerText = `🎲 ${pInfo.name} dapat angka ${data.dice}! Melangkah ke kotak ${target}...`;
    }

    while (current < target) {
        current++;
        if (pNum === 1) gameState.p1Pos = current;
        else gameState.p2Pos = current;

        updatePawnsUI();
        playSynthSound('hop');
        await new Promise(res => setTimeout(res, 200));
    }

    // Cek Ular / Tangga / Perisai
    if (data.isShielded) {
        await new Promise(res => setTimeout(res, 250));
        playSynthSound('reaction');
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        if (statusEl) statusEl.innerText = `🛡️ PERISAI KEBISAN AKTIF! ${pInfo.name} kebal dari gigitan ular di kotak ${target}!`;
        showToast(`🛡️ PERISAI KEBISAN AKTIF! ${pInfo.name} kebal dari ular!`, "🛡️");
        await new Promise(res => setTimeout(res, 400));
    } else if (data.jumpDest > 0) {
        await new Promise(res => setTimeout(res, 300));
        if (data.jumpDest > target) {
            playSynthSound('ladder');
            if (statusEl) statusEl.innerText = `🪜 WOW! ${pInfo.name} naik tangga dari kotak ${target} ke kotak ${data.jumpDest}!`;
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        } else {
            playSynthSound('snake');
            if (statusEl) statusEl.innerText = `🐍 OUCH! ${pInfo.name} digigit ular di kotak ${target}, turun ke kotak ${data.jumpDest}!`;
        }

        if (pNum === 1) gameState.p1Pos = data.finalPos;
        else gameState.p2Pos = data.finalPos;

        updatePawnsUI();
        await new Promise(res => setTimeout(res, 350));
    }

    if (data.isDoubleRoll) {
        showToast(`🎲 DOUBLE ROLL! ${pInfo.name} dapat giliran melempar dadu sekali lagi!`, "⚡");
    }

    gameState.turn = data.nextTurn;
    updatePawnsUI();

    isRolling = false;
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = false;

    currentMoveContext = {
        player: pNum,
        dice: data.dice,
        fromPos: data.fromPos,
        nextPos: data.nextPos,
        jumpDest: data.jumpDest || 0,
        finalPos: data.finalPos,
        isShielded: data.isShielded || false,
        isDoubleRoll: data.isDoubleRoll || false,
        skillUsed: data.isShielded ? "🛡️ Perisai Kebal Ular" : (data.isDoubleRoll ? "🎲 Dadu Ganda" : "")
    };

    pendingTileNumber = data.finalPos;
    openChoiceModal(data.finalPos, pNum);
}

// MODAL PILIHAN TANTANGAN (TRUTH, DARE, ATAU RANDOM)
function openChoiceModal(tileNum, targetPNum) {
    if (tileNum === 1) return; // Kotak START

    const modal = document.getElementById('choiceModal');
    if (!modal) return;
    document.getElementById('choiceModalTileNum').innerText = tileNum;
    const targetPlayer = targetPNum === 1 ? gameState.p1Info : gameState.p2Info;
    document.getElementById('choiceModalTargetPlayer').innerText = `Tantangan untuk: ${targetPlayer.name} ${targetPlayer.avatar}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    playSynthSound('card');
}

function closeChoiceModal() {
    const modal = document.getElementById('choiceModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function handleTileClick(tileNum) {
    if (isRolling) return;
    pendingTileNumber = tileNum;
    openChoiceModal(tileNum, gameState.turn);
}

function handleUserChoice(choice) {
    closeChoiceModal();
    let selectedType = choice;

    if (choice === 'RANDOM') {
        showToast("🎲 Mengacak takdir tantangan...", "🎰");
        selectedType = Math.random() > 0.5 ? 'TRUTH' : 'DARE';
    }

    drawAndRevealCard(selectedType, pendingTileNumber, choice);
}

function drawAndRevealCard(type, tileNum, userChoice = 'TRUTH') {
    let card = null;

    if (tileNum === 57 && type === 'TRUTH') {
        card = defaultTruthsList.find(c => c.id === 57) || defaultTruthsList[0];
    } else if (tileNum === 21 && type === 'DARE') {
        card = defaultDaresList.find(c => c.id === 21) || defaultDaresList[0];
    } else if (tileNum === 100) {
        card = {
            type: "FINISH",
            category: "Pemenang",
            prompt: "🎉 SELAMAT! Kamu mencapai garis FINISH! Pasanganmu wajib menuruti 1 permintaan spesial darimu hari ini! ❤️"
        };
    } else {
        const pool = type === 'TRUTH' 
            ? defaultTruthsList.concat(customCards.filter(c => c.type === 'TRUTH'))
            : defaultDaresList.concat(customCards.filter(c => c.type === 'DARE'));
        card = pool[Math.floor(Math.random() * pool.length)];
    }

    currentModalCard = card;
    displayCardModal(card, tileNum);

    const pNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const pInfo = pNum === 1 ? gameState.p1Info : gameState.p2Info;
    
    let jumpType = "";
    if (currentMoveContext.jumpDest > 0) {
        jumpType = currentMoveContext.jumpDest > currentMoveContext.nextPos ? "LADDER" : "SNAKE";
    }

    const historyEntry = {
        id: Date.now(),
        turnNumber: gameHistory.length + 1,
        playerNum: pNum,
        playerName: pInfo.name,
        avatar: pInfo.avatar,
        dice: currentMoveContext.dice || gameState.lastDice,
        fromPos: currentMoveContext.fromPos || 1,
        toPos: currentMoveContext.nextPos || tileNum,
        finalPos: currentMoveContext.finalPos || tileNum,
        jumpType: jumpType,
        jumpDest: currentMoveContext.jumpDest || 0,
        skillUsed: currentMoveContext.skillUsed || "",
        choice: userChoice,
        cardType: card.type,
        category: card.category || "Spesial",
        prompt: card.prompt,
        timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    addHistoryEntry(historyEntry);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "SHOW_CARD",
            tile: tileNum,
            cardType: card.type,
            category: card.category,
            prompt: card.prompt,
            targetP: gameState.turn === 2 ? 1 : 2
        }));

        ws.send(JSON.stringify({
            type: "RECORD_HISTORY",
            entry: historyEntry
        }));
    }
}

function displayCardModal(card, tileNum) {
    const modal = document.getElementById('cardModal');
    const badgeNum = document.getElementById('modalBadgeNum');
    const typeTitle = document.getElementById('modalTypeTitle');
    const categoryBadge = document.getElementById('modalCategoryBadge');
    const promptText = document.getElementById('modalPromptText');
    const playerTarget = document.getElementById('modalPlayerTarget');
    const dareTimerContainer = document.getElementById('dareTimerContainer');

    badgeNum.innerText = tileNum;
    typeTitle.innerText = card.type;
    categoryBadge.innerText = card.category || 'Spesial';
    promptText.innerText = `"${card.prompt}"`;

    const activePNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const activeP = activePNum === 1 ? gameState.p1Info : gameState.p2Info;
    const activeSkills = activePNum === 1 ? p1Skills : p2Skills;
    playerTarget.innerText = `Untuk: ${activeP.name} ${activeP.avatar}`;

    // Skill action row in card modal (Skip & Reverse)
    const skillRow = document.getElementById('modalSkillActionRow');
    const skipBtn = document.getElementById('modalSkipBtn');
    const reverseBtn = document.getElementById('modalReverseBtn');
    const skipUsesSpan = document.getElementById('modalSkipUses');
    const reverseUsesSpan = document.getElementById('modalReverseUses');
    const rerollBtnLabel = document.getElementById('reRollBtnLabel');

    let showSkillRow = false;
    if (activeSkills.selected.includes('skip') && activeSkills.uses.skip > 0) {
        skipBtn.classList.remove('hidden');
        skipBtn.classList.add('inline-flex');
        if (skipUsesSpan) skipUsesSpan.innerText = activeSkills.uses.skip;
        showSkillRow = true;
    } else if (skipBtn) {
        skipBtn.classList.add('hidden');
        skipBtn.classList.remove('inline-flex');
    }

    if (activeSkills.selected.includes('uno_reverse') && activeSkills.uses.uno_reverse > 0) {
        reverseBtn.classList.remove('hidden');
        reverseBtn.classList.add('inline-flex');
        if (reverseUsesSpan) reverseUsesSpan.innerText = activeSkills.uses.uno_reverse;
        showSkillRow = true;
    } else if (reverseBtn) {
        reverseBtn.classList.add('hidden');
        reverseBtn.classList.remove('inline-flex');
    }

    if (skillRow) {
        if (showSkillRow) {
            skillRow.classList.remove('hidden');
            skillRow.classList.add('flex');
        } else {
            skillRow.classList.add('hidden');
            skillRow.classList.remove('flex');
        }
    }

    if (rerollBtnLabel) {
        rerollBtnLabel.innerText = `Acak Lagi (${activeSkills.rerollCount})`;
    }

    resetDareTimer();
    if (card.type === 'DARE') {
        dareTimerContainer.classList.remove('hidden');
        dareTimerContainer.classList.add('flex');
    } else {
        dareTimerContainer.classList.add('hidden');
        dareTimerContainer.classList.remove('flex');
    }

    if (card.type === 'TRUTH') {
        badgeNum.className = "w-12 h-12 rounded-2xl bg-teal-500 border-3 border-[#3D2216] flex items-center justify-center text-xl font-extrabold text-white shadow-md";
        typeTitle.className = "text-2xl font-black tracking-wider text-teal-600";
    } else if (card.type === 'DARE') {
        badgeNum.className = "w-12 h-12 rounded-2xl bg-rose-500 border-3 border-[#3D2216] flex items-center justify-center text-xl font-extrabold text-white shadow-md";
        typeTitle.className = "text-2xl font-black tracking-wider text-rose-600";
    } else {
        badgeNum.className = "w-12 h-12 rounded-2xl bg-amber-500 border-3 border-[#3D2216] flex items-center justify-center text-xl font-extrabold text-white shadow-md";
        typeTitle.className = "text-2xl font-black tracking-wider text-amber-600";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    playSynthSound('card');

    if (tileNum === 100) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
}

function closeCardModal() {
    resetDareTimer();
    const modal = document.getElementById('cardModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "CLOSE_MODAL" }));
    }
}

function completeCardModal() {
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
    playSynthSound('reaction');
    showToast("Tantangan Selesai Dilakukan! 🎉", "✅");
    closeCardModal();
}

function copyCardPrompt() {
    if (!currentModalCard) return;
    navigator.clipboard.writeText(currentModalCard.prompt).then(() => {
        showToast("Teks berhasil disalin! Silakan kirim ke chat WA / Zoom ❤️", "📋");
    });
}

// DARE COUNTDOWN TIMER
function toggleDareTimer() {
    const btn = document.getElementById('timerToggleBtn');
    if (dareTimerInterval) {
        clearInterval(dareTimerInterval);
        dareTimerInterval = null;
        if (btn) btn.innerText = "Lanjut";
    } else {
        if (btn) btn.innerText = "Jeda";
        dareTimerInterval = setInterval(() => {
            dareSecondsLeft--;
            updateTimerUI();
            if (dareSecondsLeft <= 0) {
                clearInterval(dareTimerInterval);
                dareTimerInterval = null;
                if (btn) btn.innerText = "Selesai";
                playSynthSound('ladder');
                showToast("⏱️ Waktu Habis! Tantangan Selesai!", "⏰");
            }
        }, 1000);
    }
}

function resetDareTimer() {
    if (dareTimerInterval) {
        clearInterval(dareTimerInterval);
        dareTimerInterval = null;
    }
    dareSecondsLeft = 30;
    const btn = document.getElementById('timerToggleBtn');
    if (btn) btn.innerText = "Mulai";
    updateTimerUI();
}

function updateTimerUI() {
    const disp = document.getElementById('dareTimerDisplay');
    if (!disp) return;
    const s = dareSecondsLeft % 60;
    disp.innerText = `00:${s < 10 ? '0' : ''}${s}`;
}

// SUIT BATU-GUNTING-KERTAS
function playSuit() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "SUIT" }));
    } else {
        const opts = [
            "✊ Batu vs ✌️ Gunting (Pemain 1 Menang & Jalan Duluan! 🚀)",
            "✋ Kertas vs ✊ Batu (Pemain 1 Menang & Jalan Duluan! 🚀)",
            "✌️ Gunting vs ✋ Kertas (Pemain 1 Menang & Jalan Duluan! 🚀)",
            "✌️ Gunting vs ✊ Batu (Pemain 2 Menang & Jalan Duluan! 🚀)",
            "✊ Batu vs ✋ Kertas (Pemain 2 Menang & Jalan Duluan! 🚀)",
            "✋ Kertas vs ✌️ Gunting (Pemain 2 Menang & Jalan Duluan! 🚀)",
            "🤝 Seri! Batu vs Batu (Suit sekali lagi yuk!)"
        ];
        const res = opts[Math.floor(Math.random() * opts.length)];
        handleSuitResult(res);
    }
}

function handleSuitResult(res) {
    playSynthSound('dice');
    if (res.includes("Pemain 1")) gameState.turn = 1;
    if (res.includes("Pemain 2")) gameState.turn = 2;
    updatePawnsUI();

    const statusEl = document.getElementById('statusMessage');
    if (statusEl) statusEl.innerText = res;
    showToast(res, "✊");
}

// FLOATING REACTIONS
function sendReaction(emoji) {
    spawnFloatingEmoji(emoji);
    playSynthSound('reaction');
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "REACTION",
            emoji: emoji,
            sender: gameState.turn === 1 ? gameState.p1Info.name : gameState.p2Info.name
        }));
    }
}

function spawnFloatingEmoji(emoji) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.innerText = emoji;
    el.style.left = `${Math.floor(Math.random() * 65) + 18}%`;
    el.style.bottom = '90px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

// KELOLA DECK & CUSTOM CARDS
function openDeckModal() {
    document.getElementById('deckModal').classList.remove('hidden');
    document.getElementById('deckModal').classList.add('flex');
    switchDeckTab('add');
    renderCardList();
}

function closeDeckModal() {
    document.getElementById('deckModal').classList.add('hidden');
    document.getElementById('deckModal').classList.remove('flex');
}

function switchDeckTab(tab) {
    const btnAdd = document.getElementById('tabBtnAdd');
    const btnList = document.getElementById('tabBtnList');
    const btnExport = document.getElementById('tabBtnExport');
    const tabAdd = document.getElementById('deckTabAdd');
    const tabList = document.getElementById('deckTabList');
    const tabExport = document.getElementById('deckTabExport');

    [btnAdd, btnList, btnExport].forEach(b => b.className = "px-4 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200");
    [tabAdd, tabList, tabExport].forEach(t => t.classList.add('hidden'));

    if (tab === 'add') {
        btnAdd.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        tabAdd.classList.remove('hidden');
    } else if (tab === 'list') {
        btnList.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        tabList.classList.remove('hidden');
        tabList.classList.add('flex');
        renderCardList();
    } else if (tab === 'export') {
        btnExport.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        tabExport.classList.remove('hidden');
        populateExportJson();
    }
}

function updateDeckCountBadge() {
    const total = defaultTruthsList.length + defaultDaresList.length + customCards.length;
    const badge = document.getElementById('deckTotalCount');
    if (badge) badge.innerText = total;
    const tabCount = document.getElementById('tabCountSpan');
    if (tabCount) tabCount.innerText = total;
}

function saveCustomCard() {
    const type = document.getElementById('newCardType').value;
    const cat = document.getElementById('newCardCat').value;
    const prompt = document.getElementById('newCardPrompt').value.trim();

    if (!prompt) {
        showToast("Tulis pertanyaan/tantangan terlebih dahulu!", "⚠️");
        return;
    }

    const newCard = {
        id: Date.now(),
        type: type,
        category: cat,
        prompt: prompt,
        isCustom: true
    };

    customCards.push(newCard);
    localStorage.setItem('couple_ut_custom_cards', JSON.stringify(customCards));
    document.getElementById('newCardPrompt').value = '';

    updateDeckCountBadge();
    playSynthSound('reaction');
    showToast(`Kartu ${type} baru berhasil ditambahkan! 🎉`, "✅");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "ADD_CUSTOM_CARD",
            cardType: type,
            category: cat,
            prompt: prompt
        }));
    }
}

function deleteCustomCard(id) {
    customCards = customCards.filter(c => c.id !== id);
    localStorage.setItem('couple_ut_custom_cards', JSON.stringify(customCards));
    updateDeckCountBadge();
    renderCardList();
    showToast("Kartu berhasil dihapus dari deck.", "🗑️");
}

function renderCardList() {
    const container = document.getElementById('cardListContainer');
    if (!container) return;
    const search = document.getElementById('deckSearchInput').value.toLowerCase();
    const filterType = document.getElementById('deckFilterType').value;

    let all = [...defaultTruthsList, ...defaultDaresList, ...customCards];

    if (filterType === 'TRUTH') all = all.filter(c => c.type === 'TRUTH');
    else if (filterType === 'DARE') all = all.filter(c => c.type === 'DARE');
    else if (filterType === 'CUSTOM') all = all.filter(c => c.isCustom);

    if (search) {
        all = all.filter(c => c.prompt.toLowerCase().includes(search) || c.category.toLowerCase().includes(search));
    }

    container.innerHTML = '';
    if (all.length === 0) {
        container.innerHTML = `<div class="p-6 text-center text-xs text-stone-500 font-bold">Tidak ada kartu yang cocok dengan pencarian.</div>`;
        return;
    }

    all.forEach((c) => {
        const isTruth = c.type === 'TRUTH';
        container.innerHTML += `
            <div class="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3 shadow-xs">
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${isTruth ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                        ${c.type}
                    </span>
                    <span class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">${c.category}</span>
                    <p class="text-xs text-slate-800 font-medium line-clamp-2">${c.prompt}</p>
                </div>
                ${c.isCustom ? `
                    <button onclick="deleteCustomCard(${c.id})" class="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-md">
                        Hapus
                    </button>
                ` : `
                    <span class="text-[10px] text-stone-400 font-semibold italic">Default</span>
                `}
            </div>
        `;
    });
}

function filterCardList() {
    renderCardList();
}

function populateExportJson() {
    const data = {
        truthCount: defaultTruthsList.length,
        dareCount: defaultDaresList.length,
        customCards: customCards
    };
    document.getElementById('deckJsonArea').value = JSON.stringify(data, null, 2);
}

function exportDeckJson() {
    populateExportJson();
    const textarea = document.getElementById('deckJsonArea');
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
        showToast("JSON Deck disalin ke clipboard! Kirim ke pasanganmu ❤️", "📋");
    });
}

function importDeckJson() {
    try {
        const raw = document.getElementById('deckJsonArea').value;
        const parsed = JSON.parse(raw);
        if (parsed.customCards && Array.isArray(parsed.customCards)) {
            customCards = parsed.customCards;
            localStorage.setItem('couple_ut_custom_cards', JSON.stringify(customCards));
            updateDeckCountBadge();
            renderCardList();
            showToast("Custom deck berhasil di-import! ✅", "🎉");
        } else {
            showToast("Format JSON tidak valid!", "⚠️");
        }
    } catch (e) {
        showToast("Gagal membaca JSON: " + e.message, "❌");
    }
}

function resetDeckToDefault() {
    customCards = [];
    localStorage.removeItem('couple_ut_custom_cards');
    updateDeckCountBadge();
    renderCardList();
    populateExportJson();
    showToast("Deck dikembalikan ke default 75 Truth & 75 Dare!", "🔄");
}

// PENGATURAN PEMAIN & AVATAR
function openPlayerModal() {
    document.getElementById('playerModal').classList.remove('hidden');
    document.getElementById('playerModal').classList.add('flex');
    document.getElementById('p1NameInput').value = gameState.p1Info.name;
    document.getElementById('p1AvatarSelect').value = gameState.p1Info.avatar;
    document.getElementById('p2NameInput').value = gameState.p2Info.name;
    document.getElementById('p2AvatarSelect').value = gameState.p2Info.avatar;
}

function closePlayerModal() {
    document.getElementById('playerModal').classList.add('hidden');
    document.getElementById('playerModal').classList.remove('flex');
}

function savePlayerSettings() {
    gameState.p1Info.name = document.getElementById('p1NameInput').value.trim() || "Pemain 1";
    gameState.p1Info.avatar = document.getElementById('p1AvatarSelect').value;
    gameState.p2Info.name = document.getElementById('p2NameInput').value.trim() || "Pemain 2";
    gameState.p2Info.avatar = document.getElementById('p2AvatarSelect').value;

    localStorage.setItem('couple_ut_p1', JSON.stringify(gameState.p1Info));
    localStorage.setItem('couple_ut_p2', JSON.stringify(gameState.p2Info));

    updatePlayerDisplays();
    updatePawnsUI();
    closePlayerModal();
    showToast("Pengaturan pemain berhasil disimpan! ✅", "👥");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "UPDATE_PLAYERS",
            p1: gameState.p1Info,
            p2: gameState.p2Info
        }));
    }
}

function updatePlayerDisplays() {
    const p1N = document.getElementById('p1NameDisplay');
    const p1A = document.getElementById('p1AvatarDisplay');
    const p2N = document.getElementById('p2NameDisplay');
    const p2A = document.getElementById('p2AvatarDisplay');

    if (p1N) p1N.innerText = gameState.p1Info.name;
    if (p1A) p1A.innerText = gameState.p1Info.avatar;
    if (p2N) p2N.innerText = gameState.p2Info.name;
    if (p2A) p2A.innerText = gameState.p2Info.avatar;
}

function manualMovePrompt(playerNum) {
    const pName = playerNum === 1 ? gameState.p1Info.name : gameState.p2Info.name;
    const target = prompt(`Pindahkan pion ${pName} ke kotak nomor berapa (1 - 100)?`);
    const num = parseInt(target);
    if (!isNaN(num) && num >= 1 && num <= 100) {
        if (playerNum === 1) gameState.p1Pos = num;
        else gameState.p2Pos = num;
        updatePawnsUI();
        pendingTileNumber = num;
        openChoiceModal(num, playerNum);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "MOVE_PAWN", player: playerNum, pos: num }));
        }
    }
}

function promptResetGame() {
    if (confirm("Reset ulang permainan ke Kotak 1, bersihkan seluruh riwayat langkah, dan isi ulang semua skill?")) {
        gameState.p1Pos = 1;
        gameState.p2Pos = 1;
        gameState.turn = 1;
        gameHistory = [];
        localStorage.removeItem('couple_ut_history');
        resetPlayerSkillsToFull();
        updatePawnsUI();
        renderHistoryUI();
        renderSkillsUI();
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) statusEl.innerText = "🔄 Permainan di-reset ke garis START (Kotak 1). Riwayat langkah dibersihkan & kuota skill terisi penuh!";
        showToast("Posisi pemain, riwayat & kuota skill berhasil di-reset!", "🔄");

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "RESET" }));
        }
    }
}

// RIWAYAT PERMAINAN (HISTORY LOG)
function addHistoryEntry(entry) {
    gameHistory.push(entry);
    localStorage.setItem('couple_ut_history', JSON.stringify(gameHistory));
    renderHistoryUI();
}

function renderHistoryUI() {
    const count = gameHistory.length;
    const headerCount = document.getElementById('historyHeaderCount');
    const miniCount = document.getElementById('historyMiniCount');
    const modalTotalCount = document.getElementById('historyModalTotalCount');

    if (headerCount) headerCount.innerText = count;
    if (miniCount) miniCount.innerText = count;
    if (modalTotalCount) modalTotalCount.innerText = count;

    // Mini-list di sidebar
    const miniList = document.getElementById('historyMiniList');
    if (miniList) {
        if (count === 0) {
            miniList.innerHTML = `<p class="text-[11px] text-stone-400 italic text-center py-2">Belum ada langkah. Kocok dadu untuk mulai mencatat riwayat!</p>`;
        } else {
            miniList.innerHTML = '';
            const recentMoves = gameHistory.slice(-3).reverse();
            recentMoves.forEach(h => {
                const isTruth = h.cardType === 'TRUTH';
                let jumpBadge = '';
                if (h.jumpType === 'LADDER') {
                    jumpBadge = `<span class="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-extrabold border border-amber-300">🪜 Naik ke ${h.finalPos}</span>`;
                } else if (h.jumpType === 'SNAKE') {
                    jumpBadge = `<span class="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-extrabold border border-emerald-300">🐍 Turun ke ${h.finalPos}</span>`;
                } else if (h.jumpType === 'SKILL') {
                    jumpBadge = `<span class="bg-purple-100 text-purple-900 text-[9px] px-1.5 py-0.5 rounded font-extrabold border border-purple-300">⚡ Skill</span>`;
                }

                let skillBadge = h.skillUsed ? `<span class="bg-indigo-100 text-indigo-900 text-[9px] px-1.5 py-0.5 rounded font-bold border border-indigo-200">⚡ ${h.skillUsed}</span>` : '';

                miniList.innerHTML += `
                    <div class="p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px]">
                        <div class="flex items-center justify-between font-bold mb-0.5">
                            <span class="flex items-center gap-1">${h.avatar} ${h.playerName}</span>
                            <span class="text-[10px] text-stone-400 font-mono">${h.timeStr}</span>
                        </div>
                        <div class="flex items-center gap-1 text-[10px] text-slate-600 mb-1 flex-wrap">
                            <span>🎲 Dadu ${h.dice} (${h.fromPos} ➔ ${h.toPos})</span>
                            ${jumpBadge}
                            ${skillBadge}
                        </div>
                        <div class="bg-white p-1.5 rounded-lg border border-stone-100 text-slate-700">
                            <span class="font-extrabold ${isTruth ? 'text-teal-700' : 'text-rose-700'}">[${h.choice}: ${h.category}]</span>
                            <span class="italic line-clamp-1">"${h.prompt}"</span>
                        </div>
                    </div>
                `;
            });
        }
    }

    // Modal List Lengkap
    const modalList = document.getElementById('historyModalList');
    if (modalList) {
        if (count === 0) {
            modalList.innerHTML = `<p class="text-xs text-stone-400 italic text-center py-8">Belum ada riwayat langkah. Kocok dadu dan selesaikan tantangan untuk mulai mencatat riwayat!</p>`;
        } else {
            modalList.innerHTML = '';
            const allMovesReversed = [...gameHistory].reverse();
            allMovesReversed.forEach((h, idx) => {
                const stepNum = count - idx;
                const isTruth = h.cardType === 'TRUTH';
                let jumpBadge = '';
                if (h.jumpType === 'LADDER') {
                    jumpBadge = `<span class="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-amber-300">🪜 Naik Tangga ke Kotak ${h.finalPos}</span>`;
                } else if (h.jumpType === 'SNAKE') {
                    jumpBadge = `<span class="bg-emerald-100 text-emerald-900 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-emerald-300">🐍 Digigit Ular turun ke Kotak ${h.finalPos}</span>`;
                } else if (h.jumpType === 'SKILL') {
                    jumpBadge = `<span class="bg-purple-100 text-purple-900 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-purple-300">⚡ Aksi Skill</span>`;
                }

                let skillBadge = h.skillUsed ? `<span class="bg-indigo-100 text-indigo-900 text-[10px] px-2 py-0.5 rounded-md font-bold border border-indigo-200">⚡ ${h.skillUsed}</span>` : '';

                modalList.innerHTML += `
                    <div class="p-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 text-xs shadow-xs space-y-1.5">
                        <div class="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                            <div class="flex items-center gap-2">
                                <span class="bg-[#3D2216] text-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">#${stepNum}</span>
                                <span class="font-bold text-slate-800 text-sm flex items-center gap-1">${h.avatar} ${h.playerName}</span>
                            </div>
                            <span class="text-[10px] text-stone-400 font-mono font-bold">${h.timeStr}</span>
                        </div>

                        <div class="flex items-center gap-2 text-[11px] text-slate-600 font-semibold flex-wrap">
                            <span class="bg-white px-2 py-0.5 rounded border border-stone-200">🎲 Dadu: <b>${h.dice}</b> (Kotak ${h.fromPos} ➔ ${h.toPos})</span>
                            ${jumpBadge}
                            ${skillBadge}
                        </div>

                        <div class="p-2.5 rounded-xl bg-white border border-stone-200/80">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${isTruth ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                                    PILIHAN: ${h.choice}
                                </span>
                                <span class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    ${h.category}
                                </span>
                            </div>
                            <p class="text-xs text-slate-800 font-medium leading-relaxed italic">
                                "${h.prompt}"
                            </p>
                        </div>
                    </div>
                `;
            });
        }
    }
}

function openHistoryModal() {
    renderHistoryUI();
    const modal = document.getElementById('historyModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    playSynthSound('card');
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function copyHistorySummary() {
    if (gameHistory.length === 0) {
        showToast("Belum ada riwayat untuk disalin!", "⚠️");
        return;
    }
    let text = "📜 RANGKUMAN RIWAYAT ULAR TANGGA CINTA 💕\n";
    text += "========================================\n\n";
    gameHistory.forEach((h, i) => {
        text += `Langkah #${i + 1} • ${h.playerName} ${h.avatar}\n`;
        text += `🎲 Dadu: ${h.dice} (Kotak ${h.fromPos} ➔ ${h.toPos})`;
        if (h.jumpType === 'LADDER') text += ` ➔ 🪜 Naik ke ${h.finalPos}!`;
        if (h.jumpType === 'SNAKE') text += ` ➔ 🐍 Turun ke ${h.finalPos}!`;
        if (h.jumpType === 'SKILL') text += ` ➔ ⚡ ${h.category}!`;
        if (h.skillUsed) text += ` [Skill: ${h.skillUsed}]`;
        text += `\nPilihan: ${h.choice} [${h.category}]\n`;
        text += `"${h.prompt}"\n\n`;
    });
    text += "========================================\nMain seru bareng di Ular Tangga Cinta!";

    navigator.clipboard.writeText(text).then(() => {
        showToast("Rangkuman riwayat berhasil disalin ke clipboard! ❤️", "📋");
    });
}

// WEBSOCKET SYNC
function connectWebSocket() {
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "STATE_UPDATE" && data.state) {
                gameState.p1Pos = data.state.p1Pos;
                gameState.p2Pos = data.state.p2Pos;
                gameState.turn = data.state.turn;
                gameState.lastDice = data.state.lastDice;
                if (data.state.p1Info) gameState.p1Info = data.state.p1Info;
                if (data.state.p2Info) gameState.p2Info = data.state.p2Info;
                if (data.state.p1Skills) p1Skills = data.state.p1Skills;
                if (data.state.p2Skills) p2Skills = data.state.p2Skills;
                savePlayerSkillsLocally();
                if (data.state.history !== undefined) {
                    gameHistory = data.state.history || [];
                    localStorage.setItem('couple_ut_history', JSON.stringify(gameHistory));
                    renderHistoryUI();
                }
                updatePlayerDisplays();
                updatePawnsUI();
                renderSkillsUI();
            } else if (data.type === "DICE_ROLLED") {
                handleDiceRollSequence(data);
            } else if (data.type === "CARD_REVEALED" && data.card) {
                displayCardModal(data.card, data.card.tile);
            } else if (data.type === "SKILL_ACTIVATED") {
                playSynthSound('reaction');
                const pName = data.player === 1 ? gameState.p1Info.name : gameState.p2Info.name;
                const skillObj = AVAILABLE_SKILLS.find(s => s.id === data.skill);
                const skillTitle = skillObj ? skillObj.name : data.skill;
                showToast(`⚡ ${pName} mengaktifkan: ${skillTitle}!`, "⚡");
                if (data.state) {
                    if (data.state.p1Skills) p1Skills = data.state.p1Skills;
                    if (data.state.p2Skills) p2Skills = data.state.p2Skills;
                    savePlayerSkillsLocally();
                    renderSkillsUI();
                }
            } else if (data.type === "HISTORY_UPDATED") {
                if (data.history) {
                    gameHistory = data.history;
                } else if (data.entry) {
                    gameHistory.push(data.entry);
                }
                localStorage.setItem('couple_ut_history', JSON.stringify(gameHistory));
                renderHistoryUI();
            } else if (data.type === "MODAL_CLOSED") {
                const modal = document.getElementById('cardModal');
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            } else if (data.type === "SUIT_RESULT") {
                handleSuitResult(data.result);
            } else if (data.type === "FLOATING_REACTION") {
                spawnFloatingEmoji(data.emoji);
                playSynthSound('reaction');
            }
        };

        ws.onclose = () => {
            console.log("WebSocket terputus. Bermain offline.");
        };
    } catch (e) {
        console.log("Mode offline (tanpa WebSocket server).");
    }
}

window.addEventListener('DOMContentLoaded', initGame);
