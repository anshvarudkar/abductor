import { PLANETS, PLANET_ORDER, isPlanetUnlocked, getPlanetStars, getPlanetMaxStars, getTotalStars, getMaxTotalStars } from '../data/planets.js';

export class PlanetSelectScene extends Phaser.Scene {
  constructor() {
    super('PlanetSelectScene');
  }

  init(data) {
    this.startIndex = data?.startIndex || 0;
  }

  create() {
    const cx = 400;
    const levelStars = this.registry.get('levelStars') || {};

    // Starfield background
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.5 + 0.2
      );
      this.tweens.add({ targets: star, alpha: star.alpha * 0.3, duration: Phaser.Math.Between(1000, 3000), yoyo: true, repeat: -1 });
    }

    this.add.text(cx, 30, 'SELECT WORLD', {
      fontFamily: 'monospace', fontSize: '32px', color: '#00ff88', fontStyle: 'bold',
      stroke: '#003322', strokeThickness: 4
    }).setOrigin(0.5);

    // Total stars
    const totalStars = getTotalStars(levelStars);
    this.add.text(cx, 60, `Total Stars: ${totalStars} / ${getMaxTotalStars()}`, {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffdd00'
    }).setOrigin(0.5);

    // Planet positions — solar system orbital layout
    const selected = { index: this.startIndex };
    const planetNodes = [];
    const orbitCenterY = 310;
    const planetSpacing = 100;
    const startX = cx - ((PLANET_ORDER.length - 1) * planetSpacing) / 2;

    PLANET_ORDER.forEach((key, i) => {
      const pData = PLANETS[key];
      const unlocked = isPlanetUnlocked(key, levelStars);
      const px = startX + i * planetSpacing;
      const py = orbitCenterY + Math.sin(i * 0.7) * 30;

      // Orbit line connecting planets
      if (i > 0) {
        const prevX = startX + (i - 1) * planetSpacing;
        const prevY = orbitCenterY + Math.sin((i - 1) * 0.7) * 30;
        this.add.line(0, 0, prevX, prevY, px, py, unlocked ? 0x335533 : 0x222222, 0.5)
          .setOrigin(0);
      }

      // Planet circle
      const color = unlocked ? Phaser.Display.Color.HexStringToColor(pData.color).color : 0x333333;
      const planet = this.add.circle(px, py, pData.radius, color, unlocked ? 1 : 0.3);

      // Planet glow (for unlocked)
      if (unlocked) {
        const glow = this.add.circle(px, py, pData.radius + 5, color, 0.15);
        this.tweens.add({ targets: glow, scaleX: 1.3, scaleY: 1.3, alpha: 0, duration: 1500, repeat: -1 });
      }

      // Planet name
      this.add.text(px, py + pData.radius + 15, pData.name, {
        fontFamily: 'monospace', fontSize: '10px', color: unlocked ? pData.color : '#444444', fontStyle: 'bold'
      }).setOrigin(0.5);

      // Star count
      if (unlocked) {
        const pStars = getPlanetStars(key, levelStars);
        const pMax = getPlanetMaxStars(key);
        this.add.text(px, py + pData.radius + 28, `${pStars}/${pMax}\u2605`, {
          fontFamily: 'monospace', fontSize: '9px', color: '#ffdd00'
        }).setOrigin(0.5);
      } else {
        this.add.text(px, py + pData.radius + 28, 'LOCKED', {
          fontFamily: 'monospace', fontSize: '9px', color: '#444444'
        }).setOrigin(0.5);
      }

      planetNodes.push({ key, px, py, radius: pData.radius, unlocked });
    });

    // Selection ring
    const ring = this.add.circle(
      planetNodes[selected.index].px,
      planetNodes[selected.index].py,
      planetNodes[selected.index].radius + 10, 0x00ff88, 0
    ).setStrokeStyle(2, 0x00ff88);
    this.tweens.add({ targets: ring, scaleX: 1.1, scaleY: 1.1, alpha: 0.5, duration: 600, yoyo: true, repeat: -1 });

    // Info panel at bottom
    const infoPanel = this.add.rectangle(cx, 500, 500, 80, 0x111122, 0.8).setStrokeStyle(1, 0x334455);
    const infoName = this.add.text(cx, 480, '', { fontFamily: 'monospace', fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    const infoDesc = this.add.text(cx, 505, '', { fontFamily: 'monospace', fontSize: '12px', color: '#888888' }).setOrigin(0.5);
    const infoStatus = this.add.text(cx, 525, '', { fontFamily: 'monospace', fontSize: '11px', color: '#00ff88' }).setOrigin(0.5);

    const updateSelection = () => {
      const node = planetNodes[selected.index];
      ring.setPosition(node.px, node.py);
      ring.radius = node.radius + 10;

      const pData = PLANETS[node.key];
      infoName.setText(pData.name).setColor(pData.color);
      if (node.unlocked) {
        const pStars = getPlanetStars(node.key, levelStars);
        const pMax = getPlanetMaxStars(node.key);
        infoDesc.setText(`${pStars} / ${pMax} stars earned`);
        infoStatus.setText('PRESS SPACE TO ENTER').setColor('#00ff88');
      } else {
        infoDesc.setText('Complete previous world to unlock');
        infoStatus.setText('LOCKED').setColor('#ff4444');
      }
    };
    updateSelection();

    // Navigation
    this.input.keyboard.on('keydown-LEFT', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelection();
    });
    this.input.keyboard.on('keydown-RIGHT', () => {
      selected.index = Math.min(PLANET_ORDER.length - 1, selected.index + 1);
      updateSelection();
    });
    this.input.keyboard.on('keydown-A', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelection();
    });
    this.input.keyboard.on('keydown-D', () => {
      selected.index = Math.min(PLANET_ORDER.length - 1, selected.index + 1);
      updateSelection();
    });

    const enterPlanet = () => {
      const node = planetNodes[selected.index];
      if (node.unlocked) {
        this.scene.start('PlanetLevelSelectScene', { planet: node.key });
      }
    };

    this.input.keyboard.on('keydown-SPACE', enterPlanet);
    this.input.keyboard.on('keydown-ENTER', enterPlanet);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });

    // Hints
    this.add.text(cx, 575, 'LEFT/RIGHT to navigate  |  SPACE to enter  |  ESC for menu', {
      fontFamily: 'monospace', fontSize: '11px', color: '#444444'
    }).setOrigin(0.5);

    // UFO flying across
    try {
      const ufo = this.add.sprite(0, 80, 'ufo').play('ufo-idle').setScale(1.5);
      this.tweens.add({ targets: ufo, x: 800, duration: 8000, repeat: -1, delay: 1000 });
    } catch (e) {}
  }
}
