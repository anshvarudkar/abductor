import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { PlanetSelectScene } from './scenes/PlanetSelectScene.js';
import { PlanetLevelSelectScene } from './scenes/PlanetLevelSelectScene.js';
import { TransitionScene } from './scenes/TransitionScene.js';
import { GameScene } from './scenes/GameScene.js';
import { LevelCompleteScene } from './scenes/LevelCompleteScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { WinScene } from './scenes/WinScene.js';
import { LeaderboardScene } from './scenes/LeaderboardScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: true,
  input: {
    activePointers: 4,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    TitleScene,
    PlanetSelectScene,
    PlanetLevelSelectScene,
    TransitionScene,
    GameScene,
    LevelCompleteScene,
    GameOverScene,
    WinScene,
    LeaderboardScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
