import Phaser from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { createHomeButton } from "../components/HomeButton";

const winText = [
    "It seems that Sam's not responding well to the common treatments. His symptoms persist.",
    "His symptoms are quite varied. It is difficult to diagnose him without some specialized tests",
    "His respiratory symptoms like difficulty breathing may explain his other symptoms like fatigue and headaches",
    "Perhaps a starting point would be to seek a Pulmonologist appointment",
];

export class TileJump extends Phaser.Scene {
    constructor() {
        super("TileJump");
        this.tileWidth = 70;
        this.tileHeight = 70;
        this.playerWidth = 16;
        this.playerHeight = 32;
        this.platforms = null;
        this.spacing = 200;
        this.cursors = null;
        this.score = 0;
        this.player;
        this.isPlayerAirborne = false;
        this.winText = winText;
    }

    create() {
        this.cameras.main.backgroundColor.setTo(71, 156, 222);

        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false,
        });

        this.initPlatforms();

        this.scoreLabel = this.add
            .text(this.game.config.width / 2, 100, "0", {
                font: "100px Arial",
                fill: "#fff",
            })
            .setOrigin(0.5)
            .setDepth(1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createPlayer();

        this.time.addEvent({
            delay: 1400,
            callback: this.addPlatform,
            callbackScope: this,
            loop: true,
        });

        this.physics.add.collider(
            this.player,
            this.platforms,
            (player, platform) => {
                if (
                    !platform.cleared &&
                    this.isPlayerAirborne &&
                    player.body.touching.down
                ) {
                    this.incrementScore();
                    platform.cleared = true;
                    this.isPlayerAirborne = false; // Ensure this is reset only when a jump and land cycle is complete
                }
            }
        );

        this.homeButton = createHomeButton(this, "Pediatrician");
    }

    addTile(x, y) {
        let tile = this.platforms.get(x, y, "tile1");
        if (!tile) return;

        tile.setActive(true).setVisible(true);
        tile.setAngle(180);
        tile.body.velocity.y = 150;
        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
        tile.body.debugShowBody = false;
        tile.cleared = false;
    }

    addPlatform(y = -this.tileHeight * 2) {
        let tilesNeeded =
            Math.ceil(this.game.config.width / this.tileWidth) + 1;
        let hole = Phaser.Math.Between(1, tilesNeeded - 3);

        for (let i = 0; i < tilesNeeded; i++) {
            if (i !== hole && i !== hole + 1) {
                this.addTile(i * this.tileWidth, y);
            }
        }
    }

    initPlatforms() {
        let bottom = this.game.config.height - this.tileHeight;
        for (let y = bottom; y > -this.spacing; y -= this.spacing) {
            this.addPlatform(y);
        }
    }

    createPlayer() {
        this.player = new MyPlayer(
            this,
            this.game.config.width / 2,
            this.game.config.height - this.spacing * 2 - 3 * this.tileHeight,
            "down",
            false
        );

        // Set the player's physics pr operties
        this.player.setGravityY(2000);
        this.player.setBounce(0.1);
    }

    update() {
        this.physics.collide(this.player, this.platforms);

        // The jump condition checks if the up/space key is pressed and the player is touching the ground.
        if (
            (this.cursors.up.isDown || this.cursors.space.isDown) &&
            this.player.body.touching.down
        ) {
            this.player.setVelocityY(-1000);
            this.isPlayerAirborne = true;
        }

        // Movement logic for left and right movements.
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-290);
            this.player.anims.play("run-left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(290);
            this.player.anims.play("run-right", true);
        } else {
            this.player.setVelocityX(0);
        }

        // Game over condition if the player touches the bottom of the game world.
        if (
            this.player.body.position.y >=
            this.game.config.height - this.player.body.height
        ) {
            this.gameOver();
        }
    }

    gameOver() {
        this.score = 0;
        this.scene.start("GameOverTileJump");
    }

    incrementScore() {
        this.score += 1;
        this.scoreLabel.text = this.score.toString();

        if (this.score === 5) {
            this.score = 0;
            // Display the congratulatory message
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

            // Pause the game logic
            this.physics.pause();
            this.time.removeAllEvents();

            this.time.delayedCall(2000, () => {
                message.destroy();
                this.scene.start("MinigamePost", {
                    doctorType: "Pediatrician",
                    winText: this.winText,
                    scoreType: "Engagement",
                });
            });
        }
    }
}
