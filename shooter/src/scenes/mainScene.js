import { GAME_CONFIG } from '../config/gameConfig.js';
import { GameUtils } from '../utils/gameUtils.js';
import { GameState } from '../classes/gameState.js';
import { UIManager } from '../managers/uiManager.js';
import { BackgroundManager } from '../managers/backgroundManager.js';
import { PlayerManager } from '../managers/playerManager.js';
import { EnemyManager } from '../managers/enemyManager.js';

// ====== メインシーン ======
export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.initializeProperties();
  }

  initializeProperties() {
    this.gameState = new GameState();
    this.uiManager = null;
    this.backgroundManager = null;
    this.playerManager = null;
    this.enemyManager = null;
    
    // Physics groups
    this.bullets = null;
    this.enemies = null;
    this.enemyBoss = null;
    this.energies = null;
    
    this.continueButton = null;
  }

  preload() {
    const assets = [
      'background', 'player', 'bullet', 'energy', 'enemy', 
      'enemy2', 'enemyBoss', 'explosion', 'continueButton'
    ];
    
    assets.forEach(asset => {
      this.load.image(asset, `img/${asset}.png`);
    });
  }

  create() {
    this.resetGame();
    this.setupManagers();
    this.createPhysicsGroups();
    this.setupUI();
    this.setupInput();
    this.setupTimers();
    this.setupCollisions();
    this.startGame();
  }

  resetGame() {
    this.gameState = new GameState();
  }

  setupManagers() {
    this.backgroundManager = new BackgroundManager(this);
    this.playerManager = new PlayerManager(this);
    this.enemyManager = new EnemyManager(this);
    this.uiManager = new UIManager(this);
  }

  createPhysicsGroups() {
    this.bullets = this.physics.add.group();
    this.energies = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBoss = this.physics.add.group();
  }

  setupUI() {
    this.uiManager.createScoreText();
    this.uiManager.createTimeText();
    this.uiManager.createBossHealthUI();
    this.uiManager.createGameOverText();
    this.createContinueButton();
  }

  createContinueButton() {
    this.continueButton = this.add.sprite(
      this.scale.width / 2, 
      this.scale.height / 2 + 120, 
      'continueButton'
    )
      .setInteractive()
      .setOrigin(0.5)
      .setVisible(false);

    this.continueButton.on('pointerdown', () => {
      this.scene.start('TitleScene');
    });
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (this.gameState.isPlaying) {
        this.playerManager.setTarget(pointer.x, pointer.y);
        this.playerManager.fireBullet();
      }
    });
  }

  setupTimers() {
    // エネルギー缶生成
    this.time.addEvent({
      delay: GAME_CONFIG.ENERGY_SPAWN_RATE,
      callback: this.spawnEnergy,
      callbackScope: this,
      loop: true
    });

    // ボス出現
    this.time.addEvent({
      delay: GAME_CONFIG.ENEMY_BOSS_RATE,
      callback: () => this.enemyManager.spawnBoss(),
      callbackScope: this,
      loop: false
    });
  }

  setupCollisions() {
    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.bullets, this.enemyBoss, this.destroyEnemyBoss, null, this);
    this.physics.add.collider(this.playerManager.player, this.enemies, this.endGame, null, this);
    this.physics.add.collider(this.playerManager.player, this.enemyBoss, this.endGame, null, this);
    this.physics.add.overlap(this.playerManager.player, this.energies, this.collectEnergy, null, this);
  }

  startGame() {
    this.gameState.start(this.time.now);
  }

  update() {
    if (!this.gameState.isPlaying && !this.gameState.bossDefeated) return;

    if (this.gameState.bossDefeated) {
      this.handleGameClear();
      return;
    }

    this.backgroundManager.update();
    this.playerManager.update();
    this.enemyManager.update(this.time.now);
    this.updateUI();
  }

  updateUI() {
    this.uiManager.updateScore(this.gameState.score);
    this.uiManager.updateTime(this.gameState.getElapsedTime(this.time.now));
    
    const boss = this.enemyBoss.getFirstAlive();
    if (boss) {
      this.uiManager.updateBossHealth(boss.health, boss.maxHealth);
    } else {
      this.uiManager.updateBossHealth(0, 1);
    }
  }

  handleGameClear() {
    this.gameState.end();
    this.playerManager.setTint(0x00ff00);
    this.uiManager.elements.gameOverText.setText('ゲームクリア！').setVisible(true);
    this.physics.pause();
    this.continueButton.setVisible(true);
  }

  endGame() {
    this.gameState.end();
    this.playerManager.setTint(0xff0000);
    this.uiManager.elements.gameOverText.setText('ゲームオーバー').setVisible(true);
    this.physics.pause();
    this.continueButton.setVisible(true);
  }

  destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.health -= 1;
    
    if (enemy.health <= 0) {
      this.explodeEnemy(enemy);
      this.gameState.addScore(1);
    } else {
      enemy.setTint(0xff0000);
    }
  }

  destroyEnemyBoss(bullet, boss) {
    bullet.destroy();
    boss.health--;
    
    if (boss.health <= 0) {
      this.explodeBoss(boss);
      this.gameState.addScore(10);
    } else {
      boss.setTint(0xff0000);
    }
  }

  explodeEnemy(enemy) {
    enemy.setTexture('explosion');
    enemy.setTint(0xff0000);
    enemy.setVelocityY(0);
    this.time.delayedCall(300, () => enemy.destroy());
  }

  explodeBoss(boss) {
    boss.setTexture('explosion');
    boss.setVelocityX(0);
    this.time.delayedCall(300, () => {
      boss.destroy();
      this.gameState.defeatBoss();
    });
  }

  spawnEnergy() {
    const energy = this.energies.create(
      GameUtils.getRandomX(this), 
      -50, 
      'energy'
    );
    energy.setVelocityY(GAME_CONFIG.ENEMY_SPEED);
  }

  collectEnergy(player, energy) {
    energy.destroy();
    this.playerManager.activateEnergyMode();
  }
}