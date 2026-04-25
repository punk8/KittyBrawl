# Level Image Prompt Plan

Use these prompts with the `imagegen` skill. These are for static raster assets, not character animation sheets.

Theme for the first prototype: a dark fantasy rat den / sewer ruin that matches the cat warrior and rat enemy sprites.

## Output Plan

Recommended first-pass files:

```text
assets/levels/backgrounds/rat_den_bg.png
assets/levels/tilesets/rat_den_tileset.png
assets/levels/tilesets/rat_den_tileset_manifest.md
```

Optional later files:

```text
assets/levels/backgrounds/rat_den_far.png
assets/levels/backgrounds/rat_den_mid.png
assets/levels/backgrounds/rat_den_near.png
assets/levels/props/rat_den_props.png
```

## Shared Style Anchor

Use this style block in every prompt:

```text
16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, readable gameplay silhouettes, no painterly blur, no modern vector art, no 3D render, no photorealism
```

## Background: Single Static Prototype

Use this first. It is the simplest background for the playable combat prototype.

Target file:

```text
assets/levels/backgrounds/rat_den_bg.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: side-scrolling game background
Primary request: create a single static background for the first Kitty Brawl combat prototype.
Scene/backdrop: underground rat den sewer ruin, damp stone tunnel, cracked brick archways, distant drain pipes, old wooden supports, small bone charms and cloth scraps, faint purple crystal glow in the distance, shallow dark water channels far behind the playable floor area.
Subject: environment only, no characters, no enemies, no creatures.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, readable gameplay silhouettes, no painterly blur, no modern vector art, no 3D render, no photorealism.
Composition/framing: wide 16:9 side-view game background, designed for a 960x540 canvas, horizon and detailed scenery stay in the upper 70 percent, lower 30 percent kept visually calm and darker so foreground floor tiles and characters read clearly. Leave a subtle hint of horizontal scrolling depth, but this is one complete background plate.
Lighting/mood: moody underground ambience, cool green-gray shadows, muted brown stone, small purple-gold highlights, not too bright, not too busy.
Constraints: no text, no UI, no logo, no watermark, no characters, no foreground platform tiles, no hard black empty areas, no perspective floor plane that conflicts with side-view gameplay.
Avoid: clean sci-fi sewer, cute cartoon style, soft airbrush, heavy blur, modern fantasy illustration, realistic painting.
```

## Background: Parallax Set

Use this only after the static background works. Generate each layer separately.

### Far Layer

Target file:

```text
assets/levels/backgrounds/rat_den_far.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: parallax far background layer
Primary request: create the farthest background layer for a 16-bit side-scrolling rat den sewer level.
Scene/backdrop: distant underground stone arches, deep tunnel silhouettes, faint pipe shapes, soft purple crystal glow, minimal detail.
Subject: environment layer only, no characters, no enemies, no UI.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, dark fantasy tribal tone.
Composition/framing: wide 16:9 layer for 960x540 canvas, mostly upper and middle background, low contrast so foreground sprites remain dominant, horizontally tileable feel at left and right edges.
Lighting/mood: dim cool shadows with tiny muted purple highlights.
Constraints: no text, no UI, no characters, no floor tiles, no sharp foreground details.
```

### Mid Layer

Target file:

```text
assets/levels/backgrounds/rat_den_mid.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: parallax middle background layer
Primary request: create the middle background layer for a 16-bit side-scrolling rat den sewer level.
Scene/backdrop: cracked brick walls, pipe openings, hanging cloth scraps, small rat-den tunnels, old wooden braces, bone charms.
Subject: environment layer only, no characters, no enemies, no UI.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, dark fantasy tribal tone.
Composition/framing: wide 16:9 layer for 960x540 canvas, more detail than far layer but still behind gameplay, horizontally tileable feel at left and right edges, lower 30 percent kept calm for foreground floor.
Lighting/mood: damp sewer shadows with small gold and purple accent pixels.
Constraints: no text, no UI, no characters, no foreground floor tiles.
```

### Near Layer

Target file:

```text
assets/levels/backgrounds/rat_den_near.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: parallax near foreground decoration layer
Primary request: create a sparse near decorative layer for a 16-bit side-scrolling rat den sewer level.
Scene/backdrop: broken pipe rims, hanging chains, torn cloth strips, small foreground silhouettes of debris and bone charms.
Subject: environment decoration only, no characters, no enemies, no UI.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, dark fantasy tribal tone.
Composition/framing: wide 16:9 transparent-ready decoration layer, sparse elements around the upper corners and side edges, center kept readable for gameplay.
Lighting/mood: dark foreground silhouettes with muted brown and purple highlights.
Constraints: no text, no UI, no characters, no solid full-screen background, no large objects blocking the player.
```

Note: the near layer can be generated on a flat `#00FF00` chroma-key background if transparency is needed.

## Ground Tileset: First Prototype

