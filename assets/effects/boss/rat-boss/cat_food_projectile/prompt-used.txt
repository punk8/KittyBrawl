# Rat Boss Props And Effects Prompts

Use these prompts with `$imagegen` and postprocess with `$generate2dsprite`.

All sprite sheets must use a perfectly flat solid `#FF00FF` background for chroma cleanup. Keep every frame centered inside its cell, with generous padding and no frame touching cell edges. Final gameplay files should be `sheet-transparent.png`.

Shared style anchor:

```text
90s arcade pixel art, side-view action platformer sprite, high detail pixel art, crisp hard pixel edges, dark fantasy rat-den palette, purple hypnosis magic, warm gold sparks, transparent-ready solid #FF00FF background, no blur, no 3D render, no text, no watermark
```

## cat_food_projectile

Create a 4-frame sprite sheet, 4 columns x 1 row.

A small rat-boss-thrown cat food projectile tumbling through the air: a torn leather pouch and several crunchy golden-brown kibble pieces, with tiny purple hypnosis motes trailing behind it. Side-view readable gameplay prop, small projectile scale, same object identity across all frames, slight rotation from frame to frame.

Constraints: solid `#FF00FF` background, no shadows, no floor plane, no extra characters, no UI, no text, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/cat_food_projectile/`

## cat_food_on_ground

Create a 4-frame sprite sheet, 4 columns x 1 row.

A small pile of cat food on the ground: spilled golden-brown kibble from a torn leather pouch, with subtle purple hypnotic sparkle rising above it. Side-view ground prop, stable base line, gentle shimmer animation only.

Constraints: solid `#FF00FF` background, no floor plane beyond the prop itself, no extra characters, no UI, no text, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/cat_food_on_ground/`

## paper_ball_projectile

Create a 4-frame sprite sheet, 4 columns x 1 row.

A crumpled paper ball projectile thrown by the rat boss, tumbling and bouncing through the air. The paper ball is gray-white parchment with dark pixel creases, tiny dust flecks, and a faint purple charm trail. Side-view readable small projectile scale, slight rotation in each frame.

Constraints: solid `#FF00FF` background, no shadows, no floor plane, no extra characters, no UI, no text, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/paper_ball_projectile/`

## paper_ball_on_ground

Create a 4-frame sprite sheet, 4 columns x 1 row.

A crumpled paper ball lying on the ground, gray-white parchment with dark pixel creases. It performs a tiny idle wiggle or bounce settle, with a few dust pixels. Side-view ground prop, stable base line.

Constraints: solid `#FF00FF` background, no floor plane beyond the prop itself, no extra characters, no UI, no text, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/paper_ball_on_ground/`

## hypnosis_fx

Create a 4-frame sprite sheet, 2 columns x 2 rows.

A purple-gold hypnosis effect for the rat boss bait attacks: spiraling rings, small crescent swirls, sparkling motes, and subtle charm waves rising from bait on the ground. Arcade pixel effect, readable at gameplay scale, frames progress from small swirl to larger mesmerizing spiral.

Constraints: solid `#FF00FF` background, no characters, no UI, no text, no smoke cloud that fills the whole cell, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/hypnosis_fx/`

## kick_impact_fx

Create a 4-frame sprite sheet, 2 columns x 2 rows.

A sharp side-view kick impact burst for the rat boss: jagged white-gold starburst, purple shock streaks, small dust chips, and a brief crescent hit arc. Arcade fighting game hit effect, fast and punchy, frames progress from contact spark to larger burst to dissipating shards.

Constraints: solid `#FF00FF` background, no characters, no UI, no text, nothing crosses cell edges.

Output folder:

`assets/effects/boss/rat-boss/kick_impact_fx/`

