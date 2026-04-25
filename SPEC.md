# Kitty Brawl Spec

## Core Concept

Kitty Brawl is a 1990s-style side-scrolling action platformer inspired by games like Mega Man. The game stars fantasy warrior cats with distinct weapons, movement styles, and combat identities.

## Visual Direction

- Style: 16-bit retro pixel art sprite sheet.
- Era reference: SNES / Sega Genesis action-platformer.
- Character feel: chibi fantasy warrior, compact body proportions, oversized expressive head, readable silhouettes.
- Rendering: limited color palette, strong outline, high-contrast shadows, hand-authored pixel clusters, frame-by-frame animation.
- Tone: dark fantasy, tribal warrior, playful but not cute-only.

## Asset Needs

### Player Character

- Idle animation.
- Run animation.
- Jump, fall, land, and turn animations.
- Basic attack combo.
- Charged or special attack.
- Crouch or slide animation, if used.
- Dash animation, if used.
- Climb, wall slide, or wall jump animations, if used.
- Hit reaction.
- Death / defeat animation.
- Victory / stage clear pose.
- Small portrait or UI face icon.

### Weapons And Effects

- Melee weapon sprites.
- Projectile sprites, if any.
- Muzzle, swing, slash, impact, and charge effects.
- Dust puffs for run, land, dash, and wall contact.
- Hit sparks.
- Damage numbers or status icons, if used.

### Super Move / Ultimate Presentation

- Super meter ready state in the HUD.
- Super activation pose for the player character.
- Close-up character portrait or cut-in illustration.
- Dramatic activation background, usually a full-screen or screen-wide pixel-art plate.
- Speed lines, radial burst, aura, or energy field overlays.
- Screen flash frames, palette swap frames, or silhouette frames.
- Freeze-frame timing data for the activation moment.
- Super move attack animation.
- Super-specific slash, projectile, explosion, shockwave, or summon effects.
- Enemy hit-stun, launch, knockback, or burn/freeze/electrify reaction frames.
- Finisher impact effect.
- Camera shake, slow motion, zoom, and screen tint settings.
- Super activation sound.
- Voice bark or character callout, if used.
- Finisher hit sound and explosion sound.
- Optional super move nameplate text or kanji-style impact card.

### Enemies

- Small ground enemy set.
- Flying enemy set.
- Turret / stationary enemy set.
- Shielded or armored enemy.
- Fast melee enemy.
- Mini-boss.
- Stage boss.
- Enemy projectiles.
- Enemy hit and death effects.

### Bosses

- Boss idle, movement, attacks, hurt, intro, and defeat animations.
- Boss portrait or intro splash.
- Boss health bar UI.
- Unique arena hazards or attack effects.

### Levels

- Tilesets for ground, walls, slopes, platforms, ladders, spikes, and breakable blocks.
- Background layers for parallax.
- Foreground decoration.
- Level-specific props.
- Doors, gates, checkpoints, and stage exits.
- Hazard sprites such as spikes, lava, water, falling blocks, lasers, traps, or wind.

### Pickups And Objects

- Health pickups.
- Energy / mana pickups.
- Extra life or revive item.
- Currency, medals, or collectibles.
- Weapon upgrade item.
- Key, switch, lever, pressure plate, or unlock object.
- Save point or checkpoint marker.

### UI

- Title logo.
- Main menu.
- Pause menu.
- HUD frame.
- Health bar.
- Special meter.
- Lives / score / currency display.
- Boss health bar.
- Stage select screen.
- Dialogue box, if story is included.
- Pixel font.
- Button icons and controller prompts.

### Audio

- Stage music loops.
- Boss music loop.
- Menu music.
- Player jump, land, attack, hit, death, and special attack sounds.
- Enemy hit and death sounds.
- Pickup sounds.
- UI move, confirm, cancel, and pause sounds.
- Environmental sounds for hazards or stage ambience.

### Narrative And Presentation

- Opening cutscene stills or short intro animation.
- Character select portraits, if multiple cats are playable.
- Stage intro card.
- Boss intro card.
- Ending image or short ending sequence.

## First Vertical Slice Recommendation

For the first playable prototype, prepare only:

- One playable cat with idle, run, jump, fall, land, attack, hit, and death animations.
- One simple tileset.
- One background.
- Two enemy types.
- One pickup.
- One checkpoint.
- One mini-boss or boss.
- Basic HUD with health and boss health.
- Core sound effects for jump, attack, hit, enemy defeat, pickup, and UI confirm.
