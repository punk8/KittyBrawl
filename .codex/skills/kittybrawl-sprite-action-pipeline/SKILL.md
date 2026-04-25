---
name: kittybrawl-sprite-action-pipeline
description: KittyBrawl workflow for generating and postprocessing character or enemy action sprite sheets. Use when adding or revising player/enemy actions such as idle, run, jump, attack, hurt, death, super activation, super attack, hit reactions, or similar animation sheets, especially with generate2dsprite and KittyBrawl asset conventions.
---

# KittyBrawl Sprite Action Pipeline

## Workflow

Use this for any KittyBrawl gameplay animation sheet.

1. Load the relevant project context:
   - `assets/data/player-animations.json`
   - Existing action folder for the character or enemy.
   - Existing raw and transparent sheets if revising an action.
2. Apply `$kittybrawl-style-guide` if available, or follow the style rules directly if the skill is not loaded.
3. Write or update a prompt `.md` next to the target asset before generating.
4. Use `$generate2dsprite` for sprite sheet generation/postprocessing when available.
5. Preserve raw output as `raw-sheet.png`; create final gameplay sheet as `sheet-transparent.png`.
6. Generate a checker/preview artifact when possible.
7. Verify transparency, scale, frame alignment, and animation metadata before touching code.

## Standard Output Layout

Player action:

```text
assets/characters/player/<group>/<action>/
  raw-sheet.png
  sheet-transparent.png
  sheet-preview-checker.png
```

Enemy action:

```text
assets/characters/enemies/<enemy>/<action>/
  raw-sheet.png
  sheet-transparent.png
  sheet-preview-checker.png
```

Prompt file:

```text
assets/characters/<...>/<CHARACTER>_SPRITE_PROMPTS.md
```

## Prompt Shape

For each action, specify:

- Character identity and must-keep visual details.
- Exact side-view direction and gameplay pose.
- Frame count and grid layout.
- Looping behavior.
- Ground contact and anchor expectations.
- Transparent-ready solid magenta background.
- Negative constraints: no extra characters, no UI, no text, no 3D, no soft blur, no camera angle changes.

Example action block:

```markdown
## attack_02

Create a 6-frame sprite sheet, 3 columns x 2 rows, side-view right-facing.
The brown tabby cat warrior performs a fast staff thrust combo. Keep yellow eyes,
white muzzle and paws, dark ragged cloak, leather wraps, brass ornaments, and
purple staff tip identical to the reference. Solid magenta background for chroma
cleanup. Keep feet near the same ground line except during intentional lunge.
```

## Postprocess Checks

Always inspect likely failure zones:

- Face and muzzle transparency.
- Ear and tail alpha.
- Weapon tip and slash arc edges.
- Cape holes and dark clothing against black previews.
- Magenta spill or black gutter.
- Frame-to-frame scale drift.
- Anchor/ground-line drift.

If alpha cleanup damages thin body parts, reprocess from `raw-sheet.png` with a more conservative mask instead of editing the already-transparent sheet.

## Metadata Handoff

When integrating a sheet, provide or update these fields:

```json
{
  "src": ".../sheet-transparent.png",
  "frameWidth": 192,
  "frameHeight": 192,
  "cols": 3,
  "frames": 6,
  "fps": 8,
  "loop": false,
  "scale": 1.0,
  "anchorX": 96,
  "anchorY": 180
}
```

Tune `scale`, `anchorX`, and `anchorY` against idle/run in the actual canvas, not only by visual guess from the sheet.

## Verification

- Run `node --check src/main.js` after any code change.
- Use browser verification for visual changes at `http://localhost:4173/`.
- Trigger the action in-game and screenshot at least one representative frame.
- Report remaining asset risks instead of hiding them.
