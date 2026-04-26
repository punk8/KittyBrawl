# Stage Clear Plate Asset Report

## Output

- `stage_clear_plate.png`: final transparent PNG, 960x240 RGBA.
- `stage_clear_plate_source.png`: original chroma-key source PNG, 1774x887 RGB.
- `STAGE_CLEAR_PLATE_PROMPT.md`: final prompt record.

## Generation Method

- Used the built-in image generation tool, following the project imagegen skill.
- Generated a wide, low-height 90s arcade pixel-art UI plate on a flat green chroma-key background.
- Removed the chroma-key background with:
  - `${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py`
  - `--auto-key border`
  - `--soft-matte`
  - `--transparent-threshold 12`
  - `--opaque-threshold 220`
  - `--despill`
- Cropped the alpha subject bounds, preserved padding around sparks and trim, and fitted it into a 960x240 transparent canvas.

## QC

- Final dimensions: 960x240.
- Final alpha bounding box: `(22, 53, 938, 187)`.
- Drawn plate size after fitting: approximately 924x142.
- Transparent corners: all four corners have alpha 0.
- Green chroma-key residual scan: 0 non-transparent greenish pixels detected.
- Alpha coverage: about 39.62 percent of the final canvas.
- Text/logo check: no baked text, logo, letters, or numbers visible in the final plate.
- Style check: brass trim, purple magic glow, dark stone/leather central panel, and rat-den ruin accents match the KittyBrawl dark fantasy arcade direction.

## Risks

- The source image is AI-generated at high resolution and then scaled down; it should read well at 960x240, but it is not a hand-authored native low-resolution pixel asset.
- A few tiny purple spark particles are retained near the plate edge. They are intentional atmosphere, but code can crop or draw the plate slightly lower opacity if the stage-clear text treatment needs a quieter silhouette.
