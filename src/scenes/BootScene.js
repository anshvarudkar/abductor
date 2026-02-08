import { LEVEL_ORDER } from '../data/levels.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const barBg = this.add.rectangle(w / 2, h / 2, 320, 30, 0x222222);
    const bar = this.add.rectangle(w / 2 - 155, h / 2, 0, 22, 0x00ff88).setOrigin(0, 0.5);
    this.add.text(w / 2, h / 2 - 40, 'LOADING...', {
      fontFamily: 'monospace', fontSize: '18px', color: '#00ff88'
    }).setOrigin(0.5);
    this.load.on('progress', (v) => { bar.width = 310 * v; });

    // === UFO ===
    this.load.spritesheet('ufo', '/assets/ufo/ufo-yellow.png', { frameWidth: 60, frameHeight: 48 });

    // === Earth Targets: Creatures ===
    this.load.spritesheet('bunny-idle', '/assets/targets/bunny-idle.png', { frameWidth: 24, frameHeight: 42 });
    this.load.spritesheet('bunny-run', '/assets/targets/bunny-run.png', { frameWidth: 34, frameHeight: 44 });
    this.load.spritesheet('froggy-walk', '/assets/targets/froggy-walk.png', { frameWidth: 42, frameHeight: 38 });
    this.load.spritesheet('detective-walk', '/assets/targets/detective-walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('mushroom-walk', '/assets/targets/mushroom-walk.png', { frameWidth: 41, frameHeight: 30 });
    this.load.spritesheet('crow-fly', '/assets/targets/crow-fly.png', { frameWidth: 48, frameHeight: 48 });

    // === Earth Targets: Vehicles ===
    this.load.image('car-police', '/assets/targets/car-police.png');
    this.load.image('car-yellow', '/assets/targets/car-yellow.png');
    this.load.image('car-red', '/assets/targets/car-red.png');
    this.load.image('car-truck', '/assets/targets/car-truck.png');

    // === Moon Targets ===
    this.load.spritesheet('sunny-dragon', '/assets/targets/sunny-dragon.png', { frameWidth: 192, frameHeight: 176 });
    this.load.spritesheet('bipedal-unit', '/assets/targets/bipedal-unit.png', { frameWidth: 80, frameHeight: 64 });

    // === Mars Targets ===
    this.load.spritesheet('nightmare-idle', '/assets/targets/nightmare-idle.png', { frameWidth: 160, frameHeight: 96 });

    // === Venus Targets ===
    this.load.spritesheet('terrible-knight-idle', '/assets/targets/terrible-knight-idle.png', { frameWidth: 128, frameHeight: 96 });
    this.load.spritesheet('werewolf-idle', '/assets/targets/werewolf-idle.png', { frameWidth: 96, frameHeight: 76 });

    // === Neptune Targets ===
    this.load.spritesheet('grotto-snake-idle', '/assets/targets/grotto-snake-idle.png', { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet('grotto-lizzard-idle', '/assets/targets/grotto-lizzard-idle.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('ghost-idle', '/assets/targets/ghost-idle.png', { frameWidth: 64, frameHeight: 80 });

    // === Environment ===
    this.load.image('tileset', '/assets/environment/tileset.png');
    this.load.image('buildings-bg', '/assets/environment/buildings-bg.png');
    this.load.image('skyline-a', '/assets/environment/skyline-a.png');

    // === Earth Enemies ===
    this.load.spritesheet('enemy-01', '/assets/enemies/enemy-01.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('enemy-02', '/assets/enemies/enemy-02.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('enemy-03', '/assets/enemies/enemy-03.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('enemy-explosion', '/assets/enemies/enemy-explosion.png', { frameWidth: 80, frameHeight: 80 });

    // === Moon Enemies ===
    this.load.spritesheet('alien-flying', '/assets/enemies/alien-flying.png', { frameWidth: 83, frameHeight: 64 });
    this.load.spritesheet('alien-walking-idle', '/assets/enemies/alien-walking-idle.png', { frameWidth: 48, frameHeight: 48 });

    // === Mars Enemies ===
    this.load.spritesheet('demon-idle', '/assets/enemies/demon-idle.png', { frameWidth: 160, frameHeight: 144 });
    this.load.spritesheet('fire-skull', '/assets/enemies/fire-skull.png', { frameWidth: 96, frameHeight: 112 });
    this.load.spritesheet('flying-eye-demon', '/assets/enemies/flying-eye-demon.png', { frameWidth: 48, frameHeight: 48 });

    // === Venus Enemies ===
    this.load.spritesheet('hell-beast-idle', '/assets/enemies/hell-beast-idle.png', { frameWidth: 80, frameHeight: 160 });
    this.load.spritesheet('hell-hound-idle', '/assets/enemies/hell-hound-idle.png', { frameWidth: 64, frameHeight: 48 });

    // === Neptune Enemies ===
    this.load.spritesheet('meerman', '/assets/enemies/meerman.png', { frameWidth: 27, frameHeight: 32 });
    this.load.spritesheet('mutant-toad-idle', '/assets/enemies/mutant-toad-idle.png', { frameWidth: 80, frameHeight: 64 });
    this.load.spritesheet('grotto-boss-idle', '/assets/enemies/grotto-boss-idle.png', { frameWidth: 144, frameHeight: 64 });
    this.load.spritesheet('enemy-ghost', '/assets/enemies/enemy-ghost.png', { frameWidth: 64, frameHeight: 64 });

    // === FX ===
    this.load.spritesheet('bolt', '/assets/fx/bolt.png', { frameWidth: 48, frameHeight: 32 });
    this.load.image('pulse', '/assets/fx/pulse.png');
    this.load.spritesheet('spark', '/assets/fx/spark.png', { frameWidth: 63, frameHeight: 32 });
    this.load.spritesheet('hit-spark', '/assets/fx/hit-spark.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('explosion', '/assets/fx/explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('enemy-projectile', '/assets/fx/enemy-projectile.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('energy-shield', '/assets/fx/energy-shield.png', { frameWidth: 51, frameHeight: 47 });
    this.load.spritesheet('hit-fx', '/assets/fx/hit.png', { frameWidth: 31, frameHeight: 32 });
    this.load.spritesheet('fire-ball', '/assets/fx/fire-ball.png', { frameWidth: 52, frameHeight: 29 });
    this.load.spritesheet('electro-shock', '/assets/fx/electro-shock.png', { frameWidth: 128, frameHeight: 96 });
    this.load.spritesheet('energy-smack', '/assets/fx/energy-smack.png', { frameWidth: 128, frameHeight: 96 });
  }

  create() {
    // --- Earth Target Animations ---
    this.anims.create({ key: 'ufo-idle', frames: this.anims.generateFrameNumbers('ufo', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'bunny-idle-anim', frames: this.anims.generateFrameNumbers('bunny-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'bunny-run-anim', frames: this.anims.generateFrameNumbers('bunny-run', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'froggy-walk-anim', frames: this.anims.generateFrameNumbers('froggy-walk', { start: 0, end: 9 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'detective-walk-anim', frames: this.anims.generateFrameNumbers('detective-walk', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'mushroom-walk-anim', frames: this.anims.generateFrameNumbers('mushroom-walk', { start: 0, end: 9 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'crow-fly-anim', frames: this.anims.generateFrameNumbers('crow-fly', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });

    // --- Moon Target Animations ---
    this.anims.create({ key: 'sunny-dragon-anim', frames: this.anims.generateFrameNumbers('sunny-dragon', { start: 0, end: 8 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'bipedal-unit-anim', frames: this.anims.generateFrameNumbers('bipedal-unit', { start: 0, end: 6 }), frameRate: 8, repeat: -1 });

    // --- Mars Target Animations ---
    this.anims.create({ key: 'nightmare-anim', frames: this.anims.generateFrameNumbers('nightmare-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });

    // --- Venus Target Animations ---
    this.anims.create({ key: 'terrible-knight-anim', frames: this.anims.generateFrameNumbers('terrible-knight-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'werewolf-anim', frames: this.anims.generateFrameNumbers('werewolf-idle', { start: 0, end: 4 }), frameRate: 6, repeat: -1 });

    // --- Neptune Target Animations ---
    this.anims.create({ key: 'grotto-snake-anim', frames: this.anims.generateFrameNumbers('grotto-snake-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'grotto-lizzard-anim', frames: this.anims.generateFrameNumbers('grotto-lizzard-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'ghost-anim', frames: this.anims.generateFrameNumbers('ghost-idle', { start: 0, end: 6 }), frameRate: 6, repeat: -1 });

    // --- Earth Enemy Animations ---
    this.anims.create({ key: 'enemy-01-anim', frames: this.anims.generateFrameNumbers('enemy-01', { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'enemy-02-anim', frames: this.anims.generateFrameNumbers('enemy-02', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'enemy-03-anim', frames: this.anims.generateFrameNumbers('enemy-03', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'enemy-explode-anim', frames: this.anims.generateFrameNumbers('enemy-explosion', { start: 0, end: 6 }), frameRate: 12, repeat: 0 });

    // --- Moon Enemy Animations ---
    this.anims.create({ key: 'alien-flying-anim', frames: this.anims.generateFrameNumbers('alien-flying', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alien-walking-anim', frames: this.anims.generateFrameNumbers('alien-walking-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });

    // --- Mars Enemy Animations ---
    this.anims.create({ key: 'demon-anim', frames: this.anims.generateFrameNumbers('demon-idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'fire-skull-anim', frames: this.anims.generateFrameNumbers('fire-skull', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'flying-eye-demon-anim', frames: this.anims.generateFrameNumbers('flying-eye-demon', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });

    // --- Venus Enemy Animations ---
    this.anims.create({ key: 'hell-beast-anim', frames: this.anims.generateFrameNumbers('hell-beast-idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'hell-hound-anim', frames: this.anims.generateFrameNumbers('hell-hound-idle', { start: 0, end: 10 }), frameRate: 10, repeat: -1 });

    // --- Neptune Enemy Animations ---
    this.anims.create({ key: 'meerman-anim', frames: this.anims.generateFrameNumbers('meerman', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: 'mutant-toad-anim', frames: this.anims.generateFrameNumbers('mutant-toad-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'grotto-boss-anim', frames: this.anims.generateFrameNumbers('grotto-boss-idle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'enemy-ghost-anim', frames: this.anims.generateFrameNumbers('enemy-ghost', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

    // --- FX Animations ---
    this.anims.create({ key: 'bolt-anim', frames: this.anims.generateFrameNumbers('bolt', { start: 0, end: 3 }), frameRate: 12, repeat: -1 });
    this.anims.create({ key: 'spark-anim', frames: this.anims.generateFrameNumbers('spark', { start: 0, end: 4 }), frameRate: 12, repeat: 0 });
    this.anims.create({ key: 'hit-spark-anim', frames: this.anims.generateFrameNumbers('hit-spark', { start: 0, end: 4 }), frameRate: 12, repeat: 0 });
    this.anims.create({ key: 'explosion-anim', frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }), frameRate: 12, repeat: 0 });
    this.anims.create({ key: 'enemy-proj-anim', frames: this.anims.generateFrameNumbers('enemy-projectile', { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'shield-anim', frames: this.anims.generateFrameNumbers('energy-shield', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'hit-fx-anim', frames: this.anims.generateFrameNumbers('hit-fx', { start: 0, end: 2 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'fire-ball-anim', frames: this.anims.generateFrameNumbers('fire-ball', { start: 0, end: 2 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'electro-shock-anim', frames: this.anims.generateFrameNumbers('electro-shock', { start: 0, end: 8 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'energy-smack-anim', frames: this.anims.generateFrameNumbers('energy-smack', { start: 0, end: 7 }), frameRate: 10, repeat: 0 });

    // Init game data registry — migrate old format if needed
    let levelStars = this.registry.get('levelStars');
    if (levelStars) {
      // Migration: convert old numeric keys { 1: 0, 2: 0, 3: 0 } to string IDs
      if (levelStars[1] !== undefined || levelStars['1'] !== undefined) {
        const old = levelStars;
        levelStars = {};
        for (const id of LEVEL_ORDER) levelStars[id] = 0;
        if (old[1] || old['1']) levelStars['earth-1'] = old[1] || old['1'];
        if (old[2] || old['2']) levelStars['earth-2'] = old[2] || old['2'];
        if (old[3] || old['3']) levelStars['earth-3'] = old[3] || old['3'];
        this.registry.set('levelStars', levelStars);
      }
    } else {
      levelStars = {};
      for (const id of LEVEL_ORDER) levelStars[id] = 0;
      this.registry.set('levelStars', levelStars);
    }

    // Init cumulative run score
    if (this.registry.get('runScore') === undefined) {
      this.registry.set('runScore', 0);
    }

    this.scene.start('TitleScene');
  }

}
