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

        // Hardcoded dialogue text
        const dialogueScript = [
            {
                name: "How to play",
                text: "1. The main objective of this game is for the user to visit each hospital in the order of the symptoms presented.",
            },
            {
                name: "How to play",
                text: "2. Move around the city using the arrow keys on your keyboard.",
            },
            {
                name: "How to play",
                text: "3. To interact with a doctor, press space upon reaching them.",
            },
            {
                name: "How to play",
                text: "4.To play the treatment plan minigame suggested by the doctor, go to their computer and press space.\n Close this window to go back to the game.",
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
            this.scene.start(this.nextScene, { playerSpawn: this.playerSpawn });
        });
    }
}

