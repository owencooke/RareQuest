import Phaser from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { startSpecialistScene } from "./hospital/Hospital";

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

        this.homeButton = this.add
            .image(this.cameras.main.width - 32, 32, "home")
            .setScrollFactor(0)
            .setOrigin(1, 0)
            .setScale(0.2)
            .setInteractive();

        this.homeButton.on("pointerover", () => {
            this.game.canvas.style.cursor = "pointer";
        });

        this.homeButton.on("pointerout", () => {
            this.game.canvas.style.cursor = "default";
        });

        this.homeButton.on("pointerdown", () => {
            startSpecialistScene(this, "Pediatrician");
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
            this.add
                .text(
                    this.game.config.width / 2,
                    this.game.config.height / 2,
                    "Congratulations!",
                    { font: "48px Arial", fill: "#fff" }
                )
                .setOrigin(0.5);
            this.add
                .text(
                    this.game.config.width / 2,
                    this.game.config.height / 2 + 100,
                    "Click anywhere to continue",
                    { font: "24px Arial", fill: "#fff" }
                )
                .setOrigin(0.5);

            // Pause the game logic (but not the scene itself)
            this.physics.pause();
            this.time.removeAllEvents();

            // Make the scene listen for a click to restart
            this.input.once("pointerdown", () => {
                startSpecialistScene(this, "Pediatrician");
            });
        }
    }
}
