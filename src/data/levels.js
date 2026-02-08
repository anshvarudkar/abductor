// ============================================================
// Level Data — All 17 levels across 7 worlds
// ============================================================

export const GROWTH_TIERS = [
  { tier: 1, scale: 2.0, beamLength: 160, threshold: 0 },
  { tier: 2, scale: 2.5, beamLength: 200, threshold: 500 },
  { tier: 3, scale: 3.0, beamLength: 250, threshold: 1500 },
  { tier: 4, scale: 3.5, beamLength: 300, threshold: 3000 },
  { tier: 5, scale: 4.5, beamLength: 400, threshold: 5000 },
];

// --- TARGET DEFINITIONS ---
export const TARGET_DEFS = {
  // === EARTH ===
  tree:       { tier: 1, points: 50,  anim: null,                  spriteKey: null,             baseScale: 1,   isVehicle: false },
  bunny:      { tier: 1, points: 100, anim: 'bunny-idle-anim',     spriteKey: 'bunny-idle',     baseScale: 2,   isVehicle: false },
  froggy:     { tier: 1, points: 100, anim: 'froggy-walk-anim',    spriteKey: 'froggy-walk',    baseScale: 2,   isVehicle: false },
  mushroom:   { tier: 1, points: 100, anim: 'mushroom-walk-anim',  spriteKey: 'mushroom-walk',  baseScale: 2,   isVehicle: false },
  detective:  { tier: 1, points: 100, anim: 'detective-walk-anim', spriteKey: 'detective-walk', baseScale: 2.5, isVehicle: false, canThrow: true },
  crow:       { tier: 1, points: 75,  anim: 'crow-fly-anim',       spriteKey: 'crow-fly',       baseScale: 1.5, isVehicle: false },
  carYellow:  { tier: 2, points: 200, anim: null, spriteKey: 'car-yellow', baseScale: 1.5, isVehicle: true },
  carRed:     { tier: 2, points: 200, anim: null, spriteKey: 'car-red',    baseScale: 1.5, isVehicle: true },
  carPolice:  { tier: 2, points: 250, anim: null, spriteKey: 'car-police', baseScale: 1.0, isVehicle: true },
  carTruck:   { tier: 2, points: 300, anim: null, spriteKey: 'car-truck',  baseScale: 0.7, isVehicle: true },
  building:   { tier: 3, points: 500, anim: null, spriteKey: null,          baseScale: 1,   isVehicle: false },
  skyscraper: { tier: 4, points: 1000,anim: null, spriteKey: null,          baseScale: 1,   isVehicle: false, isHazard: true },

  // === MOON ===
  moonRock:      { tier: 1, points: 50,  anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  sunnyDragon:   { tier: 2, points: 250, anim: 'sunny-dragon-anim',     spriteKey: 'sunny-dragon',   baseScale: 1.0, isVehicle: false },
  bipedalUnit:   { tier: 2, points: 300, anim: 'bipedal-unit-anim',     spriteKey: 'bipedal-unit',   baseScale: 1.5, isVehicle: false, canThrow: true },
  moonCrystal:   { tier: 3, points: 500, anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },

  // === MARS ===
  marsSpire:     { tier: 1, points: 50,  anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  nightmare:     { tier: 2, points: 350, anim: 'nightmare-anim',        spriteKey: 'nightmare-idle', baseScale: 1.0, isVehicle: false },
  marsRuins:     { tier: 3, points: 500, anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },

  // === VENUS ===
  lavaRock:      { tier: 1, points: 50,  anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  terribleKnight:{ tier: 2, points: 300, anim: 'terrible-knight-anim',  spriteKey: 'terrible-knight-idle', baseScale: 1.2, isVehicle: false, canThrow: true },
  werewolf:      { tier: 2, points: 350, anim: 'werewolf-anim',         spriteKey: 'werewolf-idle',  baseScale: 1.5, isVehicle: false },
  venusTemple:   { tier: 3, points: 600, anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },

  // === NEPTUNE ===
  iceChunk:      { tier: 1, points: 50,  anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  grottoSnake:   { tier: 1, points: 150, anim: 'grotto-snake-anim',     spriteKey: 'grotto-snake-idle', baseScale: 2.5, isVehicle: false },
  grottoLizzard: { tier: 2, points: 250, anim: 'grotto-lizzard-anim',   spriteKey: 'grotto-lizzard-idle', baseScale: 2.0, isVehicle: false },
  ghost:         { tier: 2, points: 300, anim: 'ghost-anim',            spriteKey: 'ghost-idle',     baseScale: 1.5, isVehicle: false },

  // === UNIVERSE / MULTIVERSE ===
  asteroid:      { tier: 2, points: 200, anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  smallPlanet:   { tier: 3, points: 600, anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  galaxy:        { tier: 4, points: 1500,anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
  supercluster:  { tier: 5, points: 3000,anim: null,                    spriteKey: null,             baseScale: 1,   isVehicle: false },
};

// --- LEVEL CONFIGS ---
export const LEVELS = {
  // ===== EARTH =====
  'earth-1': {
    name: 'EARTH L1 — SUBURBS',
    planet: 'earth',
    spawns: [
      { type: 'tree', count: 18 },
      { type: 'bunny', count: 6 },
      { type: 'froggy', count: 5 },
      { type: 'mushroom', count: 4 },
      { type: 'detective', count: 4 },
      { type: 'crow', count: 5 },
    ],
    enemies: [],
    worldW: 2000, worldH: 1500,
  },
  'earth-2': {
    name: 'EARTH L2 — DOWNTOWN',
    planet: 'earth',
    spawns: [
      { type: 'tree', count: 10 },
      { type: 'bunny', count: 4 },
      { type: 'froggy', count: 3 },
      { type: 'mushroom', count: 3 },
      { type: 'detective', count: 6 },
      { type: 'crow', count: 3 },
      { type: 'carYellow', count: 4 },
      { type: 'carRed', count: 3 },
      { type: 'carPolice', count: 2 },
      { type: 'carTruck', count: 2 },
      { type: 'building', count: 3 },
    ],
    enemies: [
      { key: 'enemy-01', anim: 'enemy-01-anim', count: 3 },
    ],
    worldW: 2400, worldH: 1800,
  },
  'earth-3': {
    name: 'EARTH L3 — METROPOLIS',
    planet: 'earth',
    spawns: [
      { type: 'tree', count: 8 },
      { type: 'detective', count: 8 },
      { type: 'crow', count: 4 },
      { type: 'carYellow', count: 5 },
      { type: 'carRed', count: 4 },
      { type: 'carPolice', count: 3 },
      { type: 'carTruck', count: 3 },
      { type: 'building', count: 5 },
      { type: 'skyscraper', count: 3 },
    ],
    enemies: [
      { key: 'enemy-01', anim: 'enemy-01-anim', count: 3 },
      { key: 'enemy-02', anim: 'enemy-02-anim', count: 2 },
      { key: 'enemy-03', anim: 'enemy-03-anim', count: 2 },
    ],
    worldW: 2800, worldH: 2100,
  },

  // ===== MOON =====
  'moon-1': {
    name: 'MOON L1 — CRATERS',
    planet: 'moon',
    spawns: [
      { type: 'moonRock', count: 20 },
      { type: 'sunnyDragon', count: 4 },
      { type: 'bipedalUnit', count: 3 },
    ],
    enemies: [
      { key: 'alien-flying', anim: 'alien-flying-anim', count: 2 },
    ],
    worldW: 2000, worldH: 1500,
  },
  'moon-2': {
    name: 'MOON L2 — DARK SIDE',
    planet: 'moon',
    spawns: [
      { type: 'moonRock', count: 15 },
      { type: 'sunnyDragon', count: 5 },
      { type: 'bipedalUnit', count: 5 },
      { type: 'moonCrystal', count: 3 },
    ],
    enemies: [
      { key: 'alien-flying', anim: 'alien-flying-anim', count: 3 },
      { key: 'alien-walking-idle', anim: 'alien-walking-anim', count: 2 },
    ],
    worldW: 2400, worldH: 1800,
  },
  'moon-3': {
    name: 'MOON L3 — LUNAR BASE',
    planet: 'moon',
    spawns: [
      { type: 'moonRock', count: 10 },
      { type: 'sunnyDragon', count: 6 },
      { type: 'bipedalUnit', count: 6 },
      { type: 'moonCrystal', count: 5 },
    ],
    enemies: [
      { key: 'alien-flying', anim: 'alien-flying-anim', count: 4 },
      { key: 'alien-walking-idle', anim: 'alien-walking-anim', count: 3 },
    ],
    worldW: 2800, worldH: 2100,
  },

  // ===== MARS =====
  'mars-1': {
    name: 'MARS L1 — CANYONS',
    planet: 'mars',
    spawns: [
      { type: 'marsSpire', count: 20 },
      { type: 'nightmare', count: 4 },
    ],
    enemies: [
      { key: 'demon-idle', anim: 'demon-anim', count: 2 },
    ],
    worldW: 2200, worldH: 1600,
  },
  'mars-2': {
    name: 'MARS L2 — VOLCANOES',
    planet: 'mars',
    spawns: [
      { type: 'marsSpire', count: 14 },
      { type: 'nightmare', count: 6 },
      { type: 'marsRuins', count: 3 },
    ],
    enemies: [
      { key: 'demon-idle', anim: 'demon-anim', count: 3 },
      { key: 'fire-skull', anim: 'fire-skull-anim', count: 2 },
    ],
    worldW: 2600, worldH: 1900,
  },
  'mars-3': {
    name: 'MARS L3 — STORM',
    planet: 'mars',
    spawns: [
      { type: 'marsSpire', count: 10 },
      { type: 'nightmare', count: 8 },
      { type: 'marsRuins', count: 5 },
    ],
    enemies: [
      { key: 'demon-idle', anim: 'demon-anim', count: 3 },
      { key: 'fire-skull', anim: 'fire-skull-anim', count: 3 },
      { key: 'flying-eye-demon', anim: 'flying-eye-demon-anim', count: 2 },
    ],
    worldW: 3000, worldH: 2200,
  },

  // ===== VENUS =====
  'venus-1': {
    name: 'VENUS L1 — LAVA FIELDS',
    planet: 'venus',
    spawns: [
      { type: 'lavaRock', count: 18 },
      { type: 'terribleKnight', count: 4 },
      { type: 'werewolf', count: 3 },
    ],
    enemies: [
      { key: 'hell-beast-idle', anim: 'hell-beast-anim', count: 2 },
    ],
    worldW: 2200, worldH: 1600,
  },
  'venus-2': {
    name: 'VENUS L2 — ACID CLOUDS',
    planet: 'venus',
    spawns: [
      { type: 'lavaRock', count: 12 },
      { type: 'terribleKnight', count: 6 },
      { type: 'werewolf', count: 5 },
      { type: 'venusTemple', count: 3 },
    ],
    enemies: [
      { key: 'hell-beast-idle', anim: 'hell-beast-anim', count: 3 },
      { key: 'hell-hound-idle', anim: 'hell-hound-anim', count: 2 },
    ],
    worldW: 2600, worldH: 1900,
  },
  'venus-3': {
    name: 'VENUS L3 — INFERNO',
    planet: 'venus',
    spawns: [
      { type: 'lavaRock', count: 8 },
      { type: 'terribleKnight', count: 8 },
      { type: 'werewolf', count: 6 },
      { type: 'venusTemple', count: 5 },
    ],
    enemies: [
      { key: 'hell-beast-idle', anim: 'hell-beast-anim', count: 3 },
      { key: 'hell-hound-idle', anim: 'hell-hound-anim', count: 3 },
    ],
    worldW: 3000, worldH: 2200,
  },

  // ===== NEPTUNE =====
  'neptune-1': {
    name: 'NEPTUNE L1 — ICE CAVES',
    planet: 'neptune',
    spawns: [
      { type: 'iceChunk', count: 20 },
      { type: 'grottoSnake', count: 6 },
      { type: 'grottoLizzard', count: 4 },
    ],
    enemies: [
      { key: 'meerman', anim: 'meerman-anim', count: 2 },
      { key: 'enemy-ghost', anim: 'enemy-ghost-anim', count: 2 },
    ],
    worldW: 2200, worldH: 1600,
  },
  'neptune-2': {
    name: 'NEPTUNE L2 — DEEP OCEAN',
    planet: 'neptune',
    spawns: [
      { type: 'iceChunk', count: 14 },
      { type: 'grottoSnake', count: 8 },
      { type: 'grottoLizzard', count: 6 },
      { type: 'ghost', count: 4 },
    ],
    enemies: [
      { key: 'meerman', anim: 'meerman-anim', count: 3 },
      { key: 'mutant-toad-idle', anim: 'mutant-toad-anim', count: 2 },
      { key: 'enemy-ghost', anim: 'enemy-ghost-anim', count: 2 },
    ],
    worldW: 2600, worldH: 1900,
  },
  'neptune-3': {
    name: 'NEPTUNE L3 — FROZEN CORE',
    planet: 'neptune',
    spawns: [
      { type: 'iceChunk', count: 10 },
      { type: 'grottoSnake', count: 8 },
      { type: 'grottoLizzard', count: 6 },
      { type: 'ghost', count: 6 },
    ],
    enemies: [
      { key: 'meerman', anim: 'meerman-anim', count: 3 },
      { key: 'mutant-toad-idle', anim: 'mutant-toad-anim', count: 3 },
      { key: 'grotto-boss-idle', anim: 'grotto-boss-anim', count: 1 },
      { key: 'enemy-ghost', anim: 'enemy-ghost-anim', count: 3 },
    ],
    worldW: 3000, worldH: 2200,
  },

  // ===== UNIVERSE =====
  'universe-1': {
    name: 'THE UNIVERSE',
    planet: 'universe',
    startTier: 3,
    spawns: [
      { type: 'asteroid', count: 25 },
      { type: 'smallPlanet', count: 8 },
      { type: 'galaxy', count: 4 },
    ],
    enemies: [
      { key: 'enemy-01', anim: 'enemy-01-anim', count: 3 },
      { key: 'enemy-02', anim: 'enemy-02-anim', count: 3 },
      { key: 'enemy-03', anim: 'enemy-03-anim', count: 2 },
    ],
    worldW: 3500, worldH: 2600,
  },

  // ===== MULTIVERSE =====
  'multiverse-1': {
    name: 'THE MULTIVERSE',
    planet: 'multiverse',
    startTier: 4,
    spawns: [
      { type: 'asteroid', count: 20 },
      { type: 'smallPlanet', count: 10 },
      { type: 'galaxy', count: 8 },
      { type: 'supercluster', count: 3 },
    ],
    enemies: [
      { key: 'enemy-01', anim: 'enemy-01-anim', count: 4 },
      { key: 'enemy-02', anim: 'enemy-02-anim', count: 4 },
      { key: 'enemy-03', anim: 'enemy-03-anim', count: 4 },
    ],
    worldW: 4000, worldH: 3000,
  },
};

// --- LEVEL ORDER (progression sequence) ---
export const LEVEL_ORDER = [
  'earth-1', 'earth-2', 'earth-3',
  'moon-1', 'moon-2', 'moon-3',
  'mars-1', 'mars-2', 'mars-3',
  'venus-1', 'venus-2', 'venus-3',
  'neptune-1', 'neptune-2', 'neptune-3',
  'universe-1',
  'multiverse-1',
];

// --- HELPERS ---
export function getNextLevel(levelId) {
  const idx = LEVEL_ORDER.indexOf(levelId);
  if (idx === -1 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

export function getPlanetFromLevel(levelId) {
  return levelId.split('-')[0];
}

export function getAllLevelIds() {
  return [...LEVEL_ORDER];
}
