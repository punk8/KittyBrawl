# Kitty Brawl Web Demo Spec

This document describes the earlier player-only web demo. The current combat prototype is specified in `FIRST_PLAYABLE_SPEC.md`.

## Goal

Create a first playable browser demo for the cat warrior player character using the generated sprite assets. The demo should prove that the character can be rendered, controlled, animated, and switched between movement, attack, hurt, death, and super move states.

## Scope

Included:

- Static browser app.
- Canvas-based rendering.
- Keyboard controls.
- Player idle, run, jump/fall, attack, hurt, death, super activation, and super attack.
- Simple gravity and ground collision.
- Horizontal movement with sprite flipping.
- Super move background overlay and impact effect.
- Minimal HUD with player health and super meter.

Excluded for this version:

- Enemies.
- Background level art.
- Tileset collision.
- Real damage or combat rules.
- Audio.
- Save/load.
- Mobile touch controls.

## Controls

- Move left: `A` or `ArrowLeft`.
- Move right: `D` or `ArrowRight`.
- Jump: `W`, `ArrowUp`, or `Space`.
- Normal attack: `J`.
- Super move: `K`.
- Hurt test: `H`.
- Death test: `L`.
- Reset: `R`.

Controls are documented outside the app rather than as in-game instructional copy.

## Assets

Player sprite sheets:

- `assets/characters/player/movement/idle/sheet-transparent.png`
- `assets/characters/player/movement/run/sheet-transparent.png`
- `assets/characters/player/movement/jump_fall/sheet-transparent.png`
- `assets/characters/player/combat/attack_01/sheet-transparent.png`
- `assets/characters/player/combat/hurt/sheet-transparent.png`
- `assets/characters/player/combat/death/sheet-transparent.png`
- `assets/characters/player/super/super_activation/sheet-transparent.png`
- `assets/characters/player/super/super_attack/sheet-transparent.png`

Effect sprite sheets:

- `assets/effects/player/slash_fx/sheet-transparent.png`
- `assets/effects/player/hit_spark/sheet-transparent.png`
- `assets/effects/player/super_impact_fx/sheet-transparent.png`
- `assets/effects/player/super_background_plate/background.png`

Animation data:

- `assets/data/player-animations.json`

## State Model

Free movement states:

- `idle`
- `run`
- `jump_fall`

Locked action states:

- `attack_01`
- `hurt`
- `death`
- `super_activation`
- `super_attack`

Rules:

- `death` remains active until reset.
- `super_activation` automatically chains into `super_attack`.
- `attack_01`, `hurt`, and `super_attack` return to free movement when finished.
- Movement input is ignored during locked action states, except gravity still applies.

## Rendering

- Use a fixed logical canvas size of `960x540`.
- Use responsive scaling to fit the browser viewport.
- Disable image smoothing for crisp pixel art.
- Treat player `x` and `y` as the sprite anchor at the feet.
- Use right-facing source sprites and horizontally flip the draw call when facing left.
- Draw a simple non-asset stage floor so jumping and landing are readable.

## Acceptance Criteria

- The page loads without build tooling.
- The player appears in idle state after assets load.
- Left/right movement changes to run animation and flips correctly.
- Jump applies gravity and switches to `jump_fall`.
- `J` plays the normal attack once and returns to movement.
- `K` plays super activation, then super attack, with the super background and impact effect.
- `H` plays hurt once and returns to movement.
- `L` plays death and stays dead until `R`.
- No final sprite sheet uses an `_attempt_*_edge_touch` asset.
