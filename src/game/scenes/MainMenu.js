import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        // BACKGROUND
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // TITLE
        this.add
            .text(this.cameras.main.centerX, 300, "RareQuest", {
                fontSize: "150px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        // PLAY BUTTON
        const playButton = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "Play", {
                fontSize: "75px",
                color: "#d55e27",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5)
            .setInteractive();

        playButton.on("pointerdown", () => {
            this.scene.start("HurdleJump");
        });

        playButton.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });


        playButton.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });

        this.tweens.add({
            targets: playButton,
            scaleX: 1.3,
            scaleY: 1.3,
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}

