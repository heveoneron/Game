// ==========================================
// 3D BOARD ENGINE FOR ULAR TANGGA PASANGAN
// Powered by Three.js & OrbitControls
// ==========================================

let is3DMode = false;
let scene3D = null, camera3D = null, renderer3D = null, controls3D = null;
let tileMeshes = {};
let pawnMeshes = { 1: null, 2: null };
let board3DGroup = null;
let animReq3D = null;

// Tile coordinate generator: 10x10 boustrophedon
function getTile3DCoords(tileNum) {
    const idx = tileNum - 1;
    const row = Math.floor(idx / 10);
    let col = idx % 10;
    if (row % 2 === 1) {
        col = 9 - col; // Snake pattern (boustrophedon)
    }
    // Centered around 0: col from -4.5 to 4.5, row from -4.5 to 4.5
    const tileSize = 2.2;
    const x = (col - 4.5) * tileSize;
    const z = (4.5 - row) * tileSize;
    return { x, y: 0.2, z };
}

function init3DBoard() {
    const container = document.getElementById('board3DContainer');
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Scene
    scene3D = new THREE.Scene();
    scene3D.background = new THREE.Color(0xf6f0e8);

    // Camera
    camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera3D.position.set(0, 24, 22);

    // Renderer
    renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer3D.setSize(width, height);
    renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer3D.shadowMap.enabled = true;
    renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer3D.domElement);

    // Controls
    controls3D = new THREE.OrbitControls(camera3D, renderer3D.domElement);
    controls3D.enableDamping = true;
    controls3D.dampingFactor = 0.05;
    controls3D.maxPolarAngle = Math.PI / 2.1;
    controls3D.minDistance = 10;
    controls3D.maxDistance = 50;
    controls3D.target.set(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene3D.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.9);
    dirLight.position.set(15, 28, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene3D.add(dirLight);

    board3DGroup = new THREE.Group();
    scene3D.add(board3DGroup);

    // Create Board Base (Wooden diorama tray)
    const baseGeo = new THREE.BoxGeometry(25, 0.8, 25);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    board3DGroup.add(baseMesh);

    // Create 100 Tiles
    const tileSize = 2.05;
    const tileGeo = new THREE.BoxGeometry(tileSize, 0.35, tileSize);

    for (let num = 1; num <= 100; num++) {
        const coords = getTile3DCoords(num);
        const isSpecial = snakesAndLadders && snakesAndLadders[num];
        const isSnake = isSpecial && snakesAndLadders[num] < num;
        const isLadder = isSpecial && snakesAndLadders[num] > num;

        let tileColor = (Math.floor((num - 1) / 10) + ((num - 1) % 10)) % 2 === 0 ? 0xffedd5 : 0xfef3c7;
        if (num === 1) tileColor = 0xbbf7d0; // Start
        else if (num === 100) tileColor = 0xfef08a; // Finish
        else if (isLadder) tileColor = 0xdcfce7;
        else if (isSnake) tileColor = 0xfee2e2;

        const tileMat = new THREE.MeshStandardMaterial({
            color: tileColor,
            roughness: 0.6
        });

        const tileMesh = new THREE.Mesh(tileGeo, tileMat);
        tileMesh.position.set(coords.x, 0, coords.z);
        tileMesh.receiveShadow = true;
        tileMesh.castShadow = true;
        board3DGroup.add(tileMesh);
        tileMeshes[num] = tileMesh;

        // Number Label Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 52px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), 64, 64);

        if (isLadder) {
            ctx.font = '28px sans-serif';
            ctx.fillText('🪜', 64, 105);
        } else if (isSnake) {
            ctx.font = '28px sans-serif';
            ctx.fillText('🐍', 64, 105);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const labelGeo = new THREE.PlaneGeometry(1.8, 1.8);
        const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.rotation.x = -Math.PI / 2;
        labelMesh.position.set(coords.x, 0.18, coords.z);
        board3DGroup.add(labelMesh);
    }

    // Create 3D Ladders & Snakes Connectors
    if (typeof snakesAndLadders !== 'undefined') {
        Object.keys(snakesAndLadders).forEach(fromStr => {
            const from = parseInt(fromStr);
            const to = snakesAndLadders[from];
            const p1 = getTile3DCoords(from);
            const p2 = getTile3DCoords(to);

            if (to > from) {
                // LADDER (Green Beam / Ladder visual)
                const startVec = new THREE.Vector3(p1.x, 0.4, p1.z);
                const endVec = new THREE.Vector3(p2.x, 0.4, p2.z);
                const dir = new THREE.Vector3().subVectors(endVec, startVec);
                const len = dir.length();

                const railGeo = new THREE.CylinderGeometry(0.08, 0.08, len, 8);
                const railMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });

                const ladderGroup = new THREE.Group();
                const rail1 = new THREE.Mesh(railGeo, railMat);
                rail1.position.x = -0.3;
                const rail2 = new THREE.Mesh(railGeo, railMat);
                rail2.position.x = 0.3;
                ladderGroup.add(rail1);
                ladderGroup.add(rail2);

                const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
                ladderGroup.position.copy(mid);
                ladderGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
                board3DGroup.add(ladderGroup);
            } else {
                // SNAKE (Red curved tube)
                const startVec = new THREE.Vector3(p1.x, 0.4, p1.z);
                const endVec = new THREE.Vector3(p2.x, 0.4, p2.z);
                const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
                midVec.y += 1.8; // Arch above the board

                const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
                const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.14, 8, false);
                const tubeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
                const snakeMesh = new THREE.Mesh(tubeGeo, tubeMat);
                board3DGroup.add(snakeMesh);
            }
        });
    }

    // Create 3D Pawns
    pawnMeshes[1] = create3DPawn(0x3b82f6, 'P1'); // Player 1 Blue
    pawnMeshes[2] = create3DPawn(0xf97316, 'P2'); // Player 2 Orange
    board3DGroup.add(pawnMeshes[1]);
    board3DGroup.add(pawnMeshes[2]);

    sync3DPawns();

    // Render Loop
    function animate() {
        animReq3D = requestAnimationFrame(animate);
        if (controls3D) controls3D.update();
        if (renderer3D && scene3D && camera3D) {
            renderer3D.render(scene3D, camera3D);
        }
    }
    animate();

    window.addEventListener('resize', onWindowResize3D);
}

