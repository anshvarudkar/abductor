# Abductor - Technical Game Specification

## Overview

A retro pixel-art top-down game where the player controls a UFO, abducting everything from trees and people to entire universes. Built with Phaser.js for web browsers.

## Technical Stack

| Component | Technology |
|---|---|
| Engine | Phaser 3 (latest stable) |
| Renderer | HTML5 Canvas (WebGL fallback) |
| Language | JavaScript (ES6+) |
| Perspective | Top-down (overhead) |
| Platform | Web browser |
| Audio | Basic SFX from start (Phaser audio system) |
| Resolution | 800x600 base, pixel-perfect scaling |

## Core Mechanics

### UFO Movement
- Arrow keys or WASD to move in all 4 directions
- UFO stays in upper portion of screen by default
- Camera follows UFO, scrolling over the level map

### Abduction (Spacebar / A button)
- Activates a **cone/triangle tractor beam** extending below the UFO
- Objects within the cone are pulled upward over ~1-2 seconds
- Only objects **at or below the UFO's current abduction power level** can be abducted
- Abducting objects increases score and feeds the growth mechanic
- Beam is visible as a translucent triangle/cone sprite rendered below the UFO

### Shooting (Z key / X button)
- Fires projectiles downward/forward from the UFO
- Enemy starships require **3 hits** to destroy
- Destroyed starships play explosion animation and fall to the planet surface

### Blocking (Shift / B button)
- Activates an **energy shield** around the UFO
- Blocks incoming particles/potions thrown by people
- Shield has a short cooldown after use (~2 seconds)
- Visual: energy-shield sprite overlay on UFO

### Growth Mechanic
- Abducting objects fills a **growth meter**
- When the meter fills, the UFO scales up (sprite scales 1.0x → 1.25x → 1.5x → 2.0x → 3.0x)
- Each growth tier unlocks the ability to abduct larger target classes:
  - **Tier 1 (start):** Trees, people, animals, small objects
  - **Tier 2:** Cars, vehicles
  - **Tier 3:** Gas stations, small buildings, shops
  - **Tier 4:** Skyscrapers, large structures
  - **Tier 5:** Entire planet (level completion trigger)

### Health System
- Health bar displayed at top of screen (horizontal bar, left side)
- Max HP: 100
- Damage sources:
  - Particles/potions from people: **5 HP per hit**
  - Enemy starship attacks: **15 HP per hit**
  - Crashing into tall structures: **25 HP**
- No health regeneration (unless we add pickups later)
- HP reaches 0 → Game Over

## Level Structure

### Level Flow
```
Earth L1 → Earth L2 → Earth L3 → Moon L1 → Moon L2 → Moon L3 → Mars → Venus → Neptune → Universe → Multiverse → WIN
```

### Star Rating (per level)
| Stars | Requirement |
|---|---|
| 1 Star | Complete the level (abduct all required targets) |
| 2 Stars | Complete with score >= 2,000 and HP > 25% |
| 3 Stars | Complete with score >= 3,000 and HP > 50% |

- Minimum **1 star** required to unlock next level
- Stars accumulate across levels for leaderboard ranking

### Scoring
| Target | Points |
|---|---|
| Tree / small creature | 50 |
| Person | 100 |
| Car / vehicle | 200 |
| Small building | 500 |
| Skyscraper | 1,000 |
| Enemy starship destroyed | 300 |
| Full planet clear bonus | 2,000 |

---

## Milestones

---

### Milestone 1: Core Abduction Loop (Playable Prototype)

**Goal:** A single playable Earth level where the UFO can move, activate the tractor beam, abduct objects, grow, and complete the level.

**Deliverables:**
- [x] Project scaffolding: Phaser 3 project, asset loading, main game scene
- [x] UFO sprite on screen with 4-directional movement (arrow keys / WASD)
- [x] Tractor beam activation (spacebar) with cone visual below UFO
- [x] Spawned abduction targets on the ground: trees, people, small creatures, cars
- [x] Abduction mechanic: objects in beam cone get pulled up and disappear (absorbed)
- [x] Score counter (top-right of screen)
- [x] Growth mechanic: UFO scales up after abducting enough objects
- [x] Growth tiers unlock larger targets (cars only abductable at Tier 2+)
- [x] Basic scrolling top-down map (city/town environment)
- [x] Level completion: all targets abducted → "LEVEL PASSED" screen with star rating
- [x] Basic SFX: abduction hum, object absorbed sound

