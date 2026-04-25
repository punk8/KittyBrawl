# Kitty Brawl First Playable Spec

## Goal

Turn the current player-only browser demo into the first playable combat prototype: one screen, controllable cat hero, rat enemies, hit reactions, deaths, super move, and level art.

## Scope

Included:

- Static browser app with no build step.
- Canvas rendering at `960x540`.
- Existing keyboard controls.
- Rat den background art.
- Ground collision using a single flat floor.
- Two rat enemies.
- Enemy idle, walk, attack, hurt, and death animation states.
- Player normal attack damaging rats.
- Player super attack damaging all living rats in range.
- Enemy hit spark and death puff effects.
- Basic HUD for player HP, super meter, and remaining rats.
- Debug state exposed through `window.__kittyDebug.getState()`.

Excluded:

- Full tilemap collision.
- Multi-screen camera scrolling.
- Audio.
- Enemy projectiles.
- Player death from complex damage rules.
- Touch controls.
- Save/load.

## Controls

- Move left: `A` or `ArrowLeft`.
- Move right: `D` or `ArrowRight`.
- Jump: `W`, `ArrowUp`, or `Space`.
- Normal attack: `J`.
- Super move: `K`.
- Test hurt: `H`.
- Test death: `L`.
- Reset encounter: `R`.

## Assets

Player assets are loaded from `assets/data/player-animations.json`.

Level assets:

- `assets/levels/backgrounds/rat_den_bg.png`
- `assets/levels/tilesets/rat_den_tileset_processed/tileset-transparent.png`
- `assets/levels/tilesets/rat_den_tileset_processed/tiles/*.png`

Rat assets:

- `assets/characters/enemies/rat/idle/sheet-transparent.png`
- `assets/characters/enemies/rat/walk/sheet-transparent.png`
- `assets/characters/enemies/rat/attack/sheet-transparent.png`
- `assets/characters/enemies/rat/hurt/sheet-transparent.png`
- `assets/characters/enemies/rat/death/sheet-transparent.png`

Enemy effects:

- `assets/effects/enemies/rat_hit_spark/sheet-transparent.png`
- `assets/effects/enemies/rat_death_puff/sheet-transparent.png`

## Combat Rules

Player:

- Starts with full HP and full super meter.
- Normal attack deals `1` damage.
- Super attack deals lethal damage to rats inside the super range.
- Locked player actions keep gravity active but reduce horizontal control.

Rats:

- Spawn with `2` HP.
- Walk toward the player when alive and not locked in hurt/death/attack.
- Attack when close enough and their cooldown is ready.
- Can damage the player once per attack.
- Enter `hurt` when damaged but not killed.
- Enter `death`, spawn death puff, then disappear after the death animation finishes.

## Rendering Order

1. Rat den background.
2. Stage ground and a small set of decorative tiles.
3. Shadows.
4. Living/death-state rats.
5. Player.
6. Transient effects.
7. HUD.

## Acceptance Criteria

- Page loads on `http://localhost:4173/` without a build step.
- Background art appears behind the character.
- Player can move, jump, attack, super, hurt, death, and reset.
- Two rats are visible on load.
- Rats walk toward the player.
- Player normal attack hits a rat in front of the player and spawns a hit spark.
- After two normal hits, a rat plays death and disappears.
- Super move damages visible rats in range and spawns impact effects.
- Rats can attack the player when close.
- `R` resets the encounter, player state, effects, and rats.
- `window.__kittyDebug.getState()` reports player state, enemy state, and active effects.
