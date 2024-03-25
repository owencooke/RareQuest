import { Scene } from "phaser";
import { startSpecialistScene } from "./hospital/Hospital";
import { createHomeButton } from "../components/HomeButton";

export class iSpy extends Scene {
    constructor() {
        super("iSpy");
        this.background;
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
            startSpecialistScene(this, "Ophthalmologist");
        });
    }
}

