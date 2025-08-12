// ====== スコア管理クラス ======
export class ScoreManager {
  constructor() {
    this.STORAGE_KEY = 'shooterGameBestScore';
  }

  /**
   * ベストスコアを取得
   * @returns {number} ベストスコア（未記録の場合は0）
   */
  getBestScore() {
    try {
      const savedScore = localStorage.getItem(this.STORAGE_KEY);
      return savedScore ? parseInt(savedScore, 10) : 0;
    } catch (error) {
      console.warn('ベストスコアの読み込みに失敗:', error);
      return 0;
    }
  }

  /**
   * ベストスコアを保存
   * @param {number} score - 保存するスコア
   * @returns {boolean} 保存成功かどうか
   */
  setBestScore(score) {
    try {
      localStorage.setItem(this.STORAGE_KEY, score.toString());
      return true;
    } catch (error) {
      console.warn('ベストスコアの保存に失敗:', error);
      return false;
    }
  }

  /**
   * スコアがベストスコアかチェック
   * @param {number} currentScore - 現在のスコア
   * @returns {boolean} ベストスコアかどうか
   */
  isNewBestScore(currentScore) {
    return currentScore > this.getBestScore();
  }

  /**
   * ベストスコアを更新（必要に応じて）
   * @param {number} currentScore - 現在のスコア
   * @returns {boolean} 更新されたかどうか
   */
  updateBestScore(currentScore) {
    if (this.isNewBestScore(currentScore)) {
      this.setBestScore(currentScore);
      return true;
    }
    return false;
  }

  /**
   * ベストスコアをリセット
   */
  resetBestScore() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('ベストスコアのリセットに失敗:', error);
      return false;
    }
  }

  /**
   * 全データをリセット（開発用）
   */
  clearAllData() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('全データのクリアに失敗:', error);
      return false;
    }
  }
}