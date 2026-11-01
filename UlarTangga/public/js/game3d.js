// ==========================================
// 3D BOARD ENGINE FOR ULAR TANGGA PASANGAN
// Cute & Romantic Couple Diorama with Three.js
// Ultra-optimized: Single Master Canvas Texture (Zero lag & anti-crash)
// ==========================================

let is3DMode = false;
let scene3D = null, camera3D = null, renderer3D = null, controls3D = null;
let pawnMeshes = { 1: null, 2: null };
let activePawnRing = null;
let floatingHeartsGroup = null;
let board3DGroup = null;
let animReq3D = null;

// Tile coordinate generator: 10x10 boustrophedon
function getTile3DCoords(tileNum) {
    const idx = Math.max(0, Math.min(99, (tileNum || 1) - 1));
    const row = Math.floor(idx / 10);
    let col = idx % 10;
    if (row % 2 === 1) {
        col = 9 - col; // Snake pattern (boustrophedon)
    }
    // Centered around 0: col from -4.5 to 4.5, row from -4.5 to 4.5
    const tileSize = 2.2;
    const x = (col - 4.5) * tileSize;
    const z = (4.5 - row) * tileSize;
    return { x, y: 0.25, z };
}

// Generate Single 1024x1024 Master Board Canvas Texture
function createMasterBoardTexture(sal) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background base
    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, 1024, 1024);

    const cellSize = 102.4;

    for (let num = 1; num <= 100; num++) {
        const idx = num - 1;
        const row = Math.floor(idx / 10);
        let col = idx % 10;
        if (row % 2 === 1) col = 9 - col;

        const canvasCol = col;
        const canvasRow = 9 - row; // Row 0 is at bottom, Row 9 at top

        const x = canvasCol * cellSize;
        const y = canvasRow * cellSize;

        const isSpecial = sal && sal[num];
        const isSnake = isSpecial && sal[num] < num;
        const isLadder = isSpecial && sal[num] > num;

        // Tile background color palette
        let tileBg = ((row + col) % 2 === 0) ? '#ffffff' : '#fff1f2';
        if (num === 1) tileBg = '#dcfce7'; // START
        else if (num === 100) tileBg = '#fef08a'; // FINISH
        else if (isLadder) tileBg = '#dcfce7';
        else if (isSnake) tileBg = '#fee2e2';
        else if (num === 57) tileBg = '#e0e7ff';
        else if (num === 21) tileBg = '#fae8ff';

        // Draw tile box
        ctx.fillStyle = tileBg;
        ctx.fillRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);

        // Tile inner border
        ctx.strokeStyle = (num === 1 || num === 100 || isLadder) ? '#bbf7d0' : (isSnake ? '#fecdd3' : '#fbcfe8');
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);

        // Tile number
        ctx.fillStyle = (num === 1 || num === 100 || isLadder) ? '#166534' : (isSnake ? '#9f1239' : '#1e293b');
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), x + (cellSize / 2), y + 38);

        // Couple Icon
        let icon = '';
        if (isLadder) icon = '🪜';
        else if (isSnake) icon = '🐍';
        else if (num === 100) icon = '👑❤️';
        else if (num === 57) icon = '📞';
        else if (num === 21) icon = '🎬';
        else if (num % 7 === 0) icon = '💖';
        else if (num % 5 === 0) icon = '✨';

        if (icon) {
            ctx.font = '26px sans-serif';
            ctx.fillText(icon, x + (cellSize / 2), y + 74);
        }
    }

    // Outer board decorative border on canvas
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 1018, 1018);

    return canvas;
}

