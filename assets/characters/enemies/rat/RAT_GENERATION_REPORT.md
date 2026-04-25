# Rat Enemy Generation Report

Generated with the `generate2dsprite` workflow using the rat enemy concept image as the identity anchor.

Reference concept:

- `concept/rat_enemy_concept_v1.png`
- `concept/rat_enemy_concept_v1-transparent.png`

## Character Sheets

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `idle/sheet-transparent.png` | `2x2` | 4 | `128` | Pass |
| `walk/sheet-transparent.png` | `2x3` | 6 | `128` | Pass |
| `attack/sheet-transparent.png` | `2x3` | 6 | `192` | Pass, alpha-fixed |
| `hurt/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |
| `death/sheet-transparent.png` | `2x3` | 6 | `192` | Pass, alpha-fixed |

Notes:

- All final character sheets have `edge_touch_frames=[]`.
- The rat identity is consistent enough for a first combat prototype: gray-brown body, large pink ears, golden eyes, ragged dark hood, long pink tail, and short dagger.
- The rat reads as smaller and weaker than the cat warrior.
- `walk/_attempt_1_edge_touch/` and `walk/_attempt_2_candidate/` are archived attempts. Do not import those into the game.
- `attack` and `death` were reprocessed from their original `raw-sheet.png` files with safer chroma-key settings: `threshold=70`, `edge_threshold=95`, `edge_clean_depth=0`. This preserves the pink ears and tail better than the first pass. Previous processed files were backed up as `*.before-raw-reprocess.png`; older alpha-fix backups remain as `*.before-alpha-fix.png`.

## Effect Sheets

| Asset | Sheet | Frames | Cell | QC |
|---|---:|---:|---:|---|
| `../../effects/enemies/rat_hit_spark/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |
| `../../effects/enemies/rat_death_puff/sheet-transparent.png` | `2x2` | 4 | `192` | Pass |

Notes:

- Both final effect sheets have `edge_touch_frames=[]`.
- `rat_hit_spark` fits normal attack feedback.
- `rat_death_puff` fits enemy defeat feedback.

## Current Sufficiency

Enough for:

- Enemy idle.
- Enemy patrol walk.
- Enemy dagger attack.
- Enemy hurt reaction.
- Enemy death animation.
- Enemy hit effect.
- Enemy death effect.

Still needed before full game integration:

- Enemy animation config JSON.
- Enemy anchor data.
- Enemy hurtbox and hitbox data.
- Enemy behavior data: patrol distance, speed, aggro range, health, knockback.
- Combat wiring in the web demo.
- Optional enemy audio: squeak, hit, death, dagger attack.
