# Rat Boss Sprite Prompt Plan

Use these prompts with the KittyBrawl sprite action pipeline and `generate2dsprite`.
Every sheet should preserve `raw-sheet.png` and export `sheet-transparent.png`.

Reference assets:

- `../rat/concept/rat_enemy_concept_v1.png`
- `../rat/idle/sheet-transparent.png`
- `../rat/attack/sheet-transparent.png`
- `../rat/death/sheet-transparent.png`

## Asset Plan

| Action | Sheet | Frames | Purpose |
|---|---:|---:|---|
| `idle` | `2x2` | 4 | Boss breathing loop and baseline scale |
| `intro` | `2x3` | 6 | Boss entrance / reveal before fight starts |
| `hurt` | `2x2` | 4 | Heavy damage reaction |
| `death` | `2x3` | 6 | Boss defeat collapse |

## Rat Boss Identity Anchor

Use this identity block in every rat boss prompt:

```text
large rat boss trickster shaman, bigger and heavier than the normal rat enemy, olive gray-brown fur, oversized rounded pink ears, long segmented pink tail, sharp golden yellow eyes, pointed snout, pink nose, visible whiskers, hunched but commanding posture, ragged black-brown hood and tattered cloak, leather wraps and belts, brass ornaments, small bone charms, skull buckle, one pouch of cat food tied to the belt, a bundle of crumpled paper balls tied behind the shoulder, clawed feet and hands, mischievous cruel expression, dark fantasy rogue shaman silhouette, side-view action platformer boss sprite, right-facing, 16-bit SNES and Sega Genesis era arcade pixel art, crisp dark outline, high-detail hand-authored pixel clusters, earthy browns with warm gold highlights and subtle purple shadow accents
```

## Global Sheet Constraints

Append these constraints to every sheet prompt:

```text
solid flat #FF00FF magenta background for chroma cleanup, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or drawn grid lines between cells, exact sprite sheet grid only, same rat boss identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, feet aligned to the same baseline except during intentional collapse, leave clear magenta margin on all four sides of every cell, no body part, ear, tail, whisker, cloak scrap, belt, pouch, paper bundle, prop, spark, dust, or effect may cross a cell edge, no extra characters, no player cat, no modern cartoon style, no 3D render, no painterly blur
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
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a large rat boss trickster shaman, bigger and heavier than the normal rat enemy, olive gray-brown fur, oversized rounded pink ears, long segmented pink tail, sharp golden yellow eyes, pointed snout, pink nose, visible whiskers, hunched but commanding posture, ragged black-brown hood and tattered cloak, leather wraps and belts, brass ornaments, small bone charms, skull buckle, one pouch of cat food tied to the belt, a bundle of crumpled paper balls tied behind the shoulder, clawed feet and hands, mischievous cruel expression, dark fantasy rogue shaman silhouette, side-view action platformer boss sprite, right-facing, 16-bit SNES and Sega Genesis era arcade pixel art, crisp dark outline, high-detail hand-authored pixel clusters, earthy browns with warm gold highlights and subtle purple shadow accents. Idle animation: frame 1 guarded boss stance, frame 2 slow breathing with shoulders rising, frame 3 tiny ear twitch and tail curl, frame 4 cloak and belt charms settle back to the guarded stance. No attack, no thrown props, no detached effects. solid flat #FF00FF magenta background for chroma cleanup, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or drawn grid lines between cells, exact sprite sheet grid only, same rat boss identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, feet aligned to the same baseline except during intentional collapse, leave clear magenta margin on all four sides of every cell, no body part, ear, tail, whisker, cloak scrap, belt, pouch, paper bundle, prop, spark, dust, or effect may cross a cell edge, no extra characters, no player cat, no modern cartoon style, no 3D render, no painterly blur
```

## Intro

Parameters:

- `asset_type`: `creature`
- `action`: `intro`
- `view`: `side`
- `sheet`: `2x3`
- `frames`: `6`
- `anchor`: `feet`
- `margin`: `safe`
- `effect_policy`: `largest`

Prompt:

```text
exactly 6 equal cells in a 3 columns by 2 rows grid, animation sprite sheet of a large rat boss trickster shaman, bigger and heavier than the normal rat enemy, olive gray-brown fur, oversized rounded pink ears, long segmented pink tail, sharp golden yellow eyes, pointed snout, pink nose, visible whiskers, hunched but commanding posture, ragged black-brown hood and tattered cloak, leather wraps and belts, brass ornaments, small bone charms, skull buckle, one pouch of cat food tied to the belt, a bundle of crumpled paper balls tied behind the shoulder, clawed feet and hands, mischievous cruel expression, dark fantasy rogue shaman silhouette, side-view action platformer boss sprite, right-facing, 16-bit SNES and Sega Genesis era arcade pixel art, crisp dark outline, high-detail hand-authored pixel clusters, earthy browns with warm gold highlights and subtle purple shadow accents. Intro animation: frame 1 crouched under the hood, frame 2 rising with cloak opening, frame 3 one claw lifts the cat food pouch to tease the player, frame 4 other claw shakes the paper-ball bundle, frame 5 boss leans forward laughing with yellow eyes bright, frame 6 settles into the idle boss stance. Props must remain attached to the boss silhouette, no thrown objects yet, no detached magic. solid flat #FF00FF magenta background for chroma cleanup, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or drawn grid lines between cells, exact sprite sheet grid only, same rat boss identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, feet aligned to the same baseline except during intentional collapse, leave clear magenta margin on all four sides of every cell, no body part, ear, tail, whisker, cloak scrap, belt, pouch, paper bundle, prop, spark, dust, or effect may cross a cell edge, no extra characters, no player cat, no modern cartoon style, no 3D render, no painterly blur
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
exactly 4 equal cells in a 2x2 grid, animation sprite sheet of a large rat boss trickster shaman, bigger and heavier than the normal rat enemy, olive gray-brown fur, oversized rounded pink ears, long segmented pink tail, sharp golden yellow eyes, pointed snout, pink nose, visible whiskers, hunched but commanding posture, ragged black-brown hood and tattered cloak, leather wraps and belts, brass ornaments, small bone charms, skull buckle, one pouch of cat food tied to the belt, a bundle of crumpled paper balls tied behind the shoulder, clawed feet and hands, mischievous cruel expression, dark fantasy rogue shaman silhouette, side-view action platformer boss sprite, right-facing, 16-bit SNES and Sega Genesis era arcade pixel art, crisp dark outline, high-detail hand-authored pixel clusters, earthy browns with warm gold highlights and subtle purple shadow accents. Hurt animation: frame 1 heavy impact flinch with shoulders compressed, frame 2 recoil backward with ears thrown back and cloak flaring, frame 3 angry stagger clutching the belt props, frame 4 regaining balance into guarded stance. No blood, no gore, no detached effects, no thrown props. solid flat #FF00FF magenta background for chroma cleanup, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or drawn grid lines between cells, exact sprite sheet grid only, same rat boss identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, feet aligned to the same baseline except during intentional collapse, leave clear magenta margin on all four sides of every cell, no body part, ear, tail, whisker, cloak scrap, belt, pouch, paper bundle, prop, spark, dust, or effect may cross a cell edge, no extra characters, no player cat, no modern cartoon style, no 3D render, no painterly blur
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
exactly 6 equal cells in a 3 columns by 2 rows grid, animation sprite sheet of a large rat boss trickster shaman, bigger and heavier than the normal rat enemy, olive gray-brown fur, oversized rounded pink ears, long segmented pink tail, sharp golden yellow eyes, pointed snout, pink nose, visible whiskers, hunched but commanding posture, ragged black-brown hood and tattered cloak, leather wraps and belts, brass ornaments, small bone charms, skull buckle, one pouch of cat food tied to the belt, a bundle of crumpled paper balls tied behind the shoulder, clawed feet and hands, mischievous cruel expression, dark fantasy rogue shaman silhouette, side-view action platformer boss sprite, right-facing, 16-bit SNES and Sega Genesis era arcade pixel art, crisp dark outline, high-detail hand-authored pixel clusters, earthy browns with warm gold highlights and subtle purple shadow accents. Death animation: frame 1 stunned heavy hit recoil, frame 2 knees buckle and cat food pouch slips downward, frame 3 boss falls forward while still facing right, frame 4 collapsing onto the ground with tail curling, frame 5 defeated prone pose with cloak spread and props settled close to the body, frame 6 final still defeated pose. No blood, no gore, no detached effects, no exploding body, no props flying across the cell. solid flat #FF00FF magenta background for chroma cleanup, no gradients, no texture, no shadows, no text, no labels, no UI, no borders or drawn grid lines between cells, exact sprite sheet grid only, same rat boss identity in every frame, same facing direction to the right in every frame, same pixel scale and same bounding box in every frame, full body visible, feet aligned to the same baseline except during intentional collapse, leave clear magenta margin on all four sides of every cell, no body part, ear, tail, whisker, cloak scrap, belt, pouch, paper bundle, prop, spark, dust, or effect may cross a cell edge, no extra characters, no player cat, no modern cartoon style, no 3D render, no painterly blur
```

## Suggested Integration Metadata

Use these as initial values only; tune in-game after loading the sheets.

| Action | Frame Size | Cols | Frames | FPS | Loop | Scale | Anchor |
|---|---:|---:|---:|---:|---|---:|---|
| `idle` | `256x256` | 2 | 4 | 5 | true | 1.0 | feet |
| `intro` | `256x256` | 3 | 6 | 7 | false | 1.0 | feet |
| `hurt` | `256x256` | 2 | 4 | 8 | false | 1.0 | feet |
| `death` | `256x256` | 3 | 6 | 6 | false | 1.0 | feet |

## QC Checklist

- `pipeline-meta.json` reports no edge-touch frames.
- The boss is visually larger than the normal rat, but still smaller than the player when using a reasonable game scale.
- Yellow eyes, pink ears, pink tail, hood, cloak, cat food pouch, and paper bundle remain recognizable.
- Every frame faces right.
- Transparent sheet has no magenta fringe around ears, tail, whiskers, cloak holes, or props.
- Ground contact is stable for idle, intro ending, and hurt recovery.