function create3DPawn(colorHex, label) {
    const group = new THREE.Group();

    // Base cylinder
    const baseGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.3, 16);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.1 });
    const base = new THREE.Mesh(baseGeo, mat);
    base.position.y = 0.15;
    base.castShadow = true;
    group.add(base);

    // Body cone
    const bodyGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    // Head sphere
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 1.3;
    head.castShadow = true;
    group.add(head);

    return group;
}

function sync3DPawns(animatedPawn = 0) {
    if (!is3DMode || !pawnMeshes[1] || !pawnMeshes[2]) return;

    const p1Pos = (typeof gameState !== 'undefined' && gameState.p1Pos) ? gameState.p1Pos : (window.gameState?.player1Pos || 1);
    const p2Pos = (typeof gameState !== 'undefined' && gameState.p2Pos) ? gameState.p2Pos : (window.gameState?.player2Pos || 1);

    const c1 = getTile3DCoords(p1Pos);
    const c2 = getTile3DCoords(p2Pos);

    // Slightly offset pawns if sharing the same tile
    const offset = (p1Pos === p2Pos) ? 0.35 : 0;

    pawnMeshes[1].position.set(c1.x - offset, 0.25, c1.z);
    pawnMeshes[2].position.set(c2.x + offset, 0.25, c2.z);
}

function onWindowResize3D() {
    const container = document.getElementById('board3DContainer');
    if (!container || !renderer3D || !camera3D) return;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    camera3D.aspect = width / height;
    camera3D.updateProjectionMatrix();
    renderer3D.setSize(width, height);
}

function toggle3DMode() {
    is3DMode = !is3DMode;
    const wrapper2D = document.querySelector('.board-wrapper');
    const container3D = document.getElementById('board3DContainer');
    const btn = document.getElementById('view3dToggleBtn');

    if (is3DMode) {
        if (wrapper2D) wrapper2D.style.display = 'none';
        if (container3D) container3D.style.display = 'block';
        if (btn) {
            btn.innerHTML = '<span>🗺️ Tampilan 2D</span>';
            btn.className = 'wood-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs border border-emerald-300';
        }
        if (!renderer3D) {
            init3DBoard();
        } else {
            onWindowResize3D();
            sync3DPawns();
        }
    } else {
        if (container3D) container3D.style.display = 'none';
        if (wrapper2D) wrapper2D.style.display = '';
        if (btn) {
            btn.innerHTML = '<span>🧊 Tampilan 3D</span>';
            btn.className = 'wood-btn bg-sky-100 hover:bg-sky-200 text-sky-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs border border-sky-300';
        }
    }
}

// Hook into existing updatePawnsUI
if (typeof window !== 'undefined') {
    window.sync3DPawns = sync3DPawns;
    window.toggle3DMode = toggle3DMode;
}
