import { Scene } from "phaser";

export class Balance extends Scene {
    constructor () {
        super({
            key: "Balance"
        });
        this.playerSpeed = 375;
        this.currentDirection = "right";
        this.ballSpeed = 300;
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

        // Ball Object
        this.ball = this.add.circle(100, 100, 50, 0);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.onWorldBounds = true;
        this.ball.body.setVelocity(this.ballSpeed, this.ballSpeed);

        // Physics
        this.physics.world.on("worldbounds", function(ball) {
            ball.setVelocity(this.ballSpeed, this.ballSpeed)
        }, this);

        this.physics.add.collider(this.player, this.ball, function (player, ball) {
            ball.body.setVelocity(-this.ballSpeed, -this.ballSpeed);
        }, undefined, this);
        
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