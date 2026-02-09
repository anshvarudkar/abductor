import { LEVELS, getPlanetFromLevel } from '../data/levels.js';
import { PLANETS } from '../data/planets.js';

export class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene');
  }

  init(data) {
    this.targetLevel = data.level || 'earth-1';
    this.planet = getPlanetFromLevel(this.targetLevel);
  }

  create() {
    const cx = 400;
    const cy = 300;
    const planetData = PLANETS[this.planet];
    const cfg = LEVELS[this.targetLevel];

    // Dark background
    this.add.rectangle(cx, cy, 800, 600, 0x000011);

    // Scrolling star field
    const stars = [];
    for (let i = 0; i < 120; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Math.random() * 0.6 + 0.2
      );
      s.setData('speed', Phaser.Math.Between(100, 400));
      stars.push(s);
    }

    // Update stars scrolling
    this.starUpdate = this.time.addEvent({
      delay: 16,
      callback: () => {
        for (const s of stars) {
          s.x -= s.getData('speed') * 0.016;
          if (s.x < -10) s.x = 810;
        }
      },
      loop: true
    });

    // Planet name swoops in
    const planetColor = planetData ? planetData.color : '#00ff88';
    const nameText = this.add.text(-300, cy - 40, planetData ? planetData.name : 'UNKNOWN', {
      fontFamily: 'monospace', fontSize: '52px', color: planetColor, fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: nameText,
      x: cx,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // Level name fades in below
    const levelText = this.add.text(cx, cy + 30, cfg ? cfg.name : '', {
      fontFamily: 'monospace', fontSize: '18px', color: '#aaaaaa',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: levelText,
      alpha: 1,
      delay: 400,
      duration: 400,
    });

    // UFO flies across
    try {
      const ufo = this.add.sprite(-80, cy + 100, 'ufo').play('ufo-idle').setScale(2);
      this.tweens.add({
        targets: ufo,
        x: 880,
        y: cy + 60,
        duration: 2000,
        ease: 'Sine.easeInOut',
        delay: 300
      });
    } catch (e) {}

    // Planet icon
    if (planetData) {
      const pColor = Phaser.Display.Color.HexStringToColor(planetData.color).color;
      const planetIcon = this.add.circle(cx, cy - 120, 40, pColor, 0.8).setAlpha(0);
      this.tweens.add({
        targets: planetIcon,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        delay: 200,
        duration: 500,
        ease: 'Sine.easeOut',
        yoyo: true,
        hold: 500
      });
    }

    // Auto-transition to GameScene after 2.5 seconds
    this.time.delayedCall(2500, () => {
      this.scene.start('GameScene', { level: this.targetLevel });
    });

    // Allow skip with SPACE or tap
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { level: this.targetLevel });
    });
    this.input.once('pointerup', () => {
      this.scene.start('GameScene', { level: this.targetLevel });
    });
  }
}
