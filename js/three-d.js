import * as THREE from "three";

const canvas = document.getElementById("game3d");
const miniMap = document.getElementById("miniMap");
const miniCtx = miniMap.getContext("2d");
const setupPanel = document.getElementById("setupPanel");
const startButton = document.getElementById("startButton");
const roleButtons = Array.from(document.querySelectorAll(".role-button"));
const roleReadout = document.getElementById("roleReadout");
const objectiveReadout = document.getElementById("objectiveReadout");
const promptReadout = document.getElementById("promptReadout");
const stateReadout = document.getElementById("stateReadout");

const WORLD = { width: 2400, height: 1760 };
const SCALE = 0.045;
const PLAYER_RADIUS = 22;
const SURVIVOR_SPEED = 250;
const HUNTER_SPEED = 286;
const REPAIR_REQUIRED = 5;
const REPAIR_DURATION = 60000;
const GATE_OPEN_DURATION = 25000;
const INTERACT_RANGE = 110;
const GATE_INTERACT_RANGE = 170;
const ATTACK_RANGE = 118;
const VAULT_EXIT_OFFSET = 92;
const PALLET_DROP_RANGE = 118;
const CARRY_RANGE = 118;
const HUNTER_HIT_RECOVERY = 3000;
const HUNTER_MISS_RECOVERY = 760;
const PALLET_STUN_DURATION = 3000;
const PALLET_BREAK_DURATION = 1550;
const PALLET_DROP_ANIMATION = 260;
const SURVIVOR_INJURED_SPEED_MULTIPLIER = 0.88;
const SURVIVOR_HIT_BOOST_DURATION = 1800;
const SURVIVOR_HIT_BOOST_MULTIPLIER = 1.45;
const AI_SURVIVOR_KITE_RANGE = 560;
const AI_SURVIVOR_PALLET_USE_RANGE = 220;
const AI_SURVIVOR_WINDOW_USE_RANGE = 250;
const AI_HUNTER_TARGET_LOCK_AFTER_HIT = 7600;
const AI_HUNTER_TARGET_LOCK_MAX_DISTANCE = 980;
const LOOK_SPEED = 1.15;
const PITCH_SPEED = 0.72;
const CAMERA_BACK = 260;
const CAMERA_HEIGHT = 132;

const keys = new Set();
let selectedRole = "survivor";
let running = false;
let lastTime = performance.now();
let matchResult = "";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09130e);
scene.fog = new THREE.Fog(0x09130e, 42, 92);

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 240);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xdce9dc, 0x1b241d, 1.7);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffedbf, 2.4);
sun.position.set(-20, 42, -18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -70;
sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70;
sun.shadow.camera.bottom = -70;
scene.add(sun);

const materials = {
  ground: new THREE.MeshStandardMaterial({ color: 0x1f2c22, roughness: 0.96 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x1a221b, roughness: 0.9 }),
  lowWall: new THREE.MeshStandardMaterial({ color: 0x293626, roughness: 0.92 }),
  window: new THREE.MeshStandardMaterial({ color: 0xb7d6c1, roughness: 0.58, metalness: 0.05 }),
  windowFrame: new THREE.MeshStandardMaterial({ color: 0x5f7c69, roughness: 0.74, metalness: 0.04 }),
  windowGlass: new THREE.MeshStandardMaterial({ color: 0x9fd8e6, roughness: 0.18, metalness: 0.02, transparent: true, opacity: 0.42 }),
  pallet: new THREE.MeshStandardMaterial({ color: 0x9a6137, roughness: 0.72 }),
  palletBrace: new THREE.MeshStandardMaterial({ color: 0x6d4328, roughness: 0.78 }),
  repair: new THREE.MeshStandardMaterial({ color: 0xd9b76a, roughness: 0.5, metalness: 0.08 }),
  complete: new THREE.MeshStandardMaterial({ color: 0x75c291, roughness: 0.48, metalness: 0.08 }),
  chair: new THREE.MeshStandardMaterial({ color: 0x6e594b, roughness: 0.75 }),
  gate: new THREE.MeshStandardMaterial({ color: 0x557568, roughness: 0.64 }),
  survivor: new THREE.MeshStandardMaterial({ color: 0x74b98d, roughness: 0.62 }),
  player: new THREE.MeshStandardMaterial({ color: 0xd9b76a, roughness: 0.54 }),
  hunter: new THREE.MeshStandardMaterial({ color: 0xd77b6e, roughness: 0.55 }),
  downed: new THREE.MeshStandardMaterial({ color: 0x5a6670, roughness: 0.72 })
};

const walls = [
  rect(0, 0, WORLD.width, 54), rect(0, WORLD.height - 54, WORLD.width, 54),
  rect(0, 0, 54, WORLD.height), rect(WORLD.width - 54, 0, 54, WORLD.height),
  rect(250, 190, 360, 70), rect(760, 170, 92, 390), rect(1010, 170, 430, 76),
  rect(1650, 160, 92, 360), rect(330, 470, 90, 420), rect(540, 620, 460, 80),
  rect(1210, 460, 90, 520), rect(1450, 640, 410, 78), rect(1900, 480, 80, 430),
  rect(170, 1030, 420, 80), rect(760, 930, 88, 420), rect(1020, 1120, 360, 86),
  rect(610, 190, 40, 70, "low"), rect(720, 190, 40, 70, "low"),
  rect(1000, 620, 50, 80, "low"), rect(1140, 620, 70, 80, "low"),
  rect(590, 1030, 40, 80, "low"), rect(720, 1030, 40, 80, "low"),
  rect(1440, 1120, 40, 86, "low"), rect(1560, 1120, 40, 86, "low"),
  rect(1890, 1124, 44, 72, "low"), rect(2006, 1124, 44, 72, "low"),
  rect(1760, 1464, 44, 72, "low"), rect(1876, 1464, 44, 72, "low"),
  rect(2050, 1204, 44, 72, "low"), rect(2166, 1204, 44, 72, "low"),
  rect(2070, 1564, 44, 72, "low"), rect(2186, 1564, 44, 72, "low")
];

const pallets = [
  prop(685, 225, 82, 10), prop(1095, 660, 92, 10), prop(675, 1070, 92, 10),
  prop(1520, 1163, 84, 10), prop(1970, 1160, 68, 10), prop(1840, 1500, 68, 10),
  prop(2130, 1240, 68, 10), prop(2150, 1600, 68, 10)
];
pallets.forEach((item) => { item.dropped = false; item.destroyed = false; });

const windows = [
  prop(390, 225, 118, 44), prop(806, 350, 44, 118), prop(1220, 208, 118, 44),
  prop(1696, 320, 44, 118), prop(375, 685, 44, 118), prop(750, 660, 118, 44),
  prop(1255, 700, 44, 118), prop(360, 1070, 118, 44), prop(805, 1140, 44, 118)
];

const repairPoints = [
  point(585, 360), point(1130, 375), point(1800, 330), point(1040, 850), point(440, 1270),
  point(1620, 1320), point(1980, 1120), point(2120, 1500), point(2250, 820)
];
const exitGates = [point(190, 720), point(2240, 1460)];
exitGates.forEach((item) => { item.opened = false; });
const chairs = [
  point(190, 320), point(520, 320), point(910, 330), point(1450, 320), point(1970, 330),
  point(220, 560), point(700, 520), point(1120, 520), point(1530, 520), point(2190, 650),
  point(260, 860), point(650, 830), point(1110, 900), point(1540, 850), point(2040, 1060),
  point(360, 1320), point(1180, 1320), point(1730, 1440), point(2220, 1300), point(2260, 1600)
];

const player = actor("survivor", 340, 330, "你");
const hunter = actor("hunter", 960, 360, "追捕者");
const teammates = [
  actor("survivor", 1120, 380, "队友1"),
  actor("survivor", 460, 1260, "队友2"),
  actor("survivor", 1720, 1180, "队友3")
];
const actors = [player, hunter, ...teammates];

buildScene();
resize();
resetMatch();
requestAnimationFrame(loop);

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role || "survivor";
    roleButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
  });
});
startButton.addEventListener("click", () => {
  resetMatch();
  setupPanel.classList.add("is-hidden");
  running = true;
  lastTime = performance.now();
});
window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "Space") {
    event.preventDefault();
    interact();
  }
  if (event.code === "KeyE") {
    event.preventDefault();
    useObjective();
  }
  if (event.code === "KeyJ") attack();
  if (event.code === "KeyR") resetMatch();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));

