// ====== UIマネージャークラス ======
export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.elements = {};
  }

  createScoreText() {
    this.elements.scoreText = this.scene.add.text(10, 10, 'スコア: 0', {
      fontSize: '48px',
      color: '#000000'
    });
    return this.elements.scoreText;
  }

  createTimeText() {
    this.elements.timeText = this.scene.add.text(this.scene.scale.width - 10, 10, 'けいか時間: 0', {
      fontSize: '48px',
      color: '#000000'
    }).setOrigin(1, 0);
    return this.elements.timeText;
  }

  createBossHealthUI() {
    const x = 300, y = 10;
    
    this.elements.bossHealthText = this.scene.add.text(x, y, '', {
      fontSize: '48px',
      color: '#FF8888'
    });

    this.elements.bossHealthBarBg = this.scene.add.rectangle(x, y + 70, 300, 20, 0x555555)
      .setOrigin(0, 0)
      .setVisible(false);

    this.elements.bossHealthBarFill = this.scene.add.rectangle(x, y + 70, 300, 20, 0xff4444)
      .setOrigin(0, 0)
      .setVisible(false);

    return {
      text: this.elements.bossHealthText,
      background: this.elements.bossHealthBarBg,
      fill: this.elements.bossHealthBarFill
    };
  }

  createGameOverText() {
    this.elements.gameOverText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      '', 
      {
        fontSize: '96px',
        color: '#FF0000'
      }
    ).setOrigin(0.5).setVisible(false);
    
    return this.elements.gameOverText;
  }

  updateScore(score) {
    this.elements.scoreText?.setText(`スコア: ${score}`);
  }

  updateTime(time) {
    this.elements.timeText?.setText(`けいか時間: ${time}`);
  }

  updateBossHealth(health, maxHealth) {
    const ratio = Phaser.Math.Clamp(health / maxHealth, 0, 1);
    
    if (health > 0) {
      this.elements.bossHealthText.setText(`ボス体力: ${health}`).setVisible(true);
      this.elements.bossHealthBarFill.width = 300 * ratio;
      this.elements.bossHealthBarBg.setVisible(true);
      this.elements.bossHealthBarFill.setVisible(true);
    } else {
      this.elements.bossHealthText.setVisible(false);
      this.elements.bossHealthBarBg.setVisible(false);
      this.elements.bossHealthBarFill.setVisible(false);
    }
  }
}