// ============================================================
// Planet Data — Metadata and progression helpers
// ============================================================

import { LEVEL_ORDER, LEVELS } from './levels.js';

export const PLANETS = {
  earth:      { name: 'EARTH',      color: '#44bb44', bgColor: 0x2d5a1e, position: 0, radius: 30 },
  moon:       { name: 'MOON',       color: '#cccccc', bgColor: 0x333344, position: 1, radius: 18 },
  mars:       { name: 'MARS',       color: '#cc4422', bgColor: 0x551a0a, position: 2, radius: 26 },
  venus:      { name: 'VENUS',      color: '#ffaa33', bgColor: 0x553300, position: 3, radius: 28 },
  neptune:    { name: 'NEPTUNE',    color: '#3388ff', bgColor: 0x0a1a44, position: 4, radius: 32 },
  universe:   { name: 'UNIVERSE',   color: '#aa66ff', bgColor: 0x0a0020, position: 5, radius: 22 },
  multiverse: { name: 'MULTIVERSE', color: '#ff44ff', bgColor: 0x200020, position: 6, radius: 24 },
};

export const PLANET_ORDER = ['earth', 'moon', 'mars', 'venus', 'neptune', 'universe', 'multiverse'];

export function getPlanetLevels(planetKey) {
  return LEVEL_ORDER.filter(id => id.startsWith(planetKey + '-') || id === planetKey + '-1');
}

export function isLevelUnlocked(levelId, levelStars) {
  if (levelId === 'earth-1') return true;
  const idx = LEVEL_ORDER.indexOf(levelId);
  if (idx <= 0) return false;
  const prevLevel = LEVEL_ORDER[idx - 1];
  return (levelStars[prevLevel] || 0) > 0;
}

export function isPlanetUnlocked(planetKey, levelStars) {
  const levels = getPlanetLevels(planetKey);
  if (levels.length === 0) return false;
  return isLevelUnlocked(levels[0], levelStars);
}

export function getPlanetStars(planetKey, levelStars) {
  const levels = getPlanetLevels(planetKey);
  return levels.reduce((sum, id) => sum + (levelStars[id] || 0), 0);
}

export function getPlanetMaxStars(planetKey) {
  return getPlanetLevels(planetKey).length * 3;
}

export function getFurthestPlanet(levelStars) {
  for (let i = PLANET_ORDER.length - 1; i >= 0; i--) {
    if (isPlanetUnlocked(PLANET_ORDER[i], levelStars)) return PLANET_ORDER[i];
  }
  return 'earth';
}

export function getTotalStars(levelStars) {
  return Object.values(levelStars).reduce((a, b) => a + b, 0);
}

export function getMaxTotalStars() {
  return LEVEL_ORDER.length * 3; // 51
}