function rect(x, y, w, h, level = "high") {
  return { x, y, w, h, level };
}

function prop(x, y, w, h) {
  return { x, y, w, h };
}

function point(x, y) {
  return { x, y, progress: 0, completed: false };
}

function actor(type, x, y, name) {
  return {
    type, x, y, name,
    radius: type === "hunter" ? 25 : 22,
    yaw: 0, pitch: -0.08, vx: 0, vy: 0,
    health: type === "hunter" ? 999 : 2,
    state: "healthy", escaped: false, action: null, nextAttackAt: 0,
    stunnedUntil: 0, wipeUntil: 0, lastAttackHit: false, carrying: null,
    boostUntil: 0, target: null, targetLock: null, targetLockUntil: 0, lastTargetHitAt: 0
  };
}

function toScene(x, y, height = 0) {
  return new THREE.Vector3((x - WORLD.width / 2) * SCALE, height, (y - WORLD.height / 2) * SCALE);
}

function buildScene() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.width * SCALE, WORLD.height * SCALE),
    materials.ground
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(Math.max(WORLD.width, WORLD.height) * SCALE, 30, 0x50654d, 0x2b382d);
  grid.position.y = 0.012;
  scene.add(grid);

  walls.forEach((item) => addBox(item, getWallHeight(item), item.level === "low" ? materials.lowWall : materials.wall));
  windows.forEach(addWindowModel);
  pallets.forEach(addPalletModel);
  repairPoints.forEach((item) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 1.15, 12), materials.repair);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(toScene(item.x, item.y, 0.58));
    item.mesh = mesh;
    scene.add(mesh);
  });
  exitGates.forEach((item) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 2.8, 3.2), materials.gate);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(toScene(item.x, item.y, 1.4));
    item.mesh = mesh;
    scene.add(mesh);
  });
  chairs.forEach((item) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.05, 0.8), materials.chair);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(toScene(item.x, item.y, 0.52));
    scene.add(mesh);
  });
  actors.forEach((item) => {
    item.mesh = makeActorMesh(item);
    scene.add(item.mesh);
  });
}

function addBox(item, height, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(item.w * SCALE, height, item.h * SCALE), material);
  mesh.position.copy(toScene(item.x + item.w / 2, item.y + item.h / 2, height / 2));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function getWallHeight(item) {
  if (item.level === "low") return 1.35;
  if (isBoundaryWall(item)) return 7.2;
  const longSide = Math.max(item.w, item.h);
  if (longSide >= 420) return 6.4;
  if (longSide >= 300) return 5.8;
  return 4.8;
}

function isBoundaryWall(item) {
  return item.x <= 0 || item.y <= 0 || item.x + item.w >= WORLD.width || item.y + item.h >= WORLD.height;
}

function addPropBox(item, height, material, centerX, centerY, width = item.w * SCALE, depth = item.h * SCALE) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(Math.max(width, 0.08), height, Math.max(depth, 0.08)), material);
  mesh.position.copy(toScene(centerX, centerY, height / 2));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function addWindowModel(item) {
  const centerX = item.x + item.w / 2;
  const centerY = item.y + item.h / 2;
  const width = Math.max(item.w * SCALE, 1.2);
  const depth = Math.max(item.h * SCALE, 0.22);
  const frame = 0.14;
  if (item.w >= item.h) {
    addPropBox(item, 0.26, materials.windowFrame, centerX, centerY, width + frame, depth + frame).position.y = 0.35;
    addPropBox(item, 1.55, materials.windowFrame, item.x + 8, centerY, frame, depth + frame);
    addPropBox(item, 1.55, materials.windowFrame, item.x + item.w - 8, centerY, frame, depth + frame);
    addPropBox(item, 0.18, materials.windowFrame, centerX, centerY, width + frame, depth + frame).position.y = 1.58;
    addPropBox(item, 0.08, materials.windowFrame, centerX, centerY, width - 0.22, depth + frame).position.y = 1.02;
    addPropBox(item, 1.0, materials.windowGlass, centerX, centerY, width - 0.32, Math.max(0.04, depth * 0.42)).position.y = 1.02;
    return;
  }
  addPropBox(item, 0.26, materials.windowFrame, centerX, centerY, width + frame, depth + frame).position.y = 0.35;
  addPropBox(item, 1.55, materials.windowFrame, centerX, item.y + 8, width + frame, frame);
  addPropBox(item, 1.55, materials.windowFrame, centerX, item.y + item.h - 8, width + frame, frame);
  addPropBox(item, 0.18, materials.windowFrame, centerX, centerY, width + frame, depth + frame).position.y = 1.58;
  addPropBox(item, 0.08, materials.windowFrame, centerX, centerY, width + frame, depth - 0.22).position.y = 1.02;
  addPropBox(item, 1.0, materials.windowGlass, centerX, centerY, Math.max(0.04, width * 0.42), depth - 0.32).position.y = 1.02;
}

