import { Physics } from "phaser";

const CHAR_FRAMES_PER_ROW = 56;

const idleRow = 1 * CHAR_FRAMES_PER_ROW;

const PLAYER = {
    TEXTURE: "detective",
    SPEED: 200,
    SCALE: 2,
};

export class MyPlayer extends Physics.Arcade.Sprite {
    constructor(scene, x, y, direction, setSmallerHitBox = true) {
        super(scene, x, y, PLAYER.TEXTURE);
        this.currentDirection = direction;

        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setScale(PLAYER.SCALE);
        this.setCollideWorldBounds(true);
        if (setSmallerHitBox) {
            this.setSize(8, 8);
            this.setOffset(4, 24);
        }
    }

    move1D(left, right) {
        if (left.isDown) {
            this.setVelocityX(-PLAYER.SPEED);
            this.anims.play("run-left", true);
            this.currentDirection = "left";
        } else if (right.isDown) {
            this.setVelocityX(PLAYER.SPEED);
            this.anims.play("run-right", true);
            this.currentDirection = "right";
        } else {
            this.anims.stop();
            this.setVelocityX(0);
            this.setTexture(
                PLAYER.TEXTURE,
                this.currentDirection === "right"
                    ? idleRow
                    : this.currentDirection === "up"
                        ? idleRow + 6
                        : this.currentDirection === "left"
                            ? idleRow + 12
                            : idleRow + 18
            );
        }
    }

    move2D(cursors) {
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
                    ? idleRow
                    : this.currentDirection === "up"
                        ? idleRow + 6
                        : this.currentDirection === "left"
                            ? idleRow + 12
                            : idleRow + 18
            );
        }
    }
}

