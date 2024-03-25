import { Phaser,Scene } from "phaser";

export class SpyGame extends Scene {
    constructor() {
        super("SpyGame");
        this.background
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.background = this.add.image(0,0,"find_zebra").setOrigin(0);
        this.background.x -=200;

        const zebra = this.add.sprite(200,300,"zebra").setInteractive();
        zebra.setScale(0.7); 
        zebra.on("pointerdown", this.onZebraClicked, this);

        this.box = this.add.graphics();
        this.box.fillStyle(0x000000, 0.7);
        this.box.fillRect(this.cameras.main.centerX - 300, this.cameras.main.centerY - 50, 600, 100);

        this.startText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'Find the Zebra', { fontSize: '42px', fill: '#ffffff', fontStyle: 'bold', fontFamily: "Arial Black" }
            )
        .setOrigin(0.5);

        // Remove the text and box after 2 seconds
        this.time.delayedCall(2000, () => {
            this.startText.destroy(); 
            this.box.destroy();
        });

        this.homeButton = this.add
            .image(this.cameras.main.width - 32, 32, "home")
            .setScrollFactor(0)
            .setOrigin(1, 0)
            .setScale(0.2)
            .setInteractive();

        this.scale.on("resize", (gameSize) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
            this.homeButton.setPosition(this.cameras.main.width - 32, 32);
        });

        this.homeButton.on("pointerover", () => {
            this.game.canvas.style.cursor = "pointer";
        });

        this.homeButton.on("pointerout", () => {
            this.game.canvas.style.cursor = "default";
        });

        this.homeButton.on("pointerdown", () => {
            this.scene.start("Hospital");
        });

    }

    onZebraClicked() {

        // Create a box sprite as the background for the text
        const box = this.add.graphics();
        box.fillStyle(0x000000, 0.7);
        box.fillRect(this.cameras.main.centerX - 300, this.cameras.main.centerY - 50, 600, 100);

        this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'Congratulations!', { fontSize: '42px', fill: '#ffffff', fontStyle: 'bold', fontFamily: "Arial Black" }
            )
        .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            this.scene.start("Hospital");
        })
    }
}