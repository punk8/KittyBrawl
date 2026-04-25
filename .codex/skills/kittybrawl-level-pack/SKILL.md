---
name: kittybrawl-level-pack
description: KittyBrawl workflow for creating and integrating stage backgrounds, tilesets, platform tiles, super-background plates, and level visual layers. Use when generating level art with imagegen, slicing/cleaning tiles, updating level asset metadata, or adjusting canvas draw order for normal and super-move presentation.
---

# KittyBrawl Level Pack

## Asset Types

Background:

- Opaque PNG is fine.
- Use for parallax or full-screen cover draw.
- Should not contain gameplay-critical collision edges.

Tiles:

- Final engine tiles should be individual PNGs with transparent edges.
- Raw generated tileset sheets may be opaque visual source material.
- Avoid black gutters in final tile images.

Super background plate:

- Opaque PNG or mostly opaque PNG.
- Used as a background replacement layer during super moves.
- Should be drawn at full opacity, with only a light dark overlay if needed.

## Standard Layout

```text
assets/levels/
  LEVEL_IMAGE_PROMPTS.md
  <level-name>/
    background.png
    tiles/
      raw-tileset.png
      ground-center.png
      slime-wall.png
      floating-platform.png
```

Super presentation:

```text
assets/backgrounds/super_background_plate.png
assets/characters/player/super/player_super_cutin.png
```

## Generation Guidance

Use `$imagegen` for:

- Full stage backgrounds.
- Cinematic super background plates.
- Visual-source tileset sheets.
- Character cut-ins.

Use `$generate2dsprite` mainly for character/action sprite sheets and transparent sprite cleanup, not for large scenic backgrounds unless the task specifically needs animation-sheet processing.

## Tileset Cleanup Flow

When a generated tileset is only a visual source:

1. Keep the raw source as `raw-tileset.png`.
2. Identify tile regions by visible grid/gutter.
3. Slice into named tile PNGs.
4. Remove gutters and transparent outside edges.
5. Preserve pixel crispness; do not blur or resample softly.
6. Place final tiles in `assets/levels/<level>/tiles/`.
7. Update `assets/data/player-animations.json` level tile paths.

If the tile still contains painted background behind the object, treat it as a decoration tile or regenerate/clean it before using it for collision-like platforms.

## Canvas Layer Order

Normal gameplay:

1. Level background.
2. Stage tiles.
3. Combatants.
4. Effects.
5. HUD.

Super activation:

1. Super background plate.
2. Combatants/effects as needed.
3. Cut-in.
4. HUD.

Do not draw normal stage tiles during the super activation cut-in.

Super attack:

1. Super background plate.
2. Very dim stage tiles for spatial grounding.
3. Combatants.
4. Super impact effects.
5. HUD.

## Verification

- Check the background fills the canvas without stretched characters or obvious crop damage.
- Check final tiles have clean transparent edges.
- Check super background is not visibly transparent unless intentionally designed.
- Check tiles do not cover cut-ins or cinematic presentation.
- Use browser screenshots for normal gameplay, super activation, and super attack.