Use this for the first playable level. Ask for a clear grid, then manually inspect and crop if needed.

Target file:

```text
assets/levels/tilesets/rat_den_tileset.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: side-scrolling platformer tileset
Primary request: create a compact ground and platform tileset for the first Kitty Brawl combat prototype.
Scene/backdrop: underground rat den sewer ruin floor tiles made of cracked damp stone, old brick, dark mud, bits of straw, tiny bone chips, and muted purple crystal flecks.
Subject: exactly 16 square tiles arranged in a clean 4x4 grid. Each tile is a separate square game tile.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, readable gameplay silhouettes, no painterly blur, no modern vector art, no 3D render, no photorealism.
Composition/framing: one tileset image, exact 4 columns by 4 rows, all cells equal size, no perspective camera, orthographic side-view platformer tile art. Each tile fills its cell cleanly. Include top surface, underground fill, left edge, right edge, inner corner, outer corner, single platform, platform left cap, platform right cap, wall face, cracked variant, mossy/slimy variant, broken edge variant, small decorative stone, embedded bone detail, and dark filler tile.
Lighting/mood: dim sewer stone palette, muted brown, gray-green, black-brown shadow, tiny purple-gold accents.
Constraints: no text, no numbers, no labels, no UI, no characters, no enemies, no weapons, no decorative frame, no isometric perspective. Make tiles visually connect horizontally when repeated. Keep tile edges clean and readable.
Avoid: random illustration collage, uneven tile sizes, diagonal camera angle, photoreal textures, smooth gradients, bright candy colors.
```

## Ground Tileset: Cleaner Chroma-Key Variant

Use this if we want to remove the background around partial platform tiles.

Target file:

```text
assets/levels/tilesets/rat_den_tileset_chromakey_source.png
assets/levels/tilesets/rat_den_tileset_transparent.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: transparent-ready side-scrolling platformer tileset
Primary request: create a compact platformer tileset on a removable chroma-key background.
Scene/backdrop: underground rat den sewer ruin floor tiles made of cracked damp stone, old brick, dark mud, bits of straw, tiny bone chips, and muted purple crystal flecks.
Subject: exactly 16 square tiles arranged in a clean 4x4 grid. Each tile is a separate square game tile. Some tiles may have transparent empty space around platform edges and caps.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone.
Composition/framing: exact 4 columns by 4 rows, all cells equal size, orthographic side-view platformer tile art. Include full ground, top surface, left cap, right cap, underside, wall face, corners, cracked variants, and dark filler.
Scene/backdrop: perfectly flat solid #00FF00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, reflections, floor plane, or lighting variation.
Constraints: do not use #00FF00 anywhere in the tiles. No text, no numbers, no labels, no UI, no characters, no enemies, no watermark. Keep every tile fully inside its cell with padding where needed.
Avoid: uneven grid, merged tiles, soft shadows, perspective floor plane, photoreal textures.
```

## Optional Prop Sheet

Useful after the basic background and tileset exist.

Target file:

```text
assets/levels/props/rat_den_props.png
```

Prompt:

```text
Use case: stylized-concept
Asset type: side-scrolling platformer environment prop sheet
Primary request: create a small prop sheet for a dark fantasy rat den sewer level.
Subject: exactly 12 small environment props arranged in a clean 4x3 grid: cracked pipe opening, broken wooden brace, hanging cloth scrap, tiny bone charm bundle, small purple crystal cluster, old crate, muddy rock pile, rat nest straw pile, broken chain, skull fragment, sewer grate, dripping slime patch.
Style/medium: 16-bit SNES and Sega Genesis era side-scrolling action-platformer pixel art, compatible with the existing cat warrior hero and rat bandit enemy sprites, crisp dark outlines, limited earthy palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone.
Composition/framing: exact 4 columns by 3 rows, each prop centered in its cell with clear padding, front-facing or side-view game prop readability.
Scene/backdrop: perfectly flat solid #00FF00 chroma-key background for background removal.
Constraints: do not use #00FF00 anywhere in the props. No text, no labels, no UI, no characters, no enemies, no watermark.
```

## Recommended Generation Order

1. Generate `rat_den_bg.png` first.
2. Generate `rat_den_tileset.png`.
3. Build a tiny level using the tileset and check character readability.
4. Generate `rat_den_props.png` only if the scene feels too empty.
5. Split the background into parallax layers later, after the basic combat loop feels good.

## QC Checklist

- Background does not compete with player and enemy sprites.
- Lower gameplay area is readable and not overly detailed.
- Tileset has equal-size cells.
- Tiles connect horizontally without obvious seams.
- No text, labels, UI, or accidental characters.
- Colors match the existing dark fantasy cat/rat sprites.
- Chroma-key variants do not use the key color inside the asset.
- Save final project assets inside `assets/levels/`, not only under the default generated-images folder.
