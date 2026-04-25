# Scrolling Camera Spec

## Goal

Convert the current fixed-screen arena prototype into a simple side-scrolling level. The player should be able to keep moving horizontally through a level wider than the canvas while a camera follows and clamps to the level bounds.

## Current Problem

The prototype clamps the player and enemies to the visible canvas width. This makes the game feel like a single-screen arena. A side-scrolling platform action game needs separate world coordinates and screen coordinates:

```text
screenX = worldX - cameraX
```

## Scope

This change implements the first common side-scrolling approach:

- One continuous level wider than the viewport.
- Player and enemies use world-space `x`.
- Camera follows the player horizontally.
- Camera cannot scroll beyond the level edges.
- HUD, super cut-in, and super background remain screen-space.
- Gameplay collision remains the same flat-ground prototype.

Out of scope:

- Room transitions.
- Battle lock screens.
- Platform collision.
- Parallax layer splitting.
- Enemy spawn/despawn streaming.

## Level Data

Add `level.width` to `assets/data/player-animations.json`.

Use the generated long background:

```text
assets/levels/backgrounds/rat_den_bg_long.png
```

Recommended first value:

```json
"width": 2400
```

## Camera Rules

- `camera.x` tracks horizontal scroll in world units.
- Max camera is `level.width - WIDTH`.
- Camera target is `player.x - WIDTH * 0.42`.
- Clamp camera to `[0, maxCamera]`.
- Keep camera drawing pixel-snapped to avoid blurry pixel art.

## World Rules

- Player clamps to `[PLAYER_EDGE_PADDING, level.width - PLAYER_EDGE_PADDING]`.
- Enemies clamp to `[ENEMY_EDGE_PADDING, level.width - ENEMY_EDGE_PADDING]`.
- Effects spawn in world space.
- Hitboxes remain in world space.
- Enemy AI compares world-space player/enemy positions.

## Rendering Rules

Normal gameplay:

1. Draw level background using camera progress across the long background image.
2. Draw stage tiles in world space with camera offset.
3. Draw combatants and effects in world space with camera offset.
4. Draw HUD in screen space.

Super activation:

1. Draw super background in screen space.
2. Do not draw normal tiles.
3. Draw combatants/effects in world space with camera offset.
4. Draw cut-in in screen space.
5. Draw HUD in screen space.

Super attack:

1. Draw super background in screen space.
2. Draw dimmed stage tiles in world space with camera offset.
3. Draw combatants/effects in world space with camera offset.
4. Draw HUD in screen space.

## Acceptance Checks

- Holding right moves the player beyond the old right edge.
- Camera scrolls smoothly enough to keep the player visible.
- Player cannot leave the full level bounds.
- Background, ground tiles, enemies, shadows, health bars, and effects align under camera movement.
- HUD and cut-in do not scroll.
- Super activation still hides normal tiles.
- `node --check src/main.js` passes.
- Browser test has no console errors.
