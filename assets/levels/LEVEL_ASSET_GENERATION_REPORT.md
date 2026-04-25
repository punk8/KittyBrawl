# Level Asset Generation Report

Date: 2026-04-26

Generated with the `imagegen` skill from `assets/levels/LEVEL_IMAGE_PROMPTS.md`.

## Outputs

| Asset | Path | Dimensions | Alpha | Status |
| --- | --- | ---: | --- | --- |
| Rat den background | `assets/levels/backgrounds/rat_den_bg.png` | `1672x941` | No | Usable as first playable scene background |
| Rat den tileset | `assets/levels/tilesets/rat_den_tileset.png` | `1252x1252` | No | Usable as a visual tileset source, needs slicing/cleanup before strict tilemap use |
| Rat den props source | `assets/levels/props/rat_den_props_chromakey_source.png` | `1402x1122` | No | Preserved chroma-key source |
| Rat den props transparent | `assets/levels/props/rat_den_props.png` | `1402x1122` | Yes | Usable transparent prop sheet |

Prompt records:

- `assets/levels/backgrounds/rat_den_bg.prompt-used.txt`
- `assets/levels/tilesets/rat_den_tileset.prompt-used.txt`
- `assets/levels/props/rat_den_props.prompt-used.txt`

Tileset notes:

- The sheet is a `4x4` layout and can be divided into `313x313` cells.
- The black grid gutters are visible and the image is fully opaque.
- Some platform tiles include dark background behind the platform shapes.
- For a quick prototype, the sheet is enough as a visual source.
- For production-style tilemap work, make a second pass that crops individual tiles and creates transparent platform/edge variants.

Props notes:

- The final props sheet has an alpha channel.
- Corners are transparent.
- Alpha coverage is roughly `72.443%` transparent and `26.211%` fully opaque.
- No obvious green chroma-key fringe was visible in the generated transparent PNG.

First playable scene recommendation:

- Use `rat_den_bg.png` as the full canvas backdrop.
- Use the existing ground in the background for the first movement/combat pass.
- Slice `rat_den_tileset.png` later when tile collision and platform placement become part of the build.
- Use `rat_den_props.png` for foreground dressing once the level renderer supports props.

## Processor-Friendly Tileset Pass

Date: 2026-04-26

A second tileset pass was generated and processed for engine use.

New source:

- `assets/levels/tilesets/rat_den_tileset_magenta_raw.png`
- `assets/levels/tilesets/rat_den_tileset_magenta_raw.prompt-used.txt`

Processor:

- `scripts/process_tileset.py`

Processed outputs:

- `assets/levels/tilesets/rat_den_tileset_processed/tileset-transparent.png`
- `assets/levels/tilesets/rat_den_tileset_processed/tileset-transparent-checker.png`
- `assets/levels/tilesets/rat_den_tileset_processed/tileset.json`
- `assets/levels/tilesets/rat_den_tileset_processed/tileset_manifest.md`
- `assets/levels/tilesets/rat_den_tileset_processed/tiles/*.png`

Processing settings:

- Grid: `4x4`
- Tile size: `313x313`
- Chroma key: `#FF00FF`
- Chroma threshold: `128`
- Edge fringe cleanup: threshold `180`, passes `1`

Result:

- The processed sheet has alpha.
- The 16 individual tile PNGs have alpha.
- The old black gutter issue is gone.
- The remaining caveat is that `313x313` is not a power-of-two or common fixed tile size. For this canvas prototype it is usable, but later engine work may prefer a normalized export size such as `256x256` or `320x320`.
