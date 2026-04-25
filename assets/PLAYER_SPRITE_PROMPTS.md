# Player Sprite Prompt Plan

Use these prompts with the `generate2dsprite` workflow. Each action should be generated as a separate sheet.

## Character Identity Anchor

Use this identity block in every player prompt:

```text
stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite
```

## Global Constraints

Append these constraints to every sheet prompt:

```text
solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Idle

Sheet: `2x2`, 4 frames.

```text
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Idle ready stance animation: frame 1 neutral guarded stance, frame 2 subtle breathing and cloak lift, frame 3 slight weight shift with tail motion, frame 4 returns toward neutral with staff held ready. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Run

Sheet: `2x3`, 6 frames.

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Fast side-scrolling run cycle animation: grounded stride, compact heroic sprint, cloak streaming backward, tail counterbalancing, staff held low and ready, six readable loop frames with alternating feet. No attack swing, no detached effects. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Jump And Fall

Sheet: `2x3`, 6 frames.

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Platformer jump animation: frame 1 crouch anticipation, frame 2 takeoff with legs pushing upward, frame 3 rising pose, frame 4 peak pose with cloak and tail lifted, frame 5 falling pose with body tucked forward, frame 6 landing anticipation. No attack swing, no detached effects. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet or lowest body point aligned consistently for engine anchoring, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Normal Attack

Sheet: `2x3`, 6 frames.

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Normal staff attack animation: frame 1 guarded wind-up, frame 2 staff raised behind shoulder, frame 3 forward thrust start, frame 4 full extension strike with a compact pale slash arc tightly grouped near the weapon, frame 5 follow-through, frame 6 recovery back to ready stance. Detached effects must remain tightly grouped near the staff and still fit inside the cell. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Hurt

Sheet: `2x2`, 4 frames.

```text
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Hurt reaction animation: frame 1 impact flinch, frame 2 recoil backward with eyes narrowed, frame 3 stagger while keeping the staff, frame 4 recovering toward ready stance. No blood, no gore, no detached effects. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Death

Sheet: `2x3`, 6 frames.

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Defeat animation: frame 1 heavy hit recoil, frame 2 knees buckle, frame 3 falling backward or downward, frame 4 collapsed on ground, frame 5 cloak settles, frame 6 final defeated pose. No blood, no gore, no detached effects. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Super Activation

Sheet: `2x3`, 6 frames.

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Super move activation animation: frame 1 crouched focus pose, frame 2 staff planted and eyes glowing gold, frame 3 dark purple energy gathers around the staff, frame 4 cloak rises from power, frame 5 bright aura peak around the cat, frame 6 explosive ready pose before release. Detached aura and sparks must remain tightly grouped near the character and still fit inside the cell. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Super Attack

Sheet: `3x3`, 9 frames.

```text
exactly 9 equal cells in a 3x3 grid, animation sprite sheet of a stout gray-brown tabby cat warrior hero, white muzzle, white chest, white paws, golden eyes, compact chibi fantasy proportions, ragged dark brown and black cloak, leather wraps, tribal belt with small round talisman, striped tail, holding a short gnarled staff weapon with a dark purple crystal head, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited color palette, high-contrast hand-authored pixel clusters, side-view action platformer sprite. Super attack animation for a side-scrolling action game: frame 1 power stance, frame 2 dash wind-up, frame 3 lunging forward, frame 4 first staff strike with purple crescent energy, frame 5 spinning strike, frame 6 second crescent slash, frame 7 overhead slam, frame 8 large compact impact burst around the staff, frame 9 recovery pose with fading energy. Detached effects must remain tightly grouped near the weapon and still fit inside the cell. solid flat #FF00FF magenta background, no gradients, no text, no labels, no UI, no borders or frames between cells, exact grid only, same character identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline where grounded, full body visible, leave clear magenta margin on all four sides of every cell, no body part, weapon, tail, cloak, effect, spark, or smoke trail may cross a cell edge
```

## Separate Slash Effect

Sheet: `1x4`, 4 frames.

```text
exactly 4 equal cells in one horizontal row, loopable 16-bit pixel art slash effect for a side-view action platformer, pale cream crescent slash with dark purple magical edge, compact readable silhouette, no character, no weapon, no UI, no text. Animation frames show slash appearing, expanding, peak brightness, and fading. Same effect scale in every frame, centered in each cell, leave clear magenta margin on all four sides, no spark or trail may cross a cell edge, solid flat #FF00FF magenta background, no gradients, no borders or frames between cells
```

## Super Impact Effect

Sheet: `2x2`, 4 frames.

```text
exactly 4 equal cells in a 2x2 grid, 16-bit pixel art super move impact burst for a side-view action platformer, dark purple and pale gold magical explosion, compact circular shockwave with bright center, no character, no UI, no text. Animation frames show contact spark, expanding burst, peak shockwave, fading smoke and energy. Same effect scale in every frame, centered in each cell, detached sparks must stay tightly grouped, leave clear magenta margin on all four sides, no spark, smoke, or shockwave may cross a cell edge, solid flat #FF00FF magenta background, no gradients, no borders or frames between cells
```

## Super Background Plate

This is not a normal sprite sheet. Use it as a full-screen dramatic overlay during super activation.

```text
single full-screen 16-bit pixel art dramatic super move background plate, dark fantasy moonlit radial burst, black and deep purple speed lines, subtle golden cat-eye glow motif, SNES and Sega Genesis era pixel art, no character, no UI, no text, no logo, no labels, clean readable high contrast, designed as a temporary full-screen background for a fighting-game-style super activation
```
