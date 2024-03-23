import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.cursors;
        this.currentDirection = "down";
    }

    preload() {
        // TO SCALE
        // var width = this.cameras.main.width;

        // Load Tiled JSON map and tileset images
        this.load.tilemapTiledJSON("test", "./assets/city.json");
        this.load.image("exteriors_32", "./assets/exteriors_32.png");

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
        const exteriors = map.addTilesetImage("exteriors_32", "exteriors_32");

        // Create layers
        map.createLayer("Ground", exteriors, 0, 0);
        const buildingsLayer = map.createLayer("Buildings", exteriors, 0, 0);
        buildingsLayer.setCollisionByExclusion([-1]);
        map.createLayer("Doorways", exteriors, 0, 0);

        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        // Create player sprite
        this.player = this.physics.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "adam-run"
            )
            .setScale(2);

        map.createLayer("AbovePlayer", exteriors, 0, 0);

        this.cameras.main.startFollow(this.player);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, buildingsLayer);

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
        // Reset velocity
        this.player.setVelocity(0);
        const speed = this.cursors.shift.isDown ? 400 : 200;

        // Handle player movement
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("run-up", true);
            this.currentDirection = "up";
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("run-down", true);
            this.currentDirection = "down";
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("run-left", true);
            this.currentDirection = "left";
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("run-right", true);
            this.currentDirection = "right";
        } else {
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

