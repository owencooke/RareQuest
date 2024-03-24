import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        // TITLE
        this.add
            .text(this.cameras.main.centerX, 300, "RareQuest", {
                fontSize: "72px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        // PLAY BUTTON
        const playButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 100,
                "Play",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5)
            .setInteractive();

        playButton.on("pointerdown", () => {
            this.scene.start("Balance");
        });
    }
}

