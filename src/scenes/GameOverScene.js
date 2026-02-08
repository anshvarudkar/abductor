import { getPlanetFromLevel } from '../data/levels.js';
import { PLANETS } from '../data/planets.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.currentLevel = data.level || 'earth-1';
    this.abductedCount = data.abductedCount || 0;
    this.totalTargets = data.totalTargets || 0;
    this.planet = getPlanetFromLevel(this.currentLevel);
  }

  create() {
    const cx = 400;
    const planetData = PLANETS[this.planet];
    const planetName = planetData ? planetData.name : 'UNKNOWN';

    this.add.rectangle(cx, 300, 800, 600, 0x110000);

    // Starfield
    for (let i = 0; i < 30; i++) {
      this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.2
      );
    }

    const title = this.add.text(cx, 120, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '56px', color: '#ff3333', fontStyle: 'bold',
      stroke: '#330000', strokeThickness: 6
    }).setOrigin(0.5).setScale(0);
    this.tweens.add({
      targets: title, scaleX: 1, scaleY: 1,
      duration: 500, ease: 'Back.easeOut'
    });

    this.add.text(cx, 180, 'Your UFO was destroyed!', {
      fontFamily: 'monospace', fontSize: '14px', color: '#aa6666'
    }).setOrigin(0.5);

    this.add.text(cx, 240, `SCORE: ${this.finalScore}`, {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(cx, 275, `Level: ${planetName} — ${this.currentLevel}`, {
      fontFamily: 'monospace', fontSize: '16px', color: planetData ? planetData.color : '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(cx, 305, `Abducted: ${this.abductedCount} / ${this.totalTargets}`, {
      fontFamily: 'monospace', fontSize: '14px', color: '#888888'
    }).setOrigin(0.5);

    // Explosion particles
    for (let i = 0; i < 12; i++) {
      const p = this.add.circle(cx, 120, Phaser.Math.Between(3, 8), 0xff4400, 0.8);
      const angle = (i / 12) * Math.PI * 2;
      const dist = Phaser.Math.Between(80, 200);
      this.tweens.add({
        targets: p,
        x: cx + Math.cos(angle) * dist,
        y: 120 + Math.sin(angle) * dist,
        alpha: 0, scaleX: 0, scaleY: 0,
        duration: 1500, ease: 'Power2',
        delay: 200
      });
    }

    const retryText = this.add.text(cx, 400, 'PRESS SPACE TO RETRY', {
      fontFamily: 'monospace', fontSize: '20px', color: '#ff6644', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.tweens.add({ targets: retryText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(cx, 440, 'M = Menu  |  P = Planet Select', {
      fontFamily: 'monospace', fontSize: '12px', color: '#666666'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { level: this.currentLevel });
    });
    this.input.keyboard.once('keydown-M', () => {
      this.scene.start('TitleScene');
    });
    this.input.keyboard.once('keydown-P', () => {
      this.scene.start('PlanetSelectScene');
    });

    this.playGameOverSound();
  }

  playGameOverSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [440, 370, 311, 261];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.4);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 0.4);
      });
    } catch (e) {}
  }
}
