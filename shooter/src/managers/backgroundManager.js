import { GAME_CONFIG } from '../config/gameConfig.js';

// ====== 背景マネージャークラス ======
export class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.backgrounds = [];
    this.init();
  }

  init() {
    this.backgrounds[0] = this.scene.add.sprite(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      'background'
    );
    
    this.backgrounds[1] = this.scene.add.sprite(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2 - this.scene.scale.height, 
      'background'
    );
  }

  update() {
    this.backgrounds.forEach((bg, index) => {
      bg.y += GAME_CONFIG.BACKGROUND_SCROLL_SPEED;
      
      if (bg.y > this.scene.scale.height * 1.5) {
        bg.y = this.scene.scale.height / 2 - this.scene.scale.height;
      }
    });
  }
}