function addPalletModel(item) {
  const centerX = item.x + item.w / 2;
  const centerY = item.y + item.h / 2;
  const horizontal = item.w >= item.h;
  const width = Math.max(item.w * SCALE, 0.34);
  const depth = Math.max(item.h * SCALE, 0.12);
  const upright = new THREE.Group();
  upright.position.copy(toScene(centerX, centerY, 0));
  const sideOffset = 0.36;
  addLocalBox(upright, width, 1.42, depth, materials.pallet, horizontal ? 0 : -sideOffset, 0.71, horizontal ? -sideOffset : 0);
  if (horizontal) {
    addLocalBox(upright, width + 0.04, 0.16, depth + 0.04, materials.palletBrace, 0, 0.52, -sideOffset - 0.18);
    addLocalBox(upright, width + 0.04, 0.16, depth + 0.04, materials.palletBrace, 0, 1.05, -sideOffset + 0.18);
    addLocalBox(upright, 0.12, 1.55, 0.12, materials.palletBrace, -width / 2 - 0.12, 0.78, -sideOffset);
    addLocalBox(upright, 0.12, 1.55, 0.12, materials.palletBrace, width / 2 + 0.12, 0.78, -sideOffset);
  } else {
    addLocalBox(upright, width + 0.04, 0.16, depth + 0.04, materials.palletBrace, -sideOffset - 0.18, 0.52, 0);
    addLocalBox(upright, width + 0.04, 0.16, depth + 0.04, materials.palletBrace, -sideOffset + 0.18, 1.05, 0);
    addLocalBox(upright, 0.12, 1.55, 0.12, materials.palletBrace, -sideOffset, 0.78, -depth / 2 - 0.12);
    addLocalBox(upright, 0.12, 1.55, 0.12, materials.palletBrace, -sideOffset, 0.78, depth / 2 + 0.12);
  }
  scene.add(upright);

  const dropped = new THREE.Group();
  dropped.position.copy(toScene(centerX, centerY, 0));
  addLocalBox(
    dropped,
    item.w >= item.h ? width : Math.max(width, 1.12),
    0.22,
    item.w >= item.h ? Math.max(depth, 1.12) : depth,
    materials.pallet,
    0,
    0.11,
    0
  );
  addLocalBox(
    dropped,
    item.w >= item.h ? width + 0.04 : Math.max(width, 1.18),
    0.12,
    item.w >= item.h ? Math.max(depth, 1.18) : depth + 0.04,
    materials.palletBrace,
    0,
    0.26,
    0
  );
  dropped.visible = false;
  scene.add(dropped);
  item.mesh = upright;
  item.droppedMesh = dropped;
  item.horizontal = horizontal;
}

function addLocalBox(group, width, height, depth, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function makeActorMesh(item) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(item.radius * SCALE * 0.78, 1.05, 6, 12),
    item === player ? materials.player : item.type === "hunter" ? materials.hunter : materials.survivor
  );
  body.castShadow = true;
  body.position.y = 0.98;
  group.add(body);
  const marker = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.7), new THREE.MeshBasicMaterial({ color: 0xf2f7ef }));
  marker.position.set(0, 1.48, -0.44);
  group.add(marker);
  return group;
}

function resetMatch() {
  Object.assign(player, { x: 340, y: 330, yaw: 0.2, pitch: -0.08, vx: 0, vy: 0, state: "healthy", health: 2, escaped: false, eliminated: false, action: null, boostUntil: 0 });
  Object.assign(hunter, { x: 960, y: 360, yaw: 0, vx: 0, vy: 0, state: "healthy", health: 999, action: null, nextAttackAt: 0, carrying: null, stunnedUntil: 0, wipeUntil: 0, lastAttackHit: false, target: null, targetLock: null, targetLockUntil: 0, lastTargetHitAt: 0 });
  const starts = [[1120, 380], [460, 1260], [1720, 1180]];
  teammates.forEach((item, index) => Object.assign(item, { x: starts[index][0], y: starts[index][1], vx: 0, vy: 0, state: "healthy", health: 2, escaped: false, eliminated: false, action: null, boostUntil: 0 }));
  pallets.forEach((item) => {
    item.dropped = false;
    item.destroyed = false;
    item.dropStartedAt = 0;
    if (item.mesh) {
      item.mesh.visible = true;
      item.mesh.rotation.x = 0;
      item.mesh.rotation.z = 0;
    }
    if (item.droppedMesh) item.droppedMesh.visible = false;
  });
  repairPoints.forEach((item) => { item.progress = 0; item.completed = false; if (item.mesh) item.mesh.material = materials.repair; });
  exitGates.forEach((item) => { item.progress = 0; item.opened = false; if (item.mesh) item.mesh.material = materials.gate; });
  matchResult = "";
  updateMeshes();
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  miniMap.width = Math.floor(miniMap.clientWidth * Math.min(window.devicePixelRatio || 1, 2));
  miniMap.height = Math.floor(miniMap.clientHeight * Math.min(window.devicePixelRatio || 1, 2));
}

function loop(now) {
  const dt = Math.min(0.033, Math.max(0, (now - lastTime) / 1000));
  lastTime = now;
  if (running) update(dt, now);
  updateMeshes(now);
  updateCamera();
  renderer.render(scene, camera);
  drawMiniMap();
  requestAnimationFrame(loop);
}

function update(dt, now) {
  const controlled = selectedRole === "hunter" ? hunter : player;
  if (keys.has("ArrowLeft")) controlled.yaw += LOOK_SPEED * dt;
  if (keys.has("ArrowRight")) controlled.yaw -= LOOK_SPEED * dt;
  if (keys.has("ArrowUp")) controlled.pitch = clamp(controlled.pitch + PITCH_SPEED * dt, -0.34, 0.26);
  if (keys.has("ArrowDown")) controlled.pitch = clamp(controlled.pitch - PITCH_SPEED * dt, -0.34, 0.26);

  updatePlayerMovement(controlled, dt);
  syncCarriedSurvivor();
  updateActions(dt, now);
  updateAI(dt, now);
  syncCarriedSurvivor();
  updateReadouts(controlled, now);
}

