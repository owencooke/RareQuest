import { Scene, Math } from "phaser";
import { startSpecialistScene } from "./hospital/Hospital";

export class Pong extends Scene {
    constructor() {
        super("Pong");
        this.playerSpeed = 375;
        this.currentDirection = "right";
        this.scoreWin = 50;
        this.ballSpeed = 300;
        this.ballSpeedAmp = 20;
        this.scoreCount = 0;
        this.ColliderActivate = true;
    }

    create() {
        // Setup Scene
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#87CEEB");
        this.physics.world.setBounds(
            0,
            0,
            this.cameras.main.displayWidth,
            this.cameras.main.displayHeight,
            true,
            true,
            true,
            true
        );

        // Score
        this.score = this.add.text(10, 0, "0/" + this.scoreWin, {
            fontSize: "72px",
            color: "#ffffff",
            fontFamily: "Arial Black",
        });

        // Setup Player
        this.player = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.centerY,
            "detective"
        );
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);

        // Ground Object
        this.ground = this.add.rectangle(
            this.player.x,
            this.player.y + 182,
            this.cameras.main.displayWidth,
            200,
            "0x136d15"
        );
        this.physics.add.existing(this.ground);

        // Ball Object
        this.ball = this.add.circle(100, 100, 50, 0);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.onWorldBounds = true;
        this.ball.body.setVelocity(this.ballSpeed, this.ballSpeed);
        this.ball.body.setBounce(1, 1);

        // Physics for ball and edge of world
        this.physics.world.on(
            "worldbounds",
            function (ball) {
                this.ColliderActivate = true;
                const angle = Math.Between(25, 360);
                const vec = this.physics.velocityFromAngle(
                    angle,
                    100 + this.ballSpeed
                );
                ball.setVelocity(vec.x, vec.y);
            },
            this
        );

        // Physics for Player and Ball
        this.physics.add.collider(
            this.player,
            this.ball,
            function (player, ball) {
                // Make sure hitbox overlap doesnt give > 10 points
                if (this.ColliderActivate) {
                    const angle = Math.Between(25, 360);
                    const vec = this.physics.velocityFromAngle(
                        angle,
                        100 + this.ballSpeed
                    );
                    this.ballSpeed += this.ballSpeedAmp;
                    ball.body.setVelocity(vec.x, vec.y);

                    // Score Update
                    this.scoreCount += 10;
                    this.score.text = this.scoreCount + "/" + this.scoreWin;
                    this.ColliderActivate = false;

                    // Check for win conditions
                    if (this.scoreCount === this.scoreWin) {
                        this.playerSpeed = 375;
                        this.currentDirection = "right";
                        this.ballSpeed = 300;
                        this.scene.start("gameEnd", {
                            gameScore: this.scoreCount,
                            scoreCon: this.scoreWin,
                        });
                        this.scoreCount = 0;
                    }
                }
            },
            undefined,
            this
        );

        // Physics for ground
        this.physics.add.collider(
            this.ground,
            this.ball,
            function () {
                this.playerSpeed = 375;
                this.currentDirection = "right";
                this.ballSpeed = 300;
                this.scoreCount = 0;
                this.scene.start("gameEnd", {
                    gameScore: this.scoreCount,
                    scoreCon: this.scoreWin,
                });
            },
            undefined,
            this
        );

        // Set Up Input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player Movement
        this.player.setVelocity(0);
        const speed = (this.cursors.shift.isDown ? 2 : 1) * this.playerSpeed;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("run-left", true);
            this.currentDirection = "left";
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("run-right", true);
            this.currentDirection = "right";
        }
    }
}

export class gameEnd extends Scene {
    constructor() {
        super("gameEnd");
        this.gameState = "Failure";
    }

    create(data) {
        // Game End
        if (data.gameScore === data.scoreCon) {
            this.gameState = "Success!";
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
                startSpecialistScene(this, "Pulmonologist");
            });
        } else {
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
                this.scene.start("Pong");
            });
        }
    }
}

