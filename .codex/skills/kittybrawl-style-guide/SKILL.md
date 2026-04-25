---
name: kittybrawl-style-guide
description: KittyBrawl project art direction and prompt language for 90s arcade pixel-art assets. Use when creating, judging, or revising KittyBrawl characters, enemies, effects, backgrounds, tiles, cut-ins, or any visual asset that must match the existing cat-warrior browser game.
---

# KittyBrawl Style Guide

## Core Style

Keep KittyBrawl assets consistent with a 90s arcade side-scrolling action game: Mega Man-like platform readability, King of Fighters / Street Fighter dramatic combat energy, fantasy rogue-warrior silhouettes, and high-detail pixel art.

Primary look:

- Side-view 2D action platformer, readable at gameplay scale.
- High-detail pixel art, crisp hard pixel edges, no painterly blur.
- Dark fantasy ruins palette with warm gold highlights and purple magic.
- Characters use strong silhouettes, black/brown cloak shapes, leather wraps, small metal ornaments, and expressive yellow eyes.
- Animation sheets should feel like hand-authored arcade sprites, not modern vector art or 3D renders.

## Character Identity

Player character:

- Brown tabby cat warrior.
- Yellow eyes, white muzzle and paws.
- Dark ragged cloak, leather wraps, small brass/gold ornaments.
- Uses a wooden staff or wand-like weapon with a purple magical tip.
- Stout, grounded, determined expression.

Rat enemy:

- Small fantasy rat rogue.
- Olive-brown / gray fur, pink ears and tail, yellow eyes.
- Ragged hood or cloak, leather scraps, small dagger.
- Menacing but readable as a low-tier enemy.

## Prompt Anchors

Reuse these phrases when generating new assets:

```text
90s arcade pixel art, side-view action platformer sprite, high detail pixel art, crisp hard pixel edges, fantasy rogue warrior, dark ragged cloak, leather wraps, brass ornaments, dramatic fighting game pose, transparent-ready magenta background, consistent silhouette, no blur, no anti-aliased vector style, no 3D render
```

For player assets, add:

```text
brown tabby cat warrior, yellow eyes, white muzzle and paws, dark tattered cloak, wooden staff with purple magical tip
```

For rat enemy assets, add:

```text
small rogue rat enemy, olive gray fur, pink ears and tail, yellow eyes, ragged hood, leather scraps, small dagger
```

## Asset Rules

- Use PNG for source and final assets.
- Use solid magenta or transparent-ready background for sprite generation; final gameplay sheets must have transparent background.
- Avoid GIF as source of truth. If animation preview is needed, export GIF only as a preview artifact.
- Keep sprite sheets grid-aligned, with stable frame size and consistent ground contact.
- Do not crop frames tightly if the action needs weapon reach, slash arcs, or cape motion.
- Keep character scale consistent across idle, run, attack, hurt, death, and super actions.
- For cut-ins, generate a separate cinematic asset. Do not upscale/crop tiny gameplay sprites for face closeups.

## Quick QA

Before accepting a visual asset:

- Check it still reads as the intended character at gameplay size.
- Check face, ears, tail, weapon, and cloak do not lose alpha or become ghosted.
- Check no magenta or black gutter remains in transparent gameplay assets.
- Check action pose matches left-to-right side-view gameplay.
- Check it fits the existing canvas composition and does not fight the HUD.
