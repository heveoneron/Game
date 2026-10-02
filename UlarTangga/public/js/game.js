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
    p2Info: { name: "Pemain 2 (Cewek)", avatar: "🧕", color: "#FB923C" },
    selectedDecks: JSON.parse(localStorage.getItem('couple_ut_selected_decks') || 'null') || [
        'WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'
    ],
    playMode: localStorage.getItem('couple_ut_play_mode') || 'ONLINE', // 'ONLINE' (Video Call/LDR), 'OFFLINE' (Ketemu Langsung), 'ALL' (Campuran)
    mysteryTiles: [],
    usedCardIds: [],
    isGameOver: false,
    winnerNum: 0
};

// ================= MODE PERMAINAN (ONLINE / LDR vs OFFLINE KETEMU LANGSUNG) =================
function onPlayModeChange(mode) {
    if (!mode) return;
    gameState.playMode = mode;
    localStorage.setItem('couple_ut_play_mode', mode);
    updatePlayModeUI();
    showToast(`Mode permainan diubah ke: ${getPlayModeLabel(mode)}!`, "🕹️");

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "UPDATE_PLAY_MODE",
            playMode: mode
        }));
    }
}

function togglePlayModeQuick() {
    const current = gameState.playMode || 'ONLINE';
    let next = 'ONLINE';
    if (current === 'ONLINE') next = 'OFFLINE';
    else if (current === 'OFFLINE') next = 'ALL';
    else next = 'ONLINE';

    onPlayModeChange(next);
}

function getPlayModeLabel(mode) {
    if (mode === 'ONLINE') return '📹 Video Call / LDR';
    if (mode === 'OFFLINE') return '💑 Ketemu Langsung';
    return '🔄 Semua Mode (Campuran)';
}

function updatePlayModeUI() {
    const mode = gameState.playMode || 'ONLINE';
    const headerBtn = document.getElementById('playModeHeaderBtn');
    const headerIcon = document.getElementById('playModeHeaderIcon');
    const headerText = document.getElementById('playModeHeaderText');
    const statusBadge = document.getElementById('playModeStatusBadge');

    if (headerBtn) {
        if (mode === 'ONLINE') {
            headerBtn.className = "wood-btn bg-purple-100 hover:bg-purple-200 text-purple-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs";
            if (headerIcon) headerIcon.innerText = "📹";
            if (headerText) headerText.innerText = "Mode: Video Call";
        } else if (mode === 'OFFLINE') {
            headerBtn.className = "wood-btn bg-rose-100 hover:bg-rose-200 text-rose-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs";
            if (headerIcon) headerIcon.innerText = "💑";
            if (headerText) headerText.innerText = "Mode: Ketemu Langsung";
        } else {
            headerBtn.className = "wood-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs";
            if (headerIcon) headerIcon.innerText = "🔄";
            if (headerText) headerText.innerText = "Mode: Semua Mode";
        }
    }

    if (statusBadge) {
        if (mode === 'ONLINE') {
            statusBadge.className = "text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold";
            statusBadge.innerText = "📹 Video Call (Aktif)";
        } else if (mode === 'OFFLINE') {
            statusBadge.className = "text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold";
            statusBadge.innerText = "💑 Ketemu Langsung (Aktif)";
        } else {
            statusBadge.className = "text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold";
            statusBadge.innerText = "🔄 Semua Mode (Aktif)";
        }
    }

    // Update radio button dan visual card di dalam modal deck
    ['ONLINE', 'OFFLINE', 'ALL'].forEach(m => {
        const card = document.getElementById(`modeCard_${m}`);
        const radio = document.querySelector(`input[name="playModeRadio"][value="${m}"]`);
        if (radio) radio.checked = (m === mode);
        if (card) {
            if (m === mode) {
                card.className = "p-2.5 rounded-xl border-2 border-purple-500 bg-purple-100/90 cursor-pointer flex flex-col justify-between transition shadow-xs";
            } else {
                card.className = "p-2.5 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 cursor-pointer flex flex-col justify-between transition shadow-xs";
            }
        }
    });
}

// 20 Petak Takdir Rahasia (Forced Random) - Tampilannya sama persis seperti petak lain di papan
function generateOfflineMysteryTiles() {
    const candidates = [];
    for (let i = 2; i <= 99; i++) {
        if (i !== 21 && i !== 57) {
            candidates.push(i);
        }
    }
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const picked = candidates.slice(0, 20).sort((a, b) => a - b);
    localStorage.setItem('couple_ut_mystery_tiles', JSON.stringify(picked));
    return picked;
}

function getMysteryTiles() {
    if (gameState.mysteryTiles && gameState.mysteryTiles.length > 0) {
        return gameState.mysteryTiles;
    }
    const stored = localStorage.getItem('couple_ut_mystery_tiles');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                gameState.mysteryTiles = parsed;
                return gameState.mysteryTiles;
            }
        } catch (e) {}
    }
    gameState.mysteryTiles = generateOfflineMysteryTiles();
    return gameState.mysteryTiles;
}

function isForcedRandomTile(tileNum) {
    if (tileNum <= 1 || tileNum >= 100 || tileNum === 21 || tileNum === 57) return false;
    const list = getMysteryTiles();
    return list.includes(tileNum);
}