function updatePlayerMovement(controlled, dt) {
  if (controlled.escaped || isDisabledSurvivor(controlled) || controlled.action || isHunterBusy(controlled, performance.now())) {
    moveActor(controlled, 0, 0, dt);
    return;
  }
  const forward = (keys.has("KeyW") ? 1 : 0) - (keys.has("KeyS") ? 1 : 0);
  const strafe = (keys.has("KeyD") ? 1 : 0) - (keys.has("KeyA") ? 1 : 0);
  const len = Math.hypot(forward, strafe) || 1;
  const speed = controlled.type === "hunter" ? HUNTER_SPEED : getSurvivorSpeed(controlled, performance.now());
  const vx = (Math.sin(controlled.yaw) * forward + Math.sin(controlled.yaw + Math.PI / 2) * strafe) / len * speed;
  const vy = (Math.cos(controlled.yaw) * forward + Math.cos(controlled.yaw + Math.PI / 2) * strafe) / len * speed;
  moveActor(controlled, vx, vy, dt);
}

function updateAI(dt, now) {
  if (selectedRole !== "hunter") updateAIHunter(dt, now);

  const aiSurvivors = selectedRole === "hunter" ? [player, ...teammates] : teammates;
  aiSurvivors.forEach((survivor) => {
    if (survivor.escaped || isDisabledSurvivor(survivor)) {
      moveActor(survivor, 0, 0, dt);
      return;
    }
    const threat = selectedRole === "hunter" ? playerControlledHunter() : hunter;
    const threatDistance = distanceBetween(survivor, threat);
    if (threatDistance < AI_SURVIVOR_KITE_RANGE && !survivor.action) {
      handleAISurvivorKite(survivor, threat, threatDistance, dt, now);
      return;
    }
    const target = getAIObjective(survivor);
    if (!target) {
      moveActor(survivor, 0, 0, dt);
      return;
    }
    if (exitGates.includes(target) && areExitsPowered()) {
      if (distanceBetween(survivor, target) < GATE_INTERACT_RANGE) {
        if (target.opened) {
          survivor.escaped = true;
          survivor.action = null;
        } else if (!survivor.action || survivor.action.target !== target) {
          survivor.action = { kind: "gate", target };
        }
        moveActor(survivor, 0, 0, dt);
        return;
      }
      survivor.action = null;
      const approach = getGateApproachPoint(target);
      moveToward(survivor, approach.x, approach.y, getSurvivorSpeed(survivor, now), dt);
      return;
    }
    if (distanceBetween(survivor, target) < INTERACT_RANGE) {
      if (!survivor.action) survivor.action = { kind: exitGates.includes(target) ? "gate" : "repair", target };
      moveActor(survivor, 0, 0, dt);
    } else {
      survivor.action = null;
      moveToward(survivor, target.x, target.y, getSurvivorSpeed(survivor, now), dt);
    }
  });
}

function playerControlledHunter() {
  return selectedRole === "hunter" ? hunter : player;
}

function getSurvivorSpeed(item, now = performance.now()) {
  if (!item || item.type !== "survivor") return SURVIVOR_SPEED;
  const injured = item.state === "injured" ? SURVIVOR_INJURED_SPEED_MULTIPLIER : 1;
  const hitBoost = now < (item.boostUntil || 0) ? SURVIVOR_HIT_BOOST_MULTIPLIER : 1;
  return SURVIVOR_SPEED * injured * hitBoost;
}

function handleAISurvivorKite(survivor, threat, threatDistance, dt, now) {
  if (tryAISurvivorUseObstacle(survivor, threat, threatDistance, now)) {
    moveActor(survivor, 0, 0, dt);
    return;
  }
  const destination = getKiteDestination3D(survivor, threat);
  moveToward(survivor, destination.x, destination.y, getSurvivorSpeed(survivor, now), dt);
}

function tryAISurvivorUseObstacle(survivor, threat, threatDistance, now) {
  const pallet = findNearbyPallet(survivor);
  if (pallet && threatDistance < AI_SURVIVOR_PALLET_USE_RANGE && distanceToProp(threat, pallet) < 132) {
    dropPallet(survivor, pallet);
    return true;
  }
  const dropped = findNearbyDroppedPallet(survivor);
  if (dropped && threatDistance < AI_SURVIVOR_WINDOW_USE_RANGE) {
    vaultWindow(survivor, dropped);
    return true;
  }
  const windowProp = findNearbyWindow(survivor);
  if (windowProp && (threatDistance < AI_SURVIVOR_WINDOW_USE_RANGE || !hasWalkableLine3D(survivor.x, survivor.y, threat.x, threat.y, survivor.radius))) {
    vaultWindow(survivor, windowProp);
    return true;
  }
  return false;
}

function getKiteDestination3D(survivor, threat) {
  const away = normalize(survivor.x - threat.x, survivor.y - threat.y);
  const tangent = { x: -away.y, y: away.x };
  const options = [
    { x: survivor.x + away.x * 280, y: survivor.y + away.y * 280 },
    { x: survivor.x + away.x * 220 + tangent.x * 150, y: survivor.y + away.y * 220 + tangent.y * 150 },
    { x: survivor.x + away.x * 220 - tangent.x * 150, y: survivor.y + away.y * 220 - tangent.y * 150 }
  ];
  return options.find((item) => canStandAt(item.x, item.y, survivor.radius)) || {
    x: clamp(survivor.x + away.x * 180, 90, WORLD.width - 90),
    y: clamp(survivor.y + away.y * 180, 90, WORLD.height - 90)
  };
}

function chooseHunterTarget3D(now) {
  const locked = getValidHunterTargetLock3D(now);
  if (locked) return locked;
  return [player, ...teammates]
    .filter((item) => isValidHunterTarget3D(item))
    .sort((a, b) => {
      const stickyA = a === hunter.target ? -360 : 0;
      const stickyB = b === hunter.target ? -360 : 0;
      return distanceBetween(hunter, a) + stickyA - (distanceBetween(hunter, b) + stickyB);
    })[0] || null;
}

function getValidHunterTargetLock3D(now) {
  const target = hunter.targetLock || hunter.target;
  if (!isValidHunterTarget3D(target)) {
    clearHunterTargetLock3D();
    return null;
  }
  if (now >= (hunter.targetLockUntil || 0)) return null;
  if (distanceBetween(hunter, target) > AI_HUNTER_TARGET_LOCK_MAX_DISTANCE) {
    clearHunterTargetLock3D();
    return null;
  }
  return target;
}

