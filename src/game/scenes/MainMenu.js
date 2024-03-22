import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        // Add main title
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerX - 200,
                "Your Game Title",
                {
                    fontSize: "48px",
                    color: "#ffffff",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5);

        // Add play button
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
            .setOrigin(0.5);

        // Define action for when the play button is clicked
        playButton.setInteractive();
        playButton.on("pointerdown", () => {
            // Start the "ChooseCharacter" scene when the play button is clicked
            this.scene.start("ChooseCharacter");
        });
    }
}