const savedP1 = localStorage.getItem('couple_ut_p1');
const savedP2 = localStorage.getItem('couple_ut_p2');
if (savedP1) gameState.p1Info = JSON.parse(savedP1);
if (savedP2) gameState.p2Info = JSON.parse(savedP2);

let isRolling = false;
let didInitiateRoll = false;
let isAudioMuted = localStorage.getItem('couple_ut_muted') === 'true';
let ws = null;
let dareTimerInterval = null;
let dareSecondsLeft = 30;
let pendingTileNumber = 1;
let currentModalCard = null;

// ROOM MANAGEMENT & MULTI-SESSION
let currentRoomCode = "PUBLIC";

function getInitialRoomCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomQuery = urlParams.get('room');
    if (roomQuery && roomQuery.trim()) {
        return roomQuery.trim().toUpperCase();
    }
    const stored = localStorage.getItem('couple_ut_room_code');
    if (stored && stored.trim()) {
        return stored.trim().toUpperCase();
    }
    return "PUBLIC";
}

function updateRoomDisplayUI() {
    const headerDisplay = document.getElementById('currentRoomDisplay');
    const modalDisplay = document.getElementById('modalCurrentRoomCode');
    if (headerDisplay) headerDisplay.innerText = currentRoomCode;
    if (modalDisplay) modalDisplay.innerText = currentRoomCode;

    // Update URL agar bisa langsung disalin dari address bar tanpa reload
    if (currentRoomCode && currentRoomCode !== 'PUBLIC') {
        const newUrl = `${window.location.pathname}?room=${currentRoomCode}`;
        window.history.replaceState({ room: currentRoomCode }, '', newUrl);
    } else if (currentRoomCode === 'PUBLIC') {
        window.history.replaceState({}, '', window.location.pathname);
    }
}

function copyRoomShareLink() {
    let link = "";
    if (currentRoomCode === 'PUBLIC') {
        link = `${window.location.origin}${window.location.pathname}`;
    } else {
        link = `${window.location.origin}${window.location.pathname}?room=${currentRoomCode}`;
    }
    navigator.clipboard.writeText(link).then(() => {
        showToast(`Link Room [${currentRoomCode}] berhasil disalin! Kirimkan ke pasanganmu ❤️`, "📋");
    }).catch(() => {
        prompt("Salin link room berikut untuk pasanganmu:", link);
    });
}

