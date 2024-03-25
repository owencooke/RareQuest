import { Scene } from "phaser";
import { startDialogue } from "../components/Dialogue";

export class Rules extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        // Load the question mark button image
        this.load.image('close', 'assets/close.png');
    }

    create() {
        // BACKGROUND
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Hardcoded dialogue text
        const dialogueScript = [
            {
                "name": "How to play",
                "text": "1. The main objective of this game is for the user to visit each hospital in the order of the symptoms presented."
            },
            {
                "name": "How to play",
                "text": "2. Move around the city using the arrow keys on your keyboard."
            },
            {
                "name": "How to play",
                "text": "3. To interact with a doctor, press space upon reaching them."
            },
            {
                "name": "How to play",
                "text": "4.To play the treatment plan minigame suggested by the doctor, go to their computer and press space.\n Close this window to go back to the game."
            }
        ];

        // Start the dialogue
        startDialogue(this, dialogueScript, () => {
            console.log('Dialogue completed!');
            // Perform actions after dialogue ends
        });

        let buttonX = this.cameras.main.width - 80; // 30 pixels from the right edge of the camera viewport
        let buttonY = 80; // 30 pixels from the top of the camera viewport

        const backButton = this.add.image(buttonX, buttonY, 'close').setScrollFactor(0).setInteractive();

        backButton.on('pointerdown', () => {
        // Assuming 'this.playerSpawn' was stored in init() or create() from passed data
        this.scene.start('City', { playerSpawn: this.playerSpawn });
        });
    }

    init(data) {
        // Store the position data passed from Scene A
        this.playerSpawn = data.playerSpawn;
    }
    
}

