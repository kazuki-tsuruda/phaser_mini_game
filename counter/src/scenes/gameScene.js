/**
 * メインゲームシーン
 * 10秒チャレンジの全ての機能を管理
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // ゲーム状態
        this.isCounting = false;
        this.startTime = 0;
        
        // UI要素
        this.startButton = null;
        this.stopButton = null;
        this.counterText = null;
        this.messageText = null;
        this.bestScoreText = null;
        this.overlay = null;
        this.particles = null;
        
        // データ
        this.bestScore = null;
    }

    preload() {
        // 必要に応じてアセットを読み込み
        this.loadBestScore();
    }

    create() {
        const gw = this.scale.width;
        const gh = this.scale.height;

        this.createBackground(gw, gh);
        this.createTitle(gw);
        this.createMessage(gw);
        this.createCounterDisplay(gw, gh);
        this.createBestScoreDisplay(gw, gh);
        this.createButtons(gw, gh);
        this.createOverlay();
        this.createParticleEffect();
    }

    update(time, delta) {
        if (this.isCounting) {
            this.updateCounter(time);
            this.updateOverlay(time);
        } else {
            this.overlay.clear();
        }
    }

    /**
     * 背景作成
     */
    createBackground(gw, gh) {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE6E6FA, 0xE6E6FA, 1);
        bg.fillRect(0, 0, gw, gh);
    }

    /**
     * タイトル作成
     */
    createTitle(gw) {
        const title = this.add.text(gw / 2, 30, '10秒チャレンジ', {
            fontSize: '28px',
            color: '#2c3e50',
            fontWeight: 'bold'
        });
        title.setOrigin(0.5, 0);
    }

    /**
     * メッセージテキスト作成
     */
    createMessage(gw) {
        this.messageText = this.add.text(gw / 2, 80, '10秒ちょうどで止めてください', {
            fontSize: '16px',
            color: '#34495e',
            align: 'center'
        });
        this.messageText.setOrigin(0.5, 0);
    }

    /**
     * カウンター表示作成
     */
    createCounterDisplay(gw, gh) {
        // カウンター背景
        const counterBg = this.add.graphics();
        counterBg.fillStyle(0xffffff);
        counterBg.lineStyle(3, 0x3498db);
        counterBg.fillRoundedRect(gw/2 - 120, gh/2 - 80, 240, 120, 15);
        counterBg.strokeRoundedRect(gw/2 - 120, gh/2 - 80, 240, 120, 15);

        // カウンターテキスト
        this.counterText = this.add.text(gw / 2, gh / 2 - 20, '0.00', {
            fontSize: '72px',
            color: '#2c3e50',
            fontWeight: 'bold'
        });
        this.counterText.setOrigin(0.5, 0.5);
    }

    /**
     * ベストスコア表示作成
     */
    createBestScoreDisplay(gw, gh) {
        this.bestScoreText = this.add.text(gw / 2, gh / 2 + 60, 
            this.bestScore ? `ベストスコア: ${this.bestScore.toFixed(2)}秒` : 'ベストスコアなし', {
            fontSize: '14px',
            color: '#7f8c8d'
        });
        this.bestScoreText.setOrigin(0.5, 0.5);
    }

    /**
     * ボタン作成
     */
    createButtons(gw, gh) {
        const buttonStyle = {
            fontSize: '24px',
            padding: { x: 30, y: 15 },
            borderRadius: 25
        };

        // スタートボタン
        this.startButton = this.add.text(gw / 2, gh - 80, 'スタート', {
            ...buttonStyle,
            color: '#fff',
            backgroundColor: '#27ae60'
        });
        this.startButton.setOrigin(0.5, 0.5);
        this.startButton.setInteractive({ useHandCursor: true })
            .on('pointerdown', this.startTimer.bind(this))
            .on('pointerover', () => this.startButton.setScale(1.05))
            .on('pointerout', () => this.startButton.setScale(1));

        // ストップボタン
        this.stopButton = this.add.text(gw / 2, gh - 80, 'ストップ', {
            ...buttonStyle,
            color: '#fff',
            backgroundColor: '#e74c3c'
        });
        this.stopButton.setOrigin(0.5, 0.5);
        this.stopButton.setVisible(false);
        this.stopButton.setInteractive({ useHandCursor: true })
            .on('pointerdown', this.stopTimer.bind(this))
            .on('pointerover', () => this.stopButton.setScale(1.05))
            .on('pointerout', () => this.stopButton.setScale(1));
    }

    /**
     * オーバーレイ作成（3秒後にカウンターを隠すため）
     */
    createOverlay() {
        this.overlay = this.add.graphics();
        this.overlay.setDepth(1);
    }

    /**
     * パーティクル効果作成
     */
    createParticleEffect() {
        // パーティクル機能を一時的に無効化
        this.particles = null;
    }

    /**
     * タイマー開始
     */
    startTimer() {
        this.startButton.setVisible(false);
        this.stopButton.setVisible(true);
        this.startTime = this.time.now;
        this.isCounting = true;
        this.messageText.setText('集中して...');
        
        // ボタンのスケールをリセット
        this.startButton.setScale(1);
        this.stopButton.setScale(1);
    }

    /**
     * タイマー停止
     */
    stopTimer() {
        if (!this.isCounting) return;
        
        this.stopButton.setVisible(false);
        this.startButton.setVisible(true);
        this.isCounting = false;
        
        const elapsed = this.time.now - this.startTime;
        const elapsedSeconds = elapsed / 1000;
        const difference = Math.abs(elapsedSeconds - 10);
        
        this.showResult(difference, elapsedSeconds);
        this.updateBestScore(elapsedSeconds, difference);
        this.resetMessageAfterDelay();
    }

    /**
     * 結果表示
     */
    showResult(difference, elapsedSeconds) {
        if (difference < 0.05) {
            this.messageText.setText('🎉 パーフェクト！ 🎉');
            this.messageText.setColor('#27ae60');
            this.showParticleEffect();
        } else if (difference < 0.2) {
            this.messageText.setText('👍 とても良い！');
            this.messageText.setColor('#f39c12');
        } else if (difference < 0.5) {
            this.messageText.setText('🙂 もう少し！');
            this.messageText.setColor('#3498db');
        } else {
            this.messageText.setText('😅 頑張れ！');
            this.messageText.setColor('#e74c3c');
        }
    }

    /**
     * パーティクル効果表示
     */
    showParticleEffect() {
        // パーティクル機能を無効化中
        // this.particles.setPosition(this.scale.width / 2, this.scale.height / 2 - 20);
        // this.particles.start();
        // this.time.delayedCall(2000, () => this.particles.stop());
    }

    /**
     * ベストスコア更新
     */
    updateBestScore(elapsedSeconds, difference) {
        if (!this.bestScore || difference < Math.abs(this.bestScore - 10)) {
            this.bestScore = elapsedSeconds;
            this.saveBestScore();
            this.bestScoreText.setText(`ベストスコア: ${this.bestScore.toFixed(2)}秒`);
            this.bestScoreText.setColor('#27ae60');
        } else {
            this.bestScoreText.setColor('#7f8c8d');
        }
    }

    /**
     * メッセージリセット（遅延実行）
     */
    resetMessageAfterDelay() {
        this.time.delayedCall(3000, () => {
            this.messageText.setText('10秒ちょうどで止めてください');
            this.messageText.setColor('#34495e');
        });
    }

    /**
     * カウンター表示更新
     */
    updateCounter(time) {
        const elapsed = time - this.startTime;
        const seconds = elapsed / 1000;
        this.counterText.setText(seconds.toFixed(2));
    }

    /**
     * オーバーレイ更新（3秒後にカウンターを隠す）
     */
    updateOverlay(time) {
        const elapsed = time - this.startTime;
        let hidePercent = 0;
        
        if (elapsed >= 3000) {
            hidePercent = Math.min((elapsed - 3000) / 2000, 1);
        }
        
        this.overlay.clear();
        if (hidePercent > 0) {
            const textBounds = this.counterText.getBounds();
            const overlayHeight = textBounds.height * hidePercent;
            
            // 透過を無くして完全に隠す
            this.overlay.fillStyle(0x87CEEB, 1.0);
            this.overlay.fillRoundedRect(
                textBounds.x, 
                textBounds.y, 
                textBounds.width, 
                overlayHeight,
                8
            );
            
            // 隠れている旨を表示
            if (hidePercent > 0.5) {
                this.showHiddenText();
            }
        }
    }

    /**
     * カウンターが隠れている時のテキスト表示
     */
    showHiddenText() {
        const hiddenText = this.add.text(
            this.scale.width / 2, 
            this.scale.height / 2 - 30, 
            '???', {
            fontSize: '36px',
            color: '#e74c3c',
            fontWeight: 'bold'
        });
        hiddenText.setOrigin(0.5, 0.5);
        hiddenText.setDepth(2);
        
        this.time.delayedCall(100, () => {
            if (hiddenText) hiddenText.destroy();
        });
    }

    /**
     * ベストスコア読み込み
     */
    loadBestScore() {
        try {
            const saved = localStorage.getItem('bestScore');
            if (saved) {
                this.bestScore = parseFloat(saved);
            }
        } catch(e) {
            console.log('LocalStorage not available');
        }
    }

    /**
     * ベストスコア保存
     */
    saveBestScore() {
        try {
            localStorage.setItem('bestScore', this.bestScore.toString());
        } catch(e) {
            console.log('LocalStorage not available');
        }
    }
}