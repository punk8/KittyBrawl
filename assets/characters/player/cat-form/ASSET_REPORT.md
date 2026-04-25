# Player Cat-Form Asset Report

Scope: player cat-form animations for the rat boss food hypnosis and paper-ball bait attacks.

No runtime code or animation config was modified by this asset pass.

## Created Assets

| Action | Sheet | Frame Size | Cols | Frames | Suggested FPS | Loop |
|---|---|---:|---:|---:|---:|---|
| `cat_run` | `cat_run/sheet-transparent.png` | `128x128` | 3 | 6 | 10 | true |
| `cat_eat` | `cat_eat/sheet-transparent.png` | `128x128` | 2 | 4 | 6 | true |
| `cat_pounce` | `cat_pounce/sheet-transparent.png` | `128x128` | 3 | 6 | 9 | false |
| `cat_stunned` | `cat_stunned/sheet-transparent.png` | `128x128` | 2 | 4 | 6 | true |
| `cat_knockback` | `cat_knockback/sheet-transparent.png` | `128x128` | 3 | 6 | 9 | false |
| `cat_recover` | `cat_recover/sheet-transparent.png` | `128x128` | 2 | 4 | 7 | false |

Each action folder includes:

- `raw-sheet.png`
- `raw-sheet-clean.png`
- `sheet-transparent.png`
- `sheet-preview-checker.png`
- `animation.gif`
- extracted frame PNGs
- `pipeline-meta.json`

Combined preview:

- `cat_form_preview_checker.png`

## Integration Notes

Start with `scale: 1.0` for all cat-form animations, then tune against the standing player in canvas. These sheets are intended to temporarily replace the normal player animation while the boss status effect owns movement and attack lockout.

Recommended first-pass status mapping:

- Food hypnosis: `cat_run` -> `cat_eat` -> `cat_stunned` -> `cat_recover`
- Paper-ball bait: `cat_run` -> `cat_pounce` -> `cat_knockback` -> `cat_recover`

## QC Notes

All final `sheet-transparent.png` files are RGBA and have transparent corners based on local image metadata checks. No obvious magenta background remains in the final sheets.

