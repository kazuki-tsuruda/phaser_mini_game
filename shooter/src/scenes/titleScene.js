// ====== タイトルシーン ======
import { ScoreManager } from '../managers/scoreManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
    this.scoreManager = new ScoreManager();
  }

  preload() {
    this.load.image('background', 'img/background.png');
    this.load.image('startButton', 'img/startButton.png');
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createBestScoreDisplay();
    this.setupDifficultySelector();
    this.createStartButton();
  }

  createBackground() {
    this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'background');
  }

  createTitle() {
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 180, 'シューター', {
      fontSize: '64px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
  }

  createBestScoreDisplay() {
    const bestScore = this.scoreManager.getBestScore();
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, `ベストスコア: ${bestScore}`, {
      fontSize: '32px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  setupDifficultySelector() {
    const selector = document.getElementById("strength");
    if (selector) {
      selector.disabled = false;
      selector.options[1].selected = true; // デフォルトで「ふつう」を選択
    }
  }

  createStartButton() {
    const startButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'startButton')
      .setInteractive()
      .setOrigin(0.5);

    startButton.on('pointerdown', () => {
      const selector = document.getElementById("strength");
      if (selector) {
        selector.disabled = true;
      }
      this.scene.start('MainScene');
    });
  }
}