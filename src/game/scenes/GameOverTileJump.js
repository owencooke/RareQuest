import { Scene } from 'phaser';

export class GameOverTileJump extends Scene {
    constructor() {
        super({ key: 'GameOverTileJump' });
    }

    create() {
        this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 50, 'Game Over', { font: '48px Arial', fill: '#fff' }).setOrigin(0.5);
        let playAgainButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Play Again', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);

        playAgainButton.setInteractive({ useHandCursor: true });
        playAgainButton.on('pointerdown', () => {
            this.scene.start('TileJump');
        });
    }
}
