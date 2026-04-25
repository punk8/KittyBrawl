# Rat Boss Encounter Spec

## Goal

Add a memorable rat boss encounter after the first two normal rats are defeated. The boss uses mind-control bait attacks that temporarily transform the player from the armed cat warrior into a harmless four-legged cat, forcing short loss-of-control sequences before the player recovers.

## Encounter Flow

1. Start level with the existing two normal rats.
2. When both rats are defeated, spawn the rat boss near the right side of the level.
3. Camera should keep the boss arena readable. First version can use the existing scrolling camera; later version can add temporary arena lock.
4. Boss intro plays once.
5. Boss alternates between two special attacks:
   - Cat Food Hypnosis
   - Paper Ball Bait And Kick
6. Player can damage the boss during normal boss idle/recovery windows.
7. Boss death ends the encounter.

## Boss Identity

The boss should read as an upgraded rat trickster/shaman:

- Larger than normal rat enemy.
- Same dark fantasy rat-den style.
- Yellow eyes, ragged cloak/hood, bone charms, dirty leather wraps.
- Carries bait props: cat food pouch and paper-ball bundle.
- Mischievous, cruel, theatrical.

## Required Assets

Boss animation sheets:

- `boss_idle`
- `boss_intro`
- `boss_attack_food`
- `boss_attack_paper`
- `boss_kick`
- `boss_hurt`
- `boss_death`

Boss presentation:

- `boss_cutin.png`
- optional `boss_cutin_flash_fx`

Projectiles and props:

- `cat_food_projectile`
- `cat_food_on_ground`
- `paper_ball_projectile`
- `paper_ball_on_ground`
- `hypnosis_fx`
- `kick_impact_fx`

Player temporary cat-form sheets:

- `player_cat_run`
- `player_cat_eat`
- `player_cat_pounce`
- `player_cat_stunned`
- `player_cat_knockback`
- `player_cat_recover`

The cat-form player should still be recognizable as the same protagonist, but fully four-legged, smaller, unarmed, and unusually gentle.

## Boss State Machine

```text
hidden
  -> intro
  -> idle
  -> choose_attack
  -> food_cutin
  -> attack_food
  -> recovery
  -> choose_attack
  -> paper_cutin
  -> attack_paper
  -> kick
  -> recovery
  -> hurt
  -> death
```

Recommended first timings:

- `intro`: 1.2s
- `idle`: 0.8s to 1.2s
- `cutin`: 0.8s
- `attack_food`: 1.4s
- `attack_paper`: 1.2s
- `kick`: 0.7s
- `recovery`: 1.0s

Use cooldowns so the boss does not chain loss-of-control attacks too aggressively.

## Player Status System

Add player statuses separate from animation action:

```text
normal
charmed_food
cat_run_to_food
cat_eating
weakened
charmed_paper
cat_pounce_to_paper
cat_kicked
cat_recover
```

Status effects should control:

- Whether player input is accepted.
- Whether attack/super is allowed.
- Which player animation set is drawn.
- Forced target movement.
- Damage timing.
- Recovery timing.

Keep this system generic enough for later bosses.

## Attack 1: Cat Food Hypnosis

Theme: the boss tosses cat food onto the ground and magically charms the player.

Sequence:

1. Boss enters `food_cutin`.
2. Boss cut-in slides onto screen, similar to player super cut-in.
3. Boss plays `boss_attack_food`.
4. Spawn `cat_food_projectile`; it arcs to the ground.
5. Spawn `cat_food_on_ground` and `hypnosis_fx`.
6. If the player is not invulnerable/dead, player enters `charmed_food`.
7. Player transforms into four-legged cat form.
8. Player input and attacks are disabled.
9. Player auto-runs toward the food with `player_cat_run`.
10. On reaching food, player plays `player_cat_eat`.
11. Player loses HP.
12. Player enters short `weakened` state: normal form restored, but attacks disabled briefly.
13. Food prop disappears and boss enters recovery.

First balance:

- HP damage: `0.16`
- Forced run speed: `260`
- Eating duration: `1.0s`
- Weakened duration: `1.2s`

## Attack 2: Paper Ball Bait And Kick

Theme: the boss throws a paper ball; the charmed cat pounces on it, then the boss kicks the player away.

Sequence:

1. Boss enters `paper_cutin`.
2. Boss cut-in slides onto screen.
3. Boss plays `boss_attack_paper`.
4. Spawn `paper_ball_projectile`; it bounces or rolls ahead of the player.
5. If the player is valid, player enters `charmed_paper`.
6. Player transforms into four-legged cat form.
7. Player input and attacks are disabled.
8. Player auto-jumps/pounces toward the paper ball with `player_cat_pounce`.
9. Boss moves/turns into kick position if needed.
10. Boss plays `boss_kick`.
11. Spawn `kick_impact_fx`.
12. Player loses HP and enters `cat_kicked`.
13. Player is knocked back with vertical arc.
14. On landing, player plays `player_cat_recover` and returns to normal form.

First balance:

- HP damage: `0.2`
- Pounce speed: `340`
- Kick knockback x: `420`
- Kick knockback y: `-520`
- Recovery duration after landing: `0.45s`

## Cut-In Rules

- Boss cut-in is a separate asset, not cropped from gameplay sprite.
- Cut-in should appear only at the start of each special attack.
- If attacks feel too frequent, show cut-in only on the first use of each attack, then use a shorter flash on repeats.
- Cut-in is screen-space and should not scroll with camera.
- During boss cut-in, gameplay can slow/freeze briefly, but HUD remains readable.

## Implementation Phases

### Phase 1: Asset Planning

- Write boss sprite prompts.
- Write player cat-form sprite prompts.
- Generate boss idle/attack/hurt/death first.
- Generate cut-in and bait props.

### Phase 2: Boss Skeleton

- Add boss enemy config.
- Spawn boss after normal rats are dead.
- Draw boss health bar.
- Let player damage boss.
- Implement boss death.

### Phase 3: Generic Status Effects

- Add player status object.
- Add attack disabled flag.
- Add forced movement target.
- Add cat-form draw path.
- Ensure reset clears all statuses.

### Phase 4: Cat Food Attack

- Implement cut-in.
- Implement cat food projectile/ground prop.
- Implement forced run/eat/weaken flow.
- Tune damage and duration.

### Phase 5: Paper Ball Attack

- Implement paper projectile/ground prop.
- Implement forced pounce.
- Implement boss kick and player knockback.
- Tune recovery.

### Phase 6: Polish

- Camera framing for boss arena.
- Better telegraphs before special attacks.
- Sound hooks later.
- Avoid repeated unavoidable loss-of-control loops.

## Code Areas

Likely files:

- `assets/data/player-animations.json`
- `src/main.js`
- new boss assets under `assets/characters/enemies/rat-boss/`
- new props/effects under `assets/effects/boss/rat-boss/`
- new player cat-form assets under `assets/characters/player/cat-form/`

Expected new runtime concepts:

- `bosses` or a boss entity slot.
- `encounterState`.
- `player.status`.
- `forcedTarget`.
- `attackDisabledTime`.
- `drawBossCutin()`.

## Acceptance Checks

- Boss appears only after the two normal rats are defeated.
- Boss has visible HP and can be killed.
- Boss cut-in appears for both special attacks.
- Food attack forces the player into cat form, runs to food, eats, loses HP, and temporarily cannot attack.
- Paper attack forces the player into cat form, pounces to paper, gets kicked, loses HP, and recovers after landing.
- Player cannot attack during forced cat-form sequences.
- Player regains control after every forced sequence.
- Reset returns to the initial two-rat encounter cleanly.
- No console errors.
