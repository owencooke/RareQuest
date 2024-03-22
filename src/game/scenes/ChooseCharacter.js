import { Scene } from "phaser";

export class ChooseCharacter extends Scene {
    constructor() {
        super("ChooseCharacter");
    }

    preload() {
        // Load assets
        this.load.spritesheet("adam-run", "./assets/Adam_run_16x16.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
    }

    create() {
        // Add main title
        this.add
            .text(this.cameras.main.centerX, 200, "Choose Your Character", {
                fontSize: "36px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        // Calculate the positions for options and sprites
        const optionY = this.cameras.main.centerY;
        const optionX = this.cameras.main.centerX;

        // Add options
        const patientOption = this.add
            .text(optionX - 200, optionY, "Patient", {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        const practitionerOption = this.add
            .text(optionX + 200, optionY, "Practitioner", {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        // Add sprites beneath options
        const patientSprite = this.add
            .sprite(optionX - 200, optionY + 70, "adam-run")
            .setScale(4);
        const practitionerSprite = this.add
            .sprite(optionX + 200, optionY + 70, "adam-run")
            .setScale(4);

        // Create animations
        const frameNames = this.anims.generateFrameNumbers("adam-run", {
            start: 0,
            end: 23,
        });
        this.anims.create({
            key: "run",
            frames: frameNames,
            frameRate: 12,
            repeat: -1,
        });

        // Play animations
        patientSprite.play("run");
        practitionerSprite.play("run");

        // Set interactive behavior for options
        patientOption.setInteractive();
        practitionerOption.setInteractive();

        // Define actions for when an option is clicked
        patientOption.on("pointerdown", () => {
            // Start the "Game" scene when the patient option is clicked
            this.scene.start("Game");
        });

        practitionerOption.on("pointerdown", () => {
            // Start the "Game" scene when the practitioner option is clicked
            this.scene.start("Game");
        });
    }
}

