---
name: kittybrawl-character-pack
description: KittyBrawl workflow for adding or revising playable characters and enemies in the browser demo. Use when integrating new character/enemy assets, animation metadata, hitboxes, hurtboxes, spawn logic, AI behavior, combat damage, scale/anchor tuning, or replacing existing player/rat actions.
---

# KittyBrawl Character Pack

## Entry Points

Read these first:

- `assets/data/player-animations.json`
- `src/main.js`
- Existing character/enemy asset folders under `assets/characters/`

Use `$kittybrawl-sprite-action-pipeline` for generating or repairing action sheets. Use this skill for wiring those sheets into the game.

## Minimal Action Sets

Playable character, first playable:

- `idle`
- `run`
- `jump_fall`
- `attack_01`
- `hurt`
- `death`
- `super_activation`
- `super_attack`

Basic enemy:

- `idle`
- `walk`
- `attack`
- `hurt`
- `death`

Effects that often accompany character packs:

- player slash
- player hit spark
- player super impact
- enemy hit spark
- enemy death puff

## Integration Steps

1. Add assets under `assets/characters/player/...` or `assets/characters/enemies/<name>/...`.
2. Add animation entries to `assets/data/player-animations.json`.
3. For enemies, add an enemy config with:
   - `maxHealth`
   - `speed`
   - `attackRange`
   - `attackDamage`
   - `attackCooldown`
   - `bodyWidth`
   - `bodyHeight`
   - `bodyOffsetY`
   - `animations`
4. Update `src/main.js` only after assets and metadata are stable.
5. Tune draw scale and anchors against the live canvas.
6. Tune hitboxes/hurtboxes by behavior: attacks should feel fair before they look numerically neat.

## Animation Metadata Rules

Every animation entry needs:

```json
{
  "src": "assets/...",
  "frameWidth": 192,
  "frameHeight": 192,
  "cols": 3,
  "frames": 6,
  "fps": 8,
  "loop": false,
  "scale": 1.0,
  "anchorX": 96,
  "anchorY": 180
}
```

Use `frameByVelocity` only for movement sheets where velocity chooses frames. Keep death non-looping and freeze on final frame if the character should remain visible.

## Scale And Anchor Tuning

Compare against idle/run in-game:

- Feet should stay on the same ground line unless airborne.
- Hurt/death should not become visibly larger than idle/attack.
- Weapon reach can exceed the body frame, but body scale should remain stable.
- Tail/cape motion should not shift the perceived body center too far.

When an animation looks too large, prefer metadata scale tuning first. Regenerate only if the source pose is fundamentally wrong.

## Combat Behavior

For a new enemy, implement the smallest behavior that proves the asset:

- Spawn at a fixed x position.
- Face the player.
- Walk toward the player.
- Attack when within range and cooldown is ready.
- Enter hurt on damage.
- Enter death and remove after death animation.

Add deeper AI only after the asset pack is stable.

## Verification

- `node --check src/main.js`
- Browser screenshot at `http://localhost:4173/`.
- Test movement, attack, hurt, death, and reset.
- Test at least one hit and one kill.
- Check console errors before final response.
