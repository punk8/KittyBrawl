# Stage Clear / Victory Pose Spec

## Goal

After the rat boss is defeated, the first playable demo should resolve into a short stage-clear presentation instead of simply leaving the player in normal combat.

The sequence should feel like a 90s side-scrolling action game with arcade fighting-game influence: boss dies, the player locks into a cool victory pose, a small celebratory effect plays, and a stage-clear plate appears.

## Assets

Player animation:

```text
assets/characters/player/presentation/victory_pose/sheet-transparent.png
```

Effect:

```text
assets/effects/player/victory_spark_fx/sheet-transparent.png
```

UI plate:

```text
assets/effects/ui/stage_clear_plate/stage_clear_plate.png
```

## Animation Metadata

Add `victory_pose` to `assets/data/player-animations.json`:

- `frameWidth`: 192
- `frameHeight`: 192
- `cols`: 3
- `frames`: 6
- `fps`: 7
- `loop`: false
- `scale`: tuned near combat/super scale
- `anchorX`: 96
- `anchorY`: 166

Add `victory_spark_fx` to `effects`:

- `frameWidth`: 192
- `frameHeight`: 192
- `cols`: 2
- `frames`: 4
- `fps`: 10
- `loop`: true
- `scale`: around 1.0
- `anchorX`: 96
- `anchorY`: 112

Add a `ui.stageClearPlate` image entry for the stage clear plate.

## State Flow

1. Boss health reaches 0.
2. Boss enters `death` animation as it does today.
3. When boss death animation completes, trigger `stageClear`.
4. Stage clear should:
   - clear boss control / boss cut-ins;
   - clear transient lure/projectile effects;
   - lock player movement and attacks;
   - face player toward camera-right;
   - put player into `victory_pose`;
   - spawn `victory_spark_fx` near the player upper body;
   - show the UI plate and stage-clear text.
5. The final victory pose frame remains held.
6. `R` still resets the encounter.

## Drawing

Draw the normal game world underneath a slight dark overlay. Then draw:

- `stage_clear_plate.png` centered in the upper-middle screen.
- `STAGE CLEAR` in canvas text on top of the plate.
- A smaller subtitle such as `RAT DEN CLEARED`.
- A small `PRESS R TO REPLAY` hint after the sequence settles.

The UI text can be canvas-rendered for now; no text should be baked into generated images.

## Non-goals

- No next-stage flow yet.
- No scoring screen yet.
- No audio yet.
- No save/progression state yet.
