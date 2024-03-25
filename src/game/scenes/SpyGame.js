import { Scene } from "phaser";
import { startSpecialistScene } from "./hospital/Hospital";

export class SpyGame extends Scene {
    constructor() {
        super("SpyGame");
        this.background;
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.background = this.add.image(0, 0, "find_zebra").setOrigin(0);
        this.background.x -= 200;

        const zebra = this.add.sprite(200, 300, "zebra").setInteractive();
        zebra.setScale(0.7);
        zebra.on("pointerdown", this.onZebraClicked, this);

        this.homeButton = this.add
            .image(this.cameras.main.width - 32, 32, "home")
            .setScrollFactor(0)
            .setOrigin(1, 0)
            .setScale(0.2)
            .setInteractive();

        this.homeButton.on("pointerover", () => {
            this.game.canvas.style.cursor = "pointer";
        });

        this.homeButton.on("pointerout", () => {
            this.game.canvas.style.cursor = "default";
        });

        this.homeButton.on("pointerdown", () => {
            startSpecialistScene(this, "Ophthalmologist");
        });
    }

    onZebraClicked() {
        // Create a box sprite as the background for the text
        const box = this.add.graphics();
        box.fillStyle(0x000000, 0.7);
        box.fillRect(
            this.cameras.main.centerX - 300,
            this.cameras.main.centerY - 50,
            600,
            100
        );

        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "Congratulations!",
                {
                    fontSize: "42px",
                    fill: "#ffffff",
                    fontStyle: "bold",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            startSpecialistScene(this, "Ophthalmologist");
        });
    }
}

