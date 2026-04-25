# Sprite Generation Report

Generated with the `generate2dsprite` workflow using the cat warrior reference image as the identity anchor.

## Player Movement

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `characters/player/movement/idle/sheet-transparent.png` | `2x2` | 4 | `128` | Pass |
| `characters/player/movement/run/sheet-transparent.png` | `3x2` | 6 | `128` | Pass |
| `characters/player/movement/jump_fall/sheet-transparent.png` | `3x2` | 6 | `128` | Pass |

Notes:

- `jump_fall` is usable for a prototype, but later can be split into `jump_start`, `airborne`, and `fall` for cleaner platformer control.

## Player Combat

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `characters/player/combat/attack_01/sheet-transparent.png` | `2x3` | 6 | `192` | Pass |
| `characters/player/combat/hurt/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |
| `characters/player/combat/death/sheet-transparent.png` | `2x3` | 6 | `192` | Pass |

Notes:

- `attack_01` is ready for a first normal attack. Suggested active frames: 4 and 5.
- `hurt` includes a small impact flash in the first frame.
- `death` is a compact curled defeat pose, good for engine containment but less dramatic than a long collapse.
- `attack_01`, `hurt`, and `death` were reprocessed from their original `raw-sheet.png` files with safer chroma-key settings: `threshold=70`, `edge_threshold=95`, `edge_clean_depth=0`. This preserves the player face, white fur, pink ears, and pink nose better than the first pass. Previous processed files were backed up as `*.before-face-alpha-reprocess.*`.

## Player Super Move

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `characters/player/super/super_activation/sheet-transparent.png` | `3x2` | 6 | `192` | Pass |
| `characters/player/super/super_attack/sheet-transparent.png` | `3x3` | 9 | `192` | Pass |

Notes:

- Failed edge-touch attempts are archived in `_attempt_*_edge_touch` folders. Do not import those into the game.
- The final `super_attack` metadata has `edge_touch_frames=[]`.

## Player Effects

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `effects/player/slash_fx/sheet-transparent.png` | `1x4` | 4 | `192` | Pass |
| `effects/player/hit_spark/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |
| `effects/player/super_impact_fx/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |
| `effects/player/super_background_plate/background.png` | single | 1 | n/a | Pass |

## Current Sufficiency

Enough for:

- Player idle.
- Player run.
- Player jump / fall placeholder.
- Player normal attack.
- Player hurt.
- Player death.
- Player super activation.
- Player super attack.
- Normal slash effect.
- Hit spark.
- Super impact.
- Super background plate.

Still needed for the full first playable prototype:

- One or two enemy sprite sets: idle, walk, hit, death, optional attack.
- One background for the test scene.
- One small ground/platform tileset.
- Player animation config JSON.
- Player hitbox and hurtbox config.
- Enemy animation and collision config.
- Basic HUD: health bar and super meter.
- Audio: jump, land, attack, hit, enemy death, super activation, super impact.
