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
        this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
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
        this.ball.body.setBounce(1, 1);

        // Physics for ball and edge of world
        this.physics.world.on("worldbounds", function(ball) {
            const angle = Phaser.Math.Between(0, 360);
            const vec = this.physics.velocityFromAngle(angle, 100 + this.ballSpeed)
            this.ballSpeed += 10
            ball.setVelocity(vec.x, vec.y);

            // Game Over
            if (this.ball.y > this.player.y) {
                this.playerSpeed = 375;
                this.currentDirection = "right";
                this.ballSpeed = 300;
                this.scoreCount = 0;
                this.scene.start("gameEnd", {gameScore: this.scoreCount});
            }
        }, this);

        // Physics for Player and Ball
        this.physics.add.collider(this.player, this.ball, function (player, ball) {
            const angle = Phaser.Math.Between(0, 360);
            const vec = this.physics.velocityFromAngle(angle, 100 + this.ballSpeed)
            ball.body.setVelocity(vec.x, vec.y);

            // Score Update
            this.scoreCount += 10;
            this.score.text = this.scoreCount;

            // Check for win conditions
            if (this.scoreCount === 100) {
                this.scene.start("gameEnd", {gameScore: this.scoreCount});
            }
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

export class gameEnd extends Scene {
    constructor() {
        super("gameEnd");
        this.gameState = "Failure"
    }

    create(data) {
        // Game End
        
        if (data.gameScore === 100) {
            this.gameState = "Success!"
        }
        this.add
            .text(this.cameras.main.centerX, 300, this.gameState, {
                fontSize: "72px",
                color: "#ffffff",
                fontFamily: "Arial Black",
            })
            .setOrigin(0.5);

        // Try again or Continue

        if (this.gameState === "Success!") {
            const continueButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 100,
                "Continue",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5)
            .setInteractive();
            continueButton.on("pointerdown", () => {
                this.scene.start("City");
            });
        }
        else {
            const playButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 100,
                "Try Again",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5)
            .setInteractive();
            playButton.on("pointerdown", () => {
                this.scene.start("Balance");
            });
        }
    }
}
