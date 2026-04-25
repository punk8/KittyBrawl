const WIDTH = 960;
const HEIGHT = 540;
const GROUND_Y = 430;
const MOVE_SPEED = 315;
const JUMP_SPEED = -820;
const GRAVITY = 2250;
const FRICTION = 0.82;
const DEFAULT_LEVEL_WIDTH = 2400;
const PLAYER_EDGE_PADDING = 92;
const ENEMY_EDGE_PADDING = 70;
const CAMERA_PLAYER_OFFSET = WIDTH * 0.42;
const DEFAULT_STAGE_TILE_SIZE = 112;
const BOSS_CUTIN_DURATION = 0.95;
const BOSS_IDLE_COOLDOWN = 1.15;
const FOOD_CHARM_DAMAGE = 0.16;
const PAPER_KICK_DAMAGE = 0.2;
const FOOD_RUN_SPEED = 260;
const PAPER_POUNCE_SPEED = 340;
const PAPER_KICK_VX = 420;
const PAPER_KICK_VY = -520;
const FOOD_LURE_RADIUS = 136;
const PAPER_LURE_RADIUS = 148;
const LURE_VERTICAL_TOLERANCE = 64;
const BOSS_RUSH_SPEED = 820;
const FOOD_PROJECTILE_LIFE = 0.72;
const PAPER_PROJECTILE_LIFE = 0.62;
const BOSS_REPOSITION_CHANCE = 0.55;
const BOSS_JUMP_DURATION = 0.64;
const BOSS_JUMP_ARC_HEIGHT = 142;
const BOSS_JUMP_MIN_DISTANCE = 160;
const BOSS_JUMP_MAX_DISTANCE = 300;
const BOSS_JUMP_MIN_TRAVEL = 120;

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const loader = document.querySelector("#loader");

ctx.imageSmoothingEnabled = false;

const keys = new Set();
const transientEffects = [];
const enemies = [];
const camera = { x: 0 };
const tileCropCache = new Map();
const encounter = {
  bossSpawned: false,
  bossDefeated: false,
  nextBossAttack: "food"
};

const player = {
  x: WIDTH * 0.42,
  y: GROUND_Y,
  vx: 0,
  vy: 0,
  facing: 1,
  grounded: true,
  action: "idle",
  actionTime: 0,
  health: 1,
  superMeter: 1,
  invulnerableTime: 0,
  status: "normal",
  statusTime: 0,
  statusTargetX: 0,
  statusStartX: 0,
  statusDuration: 0,
  statusDamageApplied: false,
  flags: Object.create(null)
};

let config = null;
let levelMap = null;
let images = null;
let lastTime = performance.now();
let stagePulse = 0;
let bossCutin = null;

const lockedActions = new Set([
  "attack_01",
  "hurt",
  "death",
  "super_activation",
  "super_attack"
]);

const gameCodes = new Set([
  "KeyA",
  "KeyD",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "ArrowUp",
  "Space",
  "KeyJ",
  "KeyK",
  "KeyH",
  "KeyL",
  "KeyR",
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7"
]);

window.__kittyDebug = {
  getState: () => ({
    camera: {
      x: Math.round(camera.x),
      maxX: Math.round(getMaxCameraX())
    },
    level: {
      width: Math.round(getLevelWidth())
    },
    player: {
      action: player.action,
      x: Math.round(player.x),
      screenX: Math.round(player.x - camera.x),
      y: Math.round(player.y),
      vx: Math.round(player.vx),
      vy: Math.round(player.vy),
      facing: player.facing,
      grounded: player.grounded,
      health: Number(player.health.toFixed(2)),
      superMeter: Number(player.superMeter.toFixed(2)),
      status: player.status
    },
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      action: enemy.action,
      aiState: enemy.aiState,
      x: Math.round(enemy.x),
      screenX: Math.round(enemy.x - camera.x),
      health: enemy.health,
      facing: enemy.facing
    })),
    bossCutin,
    encounter: { ...encounter },
    effects: transientEffects.map((effect) => effect.name)
  })
};

async function start() {
  config = await fetchJson("assets/data/player-animations.json");
  levelMap = config.level.map ? await fetchJson(config.level.map) : null;
  images = await loadImages(config);
  resetEncounter();
  loader.classList.add("is-hidden");
  requestAnimationFrame(tick);
}

