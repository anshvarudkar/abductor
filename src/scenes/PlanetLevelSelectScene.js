import { LEVELS, LEVEL_ORDER } from '../data/levels.js';
import { PLANETS, getPlanetLevels, isLevelUnlocked, getPlanetStars, getPlanetMaxStars } from '../data/planets.js';

export class PlanetLevelSelectScene extends Phaser.Scene {
  constructor() {
    super('PlanetLevelSelectScene');
  }

  init(data) {
    this.planetKey = data.planet || 'earth';
  }

  create() {
    const cx = 400;
    const planetData = PLANETS[this.planetKey];
    const levelStars = this.registry.get('levelStars') || {};
    const levels = getPlanetLevels(this.planetKey);

    // Background with planet tint
    this.add.rectangle(cx, 300, 800, 600, planetData.bgColor);

    // Starfield
    for (let i = 0; i < 50; i++) {
      this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.3 + 0.1
      );
    }

    // Planet icon
    const planetColor = Phaser.Display.Color.HexStringToColor(planetData.color).color;
    this.add.circle(70, 50, 25, planetColor, 0.8);
    this.add.circle(70, 50, 20, planetColor, 0.4);

    this.add.text(cx, 35, planetData.name, {
      fontFamily: 'monospace', fontSize: '36px', color: planetData.color, fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    // Star count
    const pStars = getPlanetStars(this.planetKey, levelStars);
    const pMax = getPlanetMaxStars(this.planetKey);
    this.add.text(cx, 70, `Stars: ${pStars} / ${pMax}`, {
      fontFamily: 'monospace', fontSize: '14px', color: '#ffdd00'
    }).setOrigin(0.5);

    const selected = { index: 0 };
    const cards = [];

    levels.forEach((levelId, i) => {
      const cfg = LEVELS[levelId];
      const unlocked = isLevelUnlocked(levelId, levelStars);
      const alpha = unlocked ? 1 : 0.35;
      const y = 130 + i * 140;

      // Card
      const card = this.add.rectangle(cx, y + 30, 600, 120, 0x111122, 0.8)
        .setStrokeStyle(2, unlocked ? planetColor : 0x333333)
        .setAlpha(alpha);
      cards.push(card);

      // Level name
      this.add.text(150, y - 10, cfg.name, {
        fontFamily: 'monospace', fontSize: '20px', color: planetData.color, fontStyle: 'bold'
      }).setAlpha(alpha);

      // Enemy/target summary
      const targetCount = cfg.spawns.reduce((s, sp) => s + sp.count, 0);
      const enemyCount = cfg.enemies.reduce((s, e) => s + e.count, 0);
      this.add.text(150, y + 18, `Targets: ${targetCount}  |  Enemies: ${enemyCount}  |  World: ${cfg.worldW}x${cfg.worldH}`, {
        fontFamily: 'monospace', fontSize: '11px', color: '#888888'
      }).setAlpha(alpha);

      // Stars earned
      const starCount = levelStars[levelId] || 0;
      for (let s = 0; s < 3; s++) {
        this.add.text(150 + s * 28, y + 40, '\u2605', {
          fontFamily: 'monospace', fontSize: '22px', color: s < starCount ? '#ffdd00' : '#333333'
        }).setAlpha(alpha);
      }

      // Lock icon
      if (!unlocked) {
        this.add.text(cx + 220, y + 20, 'LOCKED', {
          fontFamily: 'monospace', fontSize: '14px', color: '#555555'
        }).setOrigin(0.5).setAlpha(0.6);
      }
    });

    // Selection indicator
    const selector = this.add.rectangle(cx, 160, 610, 126, 0x000000, 0)
      .setStrokeStyle(3, planetColor);

    const updateSelector = () => {
      selector.y = 160 + selected.index * 140;
    };

    // Input
    this.input.keyboard.on('keydown-UP', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      selected.index = Math.min(levels.length - 1, selected.index + 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-W', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-S', () => {
      selected.index = Math.min(levels.length - 1, selected.index + 1);
      updateSelector();
    });

    const startLevel = () => {
      const levelId = levels[selected.index];
      if (isLevelUnlocked(levelId, levelStars)) {
        this.scene.start('TransitionScene', { level: levelId });
      }
    };

    this.input.keyboard.on('keydown-SPACE', startLevel);
    this.input.keyboard.on('keydown-ENTER', startLevel);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('PlanetSelectScene');
    });

    // Hints
    this.add.text(cx, 570, 'UP/DOWN to select  |  SPACE to play  |  ESC to go back', {
      fontFamily: 'monospace', fontSize: '12px', color: '#444444'
    }).setOrigin(0.5);
  }
}