**No enemies in this milestone** — pure abduction sandbox on one level.

#### Milestone 1 - Assets Used

**Player:**
| Asset | File Path | Usage |
|---|---|---|
| spaceship-unit | `Legacy Collection/Assets/Misc/spaceship-unit/Spritesheets/Spritesheet.png` | Main UFO sprite (animated with thrust) |
| spaceship-unit frames | `Legacy Collection/Assets/Misc/spaceship-unit/Sprites/ShipandThrust/frame1-8.png` | Individual UFO animation frames |

**Abduction Targets:**
| Asset | File Path | Usage |
|---|---|---|
| Dancing Girl | `Legacy Collection/Assets/Characters/Dancing Girl Files/sprites/` | Person target |
| Bridge Heroine | `Legacy Collection/Assets/Characters/Bridge Heroine/Heroine base/` | Person target |
| cyberpunk-detective | `Legacy Collection/Assets/Characters/cyberpunk-detective/sprites/` | Person target |
| sunny-bunny | `Legacy Collection/Assets/Characters/sunny-bunny/Sprites/` | Small creature target |
| sunny-froggy | `Legacy Collection/Assets/Characters/sunny-froggy/Sprites/` | Small creature target |
| sunny-mushroom | `Legacy Collection/Assets/Characters/sunny-mushroom/sprites/` | Small creature target |
| crow | `Legacy Collection/Assets/Characters/crow/Sprites/` | Small flying target |
| Warped Vehicles | `Legacy Collection/Assets/Misc/Warped Vehicles Files/vehicle 1/`, `vehicle 2/`, `vehicle 3/` | Cars (Tier 2 targets) |

**Environment:**
| Asset | File Path | Usage |
|---|---|---|
| Warped City V1 | `Legacy Collection/Assets/Packs/Warped City/V1/` | City tilemap / ground layer |
| Warped City V2 | `Legacy Collection/Assets/Packs/Warped City/V2/` | Alternate city tiles |
| night-town-background | `Legacy Collection/Assets/Environments/night-town-background-files/layers/` | Parallax background layers |

**UI (generated / programmatic):**
- Health bar: Phaser graphics rectangle (green→red gradient)
- Score text: Phaser bitmap text
- Tractor beam: Programmatic triangle drawn with Phaser graphics (translucent green/blue cone)
- Star rating: Programmatic star shapes or simple text stars

---

### Milestone 2: Combat, Enemies & Full Earth Progression

**Goal:** Add enemies, combat (shoot + block), health system, multiple Earth sub-levels (L1-L3), and Game Over screen. Fully playable Earth campaign.

**Deliverables:**
- [x] Health bar at top of screen with damage system
- [x] People throw particles/potions at UFO (projectile sprites moving upward)
- [x] Block mechanic (Shift key): energy shield absorbs incoming projectiles, 2s cooldown
- [x] Enemy starships that fly around and shoot at UFO
- [x] Shoot mechanic (Z key): UFO fires projectiles downward
- [x] Starships take 3 hits → explosion → fall to ground
- [x] Skyscraper hazard: tall buildings damage UFO on collision (crash + fall animation)
- [x] 3 Earth sub-levels with increasing difficulty:
  - **Earth L1:** Trees, creatures, few people (no starships)
  - **Earth L2:** People, cars, some starships, small buildings
  - **Earth L3:** Full city with skyscrapers, many starships, heavy resistance
- [x] Game Over screen when HP = 0 (score display, retry button)
- [x] Level select screen showing star ratings per level
- [x] SFX: shoot, explosion, shield block, damage taken, game over jingle

#### Milestone 2 - Assets Used

**All Milestone 1 assets, plus:**

