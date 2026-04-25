const WIDTH = 960;
const HEIGHT = 540;
const GROUND_Y = 430;
const MOVE_SPEED = 315;
const JUMP_SPEED = -820;
const GRAVITY = 2250;
const FRICTION = 0.82;

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const loader = document.querySelector("#loader");

ctx.imageSmoothingEnabled = false;

const keys = new Set();
const transientEffects = [];
const enemies = [];

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
  flags: Object.create(null)
};

let config = null;
let images = null;
let lastTime = performance.now();
let stagePulse = 0;

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
  "KeyR"
]);

window.__kittyDebug = {
  getState: () => ({
    player: {
      action: player.action,
      x: Math.round(player.x),
      y: Math.round(player.y),
      vx: Math.round(player.vx),
      vy: Math.round(player.vy),
      facing: player.facing,
      grounded: player.grounded,
      health: Number(player.health.toFixed(2)),
      superMeter: Number(player.superMeter.toFixed(2))
    },
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      action: enemy.action,
      x: Math.round(enemy.x),
      health: enemy.health,
      facing: enemy.facing
    })),
    effects: transientEffects.map((effect) => effect.name)
  })
};

async function start() {
  config = await fetchJson("assets/data/player-animations.json");
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
  updateMovement(dt);
  updatePlayerAction(dt);
  updateEnemies(dt);
  updateEffects(dt);
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
  player.x = clamp(player.x, 92, WIDTH - 92);

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
    enemy.x = clamp(enemy.x, 70, WIDTH - 70);

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
    enemy.x = clamp(enemy.x, 70, WIDTH - 70);
    if (enemy.action !== "walk") {
      setEnemyAction(enemy, "walk");
    }
  } else if (enemy.action !== "idle") {
    setEnemyAction(enemy, "idle");
  }
}

function updateEffects(dt) {
  for (let index = transientEffects.length - 1; index >= 0; index -= 1) {
    const effect = transientEffects[index];
    const data = config.effects[effect.name];
    effect.time += dt;

    if (Math.floor(effect.time * data.fps) >= data.frames) {
      transientEffects.splice(index, 1);
    }
  }
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
  if (isPlayerActionLocked() || !player.grounded) {
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

function resetEncounter() {
  player.x = WIDTH * 0.42;
  player.y = GROUND_Y;
  player.vx = 0;
  player.vy = 0;
  player.facing = 1;
  player.grounded = true;
  player.health = 1;
  player.superMeter = 1;
  player.invulnerableTime = 0;
  transientEffects.length = 0;
  enemies.length = 0;
  setPlayerAction("idle");
  spawnRat("rat-a", WIDTH * 0.7);
  spawnRat("rat-b", WIDTH * 0.86);
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

function spawnEffect(name, x, y, facing) {
  transientEffects.push({
    name,
    x,
    y,
    facing,
    time: 0
  });
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
  enemy.health -= amount;
  enemy.facing = sourceX <= enemy.x ? -1 : 1;
  spawnEffect("rat_hit_spark", enemy.x, enemy.y - 68, enemy.facing);

  if (enemy.health <= 0) {
    enemy.health = 0;
    enemy.knockback = 0;
    setEnemyAction(enemy, "death");
    spawnEffect("rat_death_puff", enemy.x, enemy.y - 58, enemy.facing);
    return;
  }

  enemy.knockback = sourceX <= enemy.x ? 220 : -220;
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
  drawCombatants();
  drawEffects();

  if (player.action === "super_activation") {
    drawSuperCutin();
  }

  drawHud();
}

function drawBackdrop() {
  const image = images.get("level:background");
  const cover = coverRect(image.width, image.height, WIDTH, HEIGHT);
  ctx.drawImage(image, cover.sx, cover.sy, cover.sw, cover.sh, 0, 0, WIDTH, HEIGHT);

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
  ctx.save();
  ctx.globalAlpha = isSuperStage ? 0.22 : 0.82;
  const ground = images.get("tile:groundCenter");
  const wall = images.get("tile:slimeWall");
  const platform = images.get("tile:floatingPlatform");

  for (let x = -24; x < WIDTH + 150; x += 132) {
    ctx.drawImage(ground, x, GROUND_Y - 132, 150, 150);
  }

  ctx.globalAlpha = isSuperStage ? 0.12 : 0.48;
  ctx.drawImage(wall, -28, GROUND_Y - 130, 122, 122);
  ctx.drawImage(wall, WIDTH - 92, GROUND_Y - 130, 122, 122);

  ctx.globalAlpha = (isSuperStage ? 0.16 : 0.56) + Math.sin(stagePulse * 2) * 0.04;
  ctx.drawImage(platform, 664, 280, 136, 136);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = isSuperStage ? "rgba(5, 4, 4, 0.12)" : "rgba(5, 4, 4, 0.36)";
  ctx.fillRect(0, GROUND_Y + 8, WIDTH, HEIGHT - GROUND_Y);
  ctx.fillStyle = isSuperStage ? "rgba(241, 209, 146, 0.08)" : "rgba(241, 209, 146, 0.16)";
  ctx.fillRect(0, GROUND_Y - 1, WIDTH, 2);
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
    Math.round(offsetX),
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
  drawShadow(player.x, player.y, 62, 12, player.grounded ? 1 : clamp(1 - (GROUND_Y - player.y) / 360, 0.42, 0.9));

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
  drawShadow(enemy.x, enemy.y, 42, 9, enemy.action === "death" ? 0.72 : 1);
  drawSprite(anim, images.get(`enemy:${enemy.type}:${enemy.action}`), getTimedFrame(anim, enemy.actionTime), enemy.x, enemy.y, enemy.facing);

  if (enemy.action !== "death") {
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
    const frame = Math.floor(effect.time * data.fps);
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

  ctx.save();
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4efe5";
  ctx.fillText("RATS", WIDTH - 126, 31);
  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(WIDTH - 76, 23, 48, 17);
  ctx.fillStyle = "#e6ba61";
  ctx.fillText(String(enemies.length).padStart(2, "0"), WIDTH - 62, 31);
  ctx.restore();
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

function easeOutCubic(value) {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
}

function easeInCubic(value) {
  const t = clamp(value, 0, 1);
  return t ** 3;
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
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

start().catch((error) => {
  console.error(error);
  loader.textContent = "Load failed";
});
