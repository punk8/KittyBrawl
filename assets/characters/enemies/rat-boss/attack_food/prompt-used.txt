# Rat Boss Attack Sprite Prompts

Use the existing normal rat concept as the identity/style reference:

`assets/characters/enemies/rat/concept/rat_enemy_concept_v1.png`

Global style:

- 90s arcade pixel art, side-view action platformer sprite.
- High-detail pixel art with crisp hard pixel edges.
- Dark fantasy rat-den palette, olive gray fur, pink ears and tail, yellow eyes.
- Rat boss is larger and more theatrical than the normal rat: ragged hood, leather scraps, bone charms, dirty belt pouches, cruel trickster expression.
- Right-facing gameplay orientation.
- Solid `#FF00FF` background for chroma cleanup.
- No extra characters, no UI, no text, no 3D render, no soft blur, no camera-angle changes.
- Keep each frame fully contained inside its cell with generous padding.
- Keep scale, ground line, silhouette, ears, tail, cloak, and face identity consistent across all frames.

## attack_food

Create a 6-frame sprite sheet, 3 columns x 2 rows, side-view right-facing.

The rat boss performs a cat-food hypnosis attack. Frames should read as:

1. Boss crouches and reaches for a dirty bait pouch.
2. Boss lifts a small glowing cat-food morsel or pouch with a sly grin.
3. Boss winds up, cloak and tail trailing behind.
4. Boss throws the cat food forward in a low arc.
5. Boss points after the thrown food, yellow eyes glowing, subtle hypnotic spark near hand.
6. Boss returns to a hunched recovery pose, still smug and threatening.

Keep the thrown food close enough to the boss to remain inside the frame; detached sparkles are okay if contained. The boss should remain the dominant component in every frame.

Recommended metadata: `cols=3`, `frames=6`, `fps=8`, `loop=false`, `scale=1.22`, `anchor=feet`.

## attack_paper

Create a 6-frame sprite sheet, 3 columns x 2 rows, side-view right-facing.

The rat boss performs a paper-ball bait attack. Frames should read as:

1. Boss crouches with a crumpled paper ball bundle in one claw.
2. Boss teases the player with the paper ball, head low and mischievous.
3. Boss winds up with an exaggerated side throw.
4. Boss flings the crumpled paper ball forward.
5. Paper ball leaves the hand with a small motion streak; boss leans into the throw.
6. Boss recovers into a hunched taunting pose.

Keep the paper ball visible but contained within the cell. Do not make the paper ball huge; it is a bait prop, not an explosion.

Recommended metadata: `cols=3`, `frames=6`, `fps=9`, `loop=false`, `scale=1.22`, `anchor=feet`.

## kick

Create a 6-frame sprite sheet, 3 columns x 2 rows, side-view right-facing.

The rat boss performs a cruel kick after baiting the cat. Frames should read as:

1. Boss plants feet and twists body, preparing the kick.
2. Boss lifts one leg, tail counterbalances, cloak swings.
3. Boss snaps a sharp forward kick to the right.
4. Kick reaches full extension with a small impact spark near the foot.
5. Boss retracts the leg, aggressive grin.
6. Boss lands back into a stable recovery stance.

This is a melee body animation; no large projectile or separate victim should appear. Keep the kick foot and impact spark inside the cell.

Recommended metadata: `cols=3`, `frames=6`, `fps=10`, `loop=false`, `scale=1.22`, `anchor=feet`.
