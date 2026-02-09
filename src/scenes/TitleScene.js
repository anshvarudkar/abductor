import { getFurthestPlanet, PLANET_ORDER } from '../data/planets.js';
import { addVerticalSwipeNav, IS_TOUCH } from '../ui/TouchControls.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const cx = 400;

    // Starfield
    for (let i = 0; i < 80; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 3), 0xffffff, Math.random() * 0.7 + 0.3
      );
      this.tweens.add({ targets: star, alpha: star.alpha * 0.3, duration: Phaser.Math.Between(800, 2000), yoyo: true, repeat: -1 });
    }

    // Title
    const title = this.add.text(cx, 55, 'ABDUCTOR', {
      fontFamily: 'monospace', fontSize: '56px', color: '#00ff88', fontStyle: 'bold', stroke: '#003322', strokeThickness: 6
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 60, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(cx, 100, 'Abduct everything. Consume the universe.', {
      fontFamily: 'monospace', fontSize: '13px', color: '#55aa77'
    }).setOrigin(0.5);

    // HOW TO PLAY
    this.add.text(cx, 135, '- - -  HOW TO PLAY  - - -', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffdd44', fontStyle: 'bold'
    }).setOrigin(0.5);

    const controlsY = 160;
    this.add.text(cx, controlsY, 'CONTROLS', { fontFamily: 'monospace', fontSize: '14px', color: '#00ff88', fontStyle: 'bold' }).setOrigin(0.5);
    const controls = [
      ['WASD / Arrows', 'Move UFO'],
      ['Hold SPACE', 'Tractor beam (abduct)'],
      ['Z', 'Shoot enemies'],
      ['SHIFT', 'Shield (block attacks)'],
    ];
    controls.forEach((r, i) => {
      const y = controlsY + 18 + i * 16;
      this.add.text(210, y, r[0], { fontFamily: 'monospace', fontSize: '11px', color: '#88ddff' }).setOrigin(1, 0.5);
      this.add.text(225, y, r[1], { fontFamily: 'monospace', fontSize: '11px', color: '#aaaaaa' }).setOrigin(0, 0.5);
    });

    const objY = controlsY + 90;
    this.add.text(cx, objY, 'OBJECTIVE', { fontFamily: 'monospace', fontSize: '14px', color: '#00ff88', fontStyle: 'bold' }).setOrigin(0.5);
    const objectives = [
      'Fly over targets and hold SPACE to abduct them.',
      'Abduct small things first to GROW bigger.',
      'Bigger UFO can grab cars, then buildings!',
      'Shoot enemy starships. Use SHIELD for defense.',
      'Abduct all targets to complete each level.',
      'Conquer all 7 worlds to win the game!',
    ];
    objectives.forEach((l, i) => {
      this.add.text(cx, objY + 18 + i * 15, l, { fontFamily: 'monospace', fontSize: '10px', color: '#aaaaaa' }).setOrigin(0.5);
    });

    // UFO preview
    try {
      const ufo = this.add.sprite(70, 55, 'ufo').play('ufo-idle').setScale(2.5);
      this.tweens.add({ targets: ufo, x: 730, duration: 6000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } catch (e) {}

    // 3-option menu
    const menuY = 430;
    const menuItems = [
      { label: 'START', desc: 'Begin from planet select', action: () => { this.registry.set('runScore', 0); this.scene.start('PlanetSelectScene'); } },
      { label: 'CONTINUE', desc: 'Jump to furthest planet', action: () => { this.goToContinue(); } },
      { label: 'LEADERBOARD', desc: 'View high scores', action: () => { this.scene.start('LeaderboardScene'); } },
    ];

    const selected = { index: 0 };
    const menuTexts = [];
    const menuDescs = [];

    menuItems.forEach((item, i) => {
      const y = menuY + i * 35;
      const txt = this.add.text(cx, y, item.label, {
        fontFamily: 'monospace', fontSize: '20px', color: i === 0 ? '#00ff88' : '#666666', fontStyle: 'bold'
      }).setOrigin(0.5);
      menuTexts.push(txt);
      const desc = this.add.text(cx, y + 18, item.desc, {
        fontFamily: 'monospace', fontSize: '10px', color: '#444444'
      }).setOrigin(0.5);
      menuDescs.push(desc);
    });

    // Menu selector
    const selector = this.add.text(cx - 120, menuY, '\u25B6', {
      fontFamily: 'monospace', fontSize: '20px', color: '#00ff88'
    }).setOrigin(0.5);

    const updateMenu = () => {
      selector.y = menuY + selected.index * 35;
      menuTexts.forEach((t, i) => {
        t.setColor(i === selected.index ? '#00ff88' : '#666666');
      });
    };

    this.input.keyboard.on('keydown-UP', () => {
      selected.index = (selected.index - 1 + menuItems.length) % menuItems.length;
      updateMenu();
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      selected.index = (selected.index + 1) % menuItems.length;
      updateMenu();
    });
    this.input.keyboard.on('keydown-W', () => {
      selected.index = (selected.index - 1 + menuItems.length) % menuItems.length;
      updateMenu();
    });
    this.input.keyboard.on('keydown-S', () => {
      selected.index = (selected.index + 1) % menuItems.length;
      updateMenu();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      menuItems[selected.index].action();
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      menuItems[selected.index].action();
    });

    // Hint
    this.add.text(cx, 575, IS_TOUCH ? 'SWIPE UP/DOWN, TAP to select' : 'UP/DOWN + SPACE to select', {
      fontFamily: 'monospace', fontSize: '11px', color: '#333333'
    }).setOrigin(0.5);

    // Touch: swipe up/down to navigate, tap to select
    addVerticalSwipeNav(this, {
      onUp: () => { selected.index = (selected.index - 1 + menuItems.length) % menuItems.length; updateMenu(); },
      onDown: () => { selected.index = (selected.index + 1) % menuItems.length; updateMenu(); },
      onTap: () => { menuItems[selected.index].action(); }
    });
  }

  goToContinue() {
    const levelStars = this.registry.get('levelStars') || {};
    const furthest = getFurthestPlanet(levelStars);
    const idx = PLANET_ORDER.indexOf(furthest);
    this.scene.start('PlanetSelectScene', { startIndex: idx });
  }
}
