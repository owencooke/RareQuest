import { Scene } from "phaser";

const howToPlay = {
    TileJump:
        "Jump up to the next rising layer without falling! Use the left and right arrow keys to move horizontally, and press the spacebar or the up arrow key to jump.",

    Pong: "Keep the ball up using your head and to prevent the ball from hitting the ground. Move left and right using the arrow keys.",

    Maze: "Navigate through the maze to reach the zebra-striped goal. Use the arrow keys to move up, down, left, and right.",
};

export class MinigameMenu extends Scene {
    constructor() {
        super("MinigameMenu");
    }

    init(data) {
        this.minigame = data.minigame;
    }

    create() {
        let background = this.add.graphics();
        background.fillStyle(0x000000, 1);
        background.fillRect(
            0,
            0,
            this.game.config.width,
            this.game.config.height
        );

        // Title text
        this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 3,
                this.title,
                { fontSize: "48px", fill: "#ffffff", align: "center" }
            )
            .setOrigin(0.5);

        // Instructions
        this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                this.instructions,
                { fontSize: "24px", fill: "#ffffff", align: "center" }
            )
            .setOrigin(0.5)
            .setText(howToPlay[this.minigame]);

        this.startText = this.add
            .text(
                this.game.config.width / 2,
                (this.game.config.height * 2) / 3,
                "Click to Start",
                { fontSize: "24px", fill: "#ffffff", align: "center" }
            )
            .setOrigin(0.5);

        this.startText.setInteractive();
        this.startText.on("pointerdown", this.startGame, this);
    }

    startGame() {
        this.scene.start(this.minigame);
    }
}

