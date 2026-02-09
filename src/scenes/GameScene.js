// ============================================================
// GameScene — Milestone 3: Multi-Planet Support
// ============================================================

import { GROWTH_TIERS, TARGET_DEFS, LEVELS, getNextLevel, getPlanetFromLevel } from '../data/levels.js';
import { PLANETS } from '../data/planets.js';
import { createGameTouchControls } from '../ui/TouchControls.js';

const ROAD_WIDTH = 40;
const BLOCK_SIZE = 400;
const UFO_SPEED = 300;
const BEAM_HALF_ANGLE = 30 * (Math.PI / 180);
const MAX_HP = 100;
const SHIELD_DURATION = 800;
const SHIELD_COOLDOWN = 2000;
const SHOOT_COOLDOWN = 250;
const ENEMY_SHOOT_CD = 2500;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.currentLevel = data.level || 'earth-1';
    this.planet = getPlanetFromLevel(this.currentLevel);
  }

  create() {
    const cfg = LEVELS[this.currentLevel];
    if (!cfg) { this.scene.start('TitleScene'); return; }
    this.levelCfg = cfg;
    this.WW = cfg.worldW;
    this.WH = cfg.worldH;

    // State
    this.score = 0;
    this.growthPoints = 0;
    this.currentTierIndex = cfg.startTier ? Math.max(0, cfg.startTier - 1) : 0;
    this.totalTargets = 0;
    this.abductedCount = 0;
    this.beamActive = false;
    this.levelComplete = false;
    this.gameOver = false;
    this.hp = MAX_HP;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.shieldCooldownTimer = 0;
    this.lastShootTime = 0;
    this.invulnTimer = 0;

    this.physics.world.setBounds(0, 0, this.WW, this.WH);

    this.createEnvironment();
    this.createProceduralTextures();

    // Groups
    this.targets = this.add.group();
    this.enemies = this.add.group();
    this.playerBullets = this.add.group();
    this.enemyBullets = this.add.group();
    this.ambientParticles = this.add.group();

    this.spawnTargets();
    this.spawnEnemies();
    this.createUFO();
    this.createShieldSprite();

    this.beamGfx = this.add.graphics().setDepth(5);
    this.cameras.main.setBounds(0, 0, this.WW, this.WH);
    this.cameras.main.startFollow(this.ufo, true, 0.08, 0.08);

    this.createUI();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.shieldKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.createSounds();
    this.spawnAmbientParticles();

    // Touch controls (mobile/tablet only)
    this.touch = createGameTouchControls(this);

    // Level name flash
    const planetData = PLANETS[this.planet];
    const nameColor = planetData ? planetData.color : '#00ff88';
    const nameText = this.add.text(400, 300, cfg.name, {
      fontFamily: 'monospace', fontSize: '28px', color: nameColor, fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
    this.tweens.add({ targets: nameText, alpha: 0, y: 260, delay: 1500, duration: 800, onComplete: () => nameText.destroy() });
  }

  // ==========================================================
  // ENVIRONMENT DISPATCH
  // ==========================================================
  createEnvironment() {
    switch (this.planet) {
      case 'earth': this.createEarthCity(); break;
      case 'moon': this.createMoonTerrain(); break;
      case 'mars': this.createMarsTerrain(); break;
      case 'venus': this.createVenusTerrain(); break;
      case 'neptune': this.createNeptuneTerrain(); break;
      case 'universe': this.createUniverseSpace(); break;
      case 'multiverse': this.createMultiverseSpace(); break;
      default: this.createEarthCity();
    }
  }

  createEarthCity() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x2d5a1e, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    g.fillStyle(0x3a3a3a, 1);
    for (let x = BLOCK_SIZE; x < this.WW; x += BLOCK_SIZE) g.fillRect(x - ROAD_WIDTH / 2, 0, ROAD_WIDTH, this.WH);
    for (let y = BLOCK_SIZE; y < this.WH; y += BLOCK_SIZE) g.fillRect(0, y - ROAD_WIDTH / 2, this.WW, ROAD_WIDTH);
    g.fillStyle(0xcccc44, 1);
    for (let x = BLOCK_SIZE; x < this.WW; x += BLOCK_SIZE)
      for (let dy = 0; dy < this.WH; dy += 30) g.fillRect(x - 1, dy, 2, 15);
    for (let y = BLOCK_SIZE; y < this.WH; y += BLOCK_SIZE)
      for (let dx = 0; dx < this.WW; dx += 30) g.fillRect(dx, y - 1, 15, 2);
    g.fillStyle(0x666666, 1);
    for (let x = BLOCK_SIZE; x < this.WW; x += BLOCK_SIZE) {
      g.fillRect(x - ROAD_WIDTH / 2 - 8, 0, 8, this.WH);
      g.fillRect(x + ROAD_WIDTH / 2, 0, 8, this.WH);
    }
    for (let y = BLOCK_SIZE; y < this.WH; y += BLOCK_SIZE) {
      g.fillRect(0, y - ROAD_WIDTH / 2 - 8, this.WW, 8);
      g.fillRect(0, y + ROAD_WIDTH / 2, this.WW, 8);
    }
  }

  createMoonTerrain() {
    const g = this.add.graphics().setDepth(0);
    // Dark grey lunar surface
    g.fillStyle(0x333344, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Craters
    for (let i = 0; i < 40; i++) {
      const cx = Phaser.Math.Between(50, this.WW - 50);
      const cy = Phaser.Math.Between(50, this.WH - 50);
      const r = Phaser.Math.Between(20, 80);
      g.fillStyle(0x222233, 1);
      g.fillCircle(cx, cy, r);
      g.fillStyle(0x444455, 1);
      g.fillCircle(cx - r * 0.15, cy - r * 0.15, r * 0.85);
      g.lineStyle(1, 0x555566, 0.5);
      g.strokeCircle(cx, cy, r);
    }
    // Scattered moon dust spots
    for (let i = 0; i < 60; i++) {
      g.fillStyle(0x3a3a4a, 0.5);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(3, 12));
    }
    // Stars in the sky (visible from moon surface)
    for (let i = 0; i < 100; i++) {
      g.fillStyle(0xffffff, Math.random() * 0.3 + 0.1);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(1, 2));
    }
  }

  createMarsTerrain() {
    const g = this.add.graphics().setDepth(0);
    // Red-orange Martian ground
    g.fillStyle(0x551a0a, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Rocky terrain patches
    for (let i = 0; i < 50; i++) {
      const shades = [0x662211, 0x773322, 0x884433, 0x553311];
      g.fillStyle(shades[Phaser.Math.Between(0, 3)], 0.6);
      const x = Phaser.Math.Between(0, this.WW);
      const y = Phaser.Math.Between(0, this.WH);
      g.fillEllipse(x, y, Phaser.Math.Between(30, 120), Phaser.Math.Between(20, 60));
    }
    // Canyons / cracks
    for (let i = 0; i < 8; i++) {
      g.lineStyle(Phaser.Math.Between(2, 5), 0x330a00, 0.5);
      const sx = Phaser.Math.Between(0, this.WW);
      const sy = Phaser.Math.Between(0, this.WH);
      g.beginPath();
      g.moveTo(sx, sy);
      let cx = sx, cy = sy;
      for (let j = 0; j < 8; j++) {
        cx += Phaser.Math.Between(-80, 80);
        cy += Phaser.Math.Between(-80, 80);
        g.lineTo(cx, cy);
      }
      g.strokePath();
    }
    // Dust haze near bottom
    for (let i = 0; i < 30; i++) {
      g.fillStyle(0x995533, 0.15);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(40, 100));
    }
  }

  createVenusTerrain() {
    const g = this.add.graphics().setDepth(0);
    // Dark orange volcanic surface
    g.fillStyle(0x553300, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Lava rivers
    for (let i = 0; i < 6; i++) {
      g.lineStyle(Phaser.Math.Between(8, 20), 0xff4400, 0.4);
      const sx = Phaser.Math.Between(0, this.WW);
      const sy = Phaser.Math.Between(0, this.WH);
      g.beginPath();
      g.moveTo(sx, sy);
      let cx = sx, cy = sy;
      for (let j = 0; j < 10; j++) {
        cx += Phaser.Math.Between(-100, 100);
        cy += Phaser.Math.Between(-60, 100);
        g.lineTo(cx, cy);
      }
      g.strokePath();
    }
    // Lava pools
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, this.WW - 50);
      const y = Phaser.Math.Between(50, this.WH - 50);
      g.fillStyle(0xcc3300, 0.5);
      g.fillCircle(x, y, Phaser.Math.Between(15, 50));
      g.fillStyle(0xff6600, 0.3);
      g.fillCircle(x, y, Phaser.Math.Between(8, 25));
    }
    // Volcanic ash clouds
    for (let i = 0; i < 25; i++) {
      g.fillStyle(0x443322, 0.3);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(30, 80));
    }
  }

  createNeptuneTerrain() {
    const g = this.add.graphics().setDepth(0);
    // Deep blue ice surface
    g.fillStyle(0x0a1a44, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Ice formations
    for (let i = 0; i < 35; i++) {
      const x = Phaser.Math.Between(0, this.WW);
      const y = Phaser.Math.Between(0, this.WH);
      g.fillStyle(0x1133aa, 0.3);
      g.fillEllipse(x, y, Phaser.Math.Between(20, 80), Phaser.Math.Between(10, 40));
      g.fillStyle(0x4488ff, 0.15);
      g.fillEllipse(x - 5, y - 5, Phaser.Math.Between(10, 40), Phaser.Math.Between(5, 20));
    }
    // Frost cracks
    for (let i = 0; i < 12; i++) {
      g.lineStyle(1, 0x6699ff, 0.25);
      const sx = Phaser.Math.Between(0, this.WW);
      const sy = Phaser.Math.Between(0, this.WH);
      g.beginPath();
      g.moveTo(sx, sy);
      let cx = sx, cy = sy;
      for (let j = 0; j < 6; j++) {
        cx += Phaser.Math.Between(-60, 60);
        cy += Phaser.Math.Between(-60, 60);
        g.lineTo(cx, cy);
      }
      g.strokePath();
    }
    // Bubbles under ice
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3366cc, 0.2);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(3, 15));
    }
  }

  createUniverseSpace() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x0a0020, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Dense starfield
    for (let i = 0; i < 300; i++) {
      const brightness = Math.random();
      g.fillStyle(0xffffff, brightness * 0.6 + 0.1);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), brightness > 0.9 ? 2 : 1);
    }
    // Nebula patches
    const nebulaColors = [0x6622aa, 0x2244aa, 0xaa2266, 0x226688];
    for (let i = 0; i < 8; i++) {
      g.fillStyle(nebulaColors[i % nebulaColors.length], 0.08);
      g.fillCircle(Phaser.Math.Between(200, this.WW - 200), Phaser.Math.Between(200, this.WH - 200), Phaser.Math.Between(100, 300));
    }
    // Distant galaxies (small spirals)
    for (let i = 0; i < 5; i++) {
      const gx = Phaser.Math.Between(100, this.WW - 100);
      const gy = Phaser.Math.Between(100, this.WH - 100);
      g.fillStyle(0xaaaaff, 0.15);
      g.fillEllipse(gx, gy, Phaser.Math.Between(20, 60), Phaser.Math.Between(10, 30));
      g.fillStyle(0xffffff, 0.2);
      g.fillCircle(gx, gy, 3);
    }
  }

  createMultiverseSpace() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x200020, 1);
    g.fillRect(0, 0, this.WW, this.WH);
    // Multi-colored starfield
    const starColors = [0xff88ff, 0x88ffff, 0xffff88, 0xffffff, 0xff8888, 0x88ff88];
    for (let i = 0; i < 400; i++) {
      g.fillStyle(starColors[Phaser.Math.Between(0, starColors.length - 1)], Math.random() * 0.5 + 0.2);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Math.random() > 0.9 ? 2 : 1);
    }
    // Dimensional rifts
    for (let i = 0; i < 6; i++) {
      const rx = Phaser.Math.Between(100, this.WW - 100);
      const ry = Phaser.Math.Between(100, this.WH - 100);
      const riftColors = [0xff00ff, 0x00ffff, 0xffff00];
      for (let j = 3; j >= 0; j--) {
        g.fillStyle(riftColors[j % 3], 0.05 + j * 0.02);
        g.fillCircle(rx, ry, 40 + j * 25);
      }
    }
    // Nebula swirls
    for (let i = 0; i < 12; i++) {
      g.fillStyle([0x8800aa, 0xaa0088, 0x0088aa, 0xaa8800][i % 4], 0.06);
      g.fillCircle(Phaser.Math.Between(0, this.WW), Phaser.Math.Between(0, this.WH), Phaser.Math.Between(80, 250));
    }
  }

  createProceduralTextures() {
    // === EARTH TEXTURES ===
    if (!this.textures.exists('tree-tex')) {
      const tg = this.add.graphics();
      tg.fillStyle(0x1a7a1a, 1); tg.fillCircle(16, 12, 12);
      tg.fillStyle(0x228b22, 1); tg.fillCircle(16, 10, 10);
      tg.fillStyle(0x33aa33, 1); tg.fillCircle(14, 8, 6);
      tg.fillStyle(0x5c3a1e, 1); tg.fillRect(14, 20, 4, 8);
      tg.generateTexture('tree-tex', 32, 30); tg.destroy();
    }
    const colors = [0x8888aa, 0x777799, 0x9999bb];
    for (let i = 0; i < 3; i++) {
      if (this.textures.exists(`building-tex-${i}`)) continue;
      const bg = this.add.graphics();
      const w = 60 + i * 20, h = 50 + i * 15;
      bg.fillStyle(colors[i], 1); bg.fillRect(0, 0, w, h);
      bg.lineStyle(2, 0x444466, 1); bg.strokeRect(0, 0, w, h);
      bg.fillStyle(0xffffaa, 1);
      for (let wy = 8; wy < h - 8; wy += 12) for (let wx = 8; wx < w - 8; wx += 14) bg.fillRect(wx, wy, 6, 6);
      bg.generateTexture(`building-tex-${i}`, w, h); bg.destroy();
    }
    if (!this.textures.exists('skyscraper-tex')) {
      const sg = this.add.graphics();
      sg.fillStyle(0x556688, 1); sg.fillRect(0, 0, 70, 90);
      sg.lineStyle(2, 0x334466, 1); sg.strokeRect(0, 0, 70, 90);
      sg.fillStyle(0xaaddff, 0.8);
      for (let wy = 6; wy < 84; wy += 10) for (let wx = 6; wx < 64; wx += 10) sg.fillRect(wx, wy, 6, 6);
      sg.fillStyle(0xff4444, 1); sg.fillCircle(35, 5, 3);
      sg.generateTexture('skyscraper-tex', 70, 90); sg.destroy();
    }

    // === MOON TEXTURES ===
    if (!this.textures.exists('moon-rock-tex')) {
      const mr = this.add.graphics();
      mr.fillStyle(0x777788, 1); mr.fillCircle(12, 12, 10);
      mr.fillStyle(0x888899, 1); mr.fillCircle(10, 10, 7);
      mr.fillStyle(0x666677, 1); mr.fillCircle(14, 14, 4);
      mr.generateTexture('moon-rock-tex', 24, 24); mr.destroy();
    }
    if (!this.textures.exists('moon-crystal-tex')) {
      const mc = this.add.graphics();
      mc.fillStyle(0x88bbff, 0.8);
      mc.fillTriangle(20, 0, 0, 40, 40, 40);
      mc.fillStyle(0xaaddff, 0.6);
      mc.fillTriangle(20, 5, 8, 35, 32, 35);
      mc.lineStyle(1, 0xccddff, 0.5);
      mc.strokeTriangle(20, 0, 0, 40, 40, 40);
      mc.generateTexture('moon-crystal-tex', 40, 40); mc.destroy();
    }

    // === MARS TEXTURES ===
    if (!this.textures.exists('mars-spire-tex')) {
      const ms = this.add.graphics();
      ms.fillStyle(0x884422, 1);
      ms.fillTriangle(12, 0, 0, 30, 24, 30);
      ms.fillStyle(0x993322, 1);
      ms.fillTriangle(12, 4, 4, 28, 20, 28);
      ms.generateTexture('mars-spire-tex', 24, 30); ms.destroy();
    }
    if (!this.textures.exists('mars-ruins-tex')) {
      const ru = this.add.graphics();
      ru.fillStyle(0x664422, 1); ru.fillRect(0, 10, 50, 40);
      ru.fillStyle(0x553311, 1); ru.fillRect(5, 0, 15, 50); ru.fillRect(30, 5, 15, 45);
      ru.lineStyle(1, 0x443311, 1); ru.strokeRect(0, 10, 50, 40);
      ru.generateTexture('mars-ruins-tex', 50, 50); ru.destroy();
    }

    // === VENUS TEXTURES ===
    if (!this.textures.exists('lava-rock-tex')) {
      const lr = this.add.graphics();
      lr.fillStyle(0x663300, 1); lr.fillCircle(12, 12, 10);
      lr.fillStyle(0x884400, 1); lr.fillCircle(10, 10, 7);
      lr.fillStyle(0xff4400, 0.4); lr.fillCircle(12, 14, 5);
      lr.generateTexture('lava-rock-tex', 24, 24); lr.destroy();
    }
    if (!this.textures.exists('venus-temple-tex')) {
      const vt = this.add.graphics();
      vt.fillStyle(0x664400, 1); vt.fillRect(0, 15, 60, 45);
      vt.fillStyle(0x885500, 1);
      vt.fillTriangle(30, 0, 0, 20, 60, 20);
      vt.fillStyle(0x553300, 1);
      vt.fillRect(22, 25, 16, 35);
      vt.fillStyle(0xff6600, 0.3);
      vt.fillRect(24, 28, 12, 10);
      vt.generateTexture('venus-temple-tex', 60, 60); vt.destroy();
    }

    // === NEPTUNE TEXTURES ===
    if (!this.textures.exists('ice-chunk-tex')) {
      const ic = this.add.graphics();
      ic.fillStyle(0x4488cc, 0.8);
      ic.fillTriangle(10, 0, 0, 20, 20, 20);
      ic.fillStyle(0x66aadd, 0.6);
      ic.fillTriangle(10, 3, 3, 18, 17, 18);
      ic.generateTexture('ice-chunk-tex', 20, 20); ic.destroy();
    }

    // === UNIVERSE / MULTIVERSE TEXTURES ===
    if (!this.textures.exists('asteroid-tex')) {
      const at = this.add.graphics();
      at.fillStyle(0x666666, 1); at.fillCircle(16, 16, 14);
      at.fillStyle(0x555555, 1); at.fillCircle(12, 12, 8);
      at.fillStyle(0x444444, 1); at.fillCircle(18, 18, 5);
      at.generateTexture('asteroid-tex', 32, 32); at.destroy();
    }
    if (!this.textures.exists('small-planet-tex')) {
      const sp = this.add.graphics();
      sp.fillStyle(0x4488aa, 1); sp.fillCircle(24, 24, 22);
      sp.fillStyle(0x55aa88, 0.5); sp.fillCircle(20, 18, 12);
      sp.fillStyle(0x66ccaa, 0.3); sp.fillCircle(16, 14, 6);
      sp.lineStyle(1, 0x88ccdd, 0.4); sp.strokeCircle(24, 24, 22);
      sp.generateTexture('small-planet-tex', 48, 48); sp.destroy();
    }
    if (!this.textures.exists('galaxy-tex')) {
      const ga = this.add.graphics();
      ga.fillStyle(0x6633aa, 0.5); ga.fillEllipse(32, 32, 60, 30);
      ga.fillStyle(0x8855cc, 0.3); ga.fillEllipse(32, 32, 40, 20);
      ga.fillStyle(0xffffff, 0.6); ga.fillCircle(32, 32, 4);
      ga.fillStyle(0xccaaff, 0.2);
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 4;
        const r = 5 + i * 1.5;
        ga.fillCircle(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, 1);
      }
      ga.generateTexture('galaxy-tex', 64, 64); ga.destroy();
    }
    if (!this.textures.exists('supercluster-tex')) {
      const sc = this.add.graphics();
      sc.fillStyle(0xff44ff, 0.3); sc.fillCircle(40, 40, 38);
      sc.fillStyle(0xaa22aa, 0.4); sc.fillCircle(40, 40, 25);
      sc.fillStyle(0xffffff, 0.5); sc.fillCircle(40, 40, 8);
      for (let i = 0; i < 30; i++) {
        sc.fillStyle(0xffaaff, 0.3);
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 35;
        sc.fillCircle(40 + Math.cos(a) * r, 40 + Math.sin(a) * r, 2);
      }
      sc.generateTexture('supercluster-tex', 80, 80); sc.destroy();
    }
  }

  // ==========================================================
  // AMBIENT PARTICLES
  // ==========================================================
  spawnAmbientParticles() {
    const configs = {
      earth: { count: 0 },
      moon: { count: 15, color: 0x888899, sizeMin: 1, sizeMax: 3, speed: 8, label: 'dust' },
      mars: { count: 20, color: 0xff6633, sizeMin: 1, sizeMax: 3, speed: 15, label: 'ember' },
      venus: { count: 25, color: 0xff4400, sizeMin: 2, sizeMax: 4, speed: 20, label: 'ember' },
      neptune: { count: 20, color: 0x4488ff, sizeMin: 2, sizeMax: 5, speed: 10, label: 'bubble' },
      universe: { count: 10, color: 0xaaaaff, sizeMin: 1, sizeMax: 2, speed: 5, label: 'sparkle' },
      multiverse: { count: 15, color: 0xff88ff, sizeMin: 1, sizeMax: 3, speed: 8, label: 'sparkle' },
    };
    const cfg = configs[this.planet] || configs.earth;
    for (let i = 0; i < cfg.count; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, this.WW),
        Phaser.Math.Between(0, this.WH),
        Phaser.Math.Between(cfg.sizeMin, cfg.sizeMax),
        cfg.color, 0.4
      ).setDepth(3);
      p.setData('vx', (Math.random() - 0.5) * cfg.speed);
      p.setData('vy', (Math.random() - 0.5) * cfg.speed);
      p.setData('baseAlpha', 0.2 + Math.random() * 0.3);
      this.ambientParticles.add(p);
    }
  }

  updateAmbientParticles(dt) {
    const children = this.ambientParticles.getChildren();
    for (const p of children) {
      p.x += p.getData('vx') * dt;
      p.y += p.getData('vy') * dt;
      p.alpha = p.getData('baseAlpha') + Math.sin(this.time.now / 500 + p.x) * 0.15;
      if (p.x < -20) p.x = this.WW + 10;
      if (p.x > this.WW + 20) p.x = -10;
      if (p.y < -20) p.y = this.WH + 10;
      if (p.y > this.WH + 20) p.y = -10;
    }
  }

  // ==========================================================
  // SPAWNING
  // ==========================================================
  spawnTargets() {
    for (const s of this.levelCfg.spawns) {
      const def = TARGET_DEFS[s.type];
      for (let i = 0; i < s.count; i++) { this.spawnOneTarget(s.type, def); this.totalTargets++; }
    }
  }

  spawnOneTarget(type, def) {
    const pos = this.getSpawnPos(def.isVehicle);
    let sprite;
    // Procedural texture targets
    if (type === 'tree') {
      sprite = this.add.sprite(pos.x, pos.y, 'tree-tex').setScale(def.baseScale);
    } else if (type === 'building') {
      sprite = this.add.sprite(pos.x, pos.y, `building-tex-${Phaser.Math.Between(0, 2)}`).setScale(def.baseScale);
    } else if (type === 'skyscraper') {
      sprite = this.add.sprite(pos.x, pos.y, 'skyscraper-tex').setScale(1.5);
    } else if (type === 'moonRock') {
      sprite = this.add.sprite(pos.x, pos.y, 'moon-rock-tex').setScale(Phaser.Math.FloatBetween(0.8, 1.5));
    } else if (type === 'moonCrystal') {
      sprite = this.add.sprite(pos.x, pos.y, 'moon-crystal-tex').setScale(1.5);
    } else if (type === 'marsSpire') {
      sprite = this.add.sprite(pos.x, pos.y, 'mars-spire-tex').setScale(Phaser.Math.FloatBetween(1.0, 2.0));
    } else if (type === 'marsRuins') {
      sprite = this.add.sprite(pos.x, pos.y, 'mars-ruins-tex').setScale(1.2);
    } else if (type === 'lavaRock') {
      sprite = this.add.sprite(pos.x, pos.y, 'lava-rock-tex').setScale(Phaser.Math.FloatBetween(0.8, 1.5));
    } else if (type === 'venusTemple') {
      sprite = this.add.sprite(pos.x, pos.y, 'venus-temple-tex').setScale(1.3);
    } else if (type === 'iceChunk') {
      sprite = this.add.sprite(pos.x, pos.y, 'ice-chunk-tex').setScale(Phaser.Math.FloatBetween(1.0, 2.0));
    } else if (type === 'asteroid') {
      sprite = this.add.sprite(pos.x, pos.y, 'asteroid-tex').setScale(Phaser.Math.FloatBetween(0.8, 2.0));
    } else if (type === 'smallPlanet') {
      sprite = this.add.sprite(pos.x, pos.y, 'small-planet-tex').setScale(Phaser.Math.FloatBetween(1.0, 2.0));
    } else if (type === 'galaxy') {
      sprite = this.add.sprite(pos.x, pos.y, 'galaxy-tex').setScale(Phaser.Math.FloatBetween(1.0, 2.5));
    } else if (type === 'supercluster') {
      sprite = this.add.sprite(pos.x, pos.y, 'supercluster-tex').setScale(Phaser.Math.FloatBetween(1.5, 3.0));
    } else {
      // Spritesheet-based targets
      sprite = this.add.sprite(pos.x, pos.y, def.spriteKey).setScale(def.baseScale);
      if (def.anim) sprite.play(def.anim);
    }
    sprite.setDepth(2);
    sprite.setData('type', type);
    sprite.setData('tier', def.tier);
    sprite.setData('points', def.points);
    sprite.setData('beingAbducted', false);
    sprite.setData('abductProgress', 0);
    sprite.setData('canThrow', def.canThrow || false);
    sprite.setData('throwTimer', Phaser.Math.Between(2000, 5000));
    sprite.setData('isHazard', def.isHazard || false);
    sprite.setData('wanderTimer', Phaser.Math.Between(0, 2000));
    sprite.setData('wanderDirX', 0);
    sprite.setData('wanderDirY', 0);
    const isStatic = ['tree', 'building', 'skyscraper', 'moonRock', 'moonCrystal', 'marsSpire', 'marsRuins', 'lavaRock', 'venusTemple', 'iceChunk', 'asteroid', 'smallPlanet', 'galaxy', 'supercluster'].includes(type);
    sprite.setData('wanderSpeed', isStatic ? 0 : (def.isVehicle ? 60 : 30));
    this.targets.add(sprite);
  }

  getSpawnPos(isVehicle) {
    const m = 80;
    if (isVehicle && this.planet === 'earth') {
      if (Math.random() > 0.5) {
        return { x: (Math.floor(Math.random() * (this.WW / BLOCK_SIZE - 1)) + 1) * BLOCK_SIZE + Phaser.Math.Between(-15, 15), y: Phaser.Math.Between(m, this.WH - m) };
      }
      return { x: Phaser.Math.Between(m, this.WW - m), y: (Math.floor(Math.random() * (this.WH / BLOCK_SIZE - 1)) + 1) * BLOCK_SIZE + Phaser.Math.Between(-15, 15) };
    }
    return { x: Phaser.Math.Between(m, this.WW - m), y: Phaser.Math.Between(m, this.WH - m) };
  }

  isOnRoad(x, y) {
    if (this.planet !== 'earth') return false;
    for (let rx = BLOCK_SIZE; rx < this.WW; rx += BLOCK_SIZE) if (Math.abs(x - rx) < ROAD_WIDTH / 2 + 10) return true;
    for (let ry = BLOCK_SIZE; ry < this.WH; ry += BLOCK_SIZE) if (Math.abs(y - ry) < ROAD_WIDTH / 2 + 10) return true;
    return false;
  }

  spawnEnemies() {
    for (const ec of this.levelCfg.enemies) {
      for (let i = 0; i < ec.count; i++) {
        const ex = Phaser.Math.Between(100, this.WW - 100);
        const ey = Phaser.Math.Between(100, this.WH - 100);
        const enemy = this.add.sprite(ex, ey, ec.key).setScale(2).setDepth(8);
        enemy.play(ec.anim);
        enemy.setData('hp', 3);
        enemy.setData('speed', Phaser.Math.Between(80, 140));
        enemy.setData('dirX', Math.random() > 0.5 ? 1 : -1);
        enemy.setData('dirY', Math.random() > 0.5 ? 1 : -1);
        enemy.setData('changeTimer', Phaser.Math.Between(1500, 3000));
        enemy.setData('shootTimer', Phaser.Math.Between(1000, ENEMY_SHOOT_CD));
        enemy.setData('projectileType', this.getProjectileType());
        this.enemies.add(enemy);
      }
    }
  }

  getProjectileType() {
    switch (this.planet) {
      case 'mars': case 'venus': return 'fire-ball';
      case 'neptune': return 'electro-shock';
      default: return 'enemy-projectile';
    }
  }

  // ==========================================================
  // UFO & SHIELD
  // ==========================================================
  createUFO() {
    const startTier = GROWTH_TIERS[this.currentTierIndex];
    this.ufo = this.add.sprite(this.WW / 2, 300, 'ufo').play('ufo-idle').setScale(startTier.scale).setDepth(10);
    this.ufoShadow = this.add.ellipse(this.WW / 2, 340, 50, 20, 0x000000, 0.3).setDepth(1);
  }

  createShieldSprite() {
    this.shieldSprite = this.add.sprite(0, 0, 'energy-shield').play('shield-anim').setScale(2.5).setDepth(11).setVisible(false).setAlpha(0.7);
  }

  // ==========================================================
  // UI
  // ==========================================================
  createUI() {
    this.add.rectangle(10, 10, 202, 18, 0x222222).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.rectangle(11, 11, 200, 16, 0x000000).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.hpBar = this.add.rectangle(11, 11, 200, 16, 0x00ff44).setOrigin(0, 0).setScrollFactor(0).setDepth(101);
    this.hpText = this.add.text(112, 11, 'HP', { fontFamily: 'monospace', fontSize: '12px', color: '#ffffff' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(102);

    this.scoreText = this.add.text(790, 10, 'SCORE: 0', {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.tierText = this.add.text(10, 34, `TIER ${this.currentTierIndex + 1}`, {
      fontFamily: 'monospace', fontSize: '14px', color: '#00ff88', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);
    this.add.rectangle(10, 52, 152, 12, 0x222222).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.growthBar = this.add.rectangle(11, 53, 0, 10, 0x00ff88).setOrigin(0, 0).setScrollFactor(0).setDepth(101);

    this.targetsText = this.add.text(400, 10, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#aaaaaa', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    this.shieldCdText = this.add.text(790, 35, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#88ddff', stroke: '#000000', strokeThickness: 2
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    const hint = this.add.text(400, 585, 'SPACE=Beam  Z=Shoot  SHIFT=Shield  WASD=Move', {
      fontFamily: 'monospace', fontSize: '11px', color: '#444444'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(100);
    this.time.delayedCall(6000, () => { this.tweens.add({ targets: hint, alpha: 0, duration: 800 }); });
  }

  // ==========================================================
  // SOUNDS (planet-themed)
  // ==========================================================
  createSounds() {
    try { this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.audioCtx = null; }
  }

  getSfxProfile() {
    const profiles = {
      earth:      { wave: 'sine',     freqMul: 1.0 },
      moon:       { wave: 'sine',     freqMul: 0.7 },
      mars:       { wave: 'sawtooth', freqMul: 0.8 },
      venus:      { wave: 'sawtooth', freqMul: 1.2 },
      neptune:    { wave: 'triangle', freqMul: 0.9 },
      universe:   { wave: 'sine',     freqMul: 1.3 },
      multiverse: { wave: 'square',   freqMul: 1.5 },
    };
    return profiles[this.planet] || profiles.earth;
  }

  sfx(type) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const prof = this.getSfxProfile();
    if (type === 'absorb') { osc.type = prof.wave; osc.frequency.setValueAtTime(300 * prof.freqMul, t); osc.frequency.exponentialRampToValueAtTime(800 * prof.freqMul, t + 0.15); gain.gain.setValueAtTime(0.12, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2); osc.start(t); osc.stop(t + 0.2); }
    else if (type === 'shoot') { osc.type = 'square'; osc.frequency.setValueAtTime(600 * prof.freqMul, t); osc.frequency.exponentialRampToValueAtTime(200 * prof.freqMul, t + 0.1); gain.gain.setValueAtTime(0.08, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12); osc.start(t); osc.stop(t + 0.12); }
    else if (type === 'hit') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200 * prof.freqMul, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.15); gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2); osc.start(t); osc.stop(t + 0.2); }
    else if (type === 'shield') { osc.type = prof.wave; osc.frequency.setValueAtTime(800, t); osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1); gain.gain.setValueAtTime(0.06, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); osc.start(t); osc.stop(t + 0.15); }
    else if (type === 'explosion') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(30, t + 0.4); gain.gain.setValueAtTime(0.12, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5); osc.start(t); osc.stop(t + 0.5); }
    else if (type === 'damage') { osc.type = 'square'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(60, t + 0.2); gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
    else if (type === 'grow') { osc.type = 'square'; osc.frequency.setValueAtTime(200 * prof.freqMul, t); osc.frequency.exponentialRampToValueAtTime(1200 * prof.freqMul, t + 0.4); gain.gain.setValueAtTime(0.08, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5); osc.start(t); osc.stop(t + 0.5); }
  }

  beamSoundOn() {
    if (!this.audioCtx || this._bOsc) return;
    const ctx = this.audioCtx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const prof = this.getSfxProfile();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(80 * prof.freqMul, ctx.currentTime); g.gain.setValueAtTime(0.05, ctx.currentTime);
    o.start(ctx.currentTime); this._bOsc = o; this._bGain = g;
  }
  beamSoundOff() {
    if (this._bOsc) { try { this._bGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1); this._bOsc.stop(this.audioCtx.currentTime + 0.15); } catch (e) {} this._bOsc = null; this._bGain = null; }
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  update(time, delta) {
    if (this.levelComplete || this.gameOver) return;
    const dt = delta / 1000;
    this.handleInput(dt, time);
    this.updateBeam();
    this.updateTargets(dt, time);
    this.updateEnemies(dt, time);
    this.updateBullets(dt);
    this.updateShield(dt);
    this.updateAmbientParticles(dt);
    if (this.invulnTimer > 0) this.invulnTimer -= delta;
    this.updateUI();
    this.checkLevelComplete();
    this.checkGameOver();
  }

  // ==========================================================
  // INPUT
  // ==========================================================
  handleInput(dt, time) {
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    // Touch joystick input
    if (this.touch) {
      this.touch.updateShieldJustPressed();
      if (this.touch.vx !== 0 || this.touch.vy !== 0) {
        vx = this.touch.vx;
        vy = this.touch.vy;
      }
    }

    if (vx !== 0 && vy !== 0) { const m = 1 / Math.sqrt(vx * vx + vy * vy); vx *= m; vy *= m; }

    this.ufo.x = Phaser.Math.Clamp(this.ufo.x + vx * UFO_SPEED * dt, 30, this.WW - 30);
    this.ufo.y = Phaser.Math.Clamp(this.ufo.y + vy * UFO_SPEED * dt, 30, this.WH - 30);
    if (vx < 0) this.ufo.setFlipX(true); else if (vx > 0) this.ufo.setFlipX(false);

    this.ufoShadow.x = this.ufo.x;
    this.ufoShadow.y = this.ufo.y + 40;
    const tier = GROWTH_TIERS[this.currentTierIndex];
    this.ufoShadow.setSize(30 * tier.scale, 12 * tier.scale);

    this.beamActive = this.spaceKey.isDown || (this.touch && this.touch.beam);
    if (this.beamActive && !this._bWas) this.beamSoundOn();
    else if (!this.beamActive && this._bWas) this.beamSoundOff();
    this._bWas = this.beamActive;

    const shootDown = this.shootKey.isDown || (this.touch && this.touch.shoot);
    if (shootDown && time - this.lastShootTime > SHOOT_COOLDOWN) {
      this.lastShootTime = time;
      this.firePlayerBullet();
    }

    const shieldJust = Phaser.Input.Keyboard.JustDown(this.shieldKey) || (this.touch && this.touch.shieldJustPressed);
    if (shieldJust && this.shieldCooldownTimer <= 0 && !this.shieldActive) {
      this.activateShield();
    }
  }

  // ==========================================================
  // SHOOTING
  // ==========================================================
  firePlayerBullet() {
    const b = this.add.sprite(this.ufo.x, this.ufo.y + 30, 'bolt').play('bolt-anim').setScale(1.5).setDepth(6).setAngle(90);
    b.setData('vx', 0);
    b.setData('vy', 400);
    b.setData('damage', 1);
    this.playerBullets.add(b);
    this.sfx('shoot');
  }

  updateBullets(dt) {
    const pb = this.playerBullets.getChildren();
    for (let i = pb.length - 1; i >= 0; i--) {
      const b = pb[i];
      b.x += b.getData('vx') * dt;
      b.y += b.getData('vy') * dt;
      if (b.x < -50 || b.x > this.WW + 50 || b.y < -50 || b.y > this.WH + 50) { b.destroy(); continue; }
      const enemies = this.enemies.getChildren();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (!e.active) continue;
        const dist = Phaser.Math.Distance.Between(b.x, b.y, e.x, e.y);
        if (dist < 40) {
          this.hitEnemy(e);
          this.spawnHitFx(b.x, b.y);
          b.destroy();
          break;
        }
      }
    }

    const eb = this.enemyBullets.getChildren();
    for (let i = eb.length - 1; i >= 0; i--) {
      const b = eb[i];
      b.x += b.getData('vx') * dt;
      b.y += b.getData('vy') * dt;
      if (b.x < -50 || b.x > this.WW + 50 || b.y < -50 || b.y > this.WH + 50) { b.destroy(); continue; }
      const dist = Phaser.Math.Distance.Between(b.x, b.y, this.ufo.x, this.ufo.y);
      if (dist < 35 * GROWTH_TIERS[this.currentTierIndex].scale * 0.4) {
        if (this.shieldActive) {
          this.spawnHitFx(b.x, b.y);
          this.sfx('shield');
          b.destroy();
        } else {
          this.takeDamage(b.getData('damage') || 5);
          this.spawnHitFx(b.x, b.y);
          b.destroy();
        }
      }
    }
  }

  hitEnemy(enemy) {
    let hp = enemy.getData('hp') - 1;
    enemy.setData('hp', hp);
    enemy.setTint(0xff4444);
    this.time.delayedCall(100, () => { if (enemy.active) enemy.clearTint(); });
    this.sfx('hit');

    if (hp <= 0) {
      this.score += 300;
      this.sfx('explosion');
      const ex = this.add.sprite(enemy.x, enemy.y, 'enemy-explosion').play('enemy-explode-anim').setScale(2).setDepth(15);
      ex.once('animationcomplete', () => ex.destroy());
      enemy.destroy();
    }
  }

  spawnHitFx(x, y) {
    const fx = this.add.sprite(x, y, 'hit-spark').play('hit-spark-anim').setScale(2).setDepth(15);
    fx.once('animationcomplete', () => fx.destroy());
  }

  // ==========================================================
  // SHIELD
  // ==========================================================
  activateShield() {
    this.shieldActive = true;
    this.shieldTimer = SHIELD_DURATION;
    this.shieldSprite.setVisible(true);
    this.sfx('shield');
  }

  updateShield(dt) {
    if (this.shieldCooldownTimer > 0) this.shieldCooldownTimer -= dt * 1000;
    if (this.shieldActive) {
      this.shieldTimer -= dt * 1000;
      this.shieldSprite.setPosition(this.ufo.x, this.ufo.y);
      this.shieldSprite.setVisible(true);
      if (this.shieldTimer <= 0) {
        this.shieldActive = false;
        this.shieldSprite.setVisible(false);
        this.shieldCooldownTimer = SHIELD_COOLDOWN;
      }
    } else {
      this.shieldSprite.setVisible(false);
    }
  }

  // ==========================================================
  // DAMAGE & HEALTH
  // ==========================================================
  takeDamage(amount) {
    if (this.invulnTimer > 0) return;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnTimer = 500;
    this.sfx('damage');
    this.ufo.setTint(0xff0000);
    this.time.delayedCall(150, () => { if (this.ufo.active) this.ufo.clearTint(); });
    this.cameras.main.shake(150, 0.005);
  }

  // ==========================================================
  // BEAM
  // ==========================================================
  updateBeam() {
    this.beamGfx.clear();
    if (!this.beamActive) return;
    const tier = GROWTH_TIERS[this.currentTierIndex];
    const bLen = tier.beamLength;
    const ux = this.ufo.x, uy = this.ufo.y + 20;
    const lx = ux - Math.sin(BEAM_HALF_ANGLE) * bLen;
    const ly = uy + Math.cos(BEAM_HALF_ANGLE) * bLen;
    const rx = ux + Math.sin(BEAM_HALF_ANGLE) * bLen;
    const ry = uy + Math.cos(BEAM_HALF_ANGLE) * bLen;
    const pulse = 0.15 + 0.1 * Math.sin(this.time.now / 150);
    this.beamGfx.fillStyle(0x00ffaa, pulse * 0.5); this.beamGfx.fillTriangle(ux, uy, lx - 5, ly + 5, rx + 5, ry + 5);
    this.beamGfx.fillStyle(0x00ff88, pulse); this.beamGfx.fillTriangle(ux, uy, lx, ly, rx, ry);
    const ca = BEAM_HALF_ANGLE * 0.4;
    this.beamGfx.fillStyle(0xaaffdd, pulse * 1.5);
    this.beamGfx.fillTriangle(ux, uy, ux - Math.sin(ca) * bLen * 0.8, uy + Math.cos(ca) * bLen * 0.8, ux + Math.sin(ca) * bLen * 0.8, uy + Math.cos(ca) * bLen * 0.8);
    this.beamGfx.lineStyle(1, 0x00ff88, pulse * 2); this.beamGfx.lineBetween(ux, uy, lx, ly); this.beamGfx.lineBetween(ux, uy, rx, ry);
  }

  isInBeam(tx, ty) {
    const tier = GROWTH_TIERS[this.currentTierIndex];
    const ux = this.ufo.x, uy = this.ufo.y + 20;
    const dx = tx - ux, dy = ty - uy;
    if (dy < 0) return false;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > tier.beamLength || dist < 1) return dist < 1;
    return Math.atan2(Math.abs(dx), dy) <= BEAM_HALF_ANGLE;
  }

  // ==========================================================
  // TARGETS
  // ==========================================================
  updateTargets(dt, time) {
    const tier = GROWTH_TIERS[this.currentTierIndex];
    const children = this.targets.getChildren();
    for (let i = children.length - 1; i >= 0; i--) {
      const t = children[i];
      if (!t.active) continue;
      if (t.getData('beingAbducted')) { this.updateAbduction(t, dt); continue; }

      if (t.getData('isHazard') && !t.getData('beingAbducted')) {
        const dist = Phaser.Math.Distance.Between(this.ufo.x, this.ufo.y, t.x, t.y);
        if (dist < 50) { this.takeDamage(25); this.cameras.main.shake(300, 0.01); }
      }

      if (this.beamActive && this.isInBeam(t.x, t.y)) {
        if (t.getData('tier') <= tier.tier) {
          t.setData('beingAbducted', true);
          t.setData('abductProgress', 0);
          t.setTint(0x88ffbb);
        } else if (!t.getData('flashCd')) {
          t.setTint(0xff4444);
          t.setData('flashCd', true);
          this.time.delayedCall(300, () => { if (t.active) { t.clearTint(); t.setData('flashCd', false); } });
        }
      }

      if (t.getData('canThrow')) {
        let tt = t.getData('throwTimer') - dt * 1000;
        if (tt <= 0) {
          const distToUfo = Phaser.Math.Distance.Between(t.x, t.y, this.ufo.x, this.ufo.y);
          if (distToUfo < 300) {
            this.fireEnemyProjectile(t.x, t.y, this.ufo.x, this.ufo.y, 5);
          }
          tt = Phaser.Math.Between(2000, 4500);
        }
        t.setData('throwTimer', tt);
      }

      this.updateWander(t, dt);
    }
  }

  updateAbduction(t, dt) {
    let p = t.getData('abductProgress') + dt * 0.8;
    t.setData('abductProgress', p);
    const dx = this.ufo.x - t.x, dy = this.ufo.y - t.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 5) { const spd = 150 + p * 200; t.x += (dx / dist) * spd * dt; t.y += (dy / dist) * spd * dt; }
    const def = TARGET_DEFS[t.getData('type')];
    t.setScale((def ? def.baseScale : 1) * Math.max(0, 1 - p));
    t.angle += 360 * dt;
    t.setAlpha(Math.max(0, 1 - p * 0.5));
    if (p >= 1) {
      this.score += t.getData('points');
      this.growthPoints += t.getData('points');
      this.abductedCount++;
      this.sfx('absorb');
      this.createAbsorbFlash(t.x, t.y);
      t.destroy();
      this.checkGrowth();
    }
  }

  updateWander(t, dt) {
    const spd = t.getData('wanderSpeed');
    if (spd === 0) return;
    let timer = t.getData('wanderTimer') - dt * 1000;
    if (timer <= 0) {
      const a = Math.random() * Math.PI * 2;
      t.setData('wanderDirX', Math.cos(a));
      t.setData('wanderDirY', Math.sin(a));
      timer = Phaser.Math.Between(1500, 4000);
      t.setFlipX(t.getData('wanderDirX') < 0);
    }
    t.setData('wanderTimer', timer);
    const dx = t.getData('wanderDirX'), dy = t.getData('wanderDirY');
    t.x += dx * spd * dt; t.y += dy * spd * dt;
    if (t.x < 40 || t.x > this.WW - 40) { t.setData('wanderDirX', -dx); t.x = Phaser.Math.Clamp(t.x, 40, this.WW - 40); }
    if (t.y < 40 || t.y > this.WH - 40) { t.setData('wanderDirY', -dy); t.y = Phaser.Math.Clamp(t.y, 40, this.WH - 40); }
  }

  createAbsorbFlash(x, y) {
    for (let i = 0; i < 6; i++) {
      const p = this.add.circle(x, y, 4, 0x00ff88, 1).setDepth(15);
      const a = (i / 6) * Math.PI * 2;
      this.tweens.add({ targets: p, x: x + Math.cos(a) * 30, y: y + Math.sin(a) * 30, alpha: 0, scaleX: 0, scaleY: 0, duration: 300, ease: 'Power2', onComplete: () => p.destroy() });
    }
  }

  // ==========================================================
  // ENEMIES
  // ==========================================================
  updateEnemies(dt, time) {
    const enemies = this.enemies.getChildren();
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (!e.active) continue;
      const spd = e.getData('speed');
      let dx = e.getData('dirX'), dy = e.getData('dirY');

      e.x += dx * spd * dt;
      e.y += dy * spd * dt;

      let ct = e.getData('changeTimer') - dt * 1000;
      if (ct <= 0) {
        const toUfoX = this.ufo.x - e.x;
        const toUfoY = this.ufo.y - e.y;
        const mag = Math.sqrt(toUfoX * toUfoX + toUfoY * toUfoY) || 1;
        dx = toUfoX / mag + (Math.random() - 0.5) * 1.2;
        dy = toUfoY / mag + (Math.random() - 0.5) * 1.2;
        const nm = Math.sqrt(dx * dx + dy * dy) || 1;
        e.setData('dirX', dx / nm);
        e.setData('dirY', dy / nm);
        ct = Phaser.Math.Between(1500, 3500);
      }
      e.setData('changeTimer', ct);

      if (e.x < 50 || e.x > this.WW - 50) e.setData('dirX', -e.getData('dirX'));
      if (e.y < 50 || e.y > this.WH - 50) e.setData('dirY', -e.getData('dirY'));
      e.x = Phaser.Math.Clamp(e.x, 50, this.WW - 50);
      e.y = Phaser.Math.Clamp(e.y, 50, this.WH - 50);

      e.setFlipX(e.getData('dirX') < 0);

      let st = e.getData('shootTimer') - dt * 1000;
      if (st <= 0) {
        this.fireEnemyProjectile(e.x, e.y, this.ufo.x, this.ufo.y, 15, e.getData('projectileType'));
        st = ENEMY_SHOOT_CD + Phaser.Math.Between(-500, 500);
      }
      e.setData('shootTimer', st);

      const distToUfo = Phaser.Math.Distance.Between(e.x, e.y, this.ufo.x, this.ufo.y);
      if (distToUfo < 40) {
        this.takeDamage(10);
      }
    }
  }

  fireEnemyProjectile(fromX, fromY, toX, toY, damage, projType) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const speed = 200;
    const key = projType || 'enemy-projectile';
    const animMap = {
      'enemy-projectile': 'enemy-proj-anim',
      'fire-ball': 'fire-ball-anim',
      'electro-shock': 'electro-shock-anim',
    };
    const anim = animMap[key] || 'enemy-proj-anim';
    const b = this.add.sprite(fromX, fromY, key).setScale(2).setDepth(6);
    try { b.play(anim); } catch (e) {}
    b.setData('vx', Math.cos(angle) * speed);
    b.setData('vy', Math.sin(angle) * speed);
    b.setData('damage', damage);
    b.setRotation(angle);
    this.enemyBullets.add(b);
  }

  // ==========================================================
  // GROWTH
  // ==========================================================
  checkGrowth() {
    const ni = this.currentTierIndex + 1;
    if (ni >= GROWTH_TIERS.length) return;
    if (this.growthPoints >= GROWTH_TIERS[ni].threshold) {
      this.currentTierIndex = ni;
      const tier = GROWTH_TIERS[ni];
      this.tweens.add({ targets: this.ufo, scaleX: tier.scale, scaleY: tier.scale, duration: 500, ease: 'Back.easeOut' });
      this.sfx('grow');
      this.tierText.setText(`TIER ${tier.tier}`);
      this.tweens.add({ targets: this.tierText, scaleX: 1.5, scaleY: 1.5, duration: 200, yoyo: true });
      const msg = this.add.text(400, 300, `TIER ${tier.tier}!`, {
        fontFamily: 'monospace', fontSize: '36px', color: '#00ff88', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
      this.tweens.add({ targets: msg, y: 250, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 1000, onComplete: () => msg.destroy() });
    }
  }

  // ==========================================================
  // UI UPDATE
  // ==========================================================
  updateUI() {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.targetsText.setText(`TARGETS: ${this.totalTargets - this.abductedCount} remaining`);

    const pct = this.hp / MAX_HP;
    this.hpBar.width = 200 * pct;
    this.hpBar.fillColor = pct > 0.5 ? 0x00ff44 : pct > 0.25 ? 0xffaa00 : 0xff2222;
    this.hpText.setText(`HP: ${Math.ceil(this.hp)}`);

    const ci = this.currentTierIndex;
    const ct = GROWTH_TIERS[ci].threshold;
    const nt = ci < GROWTH_TIERS.length - 1 ? GROWTH_TIERS[ci + 1].threshold : ct;
    this.growthBar.width = nt === ct ? 150 : 150 * Phaser.Math.Clamp((this.growthPoints - ct) / (nt - ct), 0, 1);

    if (this.shieldCooldownTimer > 0) {
      this.shieldCdText.setText(`SHIELD: ${(this.shieldCooldownTimer / 1000).toFixed(1)}s`);
      this.shieldCdText.setColor('#666666');
    } else {
      this.shieldCdText.setText('SHIELD: READY');
      this.shieldCdText.setColor('#88ddff');
    }
  }

  // ==========================================================
  // WIN / LOSE
  // ==========================================================
  checkLevelComplete() {
    if (this.totalTargets - this.abductedCount <= 0 && !this.levelComplete) {
      this.levelComplete = true;
      this.beamSoundOff();
      this.time.delayedCall(1500, () => {
        this.scene.start('LevelCompleteScene', {
          score: this.score, totalTargets: this.totalTargets, abductedCount: this.abductedCount,
          level: this.currentLevel, healthPct: this.hp / MAX_HP
        });
      });
    }
  }

  checkGameOver() {
    if (this.hp <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.beamSoundOff();

      this.tweens.add({
        targets: this.ufo, angle: 720, scaleX: 0.5, scaleY: 0.5, alpha: 0.3,
        duration: 1000, ease: 'Power2'
      });

      for (let i = 0; i < 5; i++) {
        this.time.delayedCall(i * 200, () => {
          if (!this.ufo?.active) return;
          const ex = this.add.sprite(
            this.ufo.x + Phaser.Math.Between(-30, 30),
            this.ufo.y + Phaser.Math.Between(-30, 30),
            'explosion'
          ).play('explosion-anim').setScale(3).setDepth(20);
          ex.once('animationcomplete', () => ex.destroy());
        });
      }

      this.time.delayedCall(1500, () => {
        this.scene.start('GameOverScene', {
          score: this.score, level: this.currentLevel,
          abductedCount: this.abductedCount, totalTargets: this.totalTargets
        });
      });
    }
  }
}
