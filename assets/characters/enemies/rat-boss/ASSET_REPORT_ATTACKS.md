# Rat Boss Attack Asset Report

Scope: rat boss attack animation assets only.

Reference inputs:

- `assets/characters/enemies/rat/concept/rat_enemy_concept_v1.png`
- `RAT_BOSS_SPEC.md`
- `.codex/skills/kittybrawl-style-guide/SKILL.md`
- `.codex/skills/kittybrawl-sprite-action-pipeline/SKILL.md`

Prompt file:

- `assets/characters/enemies/rat-boss/RAT_BOSS_ATTACK_PROMPTS.md`

Generation mode:

- Built-in `imagegen` for raw solid-magenta sheets.
- `generate2dsprite.py process` for chroma cleanup, frame extraction, transparent sheet export, and GIF preview.
- Final postprocess uses 320 px cells for safer projectile/kick spacing.

## attack_food

Files:

- Raw sheet: `assets/characters/enemies/rat-boss/attack_food/raw-sheet.png`
- Clean raw: `assets/characters/enemies/rat-boss/attack_food/raw-sheet-clean.png`
- Transparent sheet: `assets/characters/enemies/rat-boss/attack_food/sheet-transparent.png`
- Checker preview: `assets/characters/enemies/rat-boss/attack_food/sheet-preview-checker.png`
- GIF preview: `assets/characters/enemies/rat-boss/attack_food/animation.gif`
- Metadata: `assets/characters/enemies/rat-boss/attack_food/pipeline-meta.json`

Recommended runtime metadata:

```json
{
  "src": "assets/characters/enemies/rat-boss/attack_food/sheet-transparent.png",
  "frameWidth": 320,
  "frameHeight": 320,
  "cols": 3,
  "frames": 6,
  "fps": 8,
  "loop": false,
  "scale": 1.0,
  "anchorX": 160,
  "anchorY": 285
}
```

QC notes:

- Final sheet has transparent corners and no visible magenta gutter.
- The bait pouch projectile is preserved in the throw frame.
- The raw source still reports one edge-touch frame because the generated art placed an effect close to a raw cell boundary. The final 320 px transparent sheet has enough padding for gameplay.
- Removed one small neighboring-frame bait fragment from frame 5 after processing.

## attack_paper

Files:

- Raw sheet: `assets/characters/enemies/rat-boss/attack_paper/raw-sheet.png`
- Clean raw: `assets/characters/enemies/rat-boss/attack_paper/raw-sheet-clean.png`
- Transparent sheet: `assets/characters/enemies/rat-boss/attack_paper/sheet-transparent.png`
- Checker preview: `assets/characters/enemies/rat-boss/attack_paper/sheet-preview-checker.png`
- GIF preview: `assets/characters/enemies/rat-boss/attack_paper/animation.gif`
- Metadata: `assets/characters/enemies/rat-boss/attack_paper/pipeline-meta.json`

Recommended runtime metadata:

```json
{
  "src": "assets/characters/enemies/rat-boss/attack_paper/sheet-transparent.png",
  "frameWidth": 320,
  "frameHeight": 320,
  "cols": 3,
  "frames": 6,
  "fps": 9,
  "loop": false,
  "scale": 1.0,
  "anchorX": 160,
  "anchorY": 285
}
```

QC notes:

- Final sheet has transparent corners and no visible magenta gutter.
- Paper-ball bait remains visible in the throw and release frames.
- The raw source reports edge-touch on two generated frames, mostly from the tail/throw pose touching the raw cell boundary. The final 320 px transparent sheet keeps the gameplay frame safely padded.
- Removed one small neighboring-frame paper fragment from frame 6 after processing.

## kick

Files:

- Raw sheet: `assets/characters/enemies/rat-boss/kick/raw-sheet.png`
- Clean raw: `assets/characters/enemies/rat-boss/kick/raw-sheet-clean.png`
- Transparent sheet: `assets/characters/enemies/rat-boss/kick/sheet-transparent.png`
- Checker preview: `assets/characters/enemies/rat-boss/kick/sheet-preview-checker.png`
- GIF preview: `assets/characters/enemies/rat-boss/kick/animation.gif`
- Metadata: `assets/characters/enemies/rat-boss/kick/pipeline-meta.json`

Recommended runtime metadata:

```json
{
  "src": "assets/characters/enemies/rat-boss/kick/sheet-transparent.png",
  "frameWidth": 320,
  "frameHeight": 320,
  "cols": 3,
  "frames": 6,
  "fps": 10,
  "loop": false,
  "scale": 1.0,
  "anchorX": 160,
  "anchorY": 285
}
```

QC notes:

- Final sheet has transparent corners and no visible magenta gutter.
- Kick extension and impact spark are preserved.
- The raw source reports edge-touch on two generated frames because the kick pose reaches toward the raw cell boundary. The final 320 px transparent sheet has safe padding.
- Removed two tiny neighboring-frame fragments after processing.

## Integration Notes

- Suggested boss attack sheets use 320 px frames. Keep the boss `scale` near `1.0` at first, then tune against normal rat scale in canvas.
- Use `anchorY: 285` as a first-pass feet anchor. The generated frames share a stable feet-aligned ground line, but final gameplay may need per-action y-offset tuning.
- The boss visual reads as an upgraded rat trickster and is intentionally larger than the normal rat.
