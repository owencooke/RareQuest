import { Scene, Input } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.cursors;
        this.currentDirection = "down"; // Default direction
    }

    preload() {
        // TO SCALE
        // var width = this.cameras.main.width;

        // Load Tiled JSON map and tileset images
        this.load.tilemapTiledJSON("test", "./assets/test_room.json");
        this.load.image(
            "Room_Builder_free_32x32",
            "./assets/Room_Builder_free_32x32.png"
        );
        this.load.image(
            "Interiors_free_32x32",
            "./assets/Interiors_free_32x32.png"
        );

        // Load player
        this.load.spritesheet("adam-run", "./assets/Adam_run_16x16.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
    }

    create() {
        // Load the tilemap
        const map = this.make.tilemap({
            key: "test",
            tileWidth: 32,
            tileHeight: 32,
        });

        // Add tilesets
        const room = map.addTilesetImage(
            "Room_Builder_free_32x32",
            "Room_Builder_free_32x32"
        );
        const interiors = map.addTilesetImage(
            "Interiors_free_32x32",
            "Interiors_free_32x32"
        );

        // Create layers
        map.createLayer("Tile Layer 1", room, 0, 0);
        map.createLayer("Tile Layer 2", interiors, 0, 0);
        map.createLayer("Tile Layer 3", interiors, 0, 0);

        // Create player sprite
        this.player = this.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "adam-run"
            )
            .setScale(2);

        this.anims.create({
            key: "run-right",
            frames: this.anims.generateFrameNumbers("adam-run", {
                start: 0,
                end: 5,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-up",
            frames: this.anims.generateFrameNumbers("adam-run", {
                start: 6,
                end: 11,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-left",
            frames: this.anims.generateFrameNumbers("adam-run", {
                start: 12,
                end: 17,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-down",
            frames: this.anims.generateFrameNumbers("adam-run", {
                start: 18,
                end: 23,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Set initial animation
        this.player.anims.play("run-down", true);

        // Enable keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = this.input.keyboard.checkDown(
            this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SHIFT)
        )
            ? 4
            : 2;

        // Handle player movement
        if (this.cursors.up.isDown) {
            this.player.y -= speed;
            this.player.anims.play("run-up", true);
            this.currentDirection = "up";
        } else if (this.cursors.down.isDown) {
            this.player.y += speed;
            this.player.anims.play("run-down", true);
            this.currentDirection = "down";
        } else if (this.cursors.left.isDown) {
            this.player.x -= speed;
            this.player.anims.play("run-left", true);
            this.currentDirection = "left";
        } else if (this.cursors.right.isDown) {
            this.player.x += speed;
            this.player.anims.play("run-right", true);
            this.currentDirection = "right";
        } else {
            // If no movement keys are pressed, stop animation
            this.player.anims.stop();
            this.player.setTexture(
                "adam-run",
                this.currentDirection === "right"
                    ? 0
                    : this.currentDirection === "up"
                    ? 6
                    : this.currentDirection === "left"
                    ? 12
                    : 18
            );
        }
    }
}

