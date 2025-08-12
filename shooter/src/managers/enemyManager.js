import { GAME_CONFIG, ENEMY_TYPES } from '../config/gameConfig.js';
import { GameUtils } from '../utils/gameUtils.js';

// ====== 敵マネージャークラス ======
export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.spawnRate = GAME_CONFIG.ENEMY_SPAWN_RATE;
    this.nextSpawnTime = 0;
    this.bossSpawned = false;
  }

  update(currentTime) {
    if (!this.scene.gameState.isPlaying) return;

    // 通常敵の生成
    if (currentTime > this.nextSpawnTime) {
      this.spawnEnemy();
      this.updateSpawnRate(currentTime);
      this.nextSpawnTime = currentTime + this.spawnRate;
    }

    // ボスの移動更新
    this.updateBossMovement();
  }

  spawnEnemy() {
    const enemyType = Math.random() < 0.5 ? ENEMY_TYPES.BASIC : ENEMY_TYPES.STRONG;
    const enemy = this.scene.enemies.create(
      GameUtils.getRandomX(this.scene), 
      -50, 
      enemyType.texture
    );
    
    enemy.health = enemyType.health;
    enemy.setVelocityY(GAME_CONFIG.ENEMY_SPEED);
  }

  spawnBoss() {
    if (this.bossSpawned) return;
    
    const difficulty = GameUtils.getDifficultySettings();
    const boss = this.scene.enemyBoss.create(
      this.scene.scale.width / 2, 
      0, 
      'enemyBoss'
    );
    
    boss.health = difficulty.bossHealth;
    boss.maxHealth = difficulty.bossHealth;
    boss.setVelocityY(GAME_CONFIG.BOSS_SPEED);
    this.bossSpawned = true;
  }

  updateSpawnRate(currentTime) {
    if (currentTime > GAME_CONFIG.ENEMY_SPAWN_RATE_REDUCTION_TIME) {
      this.spawnRate = GAME_CONFIG.ENEMY_SPAWN_RATE2;
    }
  }

  updateBossMovement() {
    this.scene.enemyBoss.getChildren().forEach(boss => {
      if (boss.body.velocity.x === 0 && boss.body.velocity.y === 0) {
        boss.setVelocity(
          GameUtils.getRandomBetween(-100, 100),
          GameUtils.getRandomBetween(-100, 100)
        );
      }

      // 画面端での反転
      this.handleBossScreenBounds(boss);
      
      // 最小速度の保証
      boss.setVelocityX(GameUtils.clampVelocity(boss.body.velocity.x, 50));
      boss.setVelocityY(GameUtils.clampVelocity(boss.body.velocity.y, 50));
    });
  }

  handleBossScreenBounds(boss) {
    const bounds = {
      left: boss.width / 2,
      right: this.scene.scale.width - boss.width / 2,
      top: boss.height / 2,
      bottom: this.scene.scale.height - boss.height / 2
    };

    if (boss.x >= bounds.right) {
      boss.setVelocityX(-GameUtils.getRandomBetween(50, 100));
    } else if (boss.x <= bounds.left) {
      boss.setVelocityX(GameUtils.getRandomBetween(50, 100));
    }

    if (boss.y >= bounds.bottom) {
      boss.setVelocityY(-GameUtils.getRandomBetween(50, 100));
    } else if (boss.y <= bounds.top) {
      boss.setVelocityY(GameUtils.getRandomBetween(50, 100));
    }
  }
}