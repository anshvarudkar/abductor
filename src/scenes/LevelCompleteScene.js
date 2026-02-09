import { LEVEL_ORDER, getNextLevel, getPlanetFromLevel } from '../data/levels.js';
import { PLANETS, getTotalStars, getMaxTotalStars } from '../data/planets.js';
import { addMenuTouch, IS_TOUCH } from '../ui/TouchControls.js';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.totalTargets = data.totalTargets || 0;
    this.abductedCount = data.abductedCount || 0;
    this.currentLevel = data.level || 'earth-1';
    this.healthPct = data.healthPct || 1;
    this.planet = getPlanetFromLevel(this.currentLevel);
  }

  create() {
    const cx = 400;
    const planetData = PLANETS[this.planet];
    const planetColor = planetData ? planetData.color : '#00ff88';
    const planetName = planetData ? planetData.name : 'UNKNOWN';

    this.add.rectangle(cx, 300, 800, 600, 0x000000, 0.8);

    const title = this.add.text(cx, 90, 'LEVEL PASSED!', {
      fontFamily: 'monospace', fontSize: '44px', color: '#00ff88', fontStyle: 'bold',
      stroke: '#003322', strokeThickness: 4
    }).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: title, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });

    this.add.text(cx, 140, `${planetName} — ${this.currentLevel} Complete`, {
      fontFamily: 'monospace', fontSize: '16px', color: planetColor
    }).setOrigin(0.5);

    this.add.text(cx, 185, `SCORE: ${this.finalScore}`, {
      fontFamily: 'monospace', fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(cx, 220, `Abducted: ${this.abductedCount} / ${this.totalTargets}  |  HP: ${Math.round(this.healthPct * 100)}%`, {
      fontFamily: 'monospace', fontSize: '13px', color: '#aaaaaa'
    }).setOrigin(0.5);

    // Calculate & save stars
    const stars = this.calculateStars();
    const levelStars = this.registry.get('levelStars') || {};
    levelStars[this.currentLevel] = Math.max(levelStars[this.currentLevel] || 0, stars);
    this.registry.set('levelStars', levelStars);

    // Accumulate run score
    const runScore = (this.registry.get('runScore') || 0) + this.finalScore;
    this.registry.set('runScore', runScore);

    // Star display with animation
    const starY = 280;
    for (let i = 0; i < 3; i++) {
      const filled = i < stars;
      const s = this.add.text(cx - 60 + i * 60, starY, '\u2605', {
        fontFamily: 'monospace', fontSize: '50px', color: filled ? '#ffdd00' : '#333333'
      }).setOrigin(0.5).setScale(0);
      this.tweens.add({
        targets: s, scaleX: 1, scaleY: 1,
        duration: 300, ease: 'Back.easeOut', delay: 500 + i * 300
      });
    }

    // Star requirements
    const reqs = [
      { text: 'Complete the level', met: stars >= 1 },
      { text: 'Score 2000+ & HP > 25%', met: stars >= 2 },
      { text: 'Score 3000+ & HP > 50%', met: stars >= 3 },
    ];
    reqs.forEach((r, i) => {
      this.add.text(cx, 330 + i * 20, `${r.met ? '\u2713' : '\u2717'} ${i + 1}\u2605: ${r.text}`, {
        fontFamily: 'monospace', fontSize: '12px', color: r.met ? '#00ff88' : '#555555'
      }).setOrigin(0.5);
    });

    // Total stars
    const totalStars = getTotalStars(levelStars);
    this.add.text(cx, 395, `Total Stars: ${totalStars} / ${getMaxTotalStars()}`, {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffdd00'
    }).setOrigin(0.5);

    // Next level routing
    const nextLevel = getNextLevel(this.currentLevel);
    const optY = 430;

    let nextAction;
    if (nextLevel) {
      const nextPlanet = getPlanetFromLevel(nextLevel);
      const nextPlanetData = PLANETS[nextPlanet];
      const nextLabel = IS_TOUCH
        ? `TAP FOR ${nextPlanet !== this.planet ? nextPlanetData.name : nextLevel.toUpperCase()}`
        : `PRESS SPACE FOR ${nextPlanet !== this.planet ? nextPlanetData.name : nextLevel.toUpperCase()}`;

      const nextText = this.add.text(cx, optY, nextLabel, {
        fontFamily: 'monospace', fontSize: '18px', color: '#00ff88', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.tweens.add({ targets: nextText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

      nextAction = () => {
        if (nextPlanet !== this.planet) {
          this.scene.start('TransitionScene', { level: nextLevel });
        } else {
          this.scene.start('GameScene', { level: nextLevel });
        }
      };
      this.input.keyboard.once('keydown-SPACE', nextAction);
    } else {
      // After multiverse-1, go to WinScene
      const winText = this.add.text(cx, optY - 10, 'ALL WORLDS CONQUERED!', {
        fontFamily: 'monospace', fontSize: '20px', color: '#ffdd00', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.tweens.add({ targets: winText, alpha: 0.5, duration: 800, yoyo: true, repeat: -1 });

      const contText = this.add.text(cx, optY + 25, IS_TOUCH ? 'TAP TO CONTINUE' : 'PRESS SPACE TO CONTINUE', {
        fontFamily: 'monospace', fontSize: '16px', color: '#00ff88'
      }).setOrigin(0.5);
      this.tweens.add({ targets: contText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

      nextAction = () => {
        this.scene.start('WinScene', { score: runScore, stars: totalStars });
      };
      this.input.keyboard.once('keydown-SPACE', nextAction);
    }

    this.add.text(cx, optY + 60, 'R = Replay  |  P = Planet Select  |  M = Menu', {
      fontFamily: 'monospace', fontSize: '11px', color: '#555555'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => {
      this.scene.start('GameScene', { level: this.currentLevel });
    });
    this.input.keyboard.once('keydown-P', () => {
      this.scene.start('PlanetSelectScene');
    });
    this.input.keyboard.once('keydown-M', () => {
      this.scene.start('TitleScene');
    });

    // Touch buttons
    if (IS_TOUCH) {
      const btnY = optY + 100;
      const makeBtn = (x, label, color, action) => {
        const bg = this.add.rectangle(x, btnY, 120, 40, 0x000000, 0.6).setStrokeStyle(2, color);
        const txt = this.add.text(x, btnY, label, {
          fontFamily: 'monospace', fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        bg.setInteractive().on('pointerup', action);
      };
      makeBtn(cx, 'NEXT', 0x00ff88, nextAction);
      makeBtn(cx - 180, 'REPLAY', 0xffdd00, () => this.scene.start('GameScene', { level: this.currentLevel }));
      makeBtn(cx + 180, 'MENU', 0xff6644, () => this.scene.start('TitleScene'));
    }

    this.playLevelCompleteSound();
  }

  calculateStars() {
    let stars = 1;
    if (this.finalScore >= 2000 && this.healthPct > 0.25) stars = 2;
    if (this.finalScore >= 3000 && this.healthPct > 0.50) stars = 3;
    return stars;
  }

  playLevelCompleteSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch (e) {}
  }
}
