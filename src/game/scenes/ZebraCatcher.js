import Phaser from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { createHomeButton } from "../components/HomeButton";


const winText = ["After a long process of monitoring Sam's responses to the tests and treatments so far, it seems that his symptoms closely match that of the Fibrocutaneous Nodular Syndrome disease.\n",
 "It is characterized by Firm, raised nodules or plaques on the skin, often slow-growing and painless, flesh-colored or pinkish in appearance, may have a slightly purplish hue, may be mistaken for a benign skin lesion, but can invade deeper tissues if left untreated.",
 "Complications with this disease arising from environmental factors may manifest some of the other symptoms Sam has been experiencing. We suggest continuing on the ZebraCatcher treatment plan/",
 "It is crucial that Sam continues to visit his doctors for regular check ups. His case also presents a unique opportunity for raising awareness on rare skin diseases. \nWe are here to help and ensure that Sam can continue to flourish in his endeavors!"];

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
        this.winText = winText;
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

        this.homeButton = createHomeButton(this, "Dermatologist");
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
        if (this.points >= 3) {
            this.gameOver(true);
        }
    }

    showCongratsMessage() {
        this.player.setVelocity(0);
        this.player.anims.stop();
        this.input.keyboard.shutdown();
        this.player.setActive(false);
        this.cameras.main.stopFollow();

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

        this.time.delayedCall(
            2000,
            () => {
                message.destroy();
                this.scene.start("MinigamePost", {
                    doctorType: "Dermatologist",
                    winText: this.winText,
                });
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

