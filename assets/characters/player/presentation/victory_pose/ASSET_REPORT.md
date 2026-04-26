# Victory Pose Asset Report

## Output

- `raw-sheet.png`: original generated 3x2 chroma-key source.
- `raw-sheet-clean.png`: cleaned chroma-key source.
- `sheet-transparent.png`: final transparent 3x2 sheet, 576x384, 192x192 per frame.
- `sheet-preview-checker.png`: checkerboard preview.
- `victory_pose-1.png` through `victory_pose-6.png`: extracted frames.
- `animation.gif`: preview animation.
- `pipeline-meta.json`: postprocess metadata.
- `prompt-used.txt`: generation prompt.

## Reference

- Identity reference board: `assets/characters/player/presentation/reference/player_existing_reference_board.png`
- The rejected earlier version drifted taller and more purple; this revision intentionally locks closer to the original dark brown/black cloak, compact body, round face, and existing staff design.

## QC

- Final sheet is RGBA with transparent corners.
- Non-transparent magenta-like pixels: 0.
- Frame grid: 3 columns x 2 rows, 6 total frames.
- Final frame bboxes are close to existing combat/super heights: `77`, `110`, `109`, `106`, `98`, `100`.
- Ground contact is stable within this sheet; generated frame bottoms are all `166`.
- Pipeline raw edge-touch report: `[0, 2]`. The final processed transparent sheet does not visually touch the frame edge, but the raw source for frame 3 was close to the cell edge.

## Integration Notes

- Suggested animation metadata: `frameWidth=192`, `frameHeight=192`, `cols=3`, `frames=6`, `fps=7`, `loop=false`, `scale` near player combat/super scale, `anchorX=96`, `anchorY=166`.
- The final two frames can be held after the stage clear animation finishes.

## Risk

- Frame 3's raw source was near a cell edge. If the pose clips in-game after scaling, regenerate with even wider cell padding or hand-shift the raw source cell before processing.
