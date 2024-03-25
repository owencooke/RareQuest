import { Scene } from "phaser";
import { startDialogue } from "../components/Dialogue";

export class Rules extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        // Load the question mark button image
        this.load.image("close", "assets/close.png");
    }

    init(data) {
        // Store the position data passed from Scene A
        this.nextScene = data.nextScene;
        this.playerSpawn = data.playerSpawn;
        this.doctorType = data.doctorType;
        this.minigame = data.minigame;
    }

    create() {
        // BACKGROUND
        const background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "background"
        );
        background.setDisplaySize(
            this.cameras.main.width,
            this.cameras.main.height
        );

        // title
        this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 2 - 64,
                "How to Play",
                {
                    fontSize: "56px",
                    fill: "white",
                    align: "center",
                    fontFamily: "'Press Start 2P'",
                }
            )
            .setOrigin(0.5);

        // Hardcoded dialogue text
        const dialogueScript = [
            {
                name: "",
                text: "1. The main objective of this game is for the user to visit each hospital in the order of the symptoms presented.",
            },
            {
                name: "",
                text: "2. Move around the city using the arrow keys on your keyboard.",
            },
            {
                name: "",
                text: "3. To interact with a doctor, press space upon reaching them.",
            },
            {
                name: "",
                text: "4. To play the treatment plan minigame suggested by the doctor, go to their computer and press space.",
            },
            {
                name: "",
                text: "5. Win minigames to increase your Value Meters! Maintaining high levels of Engagement, Integrity, Inclusion, and Collaboration are essential towards understanding the challenges of rare diseases.",
            },
            {
                name: "",
                text: "Close this window to return to the game!",
            },
        ];

        // Start the dialogue
        startDialogue(this, dialogueScript, () => {});

        let buttonX = this.cameras.main.width - 64;
        let buttonY = 64;

        const backButton = this.add
            .image(buttonX, buttonY, "close")
            .setScrollFactor(0)
            .setInteractive();

        backButton.on("pointerdown", () => {
            this.scene.start(this.nextScene, {
                playerSpawn: this.playerSpawn,
                doctorType: this.doctorType,
                minigame: this.minigame,
            });
        });
    }
}

