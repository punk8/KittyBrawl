# Rat Boss Core Animation Asset Report

Scope for this pass:

- Created the first rat boss core animation prompt plan.
- Generated and postprocessed `idle`, `intro`, `hurt`, and `death` sprite sheets.
- Did not edit `src/main.js` or `assets/data/player-animations.json`.
- Did not intentionally modify attack/cutin/projectile folders owned by other concurrent agents.

## Files Created

Prompt and report:

- `assets/characters/enemies/rat-boss/RAT_BOSS_SPRITE_PROMPTS.md`
- `assets/characters/enemies/rat-boss/ASSET_REPORT.md`

Idle:

- `assets/characters/enemies/rat-boss/idle/raw-sheet.png`
- `assets/characters/enemies/rat-boss/idle/raw-sheet-clean.png`
- `assets/characters/enemies/rat-boss/idle/sheet-transparent.png`
- `assets/characters/enemies/rat-boss/idle/sheet-preview-checker.png`
- `assets/characters/enemies/rat-boss/idle/animation.gif`
- `assets/characters/enemies/rat-boss/idle/idle-1.png` through `idle-4.png`
- `assets/characters/enemies/rat-boss/idle/pipeline-meta.json`
- `assets/characters/enemies/rat-boss/idle/prompt-used.txt`

Intro:

- `assets/characters/enemies/rat-boss/intro/raw-sheet.png`
- `assets/characters/enemies/rat-boss/intro/raw-sheet-clean.png`
- `assets/characters/enemies/rat-boss/intro/sheet-transparent.png`
- `assets/characters/enemies/rat-boss/intro/sheet-preview-checker.png`
- `assets/characters/enemies/rat-boss/intro/animation.gif`
- `assets/characters/enemies/rat-boss/intro/intro-1.png` through `intro-6.png`
- `assets/characters/enemies/rat-boss/intro/pipeline-meta.json`
- `assets/characters/enemies/rat-boss/intro/prompt-used.txt`

Hurt:

- `assets/characters/enemies/rat-boss/hurt/raw-sheet.png`
- `assets/characters/enemies/rat-boss/hurt/raw-sheet-clean.png`
- `assets/characters/enemies/rat-boss/hurt/sheet-transparent.png`
- `assets/characters/enemies/rat-boss/hurt/sheet-preview-checker.png`
- `assets/characters/enemies/rat-boss/hurt/animation.gif`
- `assets/characters/enemies/rat-boss/hurt/hurt-1.png` through `hurt-4.png`
- `assets/characters/enemies/rat-boss/hurt/pipeline-meta.json`
- `assets/characters/enemies/rat-boss/hurt/prompt-used.txt`

Death:

- `assets/characters/enemies/rat-boss/death/raw-sheet.png`
- `assets/characters/enemies/rat-boss/death/raw-sheet-clean.png`
- `assets/characters/enemies/rat-boss/death/sheet-transparent.png`
- `assets/characters/enemies/rat-boss/death/sheet-preview-checker.png`
- `assets/characters/enemies/rat-boss/death/animation.gif`
- `assets/characters/enemies/rat-boss/death/death-1.png` through `death-6.png`
- `assets/characters/enemies/rat-boss/death/pipeline-meta.json`
- `assets/characters/enemies/rat-boss/death/prompt-used.txt`

## Source Generation

Built-in `imagegen` output directory:

- `/Users/chenshipeng/.codex/generated_images/019dc634-a397-71f3-90fa-ca78d0a78fc6/`

Raw source files copied into the workspace:

- `idle/raw-sheet.png` from `ig_041a236494d880a70169ed1cc278c08191b9105bf77a1e3455.png`
- `intro/raw-sheet.png` from `ig_041a236494d880a70169ed1d7084948191b108236c189dfadf.png`
- `hurt/raw-sheet.png` from `ig_041a236494d880a70169ed1decd25881918b3b5146fce816be.png`
- `death/raw-sheet.png` from `ig_041a236494d880a70169ed1e5090108191abaf2043933cc1ff.png`

## Suggested Animation Metadata

These values are intended as first integration defaults. Tune scale and anchors in the canvas after loading the boss.

| Action | Sheet | Frame Size | Cols | Frames | FPS | Loop | Scale | AnchorX | AnchorY |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|
| `idle` | `idle/sheet-transparent.png` | `256x256` | 2 | 4 | 5 | true | 0.84 | 128 | 244 |
| `intro` | `intro/sheet-transparent.png` | `256x256` | 3 | 6 | 7 | false | 0.84 | 128 | 244 |
| `hurt` | `hurt/sheet-transparent.png` | `256x256` | 2 | 4 | 8 | false | 0.84 | 128 | 244 |
| `death` | `death/sheet-transparent.png` | `256x256` | 3 | 6 | 6 | false | 0.84 | 128 | 244 |

Suggested body/hurt box starting point:

```json
{
  "bodyWidth": 132,
  "bodyHeight": 132,
  "bodyOffsetY": -74
}
```

## QC Notes

- All final `sheet-transparent.png` files have transparent corners.
- No magenta-like pixels were detected in final transparent sheets.
- `sheet-preview-checker.png` exists for all four actions.
- `intro` was reprocessed with `component-mode=largest` to remove small detached artifacts.
- `death` final transparent sheet had a tiny isolated-pixel cleanup applied, then frame PNGs and GIF were regenerated from the cleaned sheet.

Conservative edge-touch warnings remain in `pipeline-meta.json` because some generated raw cells placed tail/cloak pixels at or very near the raw cell boundary before cropping. The final postprocessed sheets have safe transparent margins visually, but these actions should still be checked in-game after integration:

- `idle`: raw edge warning on frame 4.
- `intro`: raw edge warnings on frames 2-6.
- `hurt`: raw edge warning on frame 2.
- `death`: raw edge warnings on frames 3 and 6.

## Integration Readiness

Status: usable for a first boss integration pass.

The sheets are visually consistent with the normal rat enemy while reading as a larger trickster/shaman boss. They include the intended yellow eyes, pink ears/tail, dark hood/cloak, bone ornaments, cat-food pouch, and paper bundle.

Recommended next integration step:

1. Load `idle` first and tune the boss scale against the player and normal rats.
2. Use the same scale/anchor for `intro`, `hurt`, and `death`.
3. Confirm the raw edge-warning frames do not appear clipped at actual game scale.
