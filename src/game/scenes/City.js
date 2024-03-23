import { Scene } from "phaser";

export class City extends Scene {
    constructor() {
        super("City");
        this.currentDirection = "down";
        this.playerSpeed = 200;
    }

    create() {
        // Create city map layers from tileset
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const map = this.make.tilemap({
            key: "city",
            tileWidth: 32,
            tileHeight: 32,
        });
        const exteriors = map.addTilesetImage("exteriors_32", "exteriors_32");
        map.createLayer("Ground", exteriors, 0, 0);
        const buildingsLayer = map.createLayer("Buildings", exteriors, 0, 0);
        buildingsLayer.setCollisionByExclusion([-1]);
        map.createLayer("Doorways", exteriors, 0, 0);

        // Add player sprite before AbovePlayer layer
        this.player = this.physics.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "adam-run"
            )
            .setScale(2);
        this.physics.add.collider(this.player, buildingsLayer);
        this.player.setCollideWorldBounds(true);
        this.player.anims.play("run-down", true);

        map.createLayer("AbovePlayer", exteriors, 0, 0);

        // Set world bounds and collision
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
        this.cameras.main.startFollow(this.player);

        // Enable keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocity(0);
        const speed = (this.cursors.shift.isDown ? 2 : 1) * this.playerSpeed;

        // Handle player keyboard movement and animation
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

