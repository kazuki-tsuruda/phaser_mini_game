import { GAME_CONFIG } from '../config/gameConfig.js';

// ====== プレイヤーマネージャークラス ======
export class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.targetX = 0;
    this.targetY = 0;
    this.energyMode = {
      active: false,
      count: 0,
      maxCount: 1000
    };
    this.init();
  }

  init() {
    this.player = this.scene.physics.add.sprite(
      this.scene.scale.width / 2, 
      this.scene.scale.height - 200, 
      'player'
    );
    this.player.setCollideWorldBounds(true);
    this.targetX = this.player.x;
    this.targetY = this.player.y;
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    this.updatePosition();
    this.updateEnergyMode();
  }

  updatePosition() {
    const deltaX = this.targetX - this.player.x;
    const deltaY = this.targetY - this.player.y;
    
    if (Math.abs(deltaX) > GAME_CONFIG.PLAYER_SPEED) {
      this.player.x += Math.sign(deltaX) * GAME_CONFIG.PLAYER_SPEED;
    } else {
      this.player.x = this.targetX;
    }
    
    if (Math.abs(deltaY) > GAME_CONFIG.PLAYER_SPEED) {
      this.player.y += Math.sign(deltaY) * GAME_CONFIG.PLAYER_SPEED;
    } else {
      this.player.y = this.targetY;
    }
  }

  updateEnergyMode() {
    if (this.energyMode.active && this.scene.gameState.isPlaying) {
      this.fireEnergyBullet();
    }
  }

  fireBullet() {
    if (!this.scene.gameState.isPlaying) return;
    
    const bullet = this.scene.bullets.create(this.player.x, this.player.y - 50, 'bullet');
    bullet.setVelocityY(-GAME_CONFIG.BULLET_SPEED);
  }

  fireEnergyBullet() {
    if (this.energyMode.count < this.energyMode.maxCount) {
      const bullet = this.scene.bullets.create(this.player.x, this.player.y - 50, 'bullet');
      bullet.setVelocityY(-GAME_CONFIG.ENERGY_BULLET_SPEED);
      this.energyMode.count++;
    } else {
      this.energyMode.active = false;
      this.energyMode.count = 0;
    }
  }

  activateEnergyMode() {
    this.energyMode.count = 0;
    this.energyMode.active = true;
  }

  setTint(color) {
    this.player.setTint(color);
  }

  getPosition() {
    return { x: this.player.x, y: this.player.y };
  }
}