async function fetchJson(src) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to load ${src}`);
  }
  return response.json();
}

async function loadImages(assetConfig) {
  const entries = [];

  for (const [name, anim] of Object.entries(assetConfig.animations)) {
    entries.push([`anim:${name}`, anim.src]);
  }

  for (const [name, effect] of Object.entries(assetConfig.effects)) {
    entries.push([`effect:${name}`, effect.src]);
  }

  for (const [name, src] of Object.entries(assetConfig.backgrounds)) {
    entries.push([`background:${name}`, src]);
  }

  for (const [name, src] of Object.entries(assetConfig.cutins)) {
    entries.push([`cutin:${name}`, src]);
  }

  entries.push(["level:background", assetConfig.level.background]);

  for (const [name, src] of Object.entries(assetConfig.level.tiles)) {
    entries.push([`tile:${name}`, src]);
  }

  for (const [enemyName, enemyConfig] of Object.entries(assetConfig.enemies)) {
    for (const [animName, anim] of Object.entries(enemyConfig.animations)) {
      entries.push([`enemy:${enemyName}:${animName}`, anim.src]);
    }
  }

  const loaded = await Promise.all(entries.map(async ([key, src]) => {
    const image = await loadImage(src);
    return [key, image];
  }));

  return new Map(loaded);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
    image.src = src;
  });
}

function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  update(dt);
  draw();

  requestAnimationFrame(tick);
}

function update(dt) {
  stagePulse += dt;
  player.invulnerableTime = Math.max(0, player.invulnerableTime - dt);
  updateBossCutin(dt);
  if (!updatePlayerStatus(dt)) {
    updateMovement(dt);
  }
  updatePlayerAction(dt);
  updateEnemies(dt);
  updateEncounter();
  updateEffects(dt);
  updateCamera();
}

function updateBossCutin(dt) {
  if (!bossCutin) {
    return;
  }

  bossCutin.time += dt;

  if (bossCutin.time >= bossCutin.duration) {
    bossCutin = null;
  }
}

function updatePlayerStatus(dt) {
  if (player.status === "normal") {
    return false;
  }

  if (player.action === "death") {
    clearPlayerStatus();
    return false;
  }

  player.statusTime += dt;

  if (player.status === "weakened") {
    if (player.statusTime >= 1.2) {
      clearPlayerStatus();
    }
    return false;
  }

  if (player.status === "cat_run_to_food") {
    updateCatRunToFood(dt);
    return true;
  }

  if (player.status === "cat_eating") {
    ensurePlayerAction("cat_eat");
    player.vx = 0;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;

    if (player.statusTime >= 1) {
      setPlayerStatus("weakened");
      setPlayerAction(getLocomotionAction());
    }
    return true;
  }

  if (player.status === "cat_pounce_to_paper") {
    updateCatPounceToPaper(dt);
    return true;
  }

  if (player.status === "cat_wait_kick") {
    ensurePlayerAction("cat_stunned");
    player.vx = 0;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;
    return true;
  }

  if (player.status === "cat_kicked") {
    updateCatKnockback(dt);
    return true;
  }

  if (player.status === "cat_recover") {
    ensurePlayerAction("cat_recover");
    player.vx *= FRICTION;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;

    if (player.statusTime >= 0.55) {
      clearPlayerStatus();
      setPlayerAction(getLocomotionAction());
    }
    return true;
  }

  return false;
}

function updateCatRunToFood(dt) {
  ensurePlayerAction("cat_run");
  const direction = Math.sign(player.statusTargetX - player.x) || player.facing || 1;
  player.facing = direction;
  player.vx = direction * FOOD_RUN_SPEED;
  player.vy = 0;
  player.x += player.vx * dt;
  player.x = clamp(player.x, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
  player.y = GROUND_Y;
  player.grounded = true;

  if (Math.abs(player.statusTargetX - player.x) <= 18) {
    player.x = player.statusTargetX;
    player.vx = 0;
    applyStatusDamage(FOOD_CHARM_DAMAGE, getBossEnemy()?.x ?? player.x);
    if (player.action !== "death") {
      setPlayerStatus("cat_eating");
      setPlayerAction("cat_eat");
    }
  }
}

function updateCatPounceToPaper(dt) {
  ensurePlayerAction("cat_pounce");

  if (player.statusDuration <= 0) {
    const distance = Math.abs(player.statusTargetX - player.statusStartX);
    player.statusDuration = clamp(distance / PAPER_POUNCE_SPEED, 0.5, 1.7);
  }

  const progress = clamp(player.statusTime / player.statusDuration, 0, 1);
  const eased = easeOutCubic(progress);
  const direction = Math.sign(player.statusTargetX - player.statusStartX) || player.facing || 1;
  player.facing = direction;
  player.x = player.statusStartX + (player.statusTargetX - player.statusStartX) * eased;
  player.x = clamp(player.x, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
  player.y = GROUND_Y - Math.sin(progress * Math.PI) * 78;
  player.vx = direction * PAPER_POUNCE_SPEED;
  player.vy = 0;
  player.grounded = progress >= 1;

  if (progress >= 1) {
    player.y = GROUND_Y;
    player.vx = 0;
    setPlayerStatus("cat_wait_kick");
    setPlayerAction("cat_stunned");
    triggerBossKick();
  }
}

function updateCatKnockback(dt) {
  ensurePlayerAction("cat_knockback");
  player.x += player.vx * dt;
  player.x = clamp(player.x, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
  player.vx *= 0.985;
  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    setPlayerStatus("cat_recover");
    setPlayerAction("cat_recover");
  } else {
    player.grounded = false;
  }
}

function updateMovement(dt) {
  const actionLocked = isPlayerActionLocked();
  const inputX = Number(keys.has("KeyD") || keys.has("ArrowRight")) -
    Number(keys.has("KeyA") || keys.has("ArrowLeft"));

  if (!actionLocked) {
    player.vx = inputX * MOVE_SPEED;
    if (inputX !== 0) {
      player.facing = inputX;
    }
  } else {
    player.vx *= FRICTION;
    if (Math.abs(player.vx) < 4) {
      player.vx = 0;
    }
  }

  player.x += player.vx * dt;
  player.x = clamp(player.x, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  if (!actionLocked) {
    const next = getLocomotionAction();
    if (player.action !== next) {
      setPlayerAction(next);
    }
  }
}

function updatePlayerAction(dt) {
  player.actionTime += dt;
  const anim = config.animations[player.action];

  if (!anim) {
    return;
  }

  if (anim.loop || anim.frameByVelocity) {
    return;
  }

  const frame = Math.floor(player.actionTime * anim.fps);

  if (player.action === "attack_01") {
    if (frame >= 2 && !player.flags.slash) {
      player.flags.slash = true;
      spawnEffect("slash_fx", player.x + player.facing * 116, player.y - 92, player.facing);
    }

    if (frame >= 2 && frame <= 4 && !player.flags.attackHit) {
      player.flags.attackHit = true;
      hitEnemiesInBox(getPlayerAttackBox(), 1, false);
    }
  }

  if (player.action === "super_attack") {
    if (frame >= 4 && !player.flags.superHit) {
      player.flags.superHit = true;
      hitEnemiesInBox(getPlayerSuperBox(), 99, true);
    }

    if (frame >= 5 && !player.flags.superImpact) {
      player.flags.superImpact = true;
      spawnEffect("super_impact_fx", player.x + player.facing * 138, player.y - 108, player.facing);
    }
  }

  if (frame < anim.frames) {
    return;
  }

  if (player.action === "super_activation") {
    setPlayerAction("super_attack");
    return;
  }

  if (player.action === "death") {
    player.actionTime = (anim.frames - 1) / anim.fps;
    return;
  }

  if (player.action.startsWith("cat_")) {
    player.actionTime = Math.min(player.actionTime, (anim.frames - 1) / anim.fps);
    return;
  }

  setPlayerAction(getLocomotionAction());
}

function updateEnemies(dt) {
  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index];
    updateEnemy(enemy, dt);

    if (enemy.remove) {
      enemies.splice(index, 1);
    }
  }
}

function updateEnemy(enemy, dt) {
  if (enemy.type === "ratBoss") {
    updateBoss(enemy, dt);
    return;
  }

  const enemyConfig = config.enemies[enemy.type];
  const anim = enemyConfig.animations[enemy.action];
  enemy.actionTime += dt;
  enemy.cooldown = Math.max(0, enemy.cooldown - dt);

  if (enemy.action === "death") {
    if (Math.floor(enemy.actionTime * anim.fps) >= anim.frames) {
      enemy.remove = true;
    }
    return;
  }

  if (enemy.action === "hurt") {
    enemy.x += enemy.knockback * dt;
    enemy.knockback *= 0.82;
    enemy.x = clamp(enemy.x, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);

    if (Math.floor(enemy.actionTime * anim.fps) >= anim.frames) {
      setEnemyAction(enemy, "walk");
    }
    return;
  }

  if (enemy.action === "attack") {
    const frame = Math.floor(enemy.actionTime * anim.fps);
    if (frame >= 3 && !enemy.hitThisAttack) {
      enemy.hitThisAttack = true;
      if (rectsOverlap(getEnemyAttackBox(enemy), getPlayerHurtbox())) {
        damagePlayer(enemyConfig.attackDamage, enemy.x);
      }
    }

    if (frame >= anim.frames) {
      enemy.cooldown = enemyConfig.attackCooldown;
      setEnemyAction(enemy, "idle");
    }
    return;
  }

  if (player.action === "death") {
    if (enemy.action !== "idle") {
      setEnemyAction(enemy, "idle");
    }
    return;
  }

  const distanceToPlayer = player.x - enemy.x;
  const absDistance = Math.abs(distanceToPlayer);
  if (absDistance > 2) {
    enemy.facing = Math.sign(distanceToPlayer);
  }

  if (absDistance <= enemyConfig.attackRange && enemy.cooldown <= 0) {
    setEnemyAction(enemy, "attack");
    return;
  }

  if (absDistance > enemyConfig.attackRange * 0.72) {
    enemy.x += Math.sign(distanceToPlayer) * enemyConfig.speed * dt;
    enemy.x = clamp(enemy.x, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);
    if (enemy.action !== "walk") {
      setEnemyAction(enemy, "walk");
    }
  } else if (enemy.action !== "idle") {
    setEnemyAction(enemy, "idle");
  }
}

function updateBoss(boss, dt) {
  const bossConfig = config.enemies.ratBoss;
  const anim = bossConfig.animations[boss.action];
  boss.actionTime += dt;
  boss.stateTime += dt;
  boss.cooldown = Math.max(0, boss.cooldown - dt);
  boss.repositionCooldown = Math.max(0, (boss.repositionCooldown ?? 0) - dt);

  if (boss.action === "death") {
    encounter.bossDefeated = true;
    bossCutin = null;
    if (Math.floor(boss.actionTime * anim.fps) >= anim.frames) {
      boss.remove = true;
    }
    return;
  }

  if (boss.aiState === "hurt") {
    boss.x += boss.knockback * dt;
    boss.knockback *= 0.82;
    boss.x = clamp(boss.x, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);

    if (Math.floor(boss.actionTime * anim.fps) >= anim.frames) {
      setBossState(boss, "recovery", "idle");
      boss.cooldown = 0.65;
    }
    return;
  }

  if (boss.aiState === "rush_in") {
    updateBossRushIn(boss, dt);
    return;
  }

  if (boss.aiState === "jump_reposition") {
    updateBossJumpReposition(boss);
    return;
  }

  faceBossTowardPlayer(boss);

  if (boss.aiState === "intro") {
    if (boss.stateTime >= 1.2 || Math.floor(boss.actionTime * anim.fps) >= anim.frames) {
      setBossState(boss, "idle", "idle");
      boss.cooldown = 0.8;
    }
    return;
  }

  if (boss.aiState === "food_cutin" || boss.aiState === "paper_cutin") {
    if (boss.stateTime >= BOSS_CUTIN_DURATION) {
      const attack = boss.aiState === "food_cutin" ? "attack_food" : "attack_paper";
      setBossState(boss, attack, attack);
    }
    return;
  }

  if (boss.aiState === "attack_food") {
    updateBossFoodAttack(boss, anim);
    return;
  }

  if (boss.aiState === "attack_paper") {
    updateBossPaperAttack(boss, anim);
    return;
  }

  if (boss.aiState === "paper_wait") {
    if (boss.stateTime >= 2.2 || !isPlayerBossControlled()) {
      setBossState(boss, "recovery", "idle");
      boss.cooldown = 0.7;
    }
    return;
  }

  if (boss.aiState === "kick") {
    updateBossKick(boss, anim);
    return;
  }

  if (boss.aiState === "recovery") {
    if (boss.stateTime >= 1 && !isPlayerBossControlled()) {
      setBossState(boss, "idle", "idle");
      boss.cooldown = BOSS_IDLE_COOLDOWN;
    }
    return;
  }

  if (boss.cooldown <= 0 && canBossStartSpecial()) {
    if (shouldBossReposition(boss)) {
      startBossJumpReposition(boss);
    } else {
      startBossSpecial(boss);
    }
  }
}

function updateBossFoodAttack(boss, anim) {
  const frame = Math.floor(boss.actionTime * anim.fps);

  if (frame >= 2 && !boss.flags.projectile) {
    boss.flags.projectile = true;
    boss.targetX = getFoodTargetX(boss);
    boss.flags.landAt = boss.actionTime + FOOD_PROJECTILE_LIFE;
    spawnProjectileEffect("cat_food_projectile", boss.x - boss.facing * 74, boss.y - 92, boss.targetX, GROUND_Y - 42, boss.facing, FOOD_PROJECTILE_LIFE);
  }

  if (boss.flags.projectile && !boss.flags.landed && boss.actionTime >= boss.flags.landAt) {
    resolveBossFoodLanding(boss);
  }

  if (frame >= anim.frames && boss.flags.landed) {
    setBossState(boss, "recovery", "idle");
    boss.cooldown = 0.8;
  }
}

function resolveBossFoodLanding(boss) {
  boss.flags.landed = true;
  const targetX = boss.targetX ?? getFoodTargetX(boss);
  spawnEffect("cat_food_on_ground", targetX, GROUND_Y - 5, 1, { life: 2.4, loop: true });
  spawnEffect("hypnosis_fx", targetX, GROUND_Y - 24, 1, { life: 1.8, loop: true });
  boss.flags.hitPlayer = startCatFoodCharm(targetX);
}

function updateBossRushIn(boss, dt) {
  const targetX = boss.rushTargetX ?? getBossRushTargetX();
  const direction = Math.sign(targetX - boss.x) || -1;
  boss.facing = direction;
  boss.x += direction * BOSS_RUSH_SPEED * dt;
  boss.x = clamp(boss.x, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);

  if (Math.abs(boss.x - targetX) <= 18 || Math.sign(targetX - boss.x) !== direction) {
    boss.x = targetX;
    boss.facing = player.x <= boss.x ? -1 : 1;
    spawnEffect("kick_impact_fx", boss.x, GROUND_Y - 38, boss.facing, { life: 0.28 });
    setBossState(boss, "intro", "intro");
  }
}

function updateBossJumpReposition(boss) {
  const progress = clamp(boss.stateTime / BOSS_JUMP_DURATION, 0, 1);
  const eased = easeInOutCubic(progress);
  boss.x = boss.jumpStartX + (boss.jumpTargetX - boss.jumpStartX) * eased;
  boss.y = GROUND_Y - Math.sin(progress * Math.PI) * BOSS_JUMP_ARC_HEIGHT;
  boss.facing = player.x <= boss.x ? -1 : 1;

  if (progress >= 1) {
    boss.x = boss.jumpTargetX;
    boss.y = GROUND_Y;
    boss.facing = player.x <= boss.x ? -1 : 1;
    spawnEffect("kick_impact_fx", boss.x, GROUND_Y - 38, boss.facing, { life: 0.25 });
    setBossState(boss, "idle", "idle");
    boss.cooldown = 0.26;
  }
}

function updateBossPaperAttack(boss, anim) {
  const frame = Math.floor(boss.actionTime * anim.fps);

  if (frame >= 2 && !boss.flags.projectile) {
    boss.flags.projectile = true;
    boss.targetX = getPaperTargetX(boss);
    boss.flags.landAt = boss.actionTime + PAPER_PROJECTILE_LIFE;
    spawnProjectileEffect("paper_ball_projectile", boss.x - boss.facing * 78, boss.y - 92, boss.targetX, GROUND_Y - 34, boss.facing, PAPER_PROJECTILE_LIFE);
  }

  if (boss.flags.projectile && !boss.flags.landed && boss.actionTime >= boss.flags.landAt) {
    resolveBossPaperLanding(boss);
  }

  if (frame >= anim.frames && boss.flags.landed) {
    setBossState(boss, boss.flags.hitPlayer ? "paper_wait" : "recovery", "idle");
  }
}

function resolveBossPaperLanding(boss) {
  boss.flags.landed = true;
  const targetX = boss.targetX ?? getPaperTargetX(boss);
  spawnEffect("paper_ball_on_ground", targetX, GROUND_Y - 4, 1, { life: 2.7, loop: true });
  boss.flags.hitPlayer = startPaperCharm(targetX);
}

function updateBossKick(boss, anim) {
  const frame = Math.floor(boss.actionTime * anim.fps);

  if (frame >= 3 && !boss.flags.kickHit) {
    boss.flags.kickHit = true;
    spawnEffect("kick_impact_fx", player.x, player.y - 72, boss.facing, { life: 0.45 });
    applyBossKickDamage(boss);
  }

  if (frame >= anim.frames) {
    setBossState(boss, "recovery", "idle");
    boss.cooldown = 0.9;
  }
}

function updateEffects(dt) {
  for (let index = transientEffects.length - 1; index >= 0; index -= 1) {
    const effect = transientEffects[index];
    const data = config.effects[effect.name];
    effect.time += dt;

    if (effect.gravity) {
      effect.vy = (effect.vy ?? 0) + effect.gravity * dt;
    }

    if (effect.vx) {
      effect.x += effect.vx * dt;
    }

    if (effect.vy) {
      effect.y += effect.vy * dt;
    }

    const loop = effect.loop ?? data.loop;
    const expiredByLife = effect.life !== undefined && effect.time >= effect.life;
    const expiredByFrames = effect.life === undefined && !loop && Math.floor(effect.time * data.fps) >= data.frames;

    if (expiredByLife || expiredByFrames) {
      transientEffects.splice(index, 1);
    }
  }
}

function updateCamera() {
  camera.x = clamp(player.x - CAMERA_PLAYER_OFFSET, 0, getMaxCameraX());
}

function getLocomotionAction() {
  if (!player.grounded) {
    return "jump_fall";
  }

  if (Math.abs(player.vx) > 1) {
    return "run";
  }

  return "idle";
}

function setPlayerStatus(name, options = {}) {
  player.status = name;
  player.statusTime = 0;
  player.statusTargetX = options.targetX ?? 0;
  player.statusStartX = options.startX ?? player.x;
  player.statusDuration = options.duration ?? 0;
  player.statusDamageApplied = false;
}

function clearPlayerStatus() {
  player.status = "normal";
  player.statusTime = 0;
  player.statusTargetX = 0;
  player.statusStartX = player.x;
  player.statusDuration = 0;
  player.statusDamageApplied = false;
}

function ensurePlayerAction(name) {
  if (player.action !== name) {
    setPlayerAction(name);
  }
}

function isPlayerBossControlled() {
  return [
    "cat_run_to_food",
    "cat_eating",
    "cat_pounce_to_paper",
    "cat_wait_kick",
    "cat_kicked",
    "cat_recover"
  ].includes(player.status);
}

function isPlayerAttackDisabled() {
  return player.status !== "normal";
}

function isPlayerActionLocked() {
  return lockedActions.has(player.action);
}

function setPlayerAction(name) {
  player.action = name;
  player.actionTime = 0;
  player.flags = Object.create(null);
}

function setEnemyAction(enemy, name) {
  if (enemy.action === name) {
    return;
  }

  enemy.action = name;
  enemy.actionTime = 0;
  enemy.hitThisAttack = false;
}

function jump() {
  if (isPlayerBossControlled() || isPlayerActionLocked() || !player.grounded) {
    return;
  }

  player.vy = JUMP_SPEED;
  player.grounded = false;
  setPlayerAction("jump_fall");
}

function triggerAction(name) {
  if (player.action === "death" && name !== "idle") {
    return;
  }

  if ((name === "attack_01" || name === "super_activation") && isPlayerAttackDisabled()) {
    return;
  }

  if (isPlayerBossControlled()) {
    return;
  }

  if (isPlayerActionLocked()) {
    return;
  }

  if (name === "super_activation" && player.superMeter < 1) {
    return;
  }

  if (name === "super_activation") {
    player.superMeter = 0;
  }

  setPlayerAction(name);
}

function triggerDebugCatStatus(index) {
  if (player.action === "death") {
    return;
  }

  const forwardX = clamp(player.x + player.facing * 180, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
  const backwardKick = player.facing < 0 ? PAPER_KICK_VX : -PAPER_KICK_VX;

  if (index === 0) {
    clearPlayerStatus();
    player.vx = 0;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;
    setPlayerAction(getLocomotionAction());
  } else if (index === 1) {
    setPlayerStatus("cat_run_to_food", { targetX: forwardX });
    setPlayerAction("cat_run");
  } else if (index === 2) {
    setPlayerStatus("cat_eating", { targetX: player.x });
    setPlayerAction("cat_eat");
  } else if (index === 3) {
    setPlayerStatus("cat_pounce_to_paper", {
      targetX: forwardX,
      startX: player.x
    });
    setPlayerAction("cat_pounce");
  } else if (index === 4) {
    setPlayerStatus("cat_wait_kick");
    setPlayerAction("cat_stunned");
  } else if (index === 5) {
    setPlayerStatus("cat_kicked");
    player.vx = backwardKick;
    player.vy = PAPER_KICK_VY;
    setPlayerAction("cat_knockback");
  } else if (index === 6) {
    setPlayerStatus("cat_recover");
    player.vx = 0;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;
    setPlayerAction("cat_recover");
  } else if (index === 7) {
    setPlayerStatus("weakened");
    player.vx = 0;
    player.vy = 0;
    player.y = GROUND_Y;
    player.grounded = true;
    setPlayerAction(getLocomotionAction());
  }
}

function resetEncounter() {
  player.x = CAMERA_PLAYER_OFFSET;
  player.y = GROUND_Y;
  player.vx = 0;
  player.vy = 0;
  player.facing = 1;
  player.grounded = true;
  player.health = 1;
  player.superMeter = 1;
  player.invulnerableTime = 0;
  clearPlayerStatus();
  camera.x = 0;
  bossCutin = null;
  encounter.bossSpawned = false;
  encounter.bossDefeated = false;
  encounter.nextBossAttack = "food";
  transientEffects.length = 0;
  enemies.length = 0;
  setPlayerAction("idle");
  spawnRat("rat-a", 780);
  spawnRat("rat-b", 1420);
}

function updateEncounter() {
  if (encounter.bossSpawned || encounter.bossDefeated) {
    return;
  }

  const ratsRemain = enemies.some((enemy) => enemy.type === "rat");

  if (ratsRemain) {
    return;
  }

  const targetX = getBossRushTargetX();
  const spawnX = getBossRushSpawnX(targetX);
  spawnRatBoss(spawnX, targetX);
}

function spawnRat(id, x) {
  const ratConfig = config.enemies.rat;
  enemies.push({
    id,
    type: "rat",
    x,
    y: GROUND_Y,
    facing: -1,
    action: "idle",
    actionTime: 0,
    health: ratConfig.maxHealth,
    cooldown: 0.35,
    hitThisAttack: false,
    knockback: 0,
    remove: false
  });
}

function spawnRatBoss(x, rushTargetX) {
  const bossConfig = config.enemies.ratBoss;
  encounter.bossSpawned = true;
  enemies.push({
    id: "rat-boss",
    type: "ratBoss",
    x,
    y: GROUND_Y,
    facing: -1,
    action: "intro",
    actionTime: 0,
    aiState: "rush_in",
    stateTime: 0,
    health: bossConfig.maxHealth,
    cooldown: 0,
    repositionCooldown: 2.4,
    hitThisAttack: false,
    knockback: 0,
    targetX: 0,
    rushTargetX,
    flags: Object.create(null),
    remove: false
  });
}

function getBossRushTargetX() {
  const screenMin = camera.x + WIDTH * 0.58;
  const screenMax = camera.x + WIDTH - 150;
  const levelMax = getLevelWidth() - ENEMY_EDGE_PADDING;
  const maxX = Math.min(screenMax, levelMax);
  const minX = Math.min(Math.max(screenMin, PLAYER_EDGE_PADDING), maxX);
  return clamp(player.x + 300, minX, maxX);
}

function getBossRushSpawnX(targetX) {
  const offscreenX = camera.x + WIDTH + 180;
  const levelMax = getLevelWidth() - ENEMY_EDGE_PADDING;
  return clamp(Math.max(offscreenX, targetX + 260), targetX + 40, levelMax);
}

function spawnEffect(name, x, y, facing, options = {}) {
  const effect = {
    name,
    x,
    y,
    facing,
    time: 0,
    ...options
  };
  transientEffects.push(effect);
  return effect;
}

function spawnProjectileEffect(name, x, y, targetX, targetY, facing, life) {
  return spawnEffect(name, x, y, facing, {
    vx: (targetX - x) / life,
    vy: (targetY - y) / life - 0.5 * 980 * life,
    gravity: 980,
    life,
    loop: true
  });
}

function setBossState(boss, state, action) {
  boss.aiState = state;
  boss.stateTime = 0;
  boss.flags = Object.create(null);
  if (boss.action === action) {
    boss.actionTime = 0;
    boss.hitThisAttack = false;
    return;
  }
  setEnemyAction(boss, action);
}

function faceBossTowardPlayer(boss) {
  const distanceToPlayer = player.x - boss.x;

  if (Math.abs(distanceToPlayer) > 2) {
    boss.facing = Math.sign(distanceToPlayer);
  }
}

function canBossStartSpecial() {
  return player.status === "normal" &&
    player.action !== "death" &&
    !player.action.startsWith("super_");
}

function startBossSpecial(boss) {
  const attack = encounter.nextBossAttack;
  encounter.nextBossAttack = attack === "food" ? "paper" : "food";
  bossCutin = {
    kind: "boss",
    attack,
    time: 0,
    duration: BOSS_CUTIN_DURATION
  };
  setBossState(boss, `${attack}_cutin`, "idle");
}

function shouldBossReposition(boss) {
  if ((boss.repositionCooldown ?? 0) > 0 || isPlayerBossControlled()) {
    return false;
  }

  const distance = Math.abs(boss.x - player.x);
  const pressureRoll = distance > BOSS_JUMP_MAX_DISTANCE ? 0.82 : BOSS_REPOSITION_CHANCE;
  return Math.random() < pressureRoll;
}

function startBossJumpReposition(boss) {
  boss.jumpStartX = boss.x;
  boss.jumpTargetX = getBossJumpTargetX(boss);
  boss.y = GROUND_Y;
  boss.repositionCooldown = 2.8;
  setBossState(boss, "jump_reposition", "idle");
}

function getBossJumpTargetX(boss) {
  let side = chooseBossJumpSide(boss);
  const distance = BOSS_JUMP_MIN_DISTANCE + Math.random() * (BOSS_JUMP_MAX_DISTANCE - BOSS_JUMP_MIN_DISTANCE);
  let targetX = clamp(player.x + side * distance, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);

  if (Math.abs(targetX - boss.x) < BOSS_JUMP_MIN_TRAVEL) {
    side *= -1;
    targetX = clamp(player.x + side * distance, ENEMY_EDGE_PADDING, getLevelWidth() - ENEMY_EDGE_PADDING);
  }

  return targetX;
}

function chooseBossJumpSide(boss) {
  const leftSpace = player.x - ENEMY_EDGE_PADDING;
  const rightSpace = getLevelWidth() - ENEMY_EDGE_PADDING - player.x;

  if (leftSpace < BOSS_JUMP_MIN_DISTANCE) {
    return 1;
  }

  if (rightSpace < BOSS_JUMP_MIN_DISTANCE) {
    return -1;
  }

  if (Math.abs(boss.x - player.x) > BOSS_JUMP_MAX_DISTANCE * 1.1) {
    return boss.x < player.x ? -1 : 1;
  }

  return Math.random() < 0.5 ? -1 : 1;
}

function getFoodTargetX(boss) {
  const directionToBoss = Math.sign(boss.x - player.x) || -boss.facing || 1;
  return clamp(player.x + directionToBoss * 92 + player.vx * 0.18, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
}

function getPaperTargetX(boss) {
  const directionToBoss = Math.sign(boss.x - player.x) || -boss.facing || 1;
  return clamp(player.x + directionToBoss * 104 + player.vx * 0.16, PLAYER_EDGE_PADDING, getLevelWidth() - PLAYER_EDGE_PADDING);
}

function startCatFoodCharm(targetX) {
  if (!canBossControlPlayerAt(targetX, FOOD_LURE_RADIUS)) {
    return false;
  }

  setPlayerStatus("cat_run_to_food", { targetX });
  player.facing = Math.sign(targetX - player.x) || player.facing || 1;
  player.vx = 0;
  player.vy = 0;
  player.y = GROUND_Y;
  player.grounded = true;
  setPlayerAction("cat_run");
  return true;
}

function startPaperCharm(targetX) {
  if (!canBossControlPlayerAt(targetX, PAPER_LURE_RADIUS)) {
    return false;
  }

  setPlayerStatus("cat_pounce_to_paper", {
    targetX,
    startX: player.x
  });
  player.facing = Math.sign(targetX - player.x) || player.facing || 1;
  player.vx = 0;
  player.vy = 0;
  setPlayerAction("cat_pounce");
  return true;
}

function canBossControlPlayer() {
  return player.status === "normal" &&
    player.action !== "death" &&
    !player.action.startsWith("super_") &&
    player.invulnerableTime <= 0;
}

function canBossControlPlayerAt(targetX, radius) {
  return canBossControlPlayer() && isPlayerInLureRadius(targetX, radius);
}

function isPlayerInLureRadius(targetX, radius) {
  return Math.abs(player.x - targetX) <= radius &&
    player.y >= GROUND_Y - LURE_VERTICAL_TOLERANCE;
}

function triggerBossKick() {
  const boss = getBossEnemy();

  if (!boss || boss.action === "death") {
    return;
  }

  faceBossTowardPlayer(boss);
  setBossState(boss, "kick", "kick");
}

function applyBossKickDamage(boss) {
  if (player.action === "death") {
    return;
  }

  applyStatusDamage(PAPER_KICK_DAMAGE, boss.x);

  if (player.action === "death") {
    return;
  }

  const direction = player.x < boss.x ? -1 : 1;
  player.vx = direction * PAPER_KICK_VX;
  player.vy = PAPER_KICK_VY;
  setPlayerStatus("cat_kicked");
  setPlayerAction("cat_knockback");
}

function applyStatusDamage(amount, sourceX) {
  if (player.action === "death") {
    return;
  }

  player.health = clamp(player.health - amount, 0, 1);
  player.invulnerableTime = 0.35;
  spawnEffect("hit_spark", player.x, player.y - 66, sourceX <= player.x ? 1 : -1);

  if (player.health <= 0) {
    clearPlayerStatus();
    setPlayerAction("death");
  }
}

function getBossEnemy() {
  return enemies.find((enemy) => enemy.type === "ratBoss" && !enemy.remove) ?? null;
}

function getLivingRatCount() {
  return enemies.filter((enemy) => enemy.type === "rat" && enemy.action !== "death").length;
}

function hitEnemiesInBox(box, amount, isSuper) {
  let hits = 0;
  for (const enemy of enemies) {
    if (enemy.action === "death") {
      continue;
    }

    const validTarget = isSuper
      ? Math.abs(enemy.x - player.x) <= 410
      : rectsOverlap(box, getEnemyHurtbox(enemy));

    if (!validTarget) {
      continue;
    }

    damageEnemy(enemy, amount, player.x);
    hits += 1;
  }

  if (hits > 0) {
    player.superMeter = clamp(player.superMeter + hits * 0.16, 0, 1);
  }
}

function damageEnemy(enemy, amount, sourceX) {
  const enemyConfig = config.enemies[enemy.type];
  const isBoss = enemy.type === "ratBoss";
  const appliedAmount = isBoss && amount > 10 ? 2.4 : amount;
  enemy.health -= appliedAmount;
  enemy.facing = sourceX <= enemy.x ? -1 : 1;
  spawnEffect("rat_hit_spark", enemy.x, enemy.y - (isBoss ? 96 : 68), enemy.facing);

  if (enemy.health <= 0) {
    enemy.health = 0;
    enemy.knockback = 0;
    if (isBoss) {
      encounter.bossDefeated = true;
      bossCutin = null;
      setBossState(enemy, "death", "death");
      spawnEffect("rat_death_puff", enemy.x, enemy.y - 92, enemy.facing, { scale: 1.2 });
    } else {
      setEnemyAction(enemy, "death");
      spawnEffect("rat_death_puff", enemy.x, enemy.y - 58, enemy.facing);
    }
    return;
  }

  enemy.knockback = sourceX <= enemy.x ? 220 : -220;

  if (isBoss) {
    setBossState(enemy, "hurt", "hurt");
    enemy.cooldown = Math.max(enemy.cooldown, 0.5);
    return;
  }

  setEnemyAction(enemy, "hurt");
  enemy.cooldown = Math.max(enemy.cooldown, enemyConfig.attackCooldown * 0.5);
}

function damagePlayer(amount, sourceX) {
  if (player.action === "death" || player.action.startsWith("super_") || player.invulnerableTime > 0) {
    return;
  }

  player.health = clamp(player.health - amount, 0, 1);
  player.invulnerableTime = 0.78;
  player.vx = sourceX <= player.x ? 150 : -150;
  spawnEffect("hit_spark", player.x, player.y - 86, player.facing);

  if (player.health <= 0) {
    setPlayerAction("death");
    return;
  }

  if (!isPlayerActionLocked()) {
    setPlayerAction("hurt");
  }
}

function getPlayerHurtbox() {
  return {
    x: player.x - 40,
    y: player.y - 126,
    width: 80,
    height: 116
  };
}

function getPlayerAttackBox() {
  const width = 182;
  const height = 112;
  const front = player.facing > 0 ? player.x - 22 : player.x + 22 - width;
  return {
    x: front,
    y: player.y - 134,
    width,
    height
  };
}

function getPlayerSuperBox() {
  return {
    x: player.x - 420,
    y: player.y - 168,
    width: 840,
    height: 180
  };
}

function getEnemyHurtbox(enemy) {
  const enemyConfig = config.enemies[enemy.type];
  return {
    x: enemy.x - enemyConfig.bodyWidth * 0.5,
    y: enemy.y + enemyConfig.bodyOffsetY - enemyConfig.bodyHeight * 0.5,
    width: enemyConfig.bodyWidth,
    height: enemyConfig.bodyHeight
  };
}

function getEnemyAttackBox(enemy) {
  const width = 82;
  const front = enemy.facing > 0 ? enemy.x + 24 : enemy.x - 24 - width;
  return {
    x: front,
    y: enemy.y - 104,
    width,
    height: 82
  };
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.imageSmoothingEnabled = false;

  if (isSuperMode()) {
    drawSuperBackdrop();
  } else {
    drawBackdrop();
  }

  if (player.action !== "super_activation") {
    drawStage(player.action === "super_attack");
  }
  drawWorld(() => {
    drawCombatants();
    drawEffects();
  });

  if (player.action === "super_activation") {
    drawSuperCutin();
  }

  if (bossCutin) {
    drawBossCutin();
  }

  drawHud();
}

function drawBackdrop() {
  const image = images.get("level:background");
  const sourceWidth = Math.min(image.width, image.height * (WIDTH / HEIGHT));
  const maxSourceX = Math.max(0, image.width - sourceWidth);
  const maxCameraX = getMaxCameraX();
  const sx = maxCameraX > 0 ? (camera.x / maxCameraX) * maxSourceX : 0;
  ctx.drawImage(image, sx, 0, sourceWidth, image.height, 0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.fillStyle = "rgba(3, 4, 6, 0.18)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

function drawSuperBackdrop() {
  const image = images.get("background:super");
  const cover = coverRect(image.width, image.height, WIDTH, HEIGHT);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(image, cover.sx, cover.sy, cover.sw, cover.sh, 0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = player.action === "super_activation" ? 0.1 : 0.16;
  ctx.fillStyle = "#08020e";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

function drawStage(isSuperStage = false) {
  const map = getLevelMap();
  const tileSize = map.tileSize ?? DEFAULT_STAGE_TILE_SIZE;
  const groundY = map.groundY ?? GROUND_Y;
  const tileCount = Math.ceil(getLevelWidth() / tileSize);
  const layers = map.layers ?? {};

  ctx.save();
  ctx.translate(-getCameraDrawX(), 0);

  drawTilemapGridLayer(layers.groundFill, tileSize, tileCount, groundY, isSuperStage);
  drawTilemapGridLayer(layers.groundTop, tileSize, tileCount, groundY, isSuperStage);
  drawTilemapEdges(layers.edges, tileSize, groundY, isSuperStage);
  drawTilemapPlatforms(layers.platforms, isSuperStage);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = getOverlayColor(map.overlays?.floorDark, isSuperStage, isSuperStage ? "rgba(5, 4, 4, 0.12)" : "rgba(5, 4, 4, 0.32)");
  ctx.fillRect(0, groundY + 8, WIDTH, HEIGHT - groundY);
  ctx.fillStyle = getOverlayColor(map.overlays?.groundLine, isSuperStage, isSuperStage ? "rgba(241, 209, 146, 0.08)" : "rgba(241, 209, 146, 0.16)");
  ctx.fillRect(0, groundY - 1, WIDTH, 2);
  ctx.restore();
}

function drawTilemapGridLayer(layer, tileSize, tileCount, groundY, isSuperStage) {
  if (!layer?.tiles?.length) {
    return;
  }

  const startIndex = Math.max(0, Math.floor((camera.x - tileSize) / tileSize));
  const endIndex = Math.min(tileCount - 1, Math.ceil((camera.x + WIDTH + tileSize) / tileSize));
  const y = groundY + (layer.yOffset ?? 0);
  ctx.globalAlpha = getLayerAlpha(layer, isSuperStage);

  for (let index = startIndex; index <= endIndex; index += 1) {
    const tile = getTileFromLayer(layer, index);

    if (!tile) {
      continue;
    }

    const x = index * tileSize;
    const width = Math.min(tileSize, getLevelWidth() - x);
    drawStageTile(tile, x, y, width, tileSize);
  }
}

function drawTilemapEdges(layer, tileSize, groundY, isSuperStage) {
  if (!layer) {
    return;
  }

  const y = groundY + (layer.yOffset ?? 0);
  ctx.globalAlpha = getLayerAlpha(layer, isSuperStage);

  if (layer.leftTile) {
    drawStageTile(layer.leftTile, 0, y, tileSize, tileSize);
  }

  if (layer.rightTile) {
    drawStageTile(layer.rightTile, getLevelWidth() - tileSize, y, tileSize, tileSize);
  }
}

function drawTilemapPlatforms(layer, isSuperStage) {
  if (!layer?.items?.length) {
    return;
  }

  ctx.globalAlpha = getLayerAlpha(layer, isSuperStage) + Math.sin(stagePulse * 2) * (layer.pulse ?? 0);

  for (const platform of layer.items) {
    if (isInCameraRange(platform.x, platform.width)) {
      drawStageTile(platform.tile, platform.x, platform.y, platform.width, platform.height);
    }
  }
}

function getTileFromLayer(layer, index) {
  if (index < layer.tiles.length) {
    return layer.tiles[index];
  }

  if (layer.repeat) {
    return layer.tiles[index % layer.tiles.length];
  }

  return layer.fallback ?? null;
}

function getLayerAlpha(layer, isSuperStage) {
  return isSuperStage
    ? layer.superAlpha ?? layer.alpha ?? 1
    : layer.alpha ?? 1;
}

function getOverlayColor(overlay, isSuperStage, fallback) {
  if (!overlay) {
    return fallback;
  }

  return isSuperStage ? overlay.super ?? fallback : overlay.normal ?? fallback;
}

function getLevelMap() {
  return levelMap ?? {
    width: config?.level?.width ?? DEFAULT_LEVEL_WIDTH,
    tileSize: DEFAULT_STAGE_TILE_SIZE,
    groundY: GROUND_Y,
    layers: {}
  };
}

function isInCameraRange(x, width) {
  return x + width >= camera.x - 80 && x <= camera.x + WIDTH + 80;
}

function drawStageTile(name, x, y, width, height) {
  const image = images.get(`tile:${name}`);

  if (!image) {
    return;
  }

  const crop = getAlphaCrop(image);
  ctx.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    Math.round(x),
    Math.round(y),
    Math.round(width),
    Math.round(height)
  );
}

function getAlphaCrop(image) {
  const cacheKey = image.currentSrc || image.src;
  const cached = tileCropCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const scratch = document.createElement("canvas");
  scratch.width = image.naturalWidth || image.width;
  scratch.height = image.naturalHeight || image.height;
  const scratchCtx = scratch.getContext("2d");
  scratchCtx.drawImage(image, 0, 0);

  const { data } = scratchCtx.getImageData(0, 0, scratch.width, scratch.height);
  let minX = scratch.width;
  let minY = scratch.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < scratch.height; y += 1) {
    for (let x = 0; x < scratch.width; x += 1) {
      if (data[(y * scratch.width + x) * 4 + 3] <= 12) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  const sx = Math.max(0, minX - 2);
  const sy = Math.max(0, minY - 2);
  const crop = maxX < 0
    ? { sx: 0, sy: 0, sw: scratch.width, sh: scratch.height }
    : {
        sx,
        sy,
        sw: Math.min(scratch.width - sx, maxX - sx + 5),
        sh: Math.min(scratch.height - sy, maxY - sy + 5)
      };

  tileCropCache.set(cacheKey, crop);
  return crop;
}

function drawWorld(drawFn) {
  ctx.save();
  ctx.translate(-getCameraDrawX(), 0);
  drawFn();
  ctx.restore();
}

function drawSuperCutin() {
  const image = images.get("cutin:super");
  const anim = config.animations.super_activation;
  const duration = anim.frames / anim.fps;
  const progress = clamp(player.actionTime / duration, 0, 1);
  const enterEnd = 0.22;
  const exitStart = 0.82;
  let offsetX = 0;

  if (progress < enterEnd) {
    offsetX = -WIDTH * (1 - easeOutCubic(progress / enterEnd));
  } else if (progress > exitStart) {
    offsetX = WIDTH * easeInCubic((progress - exitStart) / (1 - exitStart));
  }

  const bannerHeight = 255;
  const y = 58;
  const cover = coverRect(image.width, image.height, WIDTH, bannerHeight);

  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.fillRect(0, y - 12, WIDTH, bannerHeight + 24);

  ctx.globalAlpha = 1;
  ctx.drawImage(
    image,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    0,
    y,
    WIDTH,
    bannerHeight
  );

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = "#f3d78a";
  ctx.fillRect(0, y - 2, WIDTH, 2);
  ctx.fillRect(0, y + bannerHeight, WIDTH, 2);
  ctx.restore();
}

function drawBossCutin() {
  const image = images.get("cutin:boss");
  const progress = clamp(bossCutin.time / bossCutin.duration, 0, 1);
  const enterEnd = 0.18;
  const exitStart = 0.76;
  let offsetX = 0;

  if (progress < enterEnd) {
    offsetX = WIDTH * (1 - easeOutCubic(progress / enterEnd));
  } else if (progress > exitStart) {
    offsetX = -WIDTH * easeInCubic((progress - exitStart) / (1 - exitStart));
  }

  const bannerHeight = 246;
  const y = 66;
  const cover = coverRect(image.width, image.height, WIDTH, bannerHeight);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(0, 0, 0, 0.76)";
  ctx.fillRect(0, y - 12, WIDTH, bannerHeight + 24);

  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(Math.round(offsetX) + WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(
    image,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    0,
    y,
    WIDTH,
    bannerHeight
  );
  ctx.restore();

  ctx.globalAlpha = 0.82;
  ctx.fillStyle = bossCutin.attack === "food" ? "#e6ba61" : "#b58cff";
  ctx.fillRect(0, y - 2, WIDTH, 2);
  ctx.fillRect(0, y + bannerHeight, WIDTH, 2);
  ctx.restore();
}

function drawCombatants() {
  const drawables = [
    ...enemies.map((enemy) => ({ kind: "enemy", y: enemy.y, value: enemy })),
    { kind: "player", y: player.y, value: player }
  ].sort((a, b) => a.y - b.y);

  for (const drawable of drawables) {
    if (drawable.kind === "enemy") {
      drawEnemy(drawable.value);
    } else {
      drawPlayer();
    }
  }
}

function drawPlayer() {
  const flashOff = player.invulnerableTime > 0 && Math.floor(player.invulnerableTime * 18) % 2 === 0;
  const catForm = player.action.startsWith("cat_");
  drawShadow(
    player.x,
    player.y,
    catForm ? 42 : 62,
    catForm ? 8 : 12,
    player.grounded ? 1 : clamp(1 - (GROUND_Y - player.y) / 360, 0.42, 0.9)
  );

  if (flashOff) {
    return;
  }

  drawSprite(
    config.animations[player.action],
    images.get(`anim:${player.action}`),
    getPlayerFrame(),
    player.x,
    player.y,
    player.facing
  );
}

function drawEnemy(enemy) {
  const enemyConfig = config.enemies[enemy.type];
  const anim = enemyConfig.animations[enemy.action];
  const isBoss = enemy.type === "ratBoss";
  drawShadow(enemy.x, enemy.y, isBoss ? 88 : 42, isBoss ? 17 : 9, enemy.action === "death" ? 0.72 : 1);
  drawSprite(anim, images.get(`enemy:${enemy.type}:${enemy.action}`), getTimedFrame(anim, enemy.actionTime), enemy.x, enemy.y, enemy.facing);

  if (enemy.action !== "death" && !isBoss) {
    drawEnemyHealth(enemy);
  }
}

function drawEnemyHealth(enemy) {
  const enemyConfig = config.enemies[enemy.type];
  const width = 46;
  const value = enemy.health / enemyConfig.maxHealth;
  ctx.save();
  ctx.fillStyle = "rgba(3, 3, 4, 0.82)";
  ctx.fillRect(Math.round(enemy.x - width * 0.5 - 1), Math.round(enemy.y - 124), width + 2, 5);
  ctx.fillStyle = "#78342f";
  ctx.fillRect(Math.round(enemy.x - width * 0.5), Math.round(enemy.y - 123), width, 3);
  ctx.fillStyle = "#e6ba61";
  ctx.fillRect(Math.round(enemy.x - width * 0.5), Math.round(enemy.y - 123), Math.round(width * value), 3);
  ctx.restore();
}

function drawEffects() {
  for (const effect of transientEffects) {
    const data = config.effects[effect.name];
    const image = images.get(`effect:${effect.name}`);
    const rawFrame = Math.floor(effect.time * data.fps);
    const frame = (effect.loop ?? data.loop) ? rawFrame % data.frames : rawFrame;
    drawSprite(data, image, frame, effect.x, effect.y, effect.facing);
  }
}

function drawShadow(x, y, width, height, scale) {
  ctx.save();
  ctx.globalAlpha = 0.28 * scale;
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.ellipse(x, GROUND_Y + 6, width * scale, height * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHud() {
  drawMeter(28, 24, 188, 12, player.health, "#d95f55", "#4e2424", "HP");
  drawMeter(28, 46, 188, 10, player.superMeter, "#8d72ff", "#29204a", "SUPER");
  drawBossHud();

  ctx.save();
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4efe5";
  ctx.fillText("RATS", WIDTH - 126, 31);
  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(WIDTH - 76, 23, 48, 17);
  ctx.fillStyle = "#e6ba61";
  ctx.fillText(String(getLivingRatCount()).padStart(2, "0"), WIDTH - 62, 31);
  ctx.restore();
}

function drawBossHud() {
  const boss = getBossEnemy();

  if (!boss || boss.action === "death") {
    return;
  }

  const bossConfig = config.enemies.ratBoss;
  drawMeter(WIDTH - 334, 52, 212, 10, boss.health / bossConfig.maxHealth, "#e6ba61", "#3c1e26", "BOSS");
}

function drawMeter(x, y, width, height, value, fill, back, label) {
  ctx.save();
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4efe5";
  ctx.fillText(label, x, y + height * 0.5);

  const barX = x + 48;
  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(barX - 2, y - 2, width + 4, height + 4);
  ctx.fillStyle = back;
  ctx.fillRect(barX, y, width, height);
  ctx.fillStyle = fill;
  ctx.fillRect(barX, y, width * clamp(value, 0, 1), height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  ctx.fillRect(barX, y, width * clamp(value, 0, 1), 2);
  ctx.restore();
}

function drawSprite(data, image, frame, x, y, facing) {
  const safeFrame = clamp(Math.floor(frame), 0, data.frames - 1);
  const sx = (safeFrame % data.cols) * data.frameWidth;
  const sy = Math.floor(safeFrame / data.cols) * data.frameHeight;
  const dw = data.frameWidth * data.scale;
  const dh = data.frameHeight * data.scale;
  const dx = -data.anchorX * data.scale;
  const dy = -data.anchorY * data.scale;

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  if (facing < 0) {
    ctx.scale(-1, 1);
  }

  ctx.drawImage(
    image,
    sx,
    sy,
    data.frameWidth,
    data.frameHeight,
    Math.round(dx),
    Math.round(dy),
    Math.round(dw),
    Math.round(dh)
  );

  ctx.restore();
}

function getPlayerFrame() {
  const anim = config.animations[player.action];

  if (anim.frameByVelocity) {
    if (player.vy < -520) {
      return 1;
    }
    if (player.vy < -120) {
      return 2;
    }
    if (player.vy < 120) {
      return 3;
    }
    if (player.vy < 560) {
      return 4;
    }
    return 5;
  }

  return getTimedFrame(anim, player.actionTime);
}

function getTimedFrame(anim, time) {
  const frame = Math.floor(time * anim.fps);

  if (anim.loop) {
    return frame % anim.frames;
  }

  return Math.min(frame, anim.frames - 1);
}

function coverRect(srcW, srcH, dstW, dstH) {
  const srcRatio = srcW / srcH;
  const dstRatio = dstW / dstH;

  if (srcRatio > dstRatio) {
    const sw = srcH * dstRatio;
    return {
      sx: (srcW - sw) * 0.5,
      sy: 0,
      sw,
      sh: srcH
    };
  }

  const sh = srcW / dstRatio;
  return {
    sx: 0,
    sy: (srcH - sh) * 0.5,
    sw: srcW,
    sh
  };
}

function isSuperMode() {
  return player.action.startsWith("super_");
}

function getLevelWidth() {
  return levelMap?.width ?? config?.level?.width ?? DEFAULT_LEVEL_WIDTH;
}

function getMaxCameraX() {
  return Math.max(0, getLevelWidth() - WIDTH);
}

function getCameraDrawX() {
  return Math.round(camera.x);
}

function easeOutCubic(value) {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
}

function easeInCubic(value) {
  const t = clamp(value, 0, 1);
  return t ** 3;
}

function easeInOutCubic(value) {
  const t = clamp(value, 0, 1);
  return t < 0.5
    ? 4 * t ** 3
    : 1 - ((-2 * t + 2) ** 3) * 0.5;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

window.addEventListener("keydown", (event) => {
  if (gameCodes.has(event.code)) {
    event.preventDefault();
  }

  keys.add(event.code);

  if (event.repeat) {
    return;
  }

  if (event.code === "Space" || event.code === "KeyW" || event.code === "ArrowUp") {
    jump();
  } else if (event.code === "KeyJ") {
    triggerAction("attack_01");
  } else if (event.code === "KeyK") {
    triggerAction("super_activation");
  } else if (event.code === "KeyH") {
    triggerAction("hurt");
  } else if (event.code === "KeyL") {
    triggerAction("death");
  } else if (event.code === "KeyR") {
    resetEncounter();
  } else if (event.code.startsWith("Digit")) {
    triggerDebugCatStatus(Number(event.code.slice(-1)));
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

start().catch((error) => {
  console.error(error);
  loader.textContent = "Load failed";
});
