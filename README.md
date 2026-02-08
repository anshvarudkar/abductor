# ABDUCTOR

A retro-style arcade game where you pilot a UFO, abducting everything from bunnies to buildings across the solar system and beyond.

## How to Play

Fly your UFO across 7 worlds — Earth, Moon, Mars, Venus, Neptune, the Universe, and the Multiverse — abducting targets with your tractor beam. Start small (trees, creatures) and grow big enough to grab cars, buildings, and skyscrapers. Fight enemy starships along the way.

### Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move UFO |
| Hold SPACE | Tractor beam (abduct targets) |
| Z | Shoot enemies |
| SHIFT | Activate shield |
| ESC | Back / Menu |

### Growth Tiers

Abducting targets earns growth points. As you grow, your UFO gets bigger and can abduct larger objects:

- **Tier 1** — Trees, creatures, people
- **Tier 2** — Cars and vehicles
- **Tier 3** — Buildings and structures
- **Tier 4** — Skyscrapers and large structures
- **Tier 5** — Massive objects

### Star Ratings

Each level awards up to 3 stars:
- 1 star: Complete the level
- 2 stars: Score 2000+ with HP above 25%
- 3 stars: Score 3000+ with HP above 50%

## Worlds

- **Earth** (3 levels) — Suburbs, Downtown, Metropolis
- **Moon** (3 levels) — Craters, Dark Side, Lunar Base
- **Mars** (3 levels) — Canyons, Volcanoes, Storm
- **Venus** (3 levels) — Lava Fields, Acid Clouds, Inferno
- **Neptune** (3 levels) — Ice Caves, Deep Ocean, Frozen Core
- **Universe** (1 level) — Open space finale
- **Multiverse** (1 level) — The ultimate challenge

## Tech Stack

- [Phaser 3](https://phaser.io/) — Game framework
- [Vite](https://vitejs.dev/) — Build tool
- Vanilla JavaScript — No framework dependencies
- Web Audio API — Procedural sound effects
- localStorage — Leaderboard persistence

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

Output goes to the `dist/` directory.
