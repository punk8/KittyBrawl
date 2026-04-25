# Rat Boss Cut-In, Props, And Effects Asset Report

## Scope

This report covers the rat boss presentation and special-attack support assets only.

Files were written under:

- `assets/characters/enemies/rat-boss/cutin/`
- `assets/effects/boss/rat-boss/`

No runtime code or animation config was modified.

## Created Assets

### Boss Cut-In

- Prompt: `assets/characters/enemies/rat-boss/cutin/RAT_BOSS_CUTIN_PROMPT.md`
- Image: `assets/characters/enemies/rat-boss/cutin/boss_cutin.png`
- Size: `1798 x 875`
- Alpha: RGB opaque cinematic banner
- Usage: screen-space boss special cut-in, matching the existing player cut-in style

### Boss Effect Prompt Set

- Prompt set: `assets/effects/boss/rat-boss/BOSS_EFFECTS_PROMPTS.md`

### cat_food_projectile

- Raw: `assets/effects/boss/rat-boss/cat_food_projectile/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/cat_food_projectile/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/cat_food_projectile/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/cat_food_projectile/animation.gif`
- Frames: 4
- Layout: `4 x 1`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: none

### cat_food_on_ground

- Raw: `assets/effects/boss/rat-boss/cat_food_on_ground/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/cat_food_on_ground/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/cat_food_on_ground/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/cat_food_on_ground/animation.gif`
- Frames: 4
- Layout: `4 x 1`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: source frame 4 reports minor raw-cell edge touch; final transparent output was visually checked and does not appear clipped

### paper_ball_projectile

- Raw: `assets/effects/boss/rat-boss/paper_ball_projectile/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/paper_ball_projectile/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/paper_ball_projectile/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/paper_ball_projectile/animation.gif`
- Frames: 4
- Layout: `4 x 1`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: none

### paper_ball_on_ground

- Raw: `assets/effects/boss/rat-boss/paper_ball_on_ground/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/paper_ball_on_ground/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/paper_ball_on_ground/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/paper_ball_on_ground/animation.gif`
- Frames: 4
- Layout: `4 x 1`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: none

### hypnosis_fx

- Raw: `assets/effects/boss/rat-boss/hypnosis_fx/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/hypnosis_fx/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/hypnosis_fx/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/hypnosis_fx/animation.gif`
- Frames: 4
- Layout: `2 x 2`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: none
- Note: regenerated once to remove baked-in food/paper props; final sheet is pure overlay FX

### kick_impact_fx

- Raw: `assets/effects/boss/rat-boss/kick_impact_fx/raw-sheet.png`
- Transparent sheet: `assets/effects/boss/rat-boss/kick_impact_fx/sheet-transparent.png`
- Preview: `assets/effects/boss/rat-boss/kick_impact_fx/sheet-preview-checker.png`
- GIF: `assets/effects/boss/rat-boss/kick_impact_fx/animation.gif`
- Frames: 4
- Layout: `2 x 2`
- Frame size: `192 x 192`
- Alpha: RGBA, transparent corners validated
- Edge touch: none

## Combined Preview

- `assets/effects/boss/rat-boss/boss_effects_preview_checker.png`

## Integration Readiness

These assets are enough to wire the first boss-special prototype:

- `boss_cutin.png` can be used for both cat-food and paper-ball cut-in presentation.
- `cat_food_projectile` and `cat_food_on_ground` cover the food hypnosis sequence.
- `paper_ball_projectile` and `paper_ball_on_ground` cover the paper bait sequence.
- `hypnosis_fx` can be layered above either ground prop.
- `kick_impact_fx` can be spawned at the boss kick contact point.

Recommended first metadata:

```json
{
  "frameWidth": 192,
  "frameHeight": 192,
  "projectileCols": 4,
  "projectileFrames": 4,
  "fxCols": 2,
  "fxFrames": 4
}
```

Scale should be tuned in-game:

- Projectile props: start around `0.35` to `0.5`.
- Ground props: start around `0.45` to `0.6`.
- Hypnosis FX: start around `0.8` to `1.1`.
- Kick impact FX: start around `0.75` to `1.0`.