function isValidHunterTarget3D(item) {
  return Boolean(item && item.type === "survivor" && !item.escaped && !isDisabledSurvivor(item) && !item.eliminated);
}

function lockHunterTarget3D(target, now) {
  if (!isValidHunterTarget3D(target)) return;
  hunter.target = target;
  hunter.targetLock = target;
  hunter.targetLockUntil = Math.max(hunter.targetLockUntil || 0, now + AI_HUNTER_TARGET_LOCK_AFTER_HIT);
  hunter.lastTargetHitAt = now;
}

function clearHunterTargetLock3D() {
  hunter.targetLock = null;
  hunter.targetLockUntil = 0;
}

function findRouteWindow3D(actorItem, target) {
  return windows
    .filter((item) => distanceToProp(actorItem, item) < INTERACT_RANGE + 38)
    .sort((a, b) => distanceBetween(propCenter(a), target) - distanceBetween(propCenter(b), target))[0] || null;
}

function hasWalkableLine3D(fromX, fromY, toX, toY, radius) {
  const distance = Math.hypot(toX - fromX, toY - fromY);
  const steps = Math.max(1, Math.ceil(distance / 48));
  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    const x = fromX + (toX - fromX) * t;
    const y = fromY + (toY - fromY) * t;
    if (!canStandAt(x, y, radius)) return false;
  }
  return true;
}

function updateAIHunter(dt, now) {
  if (isHunterBusy(hunter, now)) {
    moveActor(hunter, 0, 0, dt);
    return;
  }
  const target = chooseHunterTarget3D(now);
  hunter.target = target;
  if (!target) {
    moveActor(hunter, 0, 0, dt);
    return;
  }
  const blockingPallet = findNearbyDroppedPallet(hunter);
  if (blockingPallet && (!hasWalkableLine3D(hunter.x, hunter.y, target.x, target.y, hunter.radius) || distanceToProp(hunter, blockingPallet) < 86)) {
    stompPallet(blockingPallet);
    moveActor(hunter, 0, 0, dt);
    return;
  }
  const routeWindow = findRouteWindow3D(hunter, target);
  if (routeWindow && !hasWalkableLine3D(hunter.x, hunter.y, target.x, target.y, hunter.radius)) {
    vaultWindow(hunter, routeWindow);
    moveActor(hunter, 0, 0, dt);
    return;
  }
  const angle = Math.atan2(target.x - hunter.x, target.y - hunter.y);
  hunter.yaw = turnToward(hunter.yaw, angle, dt * 2.8);
  if (distanceBetween(hunter, target) <= ATTACK_RANGE && now >= hunter.nextAttackAt) {
    damageSurvivor(target, now);
    lockHunterTarget3D(target, now);
    startHunterWipe(now, true);
    moveActor(hunter, 0, 0, dt);
    return;
  }
  moveToward(hunter, target.x, target.y, HUNTER_SPEED, dt);
}

function updateActions(dt, now) {
  updateHunterAction(now);
  [player, ...teammates].forEach((item) => {
    if (!item.action || isDisabledSurvivor(item) || item.escaped) return;
    const target = item.action.target;
    const actionRange = item.action.kind === "gate" ? GATE_INTERACT_RANGE + 28 : INTERACT_RANGE + 24;
    if (distanceBetween(item, target) > actionRange) {
      item.action = null;
      return;
    }
    if (item.action.kind === "repair") {
      target.progress = Math.min(1, target.progress + (dt * 1000) / REPAIR_DURATION);
      if (target.progress >= 1) {
        target.completed = true;
        target.mesh.material = materials.complete;
        item.action = null;
      }
      return;
    }
    if (item.action.kind === "gate" && !areExitsPowered()) {
      item.action = null;
      return;
    }
    if (item.action.kind === "gate") {
      if (target.opened) {
        item.escaped = true;
        item.action = null;
        return;
      }
      target.progress = Math.min(1, target.progress + (dt * 1000) / GATE_OPEN_DURATION);
      if (target.progress >= 1) {
        target.opened = true;
        target.mesh.material = materials.complete;
        item.action = null;
      }
    }
  });
}

function updateHunterAction(now) {
  if (!hunter.action || hunter.action.kind !== "breaking") return;
  moveActor(hunter, 0, 0, 0);
  if (now < hunter.action.until) return;
  finishStompPallet(hunter.action.pallet);
  hunter.action = null;
  stateReadout.textContent = "木板已踩碎";
}

function interact() {
  if (!running) return;
  if (selectedRole === "hunter") {
    handleHunterInteract();
    return;
  }
  const pallet = findNearbyPallet(player);
  const windowProp = findNearbyWindow(player);
  if (pallet || windowProp) {
    if (pallet && (!windowProp || distanceToProp(player, pallet) <= distanceToProp(player, windowProp))) dropPallet(player, pallet);
    else vaultWindow(player, windowProp);
  }
}

function useObjective() {
  if (!running || selectedRole === "hunter") return;
  if (player.action) {
    player.action = null;
    return;
  }
  if (areExitsPowered()) {
    const gate = nearest(player, exitGates);
    if (gate && distanceBetween(player, gate) < GATE_INTERACT_RANGE) {
      if (gate.opened) player.escaped = true;
      else player.action = { kind: "gate", target: gate };
      return;
    }
  }
  const repair = nearest(player, repairPoints.filter((item) => !item.completed));
  if (repair && distanceBetween(player, repair) < INTERACT_RANGE + 20) {
    player.action = { kind: "repair", target: repair };
  }
}

function handleHunterInteract() {
  const now = performance.now();
  if (isHunterBusy(hunter, now)) return;
  if (hunter.carrying) {
    const chair = nearest(hunter, chairs);
    if (chair && distanceBetween(hunter, chair) < INTERACT_RANGE + 34) {
      chairSurvivor(hunter.carrying, chair);
      return;
    }
    stateReadout.textContent = "寻找椅子";
    return;
  }
  const target = nearest(hunter, [player, ...teammates].filter((item) => item.state === "downed" && !item.escaped && !item.eliminated));
  if (target && distanceBetween(hunter, target) < CARRY_RANGE) {
    pickUpSurvivor(target);
    return;
  }
  const droppedPallet = findNearbyDroppedPallet(hunter);
  const windowProp = findNearbyWindow(hunter);
  if (droppedPallet || windowProp) {
    if (droppedPallet && (!windowProp || distanceToProp(hunter, droppedPallet) <= distanceToProp(hunter, windowProp))) stompPallet(droppedPallet);
    else vaultWindow(hunter, windowProp);
  }
}

