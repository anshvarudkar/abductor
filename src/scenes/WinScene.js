import { getTotalStars, getMaxTotalStars } from '../data/planets.js';

export class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.totalStars = data.stars || 0;
  }

  create() {
    const cx = 400;

    // Dark space background
    this.add.rectangle(cx, 300, 800, 600, 0x050510);

    // Starfield with multi-colors
    const starColors = [0xff88ff, 0x88ffff, 0xffff88, 0xffffff, 0x88ff88];
    for (let i = 0; i < 150; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 3),
        starColors[Phaser.Math.Between(0, starColors.length - 1)],
        Math.random() * 0.6 + 0.2
      );
      this.tweens.add({
        targets: s, alpha: s.alpha * 0.2,
        duration: Phaser.Math.Between(500, 2000), yoyo: true, repeat: -1
      });
    }

    // Dramatic title
    const line1 = this.add.text(cx, 100, 'YOU HAVE ALL OF SPACE', {
      fontFamily: 'monospace', fontSize: '28px', color: '#ffdd00', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    const line2 = this.add.text(cx, 140, 'TO YOURSELF', {
      fontFamily: 'monospace', fontSize: '42px', color: '#ff88ff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: line1, alpha: 1, y: 95, duration: 800, delay: 500 });
    this.tweens.add({ targets: line2, alpha: 1, y: 135, duration: 800, delay: 1000 });
    this.tweens.add({ targets: line2, scaleX: 1.02, scaleY: 1.02, duration: 2000, yoyo: true, repeat: -1, delay: 2000 });

    // Stats
    this.add.text(cx, 200, `FINAL SCORE: ${this.finalScore}`, {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: this.children.list[this.children.list.length - 1], alpha: 1, delay: 1500, duration: 500 });

    this.add.text(cx, 235, `Stars: ${this.totalStars} / ${getMaxTotalStars()}`, {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffdd00'
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: this.children.list[this.children.list.length - 1], alpha: 1, delay: 1800, duration: 500 });

    // Name entry
    this.add.text(cx, 290, 'ENTER YOUR NAME FOR THE LEADERBOARD', {
      fontFamily: 'monospace', fontSize: '14px', color: '#88ddff'
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: this.children.list[this.children.list.length - 1], alpha: 1, delay: 2200, duration: 500 });

    const nameChars = ['A', 'B', 'D', 'U', 'C', 'T', 'O', 'R'];
    let nameIndex = 0;
    const maxLen = 10;

    const nameDisplay = this.add.text(cx, 330, nameChars.join(''), {
      fontFamily: 'monospace', fontSize: '32px', color: '#00ff88', fontStyle: 'bold',
      stroke: '#003322', strokeThickness: 3
    }).setOrigin(0.5);

    const cursor = this.add.text(cx + nameDisplay.width / 2 + 5, 330, '_', {
      fontFamily: 'monospace', fontSize: '32px', color: '#00ff88'
    }).setOrigin(0, 0.5);
    this.tweens.add({ targets: cursor, alpha: 0, duration: 400, yoyo: true, repeat: -1 });

    const hint = this.add.text(cx, 370, 'TYPE YOUR NAME, THEN PRESS ENTER', {
      fontFamily: 'monospace', fontSize: '11px', color: '#555555'
    }).setOrigin(0.5);

    // Keyboard input for name
    this.input.keyboard.on('keydown', (event) => {
      const key = event.key;
      if (key === 'Enter') {
        const name = nameChars.join('').trim() || 'ANON';
        this.saveToLeaderboard(name);
        this.scene.start('LeaderboardScene');
        return;
      }
      if (key === 'Backspace') {
        if (nameChars.length > 0) {
          nameChars.pop();
          nameDisplay.setText(nameChars.join(''));
          cursor.x = cx + nameDisplay.width / 2 + 5;
        }
        return;
      }
      if (key.length === 1 && /[a-zA-Z0-9 ]/.test(key) && nameChars.length < maxLen) {
        nameChars.push(key.toUpperCase());
        nameDisplay.setText(nameChars.join(''));
        cursor.x = cx + nameDisplay.width / 2 + 5;
      }
    });

    // Skip name entry
    this.add.text(cx, 400, 'ESC = Skip to leaderboard', {
      fontFamily: 'monospace', fontSize: '10px', color: '#333333'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ESC', () => {
      const name = nameChars.join('').trim() || 'ANON';
      this.saveToLeaderboard(name);
      this.scene.start('LeaderboardScene');
    });

    // Victory sound
    this.playVictorySound();
  }

  saveToLeaderboard(name) {
    const entry = {
      name,
      score: this.finalScore,
      stars: this.totalStars,
      date: new Date().toISOString().split('T')[0],
    };

    let leaderboard = [];
    try {
      leaderboard = JSON.parse(localStorage.getItem('abductor-leaderboard') || '[]');
    } catch (e) {}

    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    try {
      localStorage.setItem('abductor-leaderboard', JSON.stringify(leaderboard));
    } catch (e) {}
  }

  playVictorySound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784, 880, 1047, 1175, 1319, 1568];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.4);
      });
    } catch (e) {}
  }
}
