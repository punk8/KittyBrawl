# Rat Enemy Sprite Prompt Plan

Use these prompts with the `generate2dsprite` workflow. Each action should be generated as a separate sheet.

Reference concept:

- `concept/rat_enemy_concept_v1.png`
- `concept/rat_enemy_concept_v1-transparent.png`

## Asset Plan

Minimum enemy set for the first combat prototype:

| Action | Sheet | Frames | Purpose |
|---|---:|---:|---|
| `idle` | `2x2` | 4 | Waiting / breathing loop |
| `walk` | `2x3` | 6 | Ground patrol movement |
| `attack` | `2x3` | 6 | Short dagger stab |
| `hurt` | `2x2` | 4 | Damage reaction |
| `death` | `2x3` | 6 | Defeat animation |

Optional effect sheets:

| Effect | Sheet | Frames | Purpose |
|---|---:|---:|---|
| `rat_hit_spark` | `2x2` | 4 | Small hit spark when struck |
| `rat_death_puff` | `2x2` | 4 | Dust / smoke burst on defeat |

Recommended output folders:

```text
assets/characters/enemies/rat/idle/
assets/characters/enemies/rat/walk/
assets/characters/enemies/rat/attack/
assets/characters/enemies/rat/hurt/
assets/characters/enemies/rat/death/
assets/effects/enemies/rat_hit_spark/
assets/effects/enemies/rat_death_puff/
```

## Character Identity Anchor

Use this identity block in every rat enemy prompt:

```text
small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite
```

## Global Constraints

Append these constraints to every character sheet prompt:

```text
solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Idle

Parameters:

- `asset_type`: `creature`
- `action`: `idle`
- `view`: `side`
- `sheet`: `2x2`
- `frames`: `4`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `largest`

Prompt:

```text
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite. Idle animation: frame 1 crouched guarded stance, frame 2 subtle breathing with shoulders lifting, frame 3 tiny ear twitch and tail sway, frame 4 returns toward guarded stance with dagger held low. No attack swing, no detached effects. solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Walk

Parameters:

- `asset_type`: `creature`
- `action`: `walk`
- `view`: `side`
- `sheet`: `2x3`
- `frames`: `6`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `largest`

Prompt:

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite. Ground patrol walk animation: hunched sneaky stride, alternating clawed feet, dagger held forward and low, ears and tail counterbalance the steps, six readable loop frames. No attack swing, no detached effects. solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Attack

Parameters:

- `asset_type`: `creature`
- `action`: `attack`
- `view`: `side`
- `sheet`: `2x3`
- `frames`: `6`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `all`

Prompt:

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite. Short dagger attack animation: frame 1 crouched wind-up, frame 2 dagger pulled back, frame 3 quick lunge forward, frame 4 full extension stab with a tiny pale slash glint tightly grouped near the dagger, frame 5 recoil from the stab, frame 6 recovery back to guarded stance. Detached glint must remain tightly grouped near the dagger and still fit inside the cell. solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Hurt

Parameters:

- `asset_type`: `creature`
- `action`: `hurt`
- `view`: `side`
- `sheet`: `2x2`
- `frames`: `4`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `largest`

Prompt:

```text
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite. Hurt reaction animation: frame 1 impact flinch with body compressed, frame 2 recoil backward with ears thrown back, frame 3 stagger while gripping the dagger, frame 4 recovering toward crouched guard. No blood, no gore, no detached effects. solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, feet aligned to the same baseline, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Death

Parameters:

- `asset_type`: `creature`
- `action`: `death`
- `view`: `side`
- `sheet`: `2x3`
- `frames`: `6`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `largest`

Prompt:

```text
exactly 6 equal cells in a 2x3 grid, animation sprite sheet of a small hunched gray-brown rat bandit monster enemy, large rounded pink ears, sharp golden yellow eyes, pointed snout, small pink nose, visible whiskers, long thin pink tail, clawed feet, compact chibi fantasy proportions, ragged dark hood and black-brown cloth scraps, leather wrist wraps, rough belt with tiny bone charm, holding a tiny chipped bone-and-metal dagger, nervous but hostile expression, clearly smaller and weaker than the cat warrior hero, 16-bit SNES and Sega Genesis era pixel art, crisp dark outline, limited earthy color palette, high-contrast hand-authored pixel clusters, dark fantasy tribal tone, side-view action platformer enemy sprite. Defeat animation: frame 1 heavy hit recoil, frame 2 dagger slipping down, frame 3 knees buckle, frame 4 collapsing onto the ground, frame 5 curled defeated pose with tail settling, frame 6 final still defeated pose. No blood, no gore, no detached effects. solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or frames between cells, exact grid only, same rat enemy identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, leave clear magenta margin on all four sides of every cell, no body part, dagger, tail, ear, whisker, cloth scrap, effect, spark, or smoke trail may cross a cell edge
```

## Rat Hit Spark

Parameters:

- `asset_type`: `impact`
- `action`: `impact`
- `view`: `side`
- `sheet`: `2x2`
- `frames`: `4`
- `anchor`: `center`
- `margin`: `safe`
- `effect_policy`: `all`

Prompt:

```text
exactly 4 equal cells in a 2x2 grid, 16-bit pixel art small enemy hit spark for a side-view action platformer, pale gold and off-white impact burst with tiny dark purple fragments, compact readable silhouette, no character, no weapon, no UI, no text. Animation frames show contact spark, small expansion, peak burst, and fading fragments. Same effect scale in every frame, centered in each cell, detached fragments must stay tightly grouped, leave clear magenta margin on all four sides, no spark or fragment may cross a cell edge, solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no borders or frames between cells
```

## Rat Death Puff

Parameters:

- `asset_type`: `impact`
- `action`: `explode`
- `view`: `side`
- `sheet`: `2x2`
- `frames`: `4`
- `anchor`: `center`
- `margin`: `safe`
- `effect_policy`: `all`

Prompt:

```text
exactly 4 equal cells in a 2x2 grid, 16-bit pixel art small enemy defeat puff for a side-view action platformer, dusty gray-brown smoke burst with a few pale gold impact flecks and tiny dark cloth scraps, compact circular silhouette, no character body, no UI, no text. Animation frames show first dust pop, expanding smoke puff, peak dusty burst, and fading smoke. Same effect scale in every frame, centered in each cell, detached scraps must stay tightly grouped, leave clear magenta margin on all four sides, no smoke, fleck, or scrap may cross a cell edge, solid flat #FF00FF magenta background, no gradients, no texture, no shadows, no borders or frames between cells
```

## Generation Order

Recommended order:

1. Generate `idle` first and compare it against the concept image.
2. Generate `walk` only after the idle identity is acceptable.
3. Generate `hurt` and `death` next; these are needed for the first combat loop.
4. Generate `attack` last if the rat should be able to damage the player.
5. Generate effect sheets after the character sheets pass QC.

## QC Checklist

- `pipeline-meta.json` has `edge_touch_frames=[]`.
- The rat remains smaller than the player character.
- The silhouette reads as a rat, not a cat.
- The hood, yellow eyes, pink ears, long tail, and dagger remain recognizable.
- Feet stay aligned across grounded frames.
- The dagger and tail do not cross cell edges.
- Effects are tightly grouped and not mistaken for cleanup noise.
