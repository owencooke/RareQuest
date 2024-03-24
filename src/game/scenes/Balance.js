import { Scene } from "phaser";

export class Balance extends Scene {
    constructor () {
        super({
            key: "Balance"
        });
        this.playerSpeed = 375;
        this.currentDirection = "right";
    }

    create() {
        // Setup Scene
        this.cameras.main.fadeIn(1000);
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
        this.physics.world.setBounds(0, 0, this.cameras.main.displayWidth, this.cameras.main.displayHeight, true, true, true, true);

        // Setup Player
        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.centerY, "adam-run");
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);

        // Set Up Input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player Movement
        this.player.setVelocity(0)
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.anims.play("run-left", true);
            this.currentDirection = "left";
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.anims.play("run-right", true);
            this.currentDirection = "right";
        }
    }
}