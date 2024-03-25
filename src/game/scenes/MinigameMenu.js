import { Scene } from "phaser";

const howToPlay = {
    TileJump:
        "Jump up to the next rising layer without falling! Use the left and right arrow keys to move horizontally, and press the spacebar or the up arrow key to jump.",
    Pong: "Keep the ball up using your head and to prevent the ball from hitting the ground. Move left and right using the arrow keys.",
    Maze: "Navigate through the maze to reach the zebra-striped goal. Use the arrow keys to move up, down, left, and right.",
    iSpy: `This exercise is simple: just spot the zebra! Use the mouse to click.\n\n PS: Did you know that the zebra is the symbol of rare diseases? Because When you hear hoofbeats behind you, you don't expect to see a zebra, similar to common rare disease diagnoses.`,
    ZebraCatcher:
        "Oh no, the zebras are falling from the sky! Catch them by moving your player with the left and right arrow keys. ",
};

const textStyle = {
    fontSize: "24px",
    fill: "black",
    align: "center",
    fontFamily: "'Press Start 2P'",
};

export class MinigameMenu extends Scene {
    constructor() {
        super("MinigameMenu");
    }

    init(data) {
        this.minigame = data.minigame;
    }

    create() {
        // Background

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
                this.minigame,
                { ...textStyle, fontSize: "48px" }
            )
            .setOrigin(0.5);

        // Instructions text
        this.add
            .text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                howToPlay[this.minigame],
                {
                    ...textStyle,
                    wordWrap: { width: this.game.config.width - 100 },
                }
            )
            .setOrigin(0.5);

        // Click to start text
        let startText = this.add
            .text(
                this.game.config.width / 2,
                (this.game.config.height * 3) / 4,
                "Click Anywhere or Press Spacebar to Start!",
                textStyle
            )
            .setOrigin(0.5);

        // Make text interactive
        startText.setInteractive();
        startText.on("pointerdown", this.startGame, this);
        this.input.keyboard.on("keydown-SPACE", this.startGame, this);
    }

    startGame() {
        this.scene.start(this.minigame);
    }
}