function openRoomModal() {
    updateRoomDisplayUI();
    const modal = document.getElementById('roomModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeRoomModal() {
    const modal = document.getElementById('roomModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

async function createNewRoomAction() {
    try {
        const res = await fetch('/api/create-room');
        const data = await res.json();
        if (data && data.roomCode) {
            joinRoomAction(data.roomCode);
            showToast(`Room baru [${data.roomCode}] siap dimainkan! Bagikan link ke pasanganmu 🚀`, "🎉");
            copyRoomShareLink();
        } else {
            const offlineCode = "ROM" + Math.floor(1000 + Math.random() * 9000);
            joinRoomAction(offlineCode);
            showToast(`Room [${offlineCode}] dibuat secara lokal!`, "🎉");
        }
    } catch (e) {
        const offlineCode = "ROM" + Math.floor(1000 + Math.random() * 9000);
        joinRoomAction(offlineCode);
        showToast(`Room [${offlineCode}] dibuat!`, "🎉");
    }
}

function joinRoomFromInput() {
    const input = document.getElementById('joinRoomInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast("Masukkan kode room terlebih dahulu!", "⚠️");
        return;
    }
    joinRoomAction(code);
    input.value = '';
}

function joinRoomAction(code) {
    code = code.trim().toUpperCase();
    currentRoomCode = code;
    localStorage.setItem('couple_ut_room_code', currentRoomCode);
    updateRoomDisplayUI();
    closeRoomModal();

    // Reset local view sebelum sync room baru
    gameState.p1Pos = 1;
    gameState.p2Pos = 1;
    gameHistory = [];
    updatePawnsUI();
    renderHistoryUI();

    // Reconnect WebSocket ke room baru
    connectWebSocket();
    showToast(`Berhasil masuk ke Room [${code}]! Menyinkronkan... ✨`, "🏠");
}

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
    currentRoomCode = getInitialRoomCode();
    updateRoomDisplayUI();
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
    getMysteryTiles();
    updateDeckCountBadge();
    updatePlayModeUI();
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
function updatePawnsUI(hoppingPawnNum = 0) {
    document.querySelectorAll('[id^="pawn-container-"]').forEach(el => el.innerHTML = '');

    const p1Container = document.getElementById(`pawn-container-${gameState.p1Pos}`);
    const p2Container = document.getElementById(`pawn-container-${gameState.p2Pos}`);

    if (p1Container) {
        const isHop = hoppingPawnNum === 1 ? 'pawn-hop' : '';
        p1Container.innerHTML += `
            <div id="pawn-p1" class="pawn ${isHop} bg-sky-400 border-2 border-white shadow-md hover:scale-115" title="${gameState.p1Info.name}">
                ${gameState.p1Info.avatar}
            </div>
        `;
    }

    if (p2Container) {
        const isHop = hoppingPawnNum === 2 ? 'pawn-hop' : '';
        p2Container.innerHTML += `
            <div id="pawn-p2" class="pawn ${isHop} bg-orange-400 border-2 border-white shadow-md hover:scale-115" title="${gameState.p2Info.name}">
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
    if (gameState.isGameOver) {
        showToast("Permainan telah selesai! Klik 'Main Game Baru' untuk memulai ronde baru.", "🏆");
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        return;
    }
    if (isRolling) return;
    didInitiateRoll = true;
    isRolling = true;
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = true;

    // Safety watchdog: cegah tombol macet permanen jika jaringan/server bermasalah (15 detik)
    setTimeout(() => {
        if (isRolling) {
            console.warn("Watchdog: Membuka kunci tombol dadu setelah timeout.");
            isRolling = false;
            const btn = document.getElementById('rollDiceBtn');
            if (btn && !gameState.isGameOver) btn.disabled = false;
        }
    }, 15000);

    const pNum = gameState.turn;
    const pSkills = pNum === 1 ? p1Skills : p2Skills;
    const isDouble = isDoubleRollActive;
    const willUseShield = pSkills?.uses?.snake_shield > 0;

    if (ws && ws.readyState === WebSocket.OPEN) {
        if (isDoubleRollActive) {
            if (pSkills?.uses?.double_roll !== undefined) pSkills.uses.double_roll--;
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
                if (pSkills?.uses?.snake_shield > 0) {
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
            if (pSkills?.uses?.double_roll !== undefined) pSkills.uses.double_roll--;
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
            isDoubleRoll: isDouble,
            isGameOver: finalPos >= 100,
            winnerNum: finalPos >= 100 ? pNum : 0
        });
    }
}

async function handleDiceRollSequence(data) {
    try {
        const diceFace = document.getElementById('diceFace');
        const diceBigNumber = document.getElementById('diceBigNumber');
        const diceSubtext = document.getElementById('diceSubtext');
        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        if (diceFace) {
            diceFace.classList.add('dice-rolling');
            diceFace.classList.remove('dice-revealed');
        }
        playSynthSound('dice');

        let count = 0;
        // Kocokan dadu berputar ~1.1 detik (14 pergantian tiap 80ms)
        const rollInterval = setInterval(() => {
            const randVal = Math.floor(Math.random() * 6) + 1;
            if (diceFace) diceFace.innerText = diceFaces[randVal - 1];
            if (diceBigNumber) diceBigNumber.innerText = randVal;
            count++;
            if (count >= 14) {
                clearInterval(rollInterval);
                if (diceFace) {
                    diceFace.classList.remove('dice-rolling');
                    diceFace.innerText = diceFaces[(data.dice || 1) - 1];
                    diceFace.classList.add('dice-revealed');
                }
                if (diceBigNumber) {
                    diceBigNumber.innerText = data.dice || 1;
                }
                if (diceSubtext) {
                    diceSubtext.innerText = `Dadu ${data.dice || 1}`;
                }
                
                // Jeda 650ms agar pemain dapat melihat jelas angka dadu sebelum pion mulai melangkah
                setTimeout(() => {
                    executePawnHopping(data);
                }, 650);
            }
        }, 80);
    } catch (e) {
        console.error("Gagal menjalankan sequence animasi dadu:", e);
        isRolling = false;
        const rollBtn = document.getElementById('rollDiceBtn');
        if (rollBtn && !gameState.isGameOver) rollBtn.disabled = false;
    }
}

async function executePawnHopping(data) {
    const pNum = data.player;
    const pInfo = pNum === 1 ? gameState.p1Info : gameState.p2Info;
    let current = data.fromPos;
    const target = data.nextPos;

    try {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.innerText = `🎲 ${pInfo.name} dapat angka ${data.dice}! Melangkah ke kotak ${target}...`;
        }

        // Animasi langkah per petak (diperlambat ke 420ms per petak agar jelas terlihat)
        while (current < target) {
            current++;
            if (pNum === 1) gameState.p1Pos = current;
            else gameState.p2Pos = current;

            updatePawnsUI(pNum);
            playSynthSound('hop');
            await new Promise(res => setTimeout(res, 420));
        }

        // Hapus efek loncat pion dan beri jeda 450ms di petak singgah
        updatePawnsUI(0);
        await new Promise(res => setTimeout(res, 450));

        // Cek Ular / Tangga / Perisai
        if (data.isShielded) {
            playSynthSound('reaction');
            if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
            if (statusEl) statusEl.innerText = `🛡️ PERISAI KEBISAN AKTIF! ${pInfo.name} kebal dari gigitan ular di kotak ${target}!`;
            showToast(`🛡️ PERISAI KEBISAN AKTIF! ${pInfo.name} kebal dari ular!`, "🛡️");
            await new Promise(res => setTimeout(res, 700));
        } else if (data.jumpDest > 0) {
            await new Promise(res => setTimeout(res, 350));
            if (data.jumpDest > target) {
                playSynthSound('ladder');
                if (statusEl) statusEl.innerText = `🪜 WOW! ${pInfo.name} naik tangga dari kotak ${target} ke kotak ${data.jumpDest}!`;
                if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
            } else {
                playSynthSound('snake');
                if (statusEl) statusEl.innerText = `🐍 OUCH! ${pInfo.name} digigit ular di kotak ${target}, turun ke kotak ${data.jumpDest}!`;
            }

            if (pNum === 1) gameState.p1Pos = data.finalPos;
            else gameState.p2Pos = data.finalPos;

            updatePawnsUI(pNum);
            // Jeda 650ms setelah naik tangga atau turun ular
            await new Promise(res => setTimeout(res, 650));
            updatePawnsUI(0);
        }

        if (data.isDoubleRoll) {
            showToast(`🎲 DOUBLE ROLL! ${pInfo.name} dapat giliran melempar dadu sekali lagi!`, "⚡");
        }

        gameState.turn = data.nextTurn;
        updatePawnsUI(0);

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

        // Cek Garis Finish / Game Selesai (Petak 100)
        if (data.isGameOver || data.finalPos >= 100) {
            didInitiateRoll = false;
            triggerGameFinish(data.winnerNum || pNum);
            return;
        }

        // HANYA klien yang melempar dadu (initiator) yang membuka pop-up pilihan tantangan
        // Klien pasangan hanya menunggu kartu terbuka via CARD_REVEALED agar tidak terjadi tabrakan / penimpaan kartu!
        const isMyRoll = didInitiateRoll || (!ws || ws.readyState !== WebSocket.OPEN);
        didInitiateRoll = false; // Reset flag untuk giliran berikutnya

        if (isMyRoll) {
            // Jeda 450ms sebelum pop-up pilihan tantangan terbuka
            await new Promise(res => setTimeout(res, 450));

            if (data.finalPos > 1 && data.finalPos < 100 && isForcedRandomTile(data.finalPos)) {
                triggerForcedRandomTile(data.finalPos, pNum);
            } else {
                openChoiceModal(data.finalPos, pNum);
            }
        } else {
            // Klien pasangan: tampilkan pesan menunggu pasangan memilih kartu
            const statusEl = document.getElementById('statusMessage');
            if (statusEl) {
                statusEl.innerText = `⏳ Menunggu ${pInfo.name} memilih tantangan Truth atau Dare...`;
            }
        }
    } catch (e) {
        console.error("Error selama animasi langkah pion:", e);
    } finally {
        isRolling = false;
        const rollBtn = document.getElementById('rollDiceBtn');
        if (rollBtn && !gameState.isGameOver) rollBtn.disabled = false;
    }
}

// TRIGGER KEMENANGAN & SELESAI GAME (FINISH KOTAK 100)
function triggerGameFinish(winnerNum) {
    gameState.isGameOver = true;
    gameState.winnerNum = winnerNum;
    isRolling = false;

    const winner = winnerNum === 1 ? gameState.p1Info : gameState.p2Info;
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = true;

    const diceBigNumber = document.getElementById('diceBigNumber');
    if (diceBigNumber) diceBigNumber.innerText = '🏆';
    const diceSubtext = document.getElementById('diceSubtext');
    if (diceSubtext) diceSubtext.innerText = 'Juara!';

    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.innerText = `🏆 PERMAINAN SELESAI! ${winner.name} mencapai garis FINISH (Kotak 100) dan menjadi JUARA! 🎉`;
    }

    const winnerTitle = document.getElementById('winnerTitle');
    const winnerAvatarBox = document.getElementById('winnerAvatarBox');
    if (winnerTitle) winnerTitle.innerText = `${winner.name} Juara! 🏆`;
    if (winnerAvatarBox) winnerAvatarBox.innerText = winner.avatar;

    playSynthSound('ladder');
    if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        setTimeout(() => {
            confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 } });
        }, 400);
    }

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.classList.remove('hidden');
        gameOverModal.classList.add('flex');
    }
}

// 20 PETAK TAKDIR RAHASIA TRIGGER (FORCED RANDOM)
function triggerForcedRandomTile(tileNum, targetPNum) {
    const targetPlayer = targetPNum === 1 ? gameState.p1Info : gameState.p2Info;
    closeChoiceModal();
    playSynthSound('reaction');
    confetti({ particleCount: 45, spread: 75, origin: { y: 0.6 } });
    showToast(`🔮 PETAK TAKDIR #${tileNum}! Tidak bisa pilih Truth/Dare — takdir yang menentukan!`, "🎲");

    const forcedType = Math.random() > 0.5 ? 'TRUTH' : 'DARE';
    setTimeout(() => {
        drawAndRevealCard(forcedType, tileNum, 'TAKDIR RAHASIA (RANDOM)', true);
    }, 450);
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

function closeChoiceModal(syncWithServer = false) {
    const modal = document.getElementById('choiceModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    if (syncWithServer && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "CLOSE_MODAL" }));
    }
}

function handleTileClick(tileNum) {
    if (isRolling) return;
    didInitiateRoll = true;
    pendingTileNumber = tileNum;
    if (tileNum > 1 && tileNum < 100 && isForcedRandomTile(tileNum)) {
        triggerForcedRandomTile(tileNum, gameState.turn);
    } else {
        openChoiceModal(tileNum, gameState.turn);
    }
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

function drawAndRevealCard(type, tileNum, userChoice = 'TRUTH', isForced = false) {
    try {
        let card = null;

        if (tileNum === 57 && type === 'TRUTH') {
            card = (typeof defaultTruthsList !== 'undefined' ? defaultTruthsList.find(c => c.id === 57) : null) || defaultTruthsList[0];
        } else if (tileNum === 21 && type === 'DARE') {
            card = (typeof defaultDaresList !== 'undefined' ? defaultDaresList.find(c => c.id === 21) : null) || defaultDaresList[0];
        } else if (tileNum === 100) {
            card = {
                id: 9999,
                type: "FINISH",
                category: "Pemenang",
                prompt: "🎉 SELAMAT! Kamu mencapai garis FINISH! Pasanganmu wajib menuruti 1 permintaan spesial darimu hari ini! ❤️"
            };
        } else {
            const activeDecks = (gameState.selectedDecks && gameState.selectedDecks.length > 0)
                ? gameState.selectedDecks
                : (JSON.parse(localStorage.getItem('couple_ut_selected_decks') || 'null') || ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH']);
            const currentPlayMode = gameState.playMode || localStorage.getItem('couple_ut_play_mode') || 'ONLINE';
            
            let pool = [];
            if (typeof getGameActivePool === 'function') {
                try {
                    pool = getGameActivePool(type, activeDecks, customCards, currentPlayMode);
                } catch(e) {
                    console.error("Error saat getGameActivePool:", e);
                }
            }
            if (!pool || pool.length === 0) {
                const fallbackList = type === 'TRUTH' ? (typeof defaultTruthsList !== 'undefined' ? defaultTruthsList : []) : (typeof defaultDaresList !== 'undefined' ? defaultDaresList : []);
                pool = fallbackList.length > 0 ? fallbackList : [{ id: 1, type: type, category: "Spesial", prompt: "Tatap mata pasanganmu dan ucapkan apa yang paling kamu syukuri tentangnya hari ini." }];
            }
            
            if (!gameState.usedCardIds) {
                gameState.usedCardIds = [];
            }

            // Filter kartu agar tiap game hanya muncul 1x
            const unusedPool = pool.filter(c => c && c.id && !gameState.usedCardIds.includes(c.id));
            const finalPool = unusedPool.length > 0 ? unusedPool : pool;
            
            card = finalPool[Math.floor(Math.random() * finalPool.length)];

            if (card && card.id) {
                if (!gameState.usedCardIds.includes(card.id)) {
                    gameState.usedCardIds.push(card.id);
                }
            }
        }

        if (!card) {
            const fallbackList = type === 'TRUTH' ? defaultTruthsList : defaultDaresList;
            card = fallbackList[Math.floor(Math.random() * fallbackList.length)] || {
                id: 1,
                type: type,
                category: "Spesial",
                prompt: "Tatap mata pasanganmu selama 30 detik tanpa bicara, lalu tersenyum tulus! ❤️"
            };
        }

        currentModalCard = card;
        displayCardModal(card, tileNum, isForced);

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
            choice: isForced ? "TAKDIR RAHASIA (RANDOM)" : userChoice,
            cardType: card.type,
            category: isForced ? `${card.category} (Takdir)` : (card.category || "Spesial"),
            prompt: card.prompt,
            timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        addHistoryEntry(historyEntry);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "SHOW_CARD",
                cardId: card ? (card.id || 0) : 0,
                tile: tileNum,
                cardType: card.type,
                category: card.category,
                loveLanguage: card.loveLanguage || "GENERAL",
                mode: card.mode || "BOTH",
                prompt: card.prompt,
                targetP: gameState.turn === 2 ? 1 : 2
            }));

            ws.send(JSON.stringify({
                type: "RECORD_HISTORY",
                entry: historyEntry
            }));
        }
    } catch (err) {
        console.error("Critical error in drawAndRevealCard:", err);
        const fallbackCard = {
            id: 1,
            type: type || "TRUTH",
            category: "Spesial",
            prompt: "Ucapkan satu hal yang paling kamu sukai dari pasanganmu saat ini!"
        };
        currentModalCard = fallbackCard;
        displayCardModal(fallbackCard, tileNum, isForced);
    }
}

function displayCardModal(card, tileNum, isForced = false) {
    if (!card) return;
    closeChoiceModal(false);
    const modal = document.getElementById('cardModal');
    const badgeNum = document.getElementById('modalBadgeNum');
    const typeTitle = document.getElementById('modalTypeTitle');
    const categoryBadge = document.getElementById('modalCategoryBadge');
    const promptText = document.getElementById('modalPromptText');
    const playerTarget = document.getElementById('modalPlayerTarget');
    const dareTimerContainer = document.getElementById('dareTimerContainer');
    const forcedBadge = document.getElementById('modalForcedBadge');

    if (forcedBadge) {
        if (isForced) {
            forcedBadge.classList.remove('hidden');
            forcedBadge.classList.add('flex');
        } else {
            forcedBadge.classList.add('hidden');
            forcedBadge.classList.remove('flex');
        }
    }

    if (badgeNum) badgeNum.innerText = tileNum || 1;
    if (typeTitle) typeTitle.innerText = card.type || 'TANTANGAN';
    if (categoryBadge) categoryBadge.innerText = card.category || 'Spesial';
    if (promptText) promptText.innerText = `"${card.prompt || ''}"`;

    const loveLangBadge = document.getElementById('modalLoveLanguageBadge');
    if (loveLangBadge) {
        const langCode = card.loveLanguage || 'GENERAL';
        if (typeof getLoveLanguageMeta === 'function') {
            const meta = getLoveLanguageMeta(langCode);
            loveLangBadge.innerHTML = `<span>${meta.icon}</span> ${meta.name}`;
            loveLangBadge.classList.remove('hidden');
        } else {
            loveLangBadge.classList.add('hidden');
        }
    }

    const modeBadge = document.getElementById('modalModeBadge');
    if (modeBadge) {
        const cMode = card.mode || 'BOTH';
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

    const activePNum = currentMoveContext.player || (gameState.turn === 2 ? 1 : 2);
    const activeP = activePNum === 1 ? gameState.p1Info : gameState.p2Info;
    const activeSkills = activePNum === 1 ? (typeof p1Skills !== 'undefined' ? p1Skills : null) : (typeof p2Skills !== 'undefined' ? p2Skills : null);
    if (playerTarget) playerTarget.innerText = `Untuk: ${activeP.name} ${activeP.avatar}`;

    // Skill action row in card modal (Skip & Reverse)
    const skillRow = document.getElementById('modalSkillActionRow');
    const skipBtn = document.getElementById('modalSkipBtn');
    const reverseBtn = document.getElementById('modalReverseBtn');
    const skipUsesSpan = document.getElementById('modalSkipUses');
    const reverseUsesSpan = document.getElementById('modalReverseUses');
    const rerollBtnLabel = document.getElementById('reRollBtnLabel');

    let showSkillRow = false;
    if (activeSkills && activeSkills.selected && activeSkills.selected.includes('skip') && activeSkills.uses && activeSkills.uses.skip > 0) {
        if (skipBtn) {
            skipBtn.classList.remove('hidden');
            skipBtn.classList.add('inline-flex');
        }
        if (skipUsesSpan) skipUsesSpan.innerText = activeSkills.uses.skip;
        showSkillRow = true;
    } else if (skipBtn) {
        skipBtn.classList.add('hidden');
        skipBtn.classList.remove('inline-flex');
    }

    if (activeSkills && activeSkills.selected && activeSkills.selected.includes('uno_reverse') && activeSkills.uses && activeSkills.uses.uno_reverse > 0) {
        if (reverseBtn) {
            reverseBtn.classList.remove('hidden');
            reverseBtn.classList.add('inline-flex');
        }
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

    if (rerollBtnLabel && activeSkills) {
        rerollBtnLabel.innerText = `Acak Lagi (${activeSkills.rerollCount || 0})`;
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
    closeChoiceModal(false);
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
    switchDeckTab('lovelang');
    syncLoveLangCheckboxes();
    updateLoveLangPreview();
    updateDeckCountBadge();
}

function closeDeckModal() {
    document.getElementById('deckModal').classList.add('hidden');
    document.getElementById('deckModal').classList.remove('flex');
}

function syncLoveLangCheckboxes() {
    const active = (gameState.selectedDecks && gameState.selectedDecks.length > 0)
        ? gameState.selectedDecks
        : (JSON.parse(localStorage.getItem('couple_ut_selected_decks') || 'null') || ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH']);
    
    ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'].forEach(code => {
        const el = document.getElementById(`loveLang_${code}`);
        if (el) {
            el.checked = active.includes(code);
        }
    });
}

function updateLoveLangPreview() {
    const list = [];
    ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'].forEach(code => {
        const el = document.getElementById(`loveLang_${code}`);
        if (el && el.checked) {
            list.push(code);
        }
    });

    if (list.length === 0) {
        showToast("Minimal pilih 1 Bahasa Cinta untuk game kalian!", "⚠️");
        const defaultEl = document.getElementById('loveLang_WORDS_OF_AFFIRMATION');
        if (defaultEl) defaultEl.checked = true;
        list.push('WORDS_OF_AFFIRMATION');
    }

    // 100 kartu per bahasa cinta + 50 kartu general = 550 kartu total katalog
    const candidateDefault = (list.length * 100) + 50;
    const activeLimit = Math.min(150, candidateDefault);

    const limitSpan = document.getElementById('activeDeckLimitSpan');
    if (limitSpan) limitSpan.innerText = activeLimit;

    const customSpan = document.getElementById('customCardCountSpan');
    if (customSpan) customSpan.innerText = customCards.length;
}

function applyLoveLanguageSelection() {
    const list = [];
    ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'].forEach(code => {
        const el = document.getElementById(`loveLang_${code}`);
        if (el && el.checked) {
            list.push(code);
        }
    });

    if (list.length === 0) {
        list.push('WORDS_OF_AFFIRMATION');
    }

    // Ambil mode yang dipilih di radio button modal jika ada
    const selectedModeRadio = document.querySelector('input[name="playModeRadio"]:checked');
    if (selectedModeRadio && selectedModeRadio.value) {
        gameState.playMode = selectedModeRadio.value;
        localStorage.setItem('couple_ut_play_mode', gameState.playMode);
        updatePlayModeUI();
    }

    gameState.selectedDecks = list;
    localStorage.setItem('couple_ut_selected_decks', JSON.stringify(list));

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "UPDATE_DECK_SELECTION",
            selectedDecks: list,
            playMode: gameState.playMode || 'ONLINE'
        }));
    }

    updateDeckCountBadge();
    playSynthSound('reaction');
    showToast(`💖 ${list.length} Bahasa Cinta & Mode ${getPlayModeLabel(gameState.playMode)} diterapkan!`, "🎉");
}

