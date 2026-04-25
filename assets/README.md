# Kitty Brawl Asset Checklist

This checklist covers the first playable prototype: one screen, one player character, movement, jump, attack, super move, one or two enemies, enemy hit reactions, and enemy death.

## Folder Layout

- `characters/player/`: player sprite sheets and animation data.
- `characters/enemies/`: enemy sprite sheets and animation data.
- `effects/`: attack, hit, jump, dust, super move, and death effects.
- `levels/tilesets/`: ground and platform tiles.
- `levels/backgrounds/`: static or parallax background images.
- `ui/`: HUD, health bars, super meter, and prompts.
- `audio/sfx/`: short sound effects.
- `audio/music/`: background music loops.
- `data/`: animation, hitbox, hurtbox, and level metadata.

## Minimum Prototype Assets

### Player

- Idle animation.
- Run animation.
- Jump start frame.
- Rising / jump frame.
- Falling frame.
- Landing frame.
- Normal attack animation.
- Super activation pose.
- Super attack animation.
- Hit reaction.
- Death animation, optional for the first prototype.

### Enemies

- Enemy idle animation.
- Enemy walk or patrol animation.
- Enemy attack animation, optional for the first prototype.
- Enemy hit reaction.
- Enemy death animation.
- One small ground enemy.
- One second enemy type, optional but useful for testing combat variety.

### Combat Effects

- Normal attack slash or staff swing effect.
- Hit spark.
- Enemy death puff or burst.
- Super activation aura.
- Super cut-in or dramatic background.
- Super attack impact.
- Ground dust for run, jump, and land.

### Level

- One small tileset for floor, wall, and platform.
- One background image.
- Optional foreground decoration.
- Optional invisible collision map or simple level data.

### UI

- Player health bar.
- Super meter.
- Enemy health bar, optional for small enemies.
- Simple control prompt, optional.

### Audio

- Jump sound.
- Land sound.
- Normal attack sound.
- Hit sound.
- Enemy death sound.
- Super activation sound.
- Super impact sound.
- Optional short background music loop.

### Data Files

- Player animation config.
- Enemy animation config.
- Hitbox and hurtbox config.
- One-screen level config.
