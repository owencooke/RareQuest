import { Scene } from "phaser";
import { createHomeButton } from "../components/HomeButton";

const winText = ["Based on the tests and treatment plan, there doesn't seem to be any significant abnormality in the eye structure.",
"However, the symptoms still persist. Sometimes eye symptoms can be linked to underlying systemic conditons",
"It seems Sam has some skin rashes as well. Skin conditions can sometimes manifest with eye symptoms",
"It's worth exploring Sam's condition from a dermatology angle."];

export class iSpy extends Scene {
    constructor() {
        super("iSpy");
        this.background;
        this.winText = winText;
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.background = this.add.image(0, 0, "find_zebra").setOrigin(0);
        this.background.x -= 200;

        const zebra = this.add.sprite(200, 300, "zebra").setInteractive();
        zebra.setScale(0.7);
        zebra.on("pointerdown", this.onZebraClicked, this);

        this.homeButton = createHomeButton(this, "Ophthalmologist");
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

        const message = this.add
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
            message.destroy();
            this.scene.start("MinigamePost", {
                doctorType: "Ophthalmologist",
                winText: this.winText,
            })
        });
    }
}