function findNearbyWindow(item) {
  return windows
    .filter((windowItem) => distanceToProp(item, windowItem) < INTERACT_RANGE)
    .sort((a, b) => distanceToProp(item, a) - distanceToProp(item, b))[0] || null;
}

function findNearbyPallet(item) {
  return pallets
    .filter((palletItem) => !palletItem.dropped && !palletItem.destroyed && distanceToProp(item, palletItem) < PALLET_DROP_RANGE)
    .sort((a, b) => distanceToProp(item, a) - distanceToProp(item, b))[0] || null;
}

function findNearbyDroppedPallet(item) {
  return pallets
    .filter((palletItem) => palletItem.dropped && !palletItem.destroyed && distanceToProp(item, palletItem) < PALLET_DROP_RANGE)
    .sort((a, b) => distanceToProp(item, a) - distanceToProp(item, b))[0] || null;
}

function vaultWindow(item, windowItem) {
  const center = propCenter(windowItem);
  let nextX = item.x;
  let nextY = item.y;
  if (windowItem.w >= windowItem.h) {
    const side = Math.sign(item.y - center.y) || Math.sign(Math.cos(item.yaw)) || 1;
    nextX = clamp(item.x, windowItem.x + item.radius, windowItem.x + windowItem.w - item.radius);
    nextY = center.y - side * VAULT_EXIT_OFFSET;
  } else {
    const side = Math.sign(item.x - center.x) || Math.sign(Math.sin(item.yaw)) || 1;
    nextX = center.x - side * VAULT_EXIT_OFFSET;
    nextY = clamp(item.y, windowItem.y + item.radius, windowItem.y + windowItem.h - item.radius);
  }
  if (!canStandAt(nextX, nextY, item.radius, item)) {
    stateReadout.textContent = "窗户另一侧被挡住";
    return;
  }
  item.x = nextX;
  item.y = nextY;
  item.vx = 0;
  item.vy = 0;
  stateReadout.textContent = `${item.name} 翻窗`;
}

function dropPallet(item, pallet) {
  const now = performance.now();
  pallet.dropped = true;
  pallet.dropStartedAt = now;
  if (pallet.mesh) pallet.mesh.visible = true;
  if (pallet.droppedMesh) pallet.droppedMesh.visible = false;
  pushActorOffPallet(item, pallet);
  stateReadout.textContent = `${item.name} 放下木板`;
  if (distanceToProp(hunter, pallet) < 92 && now >= (hunter.stunnedUntil || 0)) {
    pushActorOffPallet(hunter, pallet);
    stunHunter(now, PALLET_STUN_DURATION);
    stateReadout.textContent = "木板砸中追捕者";
  }
}

function stompPallet(pallet) {
  const now = performance.now();
  if (isHunterBusy(hunter, now)) return;
  hunter.action = { kind: "breaking", pallet, start: now, until: now + PALLET_BREAK_DURATION };
  hunter.nextAttackAt = Math.max(hunter.nextAttackAt, hunter.action.until);
  stateReadout.textContent = "追捕者踩板中";
}

function finishStompPallet(pallet) {
  pallet.dropped = false;
  pallet.destroyed = true;
  if (pallet.mesh) {
    pallet.mesh.visible = false;
    pallet.mesh.rotation.x = 0;
    pallet.mesh.rotation.z = 0;
  }
  if (pallet.droppedMesh) pallet.droppedMesh.visible = false;
}

function pushActorOffPallet(actorItem, pallet) {
  const center = propCenter(pallet);
  const block = getDroppedPalletBlock(pallet);
  if (!circleHitsRect(actorItem.x, actorItem.y, actorItem.radius, block)) return;
  const horizontal = pallet.w >= pallet.h;
  const side = horizontal
    ? Math.sign(actorItem.y - center.y) || Math.sign(Math.cos(actorItem.yaw)) || 1
    : Math.sign(actorItem.x - center.x) || Math.sign(Math.sin(actorItem.yaw)) || 1;
  const candidates = [side, -side].map((direction) => horizontal
    ? { x: clamp(actorItem.x, pallet.x + actorItem.radius, pallet.x + pallet.w - actorItem.radius), y: center.y + direction * (32 + actorItem.radius + 10) }
    : { x: center.x + direction * (32 + actorItem.radius + 10), y: clamp(actorItem.y, pallet.y + actorItem.radius, pallet.y + pallet.h - actorItem.radius) });
  const target = candidates.find((candidate) => canStandAt(candidate.x, candidate.y, actorItem.radius, actorItem));
  if (!target) return;
  actorItem.x = target.x;
  actorItem.y = target.y;
  actorItem.vx = 0;
  actorItem.vy = 0;
}

function pickUpSurvivor(target) {
  target.state = "carried";
  target.action = null;
  hunter.carrying = target;
  syncCarriedSurvivor();
  stateReadout.textContent = `牵起 ${target.name}`;
}

function chairSurvivor(target, chair) {
  target.state = "chaired";
  target.eliminated = true;
  target.action = null;
  target.x = chair.x;
  target.y = chair.y;
  target.vx = 0;
  target.vy = 0;
  hunter.carrying = null;
  stateReadout.textContent = `${target.name} 已上椅`;
}

function attack() {
  if (!running || selectedRole !== "hunter") return;
  const now = performance.now();
  if (isHunterBusy(hunter, now) || now < hunter.nextAttackAt) return;
  const target = [player, ...teammates]
    .filter((item) => !item.escaped && !isDisabledSurvivor(item) && distanceBetween(hunter, item) <= ATTACK_RANGE)
    .sort((a, b) => distanceBetween(hunter, a) - distanceBetween(hunter, b))[0];
  if (target) damageSurvivor(target, now);
  startHunterWipe(now, Boolean(target));
}

function startHunterWipe(now, hit) {
  hunter.lastAttackHit = hit;
  const duration = hit ? HUNTER_HIT_RECOVERY : HUNTER_MISS_RECOVERY;
  hunter.wipeUntil = now + duration;
  hunter.nextAttackAt = hunter.wipeUntil;
  stateReadout.textContent = hit ? "追捕者擦刀" : "追捕者空刀硬直";
}

