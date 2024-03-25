import Phaser from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { startSpecialistScene } from "./hospital/Hospital";

const sizes = {
    width: 1200,
    height: 800,
};

const speedDown = 150;

export class ZebraCatcher extends Phaser.Scene {
    constructor() {
        super("ZebraCatcher");
        this.player = null;
        this.cursor = null;
        this.playerSpeed = speedDown + 50;
        this.target = null;
        this.points = 0;
        this.textScore = null;
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.add.image(0, 0, "zebrabg").setOrigin(0, 0).setScale(1.3, 1);

        this.player = new MyPlayer(
            this,
            sizes.width / 2,
            sizes.height - 50,
            "up"
        ).setScale(4);
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);

        // Adjusted to add initial downward velocity
        this.target = this.physics.add
            .image(0, 0, "zebra")
            .setOrigin(0, 0)
            .setScale(0.5);
        this.target.body.velocity.y = speedDown; // Makes the zebra fall

        this.physics.add.overlap(
            this.target,
            this.player,
            this.targetHit,
            null,
            this
        );

        this.cursor = this.input.keyboard.createCursorKeys();

        this.textScore = this.add.text(10, 10, "Score: 0", {
            // Adjusted position to top left
            font: "32px Arial",
            fill: "#d55e27",
            fontStyle: "bold",
        });

        // Create the home button
        const homeButton = this.add
            .image(sizes.width - 50, 50, "home")
            .setScrollFactor(0)
            .setOrigin(0, 0.5)
            .setScale(0.2)
            .setInteractive();

        homeButton.on("pointerover", () => {
            this.game.canvas.style.cursor = "pointer";
        });

        homeButton.on("pointerout", () => {
            this.game.canvas.style.cursor = "default";
        });

        homeButton.on("pointerdown", () => {
            startSpecialistScene(this, "Dermatologist");
        });
    }

    update() {
        if (this.target.y >= sizes.height) {
            this.resetZebraPosition();
        }

        // If the y is similar and x is out of bounds, game over
        if (
            this.target.y >= sizes.height - 50 &&
            (this.target.x < this.player.x ||
                this.target.x > this.player.x + this.player.width)
        ) {
            this.gameOver(false);
        }

        const { left, right } = this.cursor;

        this.player.move1D(left, right);
    }

    getRandomX() {
        return Math.floor(Math.random() * (sizes.width - this.target.width));
    }

    resetZebraPosition() {
        // Resets the zebra position to top with a random x-coordinate

        this.target.x = this.getRandomX();
        this.target.y = 0;
        this.target.body.velocity.y = speedDown; // Reapply the velocity to ensure it keeps falling
    }

    targetHit() {
        this.points++;

        this.textScore.setText(`Score: ${this.points}`);
        this.resetZebraPosition();
        if (this.points >= 10) {
            this.gameOver(true);
        }
    }

    showCongratsMessage() {
        this.player.setVelocity(0);
        this.player.anims.stop();
        this.input.keyboard.shutdown();
        this.player.setActive(false);
        this.cameras.main.stopFollow();

        const message = this.add
            .text(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y + this.cameras.main.height / 2,
                "Congratulations!",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    fontStyle: "bold",
                }
            )
            .setOrigin(0.5, 0.5);

        this.time.delayedCall(
            1000,
            () => {
                message.destroy();
                startSpecialistScene(this, "Dermatologist", "Collaboration");
            },
            [],
            this
        );
    }

    gameOver(win) {
        this.points = 0;
        this.textScore.setText(`Score: ${this.points}`);
        if (win) {
            this.showCongratsMessage();
        } else {
            this.scene.restart();
        }
    }
}

