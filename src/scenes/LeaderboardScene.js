export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

  create() {
    const cx = 400;

    // Background
    this.add.rectangle(cx, 300, 800, 600, 0x080818);

    // Stars
    for (let i = 0; i < 60; i++) {
      this.add.circle(
        Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.3 + 0.1
      );
    }

    this.add.text(cx, 40, 'LEADERBOARD', {
      fontFamily: 'monospace', fontSize: '36px', color: '#ffdd00', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, 75, 'TOP ABDUCTORS', {
      fontFamily: 'monospace', fontSize: '14px', color: '#888888'
    }).setOrigin(0.5);

    // Load leaderboard
    let leaderboard = [];
    try {
      leaderboard = JSON.parse(localStorage.getItem('abductor-leaderboard') || '[]');
    } catch (e) {}

    // Table header
    const headerY = 110;
    this.add.text(60, headerY, '#', { fontFamily: 'monospace', fontSize: '13px', color: '#555555' });
    this.add.text(100, headerY, 'NAME', { fontFamily: 'monospace', fontSize: '13px', color: '#555555' });
    this.add.text(350, headerY, 'SCORE', { fontFamily: 'monospace', fontSize: '13px', color: '#555555' });
    this.add.text(500, headerY, 'STARS', { fontFamily: 'monospace', fontSize: '13px', color: '#555555' });
    this.add.text(620, headerY, 'DATE', { fontFamily: 'monospace', fontSize: '13px', color: '#555555' });

    this.add.line(0, 0, 50, headerY + 18, 750, headerY + 18, 0x333333).setOrigin(0);

    // Table rows
    if (leaderboard.length === 0) {
      this.add.text(cx, 280, 'No entries yet!', {
        fontFamily: 'monospace', fontSize: '18px', color: '#444444'
      }).setOrigin(0.5);
      this.add.text(cx, 310, 'Complete the game to earn a spot.', {
        fontFamily: 'monospace', fontSize: '12px', color: '#333333'
      }).setOrigin(0.5);
    } else {
      const medalColors = ['#ffdd00', '#cccccc', '#cc8844'];
      leaderboard.forEach((entry, i) => {
        const y = 140 + i * 38;
        const color = i < 3 ? medalColors[i] : '#888888';
        const rankColor = i < 3 ? color : '#555555';

        // Rank
        this.add.text(68, y, `${i + 1}`, {
          fontFamily: 'monospace', fontSize: '16px', color: rankColor, fontStyle: i < 3 ? 'bold' : ''
        }).setOrigin(0.5);

        // Name
        this.add.text(100, y, entry.name || 'ANON', {
          fontFamily: 'monospace', fontSize: '16px', color: color, fontStyle: i === 0 ? 'bold' : ''
        });

        // Score
        this.add.text(350, y, `${entry.score || 0}`, {
          fontFamily: 'monospace', fontSize: '16px', color: '#ffffff'
        });

        // Stars
        this.add.text(500, y, `${entry.stars || 0}\u2605`, {
          fontFamily: 'monospace', fontSize: '16px', color: '#ffdd00'
        });

        // Date
        this.add.text(620, y, entry.date || '', {
          fontFamily: 'monospace', fontSize: '13px', color: '#555555'
        });
      });
    }

    // Navigation
    const backText = this.add.text(cx, 550, 'PRESS ESC OR SPACE FOR MENU', {
      fontFamily: 'monospace', fontSize: '14px', color: '#00ff88'
    }).setOrigin(0.5);
    this.tweens.add({ targets: backText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(cx, 575, 'C = Clear leaderboard', {
      fontFamily: 'monospace', fontSize: '10px', color: '#333333'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('TitleScene');
    });
    this.input.keyboard.on('keydown-C', () => {
      try { localStorage.removeItem('abductor-leaderboard'); } catch (e) {}
      this.scene.restart();
    });
  }
}