function damageSurvivor(target, now) {
  target.health -= 1;
  if (target.health <= 0) {
    target.state = "downed";
    target.action = null;
    target.boostUntil = 0;
  } else {
    target.state = "injured";
    target.boostUntil = Math.max(target.boostUntil || 0, now + SURVIVOR_HIT_BOOST_DURATION);
  }
  stateReadout.textContent = `${target.name} 受击`;
}

function stunHunter(now, duration) {
  if (hunter.action) hunter.action = null;
  dropCarriedSurvivor();
  hunter.stunnedUntil = Math.max(hunter.stunnedUntil || 0, now + duration);
  hunter.wipeUntil = 0;
  hunter.nextAttackAt = Math.max(hunter.nextAttackAt, hunter.stunnedUntil);
  hunter.vx = 0;
  hunter.vy = 0;
}

function dropCarriedSurvivor() {
  if (!hunter.carrying) return;
  const carried = hunter.carrying;
  hunter.carrying = null;
  carried.state = "downed";
  carried.x = hunter.x - Math.sin(hunter.yaw) * 58;
  carried.y = hunter.y - Math.cos(hunter.yaw) * 58;
  carried.vx = 0;
  carried.vy = 0;
}

function getAIObjective(item) {
  if (areExitsPowered()) return nearest(item, exitGates.filter((gate) => gate.opened)) || nearest(item, exitGates);
  return nearest(item, repairPoints.filter((pointItem) => !pointItem.completed));
}

function getGateApproachPoint(gate) {
  const inward = gate.x < WORLD.width / 2 ? 92 : -92;
  return { x: clamp(gate.x + inward, 90, WORLD.width - 90), y: clamp(gate.y, 90, WORLD.height - 90) };
}

function moveToward(item, x, y, speed, dt) {
  const dir = normalize(x - item.x, y - item.y);
  moveActor(item, dir.x * speed, dir.y * speed, dt);
  if (Math.hypot(dir.x, dir.y) > 0.01) item.yaw = Math.atan2(dir.x, dir.y);
}

function moveActor(item, targetVx, targetVy, dt) {
  const blend = 1 - Math.exp(-11 * dt);
  item.vx += (targetVx - item.vx) * blend;
  item.vy += (targetVy - item.vy) * blend;
  const dx = item.vx * dt;
  const dy = item.vy * dt;
  const beforeX = item.x;
  const beforeY = item.y;
  if (canStandAt(item.x + dx, item.y, item.radius, item)) item.x += dx;
  else item.vx = 0;
  if (canStandAt(item.x, item.y + dy, item.radius, item)) item.y += dy;
  else item.vy = 0;
}

function canStandAt(x, y, radius) {
  if (x < 70 || y < 70 || x > WORLD.width - 70 || y > WORLD.height - 70) return false;
  if (walls.some((item) => circleHitsRect(x, y, radius, item))) return false;
  if (pallets.some((item) => item.dropped && !item.destroyed && circleHitsRect(x, y, radius, getDroppedPalletBlock(item)))) return false;
  return true;
}

function isDisabledSurvivor(item) {
  return item && item.type === "survivor" && (item.state === "downed" || item.state === "carried" || item.state === "chaired");
}

function isHunterBusy(item, now) {
  return item === hunter && (now < (hunter.stunnedUntil || 0) || now < (hunter.wipeUntil || 0) || Boolean(hunter.action));
}

function getHunterHardStateLabel(now) {
  if (now < (hunter.stunnedUntil || 0)) return "眩晕中";
  if (hunter.action && hunter.action.kind === "breaking") return "踩板中";
  if (now < (hunter.wipeUntil || 0)) return hunter.lastAttackHit ? "擦刀中" : "空刀硬直";
  return "";
}

function syncCarriedSurvivor() {
  if (!hunter.carrying) return;
  const carried = hunter.carrying;
  carried.x = hunter.x - Math.sin(hunter.yaw) * 42;
  carried.y = hunter.y - Math.cos(hunter.yaw) * 42;
  carried.vx = 0;
  carried.vy = 0;
  carried.yaw = hunter.yaw;
}

function getDroppedPalletBlock(item) {
  const center = propCenter(item);
  if (item.w >= item.h) return { x: item.x, y: center.y - 32, w: item.w, h: 64 };
  return { x: center.x - 32, y: item.y, w: 64, h: item.h };
}

function circleHitsRect(cx, cy, radius, box) {
  const closestX = clamp(cx, box.x, box.x + box.w);
  const closestY = clamp(cy, box.y, box.y + box.h);
  return Math.hypot(cx - closestX, cy - closestY) < radius;
}

function updateMeshes(now = performance.now()) {
  syncCarriedSurvivor();
  updatePalletMeshes(now);
  actors.forEach((item) => {
    item.mesh.visible = !item.escaped;
    item.mesh.position.copy(toScene(item.x, item.y, 0));
    item.mesh.rotation.y = item.yaw;
    item.mesh.children[0].material = isDisabledSurvivor(item) ? materials.downed : item === player ? materials.player : item.type === "hunter" ? materials.hunter : materials.survivor;
  });
  repairPoints.forEach((item) => {
    if (!item.mesh) return;
    item.mesh.scale.y = 1 + item.progress * 0.42;
    item.mesh.rotation.y = now / 900;
  });
  exitGates.forEach((item) => {
    if (!item.mesh) return;
    item.mesh.scale.y = 1 + (item.opened ? 0.22 : item.progress * 0.42);
    item.mesh.material = item.opened ? materials.complete : materials.gate;
  });
}

function updatePalletMeshes(now = performance.now()) {
  pallets.forEach((item) => {
    if (!item.mesh || !item.droppedMesh) return;
    if (item.destroyed) {
      item.mesh.visible = false;
      item.droppedMesh.visible = false;
      return;
    }
    if (!item.dropped) {
      item.mesh.visible = true;
      item.mesh.rotation.x = 0;
      item.mesh.rotation.z = 0;
      item.droppedMesh.visible = false;
      return;
    }
    const progress = Math.max(0, Math.min(1, (now - (item.dropStartedAt || now)) / PALLET_DROP_ANIMATION));
    item.mesh.visible = progress < 1;
    item.droppedMesh.visible = progress >= 1;
    if (item.horizontal) {
      item.mesh.rotation.x = -progress * Math.PI / 2;
      item.mesh.rotation.z = 0;
    } else {
      item.mesh.rotation.z = progress * Math.PI / 2;
      item.mesh.rotation.x = 0;
    }
  });
}