function init3DBoard() {
    const container = document.getElementById('board3DContainer');
    if (!container) return false;

    if (typeof THREE === 'undefined') {
        console.warn("THREE.js is not loaded yet");
        return false;
    }

    try {
        const width = container.clientWidth || 500;
        const height = container.clientHeight || width || 500;

        // Scene
        scene3D = new THREE.Scene();
        scene3D.background = new THREE.Color(0xfff5f7); // Warm romantic blush

        // Camera
        camera3D = new THREE.PerspectiveCamera(40, width / height, 0.5, 100);
        camera3D.position.set(0, 24, 25);
        camera3D.lookAt(0, 0, 0);

        // Renderer
        renderer3D = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'default'
        });
        renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer3D.setSize(width, height);
        renderer3D.shadowMap.enabled = true;
        renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

        // Context loss safety guard
        renderer3D.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn("WebGL Context Lost! Switching to 2D board fallback.");
            toggle3DMode(false);
        }, false);

        container.innerHTML = '';
        container.appendChild(renderer3D.domElement);

        // Orbit Controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls3D = new THREE.OrbitControls(camera3D, renderer3D.domElement);
            controls3D.enableDamping = true;
            controls3D.dampingFactor = 0.08;
            controls3D.maxPolarAngle = Math.PI / 2.15; // Don't let camera go beneath board
            controls3D.minDistance = 12;
            controls3D.maxDistance = 42;
            controls3D.target.set(0, 0, 0);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene3D.add(ambientLight);

        const mainDirLight = new THREE.DirectionalLight(0xfff1f2, 0.85);
        mainDirLight.position.set(15, 30, 20);
        mainDirLight.castShadow = true;
        mainDirLight.shadow.mapSize.width = 1024;
        mainDirLight.shadow.mapSize.height = 1024;
        mainDirLight.shadow.camera.near = 5;
        mainDirLight.shadow.camera.far = 70;
        const d = 16;
        mainDirLight.shadow.camera.left = -d;
        mainDirLight.shadow.camera.right = d;
        mainDirLight.shadow.camera.top = d;
        mainDirLight.shadow.camera.bottom = -d;
        scene3D.add(mainDirLight);

        const warmFillLight = new THREE.PointLight(0xf43f5e, 0.5, 40);
        warmFillLight.position.set(-15, 12, -15);
        scene3D.add(warmFillLight);

        // Main Board Group
        board3DGroup = new THREE.Group();
        scene3D.add(board3DGroup);

        // Wood / Velvet Diorama Podium Base
        const baseGeo = new THREE.BoxGeometry(24.4, 0.8, 24.4);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x881337, // Romantic deep rose-burgundy
            roughness: 0.35,
            metalness: 0.2
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.4;
        baseMesh.receiveShadow = true;
        board3DGroup.add(baseMesh);

        // Champagne gold trim
        const rimGeo = new THREE.BoxGeometry(24.8, 0.9, 24.8);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.25, metalness: 0.5 });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.position.y = -0.44;
        board3DGroup.add(rimMesh);

        // Top bevel under surface
        const topBevelGeo = new THREE.BoxGeometry(22.4, 0.3, 22.4);
        const topBevelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const topBevelMesh = new THREE.Mesh(topBevelGeo, topBevelMat);
        topBevelMesh.position.y = 0.05;
        topBevelMesh.receiveShadow = true;
        board3DGroup.add(topBevelMesh);

        // Snakes and Ladders Mapping
        const sal = (typeof window.snakesAndLadders !== 'undefined' ? window.snakesAndLadders : (typeof snakesAndLadders !== 'undefined' ? snakesAndLadders : {
            4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92,
            27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41
        }));

        // Render Ultra-fast 1-Texture Board Surface (1024x1024 canvas mapped to 22x22 plane)
        const masterCanvas = createMasterBoardTexture(sal);
        if (masterCanvas) {
            const masterTexture = new THREE.CanvasTexture(masterCanvas);
            masterTexture.anisotropy = 4;
            const surfaceGeo = new THREE.PlaneGeometry(22, 22);
            surfaceGeo.rotateX(-Math.PI / 2);
            const surfaceMat = new THREE.MeshStandardMaterial({
                map: masterTexture,
                roughness: 0.35,
                metalness: 0.05
            });
            const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
            surfaceMesh.position.set(0, 0.21, 0);
            surfaceMesh.receiveShadow = true;
            board3DGroup.add(surfaceMesh);
        }

        // Render 3D Ladders & Snakes
        Object.keys(sal).forEach(fromStr => {
            const from = parseInt(fromStr);
            const to = sal[from];
            const p1 = getTile3DCoords(from);
            const p2 = getTile3DCoords(to);

            if (to > from) {
                // LADDER (Golden emerald wooden rungs)
                const group = new THREE.Group();
                const ladderMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3, metalness: 0.3 });
                const rungMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.5 });

                const v1 = new THREE.Vector3(p1.x, 0.35, p1.z);
                const v2 = new THREE.Vector3(p2.x, 0.35, p2.z);
                const dir = new THREE.Vector3().subVectors(v2, v1);
                const len = dir.length();
                const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

                const railGeo = new THREE.CylinderGeometry(0.08, 0.08, len, 8);
                const rail1 = new THREE.Mesh(railGeo, ladderMat);
                const rail2 = new THREE.Mesh(railGeo, ladderMat);

                const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(0.42);
                rail1.position.copy(mid).add(perp);
                rail2.position.copy(mid).sub(perp);

                const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
                rail1.quaternion.copy(quat);
                rail2.quaternion.copy(quat);
                group.add(rail1);
                group.add(rail2);

                const numRungs = Math.max(3, Math.floor(len / 1.4));
                for (let r = 1; r <= numRungs; r++) {
                    const t = r / (numRungs + 1);
                    const pos = new THREE.Vector3().lerpVectors(v1, v2, t);
                    const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.84, 8);
                    const rung = new THREE.Mesh(rungGeo, rungMat);
                    rung.position.copy(pos);
                    rung.quaternion.copy(quat);
                    rung.rotateZ(Math.PI / 2);
                    group.add(rung);
                }
                board3DGroup.add(group);
            } else {
                // SNAKE (Curved Romantic Rose/Ruby arch)
                const startVec = new THREE.Vector3(p1.x, 0.35, p1.z);
                const endVec = new THREE.Vector3(p2.x, 0.35, p2.z);
                const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
                midVec.y += 2.2; // Arch above board

                const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
                const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.18, 8, false);
                const tubeMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35, metalness: 0.15 });
                const snakeMesh = new THREE.Mesh(tubeGeo, tubeMat);
                board3DGroup.add(snakeMesh);
            }
        });

        // Create Couple 3D Pawns: Blue Ayang Ganteng (P1) & Pink Ayang Cantik (P2)
        pawnMeshes[1] = create3DPawn(0x2563eb, '👦', 0x93c5fd); // Player 1 Blue
        pawnMeshes[2] = create3DPawn(0xdb2777, '🧕', 0xfbcfe8); // Player 2 Pink
        board3DGroup.add(pawnMeshes[1]);
        board3DGroup.add(pawnMeshes[2]);

        // Active Turn Glowing Ring
        const ringGeo = new THREE.TorusGeometry(0.75, 0.08, 8, 28);
        ringGeo.rotateX(Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.85 });
        activePawnRing = new THREE.Mesh(ringGeo, ringMat);
        activePawnRing.position.y = 0.28;
        board3DGroup.add(activePawnRing);

        // Floating Hearts Group
        floatingHeartsGroup = new THREE.Group();
        const heartColors = [0xff4d6d, 0xff758f, 0xff85a1, 0xfbb1bd, 0xfde047];
        const heartCount = 20;
        for (let i = 0; i < heartCount; i++) {
            const hGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const hMat = new THREE.MeshBasicMaterial({ color: heartColors[i % heartColors.length] });
            const hMesh = new THREE.Mesh(hGeo, hMat);
            hMesh.position.set(
                (Math.random() - 0.5) * 24,
                1 + Math.random() * 8,
                (Math.random() - 0.5) * 24
            );
            hMesh.userData = {
                speedY: 0.015 + Math.random() * 0.02,
                baseY: hMesh.position.y,
                seed: Math.random() * 10
            };
            floatingHeartsGroup.add(hMesh);
        }
        board3DGroup.add(floatingHeartsGroup);

        sync3DPawns();

        // Render Loop
        function animate(time) {
            animReq3D = requestAnimationFrame(animate);
            if (controls3D) controls3D.update();

            // Animate Active Pawn Pulsing Ring
            if (activePawnRing) {
                const turn = (typeof gameState !== 'undefined') ? gameState.turn : 1;
                const activeMesh = pawnMeshes[turn];
                if (activeMesh) {
                    activePawnRing.position.set(activeMesh.position.x, 0.28, activeMesh.position.z);
                    activePawnRing.rotation.y += 0.04;
                    const s = 1 + Math.sin(time * 0.005) * 0.08;
                    activePawnRing.scale.set(s, s, s);
                }
            }

            // Animate Floating Heart Particles
            if (floatingHeartsGroup) {
                floatingHeartsGroup.children.forEach(h => {
                    h.position.y += h.userData.speedY;
                    h.position.x += Math.sin(time * 0.002 + h.userData.seed) * 0.01;
                    if (h.position.y > 10) {
                        h.position.y = 0.5;
                    }
                });
            }

            if (renderer3D && scene3D && camera3D) {
                renderer3D.render(scene3D, camera3D);
            }
        }
        animate(0);

        window.removeEventListener('resize', onWindowResize3D);
        window.addEventListener('resize', onWindowResize3D);
        return true;
    } catch (err) {
        console.error("Gagal init Three.js 3D board:", err);
        return false;
    }
}

