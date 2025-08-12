// ====== メインエントリーポイント ======
import { TitleScene } from './scenes/titleScene.js';
import { MainScene } from './scenes/mainScene.js';

// ====== Phaser ゲーム設定 ======
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#808080',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-game',
    width: window.innerWidth,
    height: window.innerHeight
  },
  scene: [TitleScene, MainScene]
};

// ====== ゲーム初期化 ======
new Phaser.Game(config);