function updateCamera() {
  const controlled = selectedRole === "hunter" ? hunter : player;
  const cameraBack = resolveCameraBackDistance(controlled, CAMERA_BACK);
  const backX = Math.sin(controlled.yaw) * cameraBack;
  const backY = Math.cos(controlled.yaw) * cameraBack;
  const camWorldX = controlled.x - backX;
  const camWorldY = controlled.y - backY;
  const cam = toScene(camWorldX, camWorldY, CAMERA_HEIGHT * SCALE + 2.1);
  const look = toScene(
    controlled.x + Math.sin(controlled.yaw) * 120,
    controlled.y + Math.cos(controlled.yaw) * 120,
    1.3 + controlled.pitch * 6
  );
  camera.position.lerp(cam, 0.28);
  camera.lookAt(look);
}

function resolveCameraBackDistance(controlled, preferredBack) {
  const step = 12;
  let best = 72;
  for (let distance = 72; distance <= preferredBack; distance += step) {
    const x = controlled.x - Math.sin(controlled.yaw) * distance;
    const y = controlled.y - Math.cos(controlled.yaw) * distance;
    if (!canStandAt(x, y, 8)) return best;
    best = distance;
  }
  return preferredBack;
}

function updateReadouts(controlled) {
  const now = performance.now();
  const completed = repairPoints.filter((item) => item.completed).length;
  const escaped = [player, ...teammates].filter((item) => item.escaped).length;
  roleReadout.textContent = selectedRole === "hunter" ? "追捕者 · 3D" : "求生者 · 3D";
  objectiveReadout.textContent = areExitsPowered() ? `逃出 ${escaped}/4` : `修机 ${completed}/${REPAIR_REQUIRED}`;
  if (matchResult) promptReadout.textContent = matchResult;
  else if (selectedRole === "hunter" && getHunterHardStateLabel(now)) promptReadout.textContent = getHunterHardStateLabel(now);
  else if (controlled.action) promptReadout.textContent = controlled.action.kind === "repair" ? "修理中 · E取消" : "开门中 · E取消";
  else promptReadout.textContent = getPrompt(controlled);
  if (!matchResult && escaped >= 3) matchResult = "逃生成功";
}

function getPrompt(controlled) {
  if (selectedRole === "hunter") {
    const hardState = getHunterHardStateLabel(performance.now());
    if (hardState) return hardState;
    if (hunter.carrying) {
      const chair = nearest(hunter, chairs);
      return chair && distanceBetween(hunter, chair) < INTERACT_RANGE + 34 ? "Space 挂上椅子" : "牵人中";
    }
    const downed = nearest(hunter, [player, ...teammates].filter((item) => item.state === "downed" && !item.escaped && !item.eliminated));
    if (downed && distanceBetween(hunter, downed) < CARRY_RANGE) return "Space 牵起";
    const droppedPallet = findNearbyDroppedPallet(hunter);
    const windowProp = findNearbyWindow(hunter);
    if (droppedPallet || windowProp) return droppedPallet && (!windowProp || distanceToProp(hunter, droppedPallet) <= distanceToProp(hunter, windowProp)) ? "Space 踩板" : "Space 翻窗";
    const target = nearest(hunter, [player, ...teammates].filter((item) => !item.escaped && !isDisabledSurvivor(item)));
    return target && distanceBetween(hunter, target) <= ATTACK_RANGE ? "J 攻击" : "追击";
  }
  const pallet = findNearbyPallet(player);
  const windowProp = findNearbyWindow(player);
  if (pallet || windowProp) return pallet && (!windowProp || distanceToProp(player, pallet) <= distanceToProp(player, windowProp)) ? "Space 放板" : "Space 翻窗";
  if (areExitsPowered()) {
    const gate = nearest(player, exitGates);
    if (gate && distanceBetween(player, gate) < GATE_INTERACT_RANGE) return gate.opened ? "E 逃出" : "E 开门";
    return "寻找大门";
  }
  const repair = nearest(player, repairPoints.filter((item) => !item.completed));
  return repair && distanceBetween(player, repair) < INTERACT_RANGE + 20 ? "E 修理" : "寻找电机";
}

function drawMiniMap() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = miniMap.width / dpr;
  const h = miniMap.height / dpr;
  miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  miniCtx.clearRect(0, 0, w, h);
  const scale = Math.min((w - 12) / WORLD.width, (h - 12) / WORLD.height);
  const ox = (w - WORLD.width * scale) / 2;
  const oy = (h - WORLD.height * scale) / 2;
  miniCtx.fillStyle = "rgba(20, 31, 23, 0.88)";
  miniCtx.fillRect(0, 0, w, h);
  miniCtx.save();
  miniCtx.translate(ox, oy);
  miniCtx.scale(scale, scale);
  miniCtx.fillStyle = "#141b16";
  walls.forEach((item) => miniCtx.fillRect(item.x, item.y, item.w, item.h));
  miniCtx.fillStyle = "#d9b76a";
  repairPoints.forEach((item) => miniCtx.fillRect(item.x - 14, item.y - 14, 28, 28));
  exitGates.forEach((item) => {
    miniCtx.fillStyle = item.opened ? "#75c291" : areExitsPowered() ? "#d9b76a" : "#557568";
    miniCtx.fillRect(item.x - 16, item.y - 16, 32, 32);
  });
  actors.forEach((item) => {
    if (item.escaped) return;
    miniCtx.fillStyle = item.type === "hunter" ? "#d77b6e" : item === player ? "#f0d77c" : "#75c291";
    miniCtx.beginPath();
    miniCtx.arc(item.x, item.y, item.radius * 1.5, 0, Math.PI * 2);
    miniCtx.fill();
  });
  miniCtx.restore();
}

function areExitsPowered() {
  return repairPoints.filter((item) => item.completed).length >= REPAIR_REQUIRED;
}

function nearest(from, list) {
  return list.reduce((best, item) => !best || distanceBetween(from, item) < distanceBetween(from, best) ? item : best, null);
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function propCenter(item) {
  return { x: item.x + item.w / 2, y: item.y + item.h / 2 };
}

function distanceToProp(actorItem, propItem) {
  const center = propCenter(propItem);
  return Math.hypot(actorItem.x - center.x, actorItem.y - center.y);
}

function normalize(x, y) {
  const len = Math.hypot(x, y);
  return len > 0.001 ? { x: x / len, y: y / len } : { x: 0, y: 0 };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function turnToward(current, target, amount) {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + clamp(diff, -amount, amount);
}