// Couple 3D Pawn generator
function create3DPawn(colorHex, emoji, ringColor) {
    const group = new THREE.Group();

    // Base podium
    const baseGeo = new THREE.CylinderGeometry(0.55, 0.68, 0.42, 18);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.25, metalness: 0.2 });
    const base = new THREE.Mesh(baseGeo, mat);
    base.position.y = 0.21;
    base.castShadow = true;
    group.add(base);

    // Glowing couple ring
    const ringGeo = new THREE.TorusGeometry(0.62, 0.07, 8, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({ color: ringColor || 0xfef08a, roughness: 0.2, metalness: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.42;
    group.add(ring);

    // Body cone
    const bodyGeo = new THREE.ConeGeometry(0.46, 1.15, 18);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.y = 0.95;
    body.castShadow = true;
    group.add(body);

    // Head sphere
    const headGeo = new THREE.SphereGeometry(0.42, 18, 18);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2, metalness: 0.4 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.72;
    head.castShadow = true;
    group.add(head);

    // Emoji floating crown banner
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji || '❤️', 64, 66);

    const texture = new THREE.CanvasTexture(canvas);
    const bannerGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const bannerMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.y = 2.5;
    group.add(banner);

    return group;
}

function sync3DPawns(animatedPawn = 0) {
    if (!is3DMode || !pawnMeshes[1] || !pawnMeshes[2]) return;

    try {
        const p1Pos = (typeof gameState !== 'undefined' && gameState.p1Pos) ? gameState.p1Pos : (window.gameState?.p1Pos || 1);
        const p2Pos = (typeof gameState !== 'undefined' && gameState.p2Pos) ? gameState.p2Pos : (window.gameState?.p2Pos || 1);

        const c1 = getTile3DCoords(p1Pos);
        const c2 = getTile3DCoords(p2Pos);

        const offset = (p1Pos === p2Pos) ? 0.45 : 0;

        pawnMeshes[1].position.set(c1.x - offset, 0.25, c1.z);
        pawnMeshes[2].position.set(c2.x + offset, 0.25, c2.z);
    } catch (e) {
        console.warn("sync3DPawns error handled:", e);
    }
}

function onWindowResize3D() {
    const container = document.getElementById('board3DContainer');
    if (!container || !renderer3D || !camera3D) return;
    try {
        const width = container.clientWidth || 500;
        const height = container.clientHeight || width || 500;
        camera3D.aspect = width / height;
        camera3D.updateProjectionMatrix();
        renderer3D.setSize(width, height);
    } catch (e) {
        console.warn("Resize 3D handled:", e);
    }
}

function toggle3DMode(forceState) {
    const wrapper2D = document.querySelector('.board-wrapper');
    const container3D = document.getElementById('board3DContainer');
    const btn = document.getElementById('view3dToggleBtn');
    const mobBtn = document.getElementById('mobileView3dBtn');

    const nextMode = (forceState !== undefined) ? forceState : !is3DMode;

    if (nextMode) {
        // Turning ON 3D Mode
        if (typeof THREE === 'undefined') {
            if (typeof showToast === 'function') {
                showToast("⏳ Tiga Dimensi (3D) sedang memuat aset Three.js...");
            }
            return;
        }

        try {
            if (wrapper2D) wrapper2D.style.display = 'none';
            if (container3D) container3D.style.display = 'block';

            if (!renderer3D) {
                const ok = init3DBoard();
                if (!ok) throw new Error("Gagal menginisialisasi 3D canvas");
            } else {
                onWindowResize3D();
                sync3DPawns();
            }

            is3DMode = true;
            if (btn) {
                btn.innerHTML = '<span>🗺️ Tampilan 2D</span>';
                btn.className = 'wood-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs border border-emerald-300';
            }
            if (mobBtn) {
                mobBtn.innerHTML = '<span>🗺️ 2D</span>';
                mobBtn.className = 'wood-btn bg-emerald-100 text-emerald-900 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs border border-emerald-300';
            }
            if (typeof showToast === 'function') {
                showToast("🧊 Mode 3D Aktif! Geser & putar papannya! ✨");
            }
        } catch (err) {
            console.error("3D Mode Error:", err);
            is3DMode = false;
            if (container3D) container3D.style.display = 'none';
            if (wrapper2D) wrapper2D.style.display = '';
            if (btn) {
                btn.innerHTML = '<span>🧊 Mode 3D</span>';
                btn.className = 'wood-btn bg-pink-100 hover:bg-pink-200 text-pink-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs border border-pink-300';
            }
            if (mobBtn) {
                mobBtn.innerHTML = '<span>🧊 3D</span>';
                mobBtn.className = 'wood-btn bg-rose-100 hover:bg-rose-200 text-rose-900 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs border border-rose-300';
            }
        }
    } else {
        // Turning OFF 3D Mode -> Return to 2D
        is3DMode = false;
        if (container3D) container3D.style.display = 'none';
        if (wrapper2D) wrapper2D.style.display = '';

        if (btn) {
            btn.innerHTML = '<span>🧊 Mode 3D</span>';
            btn.className = 'wood-btn bg-pink-100 hover:bg-pink-200 text-pink-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs border border-pink-300';
        }
        if (mobBtn) {
            mobBtn.innerHTML = '<span>🧊 3D</span>';
            mobBtn.className = 'wood-btn bg-rose-100 hover:bg-rose-200 text-rose-900 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs border border-rose-300';
        }
        if (typeof showToast === 'function') {
            showToast("🗺️ Kembali ke Tampilan 2D Klasik! ❤️");
        }
    }
}

// Hook into window for global availability
if (typeof window !== 'undefined') {
    window.sync3DPawns = sync3DPawns;
    window.toggle3DMode = toggle3DMode;
    window.is3DMode = () => is3DMode;
    window.getScene3D = () => scene3D;
    window.getCamera3D = () => camera3D;
    window.getPawnMeshes = () => pawnMeshes;
}
