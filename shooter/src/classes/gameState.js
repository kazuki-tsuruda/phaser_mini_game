// ====== ゲーム状態管理クラス ======
export class GameState {
  constructor() {
    this.isPlaying = false;
    this.startTime = 0;
    this.score = 0;
    this.bossDefeated = false;
  }

  /**
   * ゲームを開始する
   * @param {*} currentTime - 現在の時間
   * @description
   * ゲームの開始状態を設定します。
   * スコアを0にリセットし、ゲームプレイを開始します。
   * @returns {void}
   */
  start(currentTime) {
    this.isPlaying = true; // ゲームプレイを開始
    this.startTime = currentTime; // ゲーム開始時間を記録
    this.score = 0; // スコアをリセット
    this.bossDefeated = false; // ボスが倒された状態をリセット
  }

  /**
   * ゲームを終了する
   * @description
   * ゲームの終了状態を設定します。
   * ゲームプレイを停止し、スコアや状態をリセットします。
   */
  end() {
    this.isPlaying = false;
  }

  /**
   * スコアを追加する
   * @param {*} points - 追加するスコアポイント
   * @description
   * 指定されたポイントを現在のスコアに加算します。
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * 経過時間を取得する
   * @param {*} currentTime - 現在の時間
   * @returns {number} - ゲーム開始からの経過時間（秒単位）
   * @description
   * ゲーム開始から現在までの経過時間を計算します。
   */
  getElapsedTime(currentTime) {
    return Math.floor((currentTime - this.startTime) / 1000);
  }

  /**
   * ボスを倒した状態にする
   * @description
   * ボスが倒された状態を設定します。
   * ゲームの状態をボスが倒された状態に更新します。
   */
  defeatBoss() {
    this.bossDefeated = true;
  }
}