function switchDeckTab(tab) {
    const btnLoveLang = document.getElementById('tabBtnLoveLang');
    const btnAdd = document.getElementById('tabBtnAdd');
    const btnList = document.getElementById('tabBtnList');
    const btnExport = document.getElementById('tabBtnExport');
    const tabLoveLang = document.getElementById('deckTabLoveLang');
    const tabAdd = document.getElementById('deckTabAdd');
    const tabList = document.getElementById('deckTabList');
    const tabExport = document.getElementById('deckTabExport');

    const allBtns = [btnLoveLang, btnAdd, btnList, btnExport].filter(Boolean);
    const allTabs = [tabLoveLang, tabAdd, tabList, tabExport].filter(Boolean);

    allBtns.forEach(b => b.className = "px-4 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200");
    allTabs.forEach(t => t.classList.add('hidden'));

    if (tab === 'lovelang') {
        if (btnLoveLang) btnLoveLang.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        if (tabLoveLang) tabLoveLang.classList.remove('hidden');
        syncLoveLangCheckboxes();
        updateLoveLangPreview();
    } else if (tab === 'add') {
        if (btnAdd) btnAdd.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        if (tabAdd) tabAdd.classList.remove('hidden');
    } else if (tab === 'list') {
        if (btnList) btnList.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        if (tabList) {
            tabList.classList.remove('hidden');
            tabList.classList.add('flex');
        }
        renderCardList();
    } else if (tab === 'export') {
        if (btnExport) btnExport.className = "px-4 py-2 rounded-xl bg-[#3D2216] text-white";
        if (tabExport) tabExport.classList.remove('hidden');
        populateExportJson();
    }
}

