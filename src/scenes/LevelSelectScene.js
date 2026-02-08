const LEVEL_INFO = [
  { id: 1, name: 'EARTH L1 - SUBURBS', desc: 'Trees, creatures, and people. No enemies.', color: '#66cc66' },
  { id: 2, name: 'EARTH L2 - DOWNTOWN', desc: 'Cars and starships join the fight.', color: '#66aacc' },
  { id: 3, name: 'EARTH L3 - METROPOLIS', desc: 'Skyscrapers, heavy resistance.', color: '#cc66aa' },
];

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    const cx = 400;
    const stars = this.registry.get('levelStars') || { 1: 0, 2: 0, 3: 0 };

    // Starfield
    for (let i = 0; i < 50; i++) {
      this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.5 + 0.2
      );
    }

    this.add.text(cx, 40, 'SELECT LEVEL', {
      fontFamily: 'monospace', fontSize: '32px', color: '#00ff88', fontStyle: 'bold', stroke: '#003322', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, 75, 'EARTH CAMPAIGN', {
      fontFamily: 'monospace', fontSize: '14px', color: '#888888'
    }).setOrigin(0.5);

    const selected = { index: 0 };
    const cards = [];

    LEVEL_INFO.forEach((lvl, i) => {
      const y = 140 + i * 140;
      const unlocked = i === 0 || stars[i] > 0; // Level 1 always open, others need prev star
      const alpha = unlocked ? 1 : 0.35;

      // Card background
      const card = this.add.rectangle(cx, y + 30, 600, 120, 0x111122, 0.8)
        .setStrokeStyle(2, unlocked ? 0x00ff88 : 0x333333)
        .setAlpha(alpha);
      cards.push(card);

      // Level name
      this.add.text(150, y - 10, lvl.name, {
        fontFamily: 'monospace', fontSize: '20px', color: lvl.color, fontStyle: 'bold'
      }).setAlpha(alpha);

      // Description
      this.add.text(150, y + 18, lvl.desc, {
        fontFamily: 'monospace', fontSize: '12px', color: '#aaaaaa'
      }).setAlpha(alpha);

      // Stars earned
      const starCount = stars[lvl.id] || 0;
      for (let s = 0; s < 3; s++) {
        this.add.text(150 + s * 28, y + 42, '\u2605', {
          fontFamily: 'monospace', fontSize: '22px', color: s < starCount ? '#ffdd00' : '#333333'
        }).setAlpha(alpha);
      }

      // Lock icon
      if (!unlocked) {
        this.add.text(cx + 220, y + 20, '\u{1f512}', {
          fontFamily: 'monospace', fontSize: '30px', color: '#555555'
        }).setOrigin(0.5).setAlpha(0.6);
      }

      // Best score
      if (starCount > 0) {
        this.add.text(650, y + 42, `BEST: ${starCount}\u2605`, {
          fontFamily: 'monospace', fontSize: '12px', color: '#ffdd00'
        }).setOrigin(1, 0).setAlpha(alpha);
      }
    });

    // Selection indicator
    const selector = this.add.rectangle(cx, 170, 610, 126, 0x00ff88, 0)
      .setStrokeStyle(3, 0x00ff88);

    const updateSelector = () => {
      selector.y = 170 + selected.index * 140;
    };

    // Input
    this.input.keyboard.on('keydown-UP', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      selected.index = Math.min(2, selected.index + 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-W', () => {
      selected.index = Math.max(0, selected.index - 1);
      updateSelector();
    });
    this.input.keyboard.on('keydown-S', () => {
      selected.index = Math.min(2, selected.index + 1);
      updateSelector();
    });

    const startLevel = () => {
      const lvlId = selected.index + 1;
      const unlocked = lvlId === 1 || stars[lvlId - 1] > 0;
      if (unlocked) {
        this.scene.start('GameScene', { level: lvlId });
      }
    };

    this.input.keyboard.on('keydown-SPACE', startLevel);
    this.input.keyboard.on('keydown-ENTER', startLevel);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });

    // Hints
    this.add.text(cx, 570, 'UP/DOWN to select  |  SPACE to play  |  ESC for menu', {
      fontFamily: 'monospace', fontSize: '12px', color: '#555555'
    }).setOrigin(0.5);

    // Total stars
    const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
    this.add.text(cx, 545, `Total Stars: ${totalStars} / 9`, {
      fontFamily: 'monospace', fontSize: '14px', color: '#ffdd00'
    }).setOrigin(0.5);
  }
}
