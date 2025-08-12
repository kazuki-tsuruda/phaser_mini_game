// ====== ゲーム状態管理クラス ======
export class GameState {
  constructor(scoreManager = null) {
    this.isPlaying = false;
    this.startTime = 0;
    this.score = 0;
    this.bossDefeated = false;
    this.scoreManager = scoreManager;
    this.newBestScore = false;
  }

  start(currentTime) {
    this.isPlaying = true;
    this.startTime = currentTime;
    this.score = 0;
    this.bossDefeated = false;
    this.newBestScore = false;
  }

  end() {
    this.isPlaying = false;
    // ゲーム終了時にベストスコアをチェック・更新
    if (this.scoreManager && this.scoreManager.updateBestScore(this.score)) {
      this.newBestScore = true;
    }
  }

  addScore(points) {
    this.score += points;
  }

  getElapsedTime(currentTime) {
    return Math.floor((currentTime - this.startTime) / 1000);
  }

  defeatBoss() {
    this.bossDefeated = true;
  }

  getBestScore() {
    return this.scoreManager ? this.scoreManager.getBestScore() : 0;
  }

  isNewBestScore() {
    return this.newBestScore;
  }
}