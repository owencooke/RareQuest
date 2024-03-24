import { Scene, Cameras } from "phaser";

export class City extends Scene {
    constructor() {
        super("City");
    }

    create() {
        this.allowMovement = true;
        this.currentDirection = "down";
        this.playerSpeed = 200;

        // Create city map layers from tileset
        const map = this.make.tilemap({
            key: "city",
            tileWidth: 32,
            tileHeight: 32,
        });
        const exteriors = map.addTilesetImage("exteriors_32", "exteriors_32");
        map.createLayer("Ground", exteriors, 0, 0);
        const buildingsLayer = map.createLayer("Buildings", exteriors, 0, 0);
        buildingsLayer.setCollisionByExclusion([-1]);
        map.createLayer("BelowPlayer", exteriors, 0, 0);

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

        // Bind door objects to next scene handler
        this.physics.add.collider(
            this.player,
            this.physics.add.staticGroup(map.createFromObjects("Doors")),
            this.handleEnterDoor,
            null,
            this
        );

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
        if (!this.allowMovement) return;

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

    // Scene names should be stored as Object names in the "Doors" layer of City map
    handleEnterDoor(_, door) {
        this.allowMovement = false;
        const nextScene = door.name;
        console.log(nextScene);
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
            //FIXME: pass nextScene here
            this.scene.start("Hospital")
        );
    }
}