**Enemies:**
| Asset | File Path | Usage |
|---|---|---|
| top-down-shooter-enemies | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/sprites/` | Enemy starships |
| top-down-shooter-enemies sheets | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/spritesheets/` | Enemy starship spritesheets |
| top-down-shooter-ship | `Legacy Collection/Assets/Characters/top-down-shooter-ship/sprites/` | Alternate enemy ship |
| space-marine | `Legacy Collection/Assets/Characters/space-marine/Sprites/` | Ground soldier enemy |
| mech-unit | `Legacy Collection/Assets/Characters/mech-unit/sprites/` | Heavy ground enemy |
| top-down-boss | `Legacy Collection/Assets/Misc/top-down-boss/PNG/` | Earth boss ship |

**Projectiles & Combat FX:**
| Asset | File Path | Usage |
|---|---|---|
| Warped shooting fx - Bolt | `Legacy Collection/Assets/Misc/Warped shooting fx/Bolt/` | UFO shoot projectile |
| Warped shooting fx - Pulse | `Legacy Collection/Assets/Misc/Warped shooting fx/Pulse/` | Enemy shoot projectile |
| Warped shooting fx - spark | `Legacy Collection/Assets/Misc/Warped shooting fx/spark/` | Hit spark FX |
| EnemyProjectile | `Legacy Collection/Assets/Misc/EnemyProjectile/Sprites/` | People's thrown particles/potions |
| Hit | `Legacy Collection/Assets/Misc/Hit/Sprites/hit1-3.png` | Impact FX on hit |

