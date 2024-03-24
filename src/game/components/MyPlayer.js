import { Physics } from "phaser";

const PLAYER = {
    TEXTURE: "adam-run",
    SPEED: 200,
    SCALE: 2,
};

export class MyPlayer extends Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, PLAYER.TEXTURE);
        this.currentDirection = direction;

        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setScale(PLAYER.SCALE);
        this.setCollideWorldBounds(true);
        this.anims.play(`run-${direction}`, true);
        this.setSize(8, 8);
        this.setOffset(4, 24);
    }

    update(cursors) {
        this.setVelocity(0);
        const speed = (cursors.shift.isDown ? 2 : 1) * PLAYER.SPEED;

        // Handle player keyboard movement and animation
        if (cursors.up.isDown) {
            this.setVelocityY(-speed);
            this.anims.play("run-up", true);
            this.currentDirection = "up";
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed);
            this.anims.play("run-down", true);
            this.currentDirection = "down";
        } else if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.anims.play("run-left", true);
            this.currentDirection = "left";
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.anims.play("run-right", true);
            this.currentDirection = "right";
        } else {
            this.anims.stop();
            this.setTexture(
                PLAYER.TEXTURE,
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