function updateDeckCountBadge() {
    const masterCount = typeof getAllMasterCards === 'function' ? getAllMasterCards().length : (defaultTruthsList.length + defaultDaresList.length);
    const total = masterCount + customCards.length;
    const badge = document.getElementById('deckTotalCount');
    if (badge) badge.innerText = total;
    const tabCount = document.getElementById('tabCountSpan');
    if (tabCount) tabCount.innerText = total;
}

function saveCustomCard() {
    const type = document.getElementById('newCardType').value;
    const mode = (document.getElementById('newCardMode') ? document.getElementById('newCardMode').value : 'BOTH') || 'BOTH';
    const loveLang = (document.getElementById('newCardLoveLang') ? document.getElementById('newCardLoveLang').value : 'GENERAL') || 'GENERAL';
    const cat = document.getElementById('newCardCat').value;
    const prompt = document.getElementById('newCardPrompt').value.trim();

    if (!prompt) {
        showToast("Tulis pertanyaan/tantangan terlebih dahulu!", "⚠️");
        return;
    }

    const newCard = {
        id: Date.now(),
        type: type,
        loveLanguage: loveLang,
        mode: mode,
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
            loveLanguage: loveLang,
            mode: mode,
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
    const search = (document.getElementById('deckSearchInput') ? document.getElementById('deckSearchInput').value : '').toLowerCase();
    const filterType = document.getElementById('deckFilterType') ? document.getElementById('deckFilterType').value : 'ALL';
    const filterMode = document.getElementById('deckFilterMode') ? document.getElementById('deckFilterMode').value : 'ALL';
    const filterLoveLang = document.getElementById('deckFilterLoveLang') ? document.getElementById('deckFilterLoveLang').value : 'ALL';

    const masterList = typeof getAllMasterCards === 'function' ? getAllMasterCards() : [...defaultTruthsList, ...defaultDaresList];
    let all = [...masterList, ...customCards];

    if (filterType === 'TRUTH') all = all.filter(c => c.type === 'TRUTH');
    else if (filterType === 'DARE') all = all.filter(c => c.type === 'DARE');
    else if (filterType === 'CUSTOM') all = all.filter(c => c.isCustom);

    if (filterMode !== 'ALL') {
        all = all.filter(c => (c.mode || 'BOTH') === filterMode);
    }

    if (filterLoveLang !== 'ALL') {
        all = all.filter(c => (c.loveLanguage || 'GENERAL') === filterLoveLang);
    }

    if (search) {
        all = all.filter(c => 
            c.prompt.toLowerCase().includes(search) || 
            (c.category && c.category.toLowerCase().includes(search)) ||
            (c.loveLanguage && c.loveLanguage.toLowerCase().includes(search))
        );
    }

    container.innerHTML = '';
    if (all.length === 0) {
        container.innerHTML = `<div class="p-6 text-center text-xs text-stone-500 font-bold">Tidak ada kartu yang cocok dengan filter pencarian.</div>`;
        return;
    }

    let html = '';
    all.forEach((c) => {
        const isTruth = c.type === 'TRUTH';
        const meta = typeof getLoveLanguageMeta === 'function' ? getLoveLanguageMeta(c.loveLanguage || 'GENERAL') : { icon: '💬', name: c.loveLanguage || 'General' };
        
        let modeBadgeHtml = '';
        if (c.mode === 'ONLINE') {
            modeBadgeHtml = `<span class="text-[9px] bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-bold">📹 Online</span>`;
        } else if (c.mode === 'OFFLINE') {
            modeBadgeHtml = `<span class="text-[9px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold">💑 Offline</span>`;
        } else {
            modeBadgeHtml = `<span class="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">✨ Fleksibel</span>`;
        }

        html += `
            <div class="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3 shadow-xs">
                <div class="flex items-center gap-2 flex-1 flex-wrap">
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${isTruth ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                        ${c.type}
                    </span>
                    ${modeBadgeHtml}
                    <span class="text-[9px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <span>${meta.icon}</span> ${meta.name}
                    </span>
                    <span class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">${c.category || 'Spesial'}</span>
                    <p class="text-xs text-slate-800 font-medium line-clamp-2 w-full mt-0.5">${c.prompt}</p>
                </div>
                ${c.isCustom ? `
                    <button onclick="deleteCustomCard(${c.id})" class="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-md shrink-0">
                        Hapus
                    </button>
                ` : `
                    <span class="text-[10px] text-stone-400 font-semibold italic shrink-0">Bawaan</span>
                `}
            </div>
        `;
    });
    container.innerHTML = html;
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
        if (num > 1 && num < 100 && isForcedRandomTile(num)) {
            triggerForcedRandomTile(num, playerNum);
        } else {
            openChoiceModal(num, playerNum);
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "MOVE_PAWN", player: playerNum, pos: num }));
        }
    }
}