**Explosions & Death:**
| Asset | File Path | Usage |
|---|---|---|
| Explosions pack (a-g) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-a/` through `explosion-1-g/` | Starship destruction (3-hit kill) |
| Explosion | `Legacy Collection/Assets/Misc/Explosion/sprites/` | Single explosion variant |
| EnemyDeath | `Legacy Collection/Assets/Misc/EnemyDeath/Sprites/` | Enemy death animation |

**Shield / Block:**
| Asset | File Path | Usage |
|---|---|---|
| energy-shield | `Legacy Collection/Assets/Misc/Grotto-escape-2-FX/spritesheets/energy-shield.png` | Block button shield visual |
| energy-field sprites | `Legacy Collection/Assets/Misc/Grotto-escape-2-FX/sprites/energy-field_*.png` | Shield animation frames |

**Environment (Earth levels):**
| Asset | File Path | Usage |
|---|---|---|
| Synth City | `Legacy Collection/Assets/Environments/Synth City/` | City skyline elements for L3 |
| Urban-landscape | `Legacy Collection/Assets/Environments/Urban-landscape-files/layers/` | Urban backdrop |
| Miami-synth | `Legacy Collection/Assets/Packs/Miami-synth-files/Layers/` | Retro neon city variant |

**UI:**
| Asset | File Path | Usage |
|---|---|---|
| Warped Portraits | `Legacy Collection/Assets/Misc/Warped Portraits Files/Portraits with transparent bg/portraits1-4.png` | Character portraits on Game Over / level intro |
| gems | `Legacy Collection/Assets/Misc/gems/spritesheets/` | Score pickup animations |

---

### Milestone 3: Planets, Universe & Endgame

**Goal:** Full game with planetary progression, multiple worlds, universe/multiverse finale, leaderboard, and polish. Complete playable game.

**Deliverables:**
- [x] Planet select map (solar system overview, planets unlock sequentially)
- [x] Moon levels (L1-L3): low gravity feel, rocky terrain, alien creatures
- [x] Mars levels (L1-L3): red desert, dust storms, alien enemies
- [x] Venus levels (L1-L3): lava/volcanic, fire-based enemies
- [x] Neptune levels (L1-L3): underwater/ice theme, aquatic targets
- [x] New enemy types per planet:
  - Moon: alien-flying-enemy, alien-walking-enemy
  - Mars: demon, fire-skull, flying-eye-demon
  - Venus: Hell-Beast, Hell-Hound
  - Neptune: meerman, mutant-toad, Grotto creatures
- [x] Universe level: abduct entire planets (massive scale UFO)
- [x] Multiverse level: abduct universes (final level)
- [x] Win screen: "You have all of space to yourself"
- [x] Leaderboard: local storage high scores with name entry
- [x] Planet transition animations (UFO flying through space between worlds)
- [x] SFX per planet theme, level music tracks
- [x] Title screen with Start / Continue / Leaderboard options

#### Milestone 3 - Assets Used

**All Milestone 1 + 2 assets, plus:**

**Moon Enemies & Targets:**
| Asset | File Path | Usage |
|---|---|---|
| alien-flying-enemy | `Legacy Collection/Assets/Characters/alien-flying-enemy/sprites/` | Moon flying enemy |
| alien-walking-enemy | `Legacy Collection/Assets/Characters/alien-walking-enemy/Sprites/` | Moon ground enemy |
| bipedal-Unit | `Legacy Collection/Assets/Characters/bipedal-Unit/sprites/` | Moon alien soldier |
| sunny-dragon | `Legacy Collection/Assets/Characters/sunny-dragon/sprites/` | Moon creature target |

**Mars Enemies & Targets:**
| Asset | File Path | Usage |
|---|---|---|
| demon-Files | `Legacy Collection/Assets/Characters/demon-Files/Sprites/` | Mars demon enemy |
| Fire-Skull-Files | `Legacy Collection/Assets/Characters/Fire-Skull-Files/Sprites/` | Mars fire skull enemy |
| flying-eye-demon | `Legacy Collection/Assets/Characters/flying-eye-demon/Sprites/` | Mars flying enemy |
| Nightmare-Files | `Legacy Collection/Assets/Characters/Nightmare-Files/Sprites/` | Mars nightmare creature |

**Venus Enemies & Targets:**
| Asset | File Path | Usage |
|---|---|---|
| Hell-Beast-Files | `Legacy Collection/Assets/Characters/Hell-Beast-Files/` | Venus boss enemy (breath, fireball) |
| Hell-Hound-Files | `Legacy Collection/Assets/Characters/Hell-Hound-Files/Sprites/` | Venus hound enemy |
| WereWolf | `Legacy Collection/Assets/Characters/WereWolf/Sprites/` | Venus werewolf enemy |
| Terrible Knight | `Legacy Collection/Assets/Characters/Terrible Knight/Sprites/` | Venus knight enemy |

**Neptune Enemies & Targets:**
| Asset | File Path | Usage |
|---|---|---|
| meerman | `Legacy Collection/Assets/Characters/meerman/Sprites/` | Neptune aquatic enemy |
| mutant-toad | `Legacy Collection/Assets/Characters/mutant-toad/Sprites/` | Neptune toad enemy |
| Grotto-escape-2-snake | `Legacy Collection/Assets/Characters/Grotto-escape-2-snake/sprites/` | Neptune snake |
| Grotto-escape-2-lizzard | `Legacy Collection/Assets/Characters/Grotto-escape-2-lizzard/sprites/` | Neptune lizard |
| Grotto-escape-2-boss-dragon | `Legacy Collection/Assets/Characters/Grotto-escape-2-boss-dragon/sprites/` | Neptune boss |
| enemy-ghost | `Legacy Collection/Assets/Characters/enemy-ghost/Sprites/` | Neptune ghost enemy |
| Ghost-Files | `Legacy Collection/Assets/Characters/Ghost-Files/Sprites/` | Neptune ghost variant |

**Planet Environments:**
| Asset | File Path | Usage |
|---|---|---|
| Rocky Pass | `Legacy Collection/Assets/Environments/Rocky Pass Files/PNG/` | Moon terrain |
| Rocky Beach | `Legacy Collection/Assets/Environments/Rocky Beach environment/layers/` | Moon surface |
| Rocky-Tileset | `Legacy Collection/Assets/Environments/Rocky-Tileset/PNG/` | Moon/Mars tiles |
| alien-environment | `Legacy Collection/Assets/Environments/alien-environment/PNG/` | Mars alien landscape |
| another-world | `Legacy Collection/Assets/Environments/another-world/PNG/` | Mars alternate terrain |
| lava-background | `Legacy Collection/Assets/Environments/lava-background/PNG/` | Venus lava backdrop |
| Underwater Fantasy | `Legacy Collection/Assets/Environments/Underwater Fantasy/PNG/` | Neptune underwater |
| sci-fi-environment-background | `Legacy Collection/Assets/Environments/sci-fi-environment-background-files/PNG/` | Universe level backdrop |
| space_background_pack | `Legacy Collection/Assets/Environments/space_background_pack/` | Space travel / universe level |
| top-down-space-environment | `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/` | Space tileset for final levels |
| sci-fi-interior-platform | `Legacy Collection/Assets/Environments/sci-fi-interior-platform/PNG/` | Bonus interior level |

**Additional FX:**
| Asset | File Path | Usage |
|---|---|---|
| Grotto-escape-2-FX: electro-shock | `Legacy Collection/Assets/Misc/Grotto-escape-2-FX/spritesheets/electro-shock.png` | Electric attack FX |
| Grotto-escape-2-FX: fire-ball | `Legacy Collection/Assets/Misc/Grotto-escape-2-FX/spritesheets/fire-ball.png` | Venus fire projectile |
| Grotto-escape-2-FX: energy-smack | `Legacy Collection/Assets/Misc/Grotto-escape-2-FX/spritesheets/energy-smack.png` | Energy attack FX |
| Warped shooting fx - charged | `Legacy Collection/Assets/Misc/Warped shooting fx/charged/` | Charged shot (upgraded UFO) |
| Warped shooting fx - waveform | `Legacy Collection/Assets/Misc/Warped shooting fx/waveform/` | Wave attack FX |
| Warped shooting fx - crossed | `Legacy Collection/Assets/Misc/Warped shooting fx/crossed/` | Crossed beam FX |
| Warped Fast Ship | `Legacy Collection/Assets/Misc/Warped Fast Ship Files/Sprites/ship-sprites/` | Upgraded UFO skin (endgame) |

**Additional Packs:**
| Asset | File Path | Usage |
|---|---|---|
| SpaceShipShooter | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/` | Extra space sprites |
| SpaceShooter | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/` | Space shooter assets |
| asteroid-fighter | `Legacy Collection/Assets/Packs/asteroid-fighter/PNG/` | Asteroid field obstacles |

---

## Assets NOT in the Collection (Need to Create or Source)

| Missing Asset | Needed For | Suggested Solution |
|---|---|---|
| Tractor beam cone sprite | Core abduction visual | Programmatic Phaser graphics (translucent gradient triangle) |
| Trees | Earth abduction targets | Extract from environment tilesets (Warped City, forest packs) or create simple pixel tree |
| Buildings (gas station, shops) | Earth Tier 3 targets | Extract from city environment packs or create modular building sprites |
| Health bar frame | UI | Programmatic Phaser graphics |
| Star icons | Level rating UI | Programmatic or simple pixel art |
| Planet icons | Planet select map | Simple pixel circles with planet colors |
| Universe / multiverse visuals | Endgame levels | Scaled space backgrounds with glow effects |
| Title screen logo | Main menu | Pixel art text or Phaser bitmap font |

---

## Controls Summary

| Action | Keyboard | Description |
|---|---|---|
| Move | Arrow keys / WASD | Move UFO in 4 directions |
| Abduct | Spacebar | Activate tractor beam cone |
| Shoot | Z | Fire projectile at enemies |
| Block | Shift | Activate energy shield |
| Pause | Escape / P | Pause menu |

---

## File Structure (Planned)

```
aductor/
├── SPEC.md                  # This file
├── Legacy Collection/       # Pixel art asset library
├── src/
│   ├── index.html           # Entry point
│   ├── main.js              # Phaser game config & boot
│   ├── scenes/
│   │   ├── BootScene.js     # Asset preloading
│   │   ├── TitleScene.js    # Main menu
│   │   ├── GameScene.js     # Core gameplay
│   │   ├── LevelSelectScene.js
│   │   ├── GameOverScene.js
│   │   └── LevelCompleteScene.js
│   ├── sprites/
│   │   ├── UFO.js           # Player UFO class
│   │   ├── TractorBeam.js   # Beam mechanic
│   │   ├── Enemy.js         # Enemy base class
│   │   ├── Starship.js      # Enemy starship
│   │   ├── Target.js        # Abductable object base
│   │   └── Shield.js        # Block shield
│   ├── systems/
│   │   ├── GrowthSystem.js  # UFO growth tiers
│   │   ├── ScoreSystem.js   # Scoring & stars
│   │   ├── HealthSystem.js  # HP management
│   │   └── LevelManager.js  # Level data & progression
│   └── assets/              # Copied/processed game assets
│       ├── sprites/
│       ├── environments/
│       ├── fx/
│       └── audio/
├── package.json
└── vite.config.js           # Dev server & bundling
```
