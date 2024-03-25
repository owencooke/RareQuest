import Phaser from "phaser";
import { startSpecialistScene } from "./hospital/Hospital";

const textStyle = {
    fontSize: "24px",
    fill: "black",
    align: "center",
    fontFamily: "'Press Start 2P'",
};

export class MinigamePost extends Phaser.Scene {
    constructor() {
        super("MinigamePost");
    }

    init(data) {
        this.doctorType = data.doctorType;
        this.winText = data.winText;
    }

    create() {
        const background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "bg"
        );
        background.setDisplaySize(
            this.cameras.main.width,
            this.cameras.main.height
        );

        // Title text
        this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 4,
                "Treatment results",
                { ...textStyle, fontSize: "48px" }
            )
            .setOrigin(0.5);
        

        const selectButton = this.add.sprite(this.cameras.main.width-64, this.cameras.main.height-64, "select").setScale(0.2).setInteractive();
        let line = this.displayString(this.winText[0]);
        let clickCount = 1;
        selectButton.on('pointerup', () => {
            clickCount++;
            line.destroy()
            // Display the next string from the array
            if (clickCount <= this.winText.length) {
                line = this.displayString(this.winText[clickCount - 1]);
            } else {
                startSpecialistScene(this, this.doctorType);
            }
        });
    }

    displayString(string) {
         return this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                string,
                {
                    ...textStyle,
                    wordWrap: { width: this.game.config.width - 100 },
                }
            )
            .setOrigin(0.5);
    }

}

