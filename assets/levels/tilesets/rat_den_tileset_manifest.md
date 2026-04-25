# Rat Den Tileset Manifest

Final image: `rat_den_tileset.png`

Grid: 4 columns x 4 rows. Final project image is 1252 x 1252 px, so each nominal slice is 313 x 313 px.

Recommended tile usage, reading left to right, top to bottom:

1. Solid ground with cracked stone top and dirt fill; good default floor.
2. Dark dirt and rubble fill; use as underground interior fill.
3. Left ground edge with stone side wall; use for ledges and pits.
4. Right ground edge with stone side wall; use for ledges and pits.
5. Inner corner / tunnel cut-in; use where floor meets vertical drop.
6. Outer corner or broken ledge transition; use for exposed platform corners.
7. Short floating platform center.
8. Floating platform right/edge cap.
9. Floating platform left/edge cap.
10. Stone wall face with small purple crystal detail.
11. Cracked wall face variant.
12. Mossy/slimy wall face variant.
13. Broken ground overhang / damaged edge.
14. Small decorative stone marker tile.
15. Embedded bone detail / decorative dirt fill.
16. Dark filler dirt tile for repeated underground mass.

QC notes: The generated art is a clear 4x4 tileset with readable pixel-art cells, no text, labels, UI, characters, enemies, or weapons. It matches the requested dark fantasy rat-den/sewer palette. The cells are visually even, but the artwork includes black grid gutters and some partial-platform cells use the dark background rather than true transparency, so downstream slicing may want gutter-aware trimming or a later chroma-key/transparent variant.