function promptResetGame(force = false) {
    if (force || confirm("Reset ulang permainan ke Kotak 1, bersihkan seluruh riwayat langkah, dan isi ulang semua skill?")) {
        gameState.p1Pos = 1;
        gameState.p2Pos = 1;
        gameState.turn = 1;
        gameState.isGameOver = false;
        gameState.winnerNum = 0;
        gameState.usedCardIds = [];
        gameHistory = [];
        localStorage.removeItem('couple_ut_history');
        resetPlayerSkillsToFull();
        gameState.mysteryTiles = generateOfflineMysteryTiles();

        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            gameOverModal.classList.add('hidden');
            gameOverModal.classList.remove('flex');
        }

        const rollBtn = document.getElementById('rollDiceBtn');
        if (rollBtn) rollBtn.disabled = false;
        const diceBigNumber = document.getElementById('diceBigNumber');
        const diceSubtext = document.getElementById('diceSubtext');
        if (diceBigNumber) diceBigNumber.innerText = '?';
        if (diceSubtext) diceSubtext.innerText = 'Dadu';
        isRolling = false;

        updatePawnsUI();
        renderHistoryUI();
        renderSkillsUI();
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) statusEl.innerText = "🔄 Permainan di-reset ke garis START (Kotak 1). 20 Petak Takdir diundi ulang & kuota skill terisi penuh!";
        showToast("Posisi pemain, riwayat & petak takdir berhasil di-reset!", "🔄");

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
        if (ws) {
            try { ws.close(); } catch(e) {}
        }
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}/ws?room=${encodeURIComponent(currentRoomCode)}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "STATE_UPDATE" && data.state) {
                if (data.roomCode) {
                    currentRoomCode = data.roomCode;
                    updateRoomDisplayUI();
                }
                gameState.p1Pos = data.state.p1Pos;
                gameState.p2Pos = data.state.p2Pos;
                gameState.turn = data.state.turn;
                gameState.lastDice = data.state.lastDice;
                if (data.state.p1Info) gameState.p1Info = data.state.p1Info;
                if (data.state.p2Info) gameState.p2Info = data.state.p2Info;
                if (data.state.p1Skills) p1Skills = data.state.p1Skills;
                if (data.state.p2Skills) p2Skills = data.state.p2Skills;
                if (data.state.mysteryTiles && data.state.mysteryTiles.length > 0) {
                    gameState.mysteryTiles = data.state.mysteryTiles;
                    localStorage.setItem('couple_ut_mystery_tiles', JSON.stringify(gameState.mysteryTiles));
                }
                if (data.state.selectedDecks && Array.isArray(data.state.selectedDecks)) {
                    gameState.selectedDecks = data.state.selectedDecks;
                    localStorage.setItem('couple_ut_selected_decks', JSON.stringify(gameState.selectedDecks));
                    if (typeof syncLoveLangCheckboxes === 'function') syncLoveLangCheckboxes();
                    if (typeof updateLoveLangPreview === 'function') updateLoveLangPreview();
                }
                if (data.state.playMode) {
                    gameState.playMode = data.state.playMode;
                    localStorage.setItem('couple_ut_play_mode', gameState.playMode);
                    if (typeof updatePlayModeUI === 'function') updatePlayModeUI();
                }
                if (data.state.usedCardIds && Array.isArray(data.state.usedCardIds)) {
                    gameState.usedCardIds = data.state.usedCardIds;
                }
                if (data.state.isGameOver !== undefined) {
                    gameState.isGameOver = data.state.isGameOver;
                    gameState.winnerNum = data.state.winnerNum || 0;
                    if (gameState.isGameOver && gameState.winnerNum > 0) {
                        triggerGameFinish(gameState.winnerNum);
                    } else if (!gameState.isGameOver) {
                        const gameOverModal = document.getElementById('gameOverModal');
                        if (gameOverModal) {
                            gameOverModal.classList.add('hidden');
                            gameOverModal.classList.remove('flex');
                        }
                        const rollBtn = document.getElementById('rollDiceBtn');
                        if (rollBtn) rollBtn.disabled = false;
                        const diceBigNumber = document.getElementById('diceBigNumber');
                        const diceSubtext = document.getElementById('diceSubtext');
                        if (diceBigNumber && diceBigNumber.innerText === '🏆') {
                            diceBigNumber.innerText = '?';
                        }
                        if (diceSubtext && diceSubtext.innerText === 'Juara!') {
                            diceSubtext.innerText = 'Dadu';
                        }
                    }
                }
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
                closeChoiceModal(false);
                currentModalCard = data.card;
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
                closeChoiceModal(false);
                resetDareTimer();
                const modal = document.getElementById('cardModal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
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
