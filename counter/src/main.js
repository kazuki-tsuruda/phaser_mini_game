/**
 * メインゲーム設定とゲームインスタンス作成
 */

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 500,
    parent: 'phaser-game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [GameScene]
};

// ゲームインスタンス作成
const game = new Phaser.Game(config);