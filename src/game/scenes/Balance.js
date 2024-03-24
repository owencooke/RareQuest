import { Scene } from "phaser";

export class Balance extends Scene {
    constructor () {
        super({
            key: "Balance"
        });
        this.playerSpeed = 375;
        this.currentDirection = "right";
        this.ballSpeed = 300;
        this.scoreCount = 0;
    }

    create() {
        // Setup Scene
        this.cameras.main.fadeIn(1000);
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
        this.physics.world.setBounds(0, 0, this.cameras.main.displayWidth, this.cameras.main.displayHeight, true, true, true, true);

        // Score
        this.score = this.add.text(10, 0, this.scoreCount, {
            fontSize: "72px",
            color: "#ffffff",
            fontFamily: "Arial Black",
        })

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
            const angle = Phaser.Math.Between(0, 360);
            const vec = this.physics.velocityFromAngle(angle, 300)
            ball.setVelocity(vec.x, vec.y);
        }, this);

        this.physics.add.collider(this.player, this.ball, function (player, ball) {
            const angle = Phaser.Math.Between(0, 360);
            const vec = this.physics.velocityFromAngle(angle, 300)
            ball.body.setVelocity(vec.x, vec.y);

            // Score Update
            this.scoreCount += 10;
            this.score.text = this.scoreCount;
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