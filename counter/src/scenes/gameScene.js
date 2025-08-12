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
        // よりモダンなグラデーション背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x6366f1, 0x8b5cf6, 0x06b6d4, 0x3b82f6, 1);
        bg.fillRect(0, 0, gw, gh);
        
        // 装飾的な円形要素を追加
        const circle1 = this.add.graphics();
        circle1.fillStyle(0xffffff, 0.05);
        circle1.fillCircle(gw * 0.2, gh * 0.3, 60);
        
        const circle2 = this.add.graphics();
        circle2.fillStyle(0xffffff, 0.03);
        circle2.fillCircle(gw * 0.8, gh * 0.7, 80);
    }

    /**
     * タイトル作成
     */
    createTitle(gw) {
        // タイトルはHTMLで表示するので削除
    }

    /**
     * メッセージテキスト作成
     */
    createMessage(gw) {
        this.messageText = this.add.text(gw / 2, 40, '10秒ちょうどで止めてください', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            fontWeight: '300'
        });
        this.messageText.setOrigin(0.5, 0);
    }

    /**
     * カウンター表示作成
     */
    createCounterDisplay(gw, gh) {
        // モダンなカウンター背景（グラスモーフィズム風）
        const counterBg = this.add.graphics();
        counterBg.fillStyle(0xffffff, 0.15);
        counterBg.lineStyle(2, 0xffffff, 0.3);
        counterBg.fillRoundedRect(gw/2 - 140, gh/2 - 90, 280, 140, 25);
        counterBg.strokeRoundedRect(gw/2 - 140, gh/2 - 90, 280, 140, 25);

        // 内側のグロー効果
        const innerGlow = this.add.graphics();
        innerGlow.fillStyle(0x6366f1, 0.1);
        innerGlow.fillRoundedRect(gw/2 - 135, gh/2 - 85, 270, 130, 20);

        // カウンターテキスト（より大きく、モダンに）
        this.counterText = this.add.text(gw / 2, gh / 2 - 20, '0.00', {
            fontSize: '80px',
            color: '#ffffff',
            fontWeight: '200',
            fontFamily: 'Segoe UI, sans-serif'
        });
        this.counterText.setOrigin(0.5, 0.5);
        
        // テキストにグロー効果
        this.counterText.setStroke('#6366f1', 2);
        this.counterText.setShadow(0, 0, 'rgba(99, 102, 241, 0.5)', 10, true, true);
    }

    /**
     * ベストスコア表示作成
     */
    createBestScoreDisplay(gw, gh) {
        this.bestScoreText = this.add.text(gw / 2, gh / 2 + 80, 
            this.bestScore ? `ベストスコア: ${this.bestScore.toFixed(2)}秒` : 'ベストスコアなし', {
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '300'
        });
        this.bestScoreText.setOrigin(0.5, 0.5);
    }

    /**
     * ボタン作成
     */
    createButtons(gw, gh) {
        // モダンなボタンスタイル
        const buttonStyle = {
            fontSize: '22px',
            padding: { x: 40, y: 18 },
            fontWeight: '300',
            fontFamily: 'Segoe UI, sans-serif'
        };

        // スタートボタン（グラスモーフィズム風）
        this.startButton = this.add.graphics();
        this.startButton.fillStyle(0xffffff, 0.2);
        this.startButton.lineStyle(1, 0xffffff, 0.3);
        this.startButton.fillRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
        this.startButton.strokeRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
        
        this.startButtonText = this.add.text(gw / 2, gh - 90, 'スタート', {
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: '400'
        });
        this.startButtonText.setOrigin(0.5, 0.5);
        
        // インタラクティブエリア
        const startArea = this.add.zone(gw/2, gh - 90, 160, 80);
        startArea.setInteractive({ useHandCursor: true })
            .on('pointerdown', this.startTimer.bind(this))
            .on('pointerover', () => {
                this.startButton.clear();
                this.startButton.fillStyle(0xffffff, 0.3);
                this.startButton.lineStyle(1, 0xffffff, 0.5);
                this.startButton.fillRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
                this.startButton.strokeRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
            })
            .on('pointerout', () => {
                this.startButton.clear();
                this.startButton.fillStyle(0xffffff, 0.2);
                this.startButton.lineStyle(1, 0xffffff, 0.3);
                this.startButton.fillRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
                this.startButton.strokeRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
            });

        // ストップボタン
        this.stopButton = this.add.graphics();
        this.stopButtonText = this.add.text(gw / 2, gh - 90, 'ストップ', {
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: '400'
        });
        this.stopButtonText.setOrigin(0.5, 0.5);
        this.stopButtonText.setVisible(false);

        const stopArea = this.add.zone(gw/2, gh - 90, 160, 80);
        stopArea.setVisible(false);
        stopArea.setInteractive({ useHandCursor: true })
            .on('pointerdown', this.stopTimer.bind(this))
            .on('pointerover', () => {
                this.stopButton.clear();
                this.stopButton.fillStyle(0xff4757, 0.4);
                this.stopButton.lineStyle(1, 0xff4757, 0.6);
                this.stopButton.fillRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
                this.stopButton.strokeRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
            })
            .on('pointerout', () => {
                this.stopButton.clear();
                this.stopButton.fillStyle(0xff4757, 0.3);
                this.stopButton.lineStyle(1, 0xff4757, 0.5);
                this.stopButton.fillRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
                this.stopButton.strokeRoundedRect(gw/2 - 80, gh - 130, 160, 80, 25);
            });

        // 参照用に保存
        this.startButtonArea = startArea;
        this.stopButtonArea = stopArea;
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
        // ボタンの表示切り替え
        this.startButtonArea.setVisible(false);
        this.startButtonText.setVisible(false);
        this.startButton.setVisible(false);
        
        this.stopButtonArea.setVisible(true);
        this.stopButtonText.setVisible(true);
        this.stopButton.setVisible(true);
        
        // ストップボタンの描画
        this.stopButton.clear();
        this.stopButton.fillStyle(0xff4757, 0.3);
        this.stopButton.lineStyle(1, 0xff4757, 0.5);
        this.stopButton.fillRoundedRect(this.scale.width/2 - 80, this.scale.height - 130, 160, 80, 25);
        this.stopButton.strokeRoundedRect(this.scale.width/2 - 80, this.scale.height - 130, 160, 80, 25);
        
        this.startTime = this.time.now;
        this.isCounting = true;
    }

    /**
     * タイマー停止
     */
    stopTimer() {
        if (!this.isCounting) return;
        
        // ボタンの表示切り替え
        this.stopButtonArea.setVisible(false);
        this.stopButtonText.setVisible(false);
        this.stopButton.setVisible(false);
        
        this.startButtonArea.setVisible(true);
        this.startButtonText.setVisible(true);
        this.startButton.setVisible(true);
        
        // スタートボタンの再描画
        this.startButton.clear();
        this.startButton.fillStyle(0xffffff, 0.2);
        this.startButton.lineStyle(1, 0xffffff, 0.3);
        this.startButton.fillRoundedRect(this.scale.width/2 - 80, this.scale.height - 130, 160, 80, 25);
        this.startButton.strokeRoundedRect(this.scale.width/2 - 80, this.scale.height - 130, 160, 80, 25);
        
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
        // 結果表示は削除（HTMLのタイトルで十分なため）
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
            this.bestScoreText.setColor('#10b981');
        } else {
            this.bestScoreText.setColor('rgba(255, 255, 255, 0.8)');
        }
    }

    /**
     * メッセージリセット（遅延実行）
     */
    resetMessageAfterDelay() {
        // メッセージ機能を削除したため、何も処理しない
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
            
            // モダンなオーバーレイ（グラデーション）
            this.overlay.fillGradientStyle(0x6366f1, 0x8b5cf6, 0x6366f1, 0x8b5cf6, 1.0);
            this.overlay.fillRoundedRect(
                textBounds.x, 
                textBounds.y, 
                textBounds.width, 
                overlayHeight,
                12
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
            fontSize: '40px',
            color: '#ffffff',
            fontWeight: '300',
            fontFamily: 'Segoe UI, sans-serif'
        });
        hiddenText.setOrigin(0.5, 0.5);
        hiddenText.setDepth(2);
        hiddenText.setStroke('#6366f1', 2);
        hiddenText.setShadow(0, 0, 'rgba(99, 102, 241, 0.8)', 8, true, true);
        
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