import { DIFFICULTY_SETTINGS } from '../config/gameConfig.js';

// ====== ユーティリティクラス ======
export class GameUtils {
  /**
   * 敵機生成用にランダムなX座標を取得する
   * @param {Phaser.Scene} scene - 現在のシーン
   * @returns {number} - ランダムなX座標
   * @description
   * 指定されたシーンの幅内でランダムなX座標を取得します。
   * 敵機の生成位置をランダム化するために使用されます。
   */
  static getRandomX(scene) {  
    return Phaser.Math.Between(0, scene.scale.width);
  }

  /**
   * ボス敵機生成用に指定範囲内でランダムな座標を取得する
   * @param {Phaser.Scene} scene - 現在のシーン
   * @returns {Object} - ランダムな座標オブジェクト { x, y }
   * @description
   * 指定されたシーンの幅内でランダムなX座標と、画面上部からのY座標を取得します。
   * ボス敵機の生成位置をランダム化するために使用されます。
   */
  static getRandomBetween(min, max) { 
    return Phaser.Math.Between(min, max);
  }

  /**
   * ボス敵機の移動速度を制限する
   * @param {*} velocity - 現在の移動速度  
   * @param {*} min - 最小速度
   * @returns {number} - 制限された移動速度
   * @description
   * 指定された速度が最小速度未満の場合、最小速度に調整します。
   * それ以外の場合は、元の速度を返します。
   * ボス敵機の移動速度を制限するために使用されます
   * @example
   * const limitedVelocity = GameUtils.clampVelocity(currentVelocity, 50);
   * currentVelocityが50未満の場合、limitedVelocityは50になります。
   * それ以外の場合は、currentVelocityがそのまま返されます
   */
  static clampVelocity(velocity, min) {
    return Math.abs(velocity) < min ? (velocity > 0 ? min : -min) : velocity;
  }

  /**
   * 難易度設定を取得する
   * @returns {Object} - 選択された難易度の設定
   * @description 
   * HTMLのセレクトボックスから選択された難易度に基づいて、対応する難易度設定を返します。
   * セレクトボックスの値が存在しない場合は、デフォルトの'normal'難易度設定を返します。
   */
  static getDifficultySettings() {
    const selector = document.getElementById('strength');
    const difficulty = selector?.value || 'normal';
    return DIFFICULTY_SETTINGS[difficulty];
  }
}