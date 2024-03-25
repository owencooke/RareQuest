import { MyPlayer } from "../components/MyPlayer";
import Phaser from 'phaser';

export class HurdleJump extends Phaser.Scene {

    constructor() {
        super('HurdleJump');
      }

      create() {
        this.player = new MyPlayer(
            this,
            0,
            0,
            "down"
        );
        const { height, width } = this.game.config;
        this.customGameSpeed = 10;
        this.customIsGameRunning = false;
        this.customRespawnTime = 0;
        this.customScore = 0;
    
        this.customStartTrigger = this.physics.add.sprite(0, 10).setOrigin(0, 1).setImmovable();
        this.customGround = this.add.tileSprite(0, height, 88, 26, 'ground').setOrigin(0, 1)
        this.alex = this.physics.add.sprite(0, height, 'alex-idle')
          .setCollideWorldBounds(true)
          .setGravityY(5000)
          .setBodySize(44, 92)
          .setDepth(1)
          .setOrigin(0, 1);
    
        this.customScoreText = this.add.text(width, 0, "00000", {fill: "#535353", font: '900 35px Courier', resolution: 5})
          .setOrigin(1, 0)
          .setAlpha(0);
    
        this.customHighScoreText = this.add.text(0, 0, "00000", {fill: "#535353", font: '900 35px Courier', resolution: 5})
          .setOrigin(1, 0)
          .setAlpha(0);
    
          this.customEnvironment = this.add.group();
          this.customEnvironment.addMultiple([
            this.add.image(width / 2, 170, 'cloud'),
            this.add.image(width - 80, 80, 'cloud'),
            this.add.image((width / 1.3), 100, 'cloud')
          ]);
          this.customEnvironment.setAlpha(0);
    
        this.customGameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0)
        this.customGameOverText = this.add.image(0, 0, 'game-over');
        this.customRestart = this.add.image(0, 80, 'restart').setInteractive();
        this.customGameOverScreen.add([
          this.customGameOverText,  this.customRestart
        ])
    
        this.customObstacles = this.physics.add.group();
    
        this.initAnims();
        this.initStartTrigger();
        this.initColliders();
        this.handleInputs();
        this.handleScore();
    }

    initColliders() {
        this.physics.add.collider(this.alex, this.customObstacles, () => {
            this.customHighScoreText.x = this.customScoreText.x - this.customScoreText.width - 20;
    
            const highScore = this.customHighScoreText.text.substr(this.customHighScoreText.text.length - 5);
            const newScore = Number(this.customScoreText.text) > Number(highScore) ? this.customScoreText.text : highScore;
    
            this.customHighScoreText.setText('HI ' + newScore);
            this.customHighScoreText.setAlpha(1);
    
            this.physics.pause();
            this.customIsGameRunning = false;
            this.anims.pauseAll();
            this.alex.setTexture('alex-hurt'); // Assuming you have a texture named 'alex-hurt' for the hurt state
            this.customRespawnTime = 0;
            this.customGameSpeed = 10;
            this.customGameOverScreen.setAlpha(1);
            this.customScore = 0;
            this.customHitSound.play();
        }, null, this);
    }
    
    initStartTrigger() {
        const { width, height } = this.game.config;
        this.physics.add.overlap(this.customStartTrigger, this.alex, () => {
            if (this.customStartTrigger.y === 10) {
                this.customStartTrigger.body.reset(0, height);
                return;
            }
    
            this.customStartTrigger.disableBody(true, true);
    
            const startEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callbackScope: this,
                callback: () => {
                    this.alex.setVelocityX(80);
                    this.alex.play('alex-run', 1); // Assuming you have an animation named 'alex-run' for running
    
                    if (this.customGround.width < width) {
                        this.customGround.width += 17 * 2;
                    }
    
                    if (this.customGround.width >= 1000) {
                        this.customGround.width = width;
                        this.customIsGameRunning = true;
                        this.alex.setVelocityX(0);
                        this.customScoreText.setAlpha(1);
                        this.customEnvironment.setAlpha(1);
                        startEvent.remove();
                    }
                }
            });
        }, null, this)
    }

    //Kashish, try adding and commiting and pushing the files me and Bhagya just edited. Then try creating and PR and running that through github
    initAnims() {
        // Assuming you have animations for 'alex-run' (running), 'alex-down-anim' (crouching), and 'enemy-alex-fly' (flying enemies)
        this.anims.create({
            key: 'alex-run',
            frames: this.anims.generateFrameNumbers('alex', { start: 2, end: 3 }), // Adjust frame numbers as per your spritesheet
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'alex-down-anim',
            frames: this.anims.generateFrameNumbers('alex-down', { start: 0, end: 1 }), // Adjust frame numbers as per your spritesheet
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'enemy-alex-fly',
            frames: this.anims.generateFrameNumbers('enemy-alex', { start: 0, end: 1 }), // Adjust frame numbers as per your spritesheet
            frameRate: 6,
            repeat: -1
        });
    }

    handleScore() {
        this.time.addEvent({
            delay: 1000 / 10,
            loop: true,
            callbackScope: this,
            callback: () => {
                if (!this.customIsGameRunning) { return; }
    
                this.customScore++;
                this.customGameSpeed += 0.01;
    
                if (this.customScore % 100 === 0) {
                    this.customReachSound.play();
    
                    this.tweens.add({
                        targets: this.customScoreText,
                        duration: 100,
                        repeat: 3,
                        alpha: 0,
                        yoyo: true
                    });
                }
    
                const score = Array.from(String(this.customScore), Number);
                for (let i = 0; i < 5 - String(this.customScore).length; i++) {
                    score.unshift(0);
                }
    
                this.customScoreText.setText(score.join(''));
            }
        });
    }

    handleInputs() {
        this.restart.on('pointerdown', () => {
            this.customPlayer.setVelocityY(0);
            this.customPlayer.body.height = 92;
            this.customPlayer.body.offset.y = 0;
            this.physics.resume();
            this.obstacles.clear(true, true);
            this.customIsGameRunning = true;
            this.customGameOverScreen.setAlpha(0);
            this.anims.resumeAll();
        });
    
        this.input.keyboard.on('keydown_SPACE', () => {
            if (!this.customPlayer.body.onFloor() || this.customPlayer.body.velocity.x > 0) { return; }
    
            this.customJumpSound.play();
            this.customPlayer.body.height = 92;
            this.customPlayer.body.offset.y = 0;
            this.customPlayer.setVelocityY(-1600);
            this.customPlayer.setTexture('alex', 0); // Assuming 'alex' is your player's texture key
        });
    
        this.input.keyboard.on('keydown_DOWN', () => {
            if (!this.customPlayer.body.onFloor() || !this.customIsGameRunning) { return; }
    
            this.customPlayer.body.height = 58;
            this.customPlayer.body.offset.y = 34;
        });
    
        this.input.keyboard.on('keyup_DOWN', () => {
            if ((this.customScore !== 0 && !this.customIsGameRunning)) { return; }
    
            this.customPlayer.body.height = 92;
            this.customPlayer.body.offset.y = 0;
        });
    }

    placeObstacle() {
        const obstacleNum = Math.floor(Math.random() * 7) + 1;
        const distance = Phaser.Math.Between(600, 900);
    
        let obstacle;
        if (obstacleNum > 6) {
            const enemyHeight = [20, 50];
            obstacle = this.obstacles.create(this.game.config.width + distance, this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)], 'enemy-bird'); // Replace 'enemy-bird' with your enemy sprite key
            obstacle.setOrigin(0, 1);
            obstacle.play('enemy-alex-fly', 1); // Adjust animation name if needed
            obstacle.body.height = obstacle.body.height / 1.5; // Adjust obstacle height scaling
        } else {
            obstacle = this.obstacles.create(this.game.config.width + distance, this.game.config.height, `obstacle-${obstacleNum}`); // Replace `obstacle-${obstacleNum}` with your obstacle sprite key
            obstacle.setOrigin(0, 1);
            obstacle.body.offset.y = +10; // Adjust offset if needed
        }
    
        obstacle.setImmovable();
    }
    

    update(time, delta) {
        if (!this.isGameRunning) { return; }
    
        this.ground.tilePositionX += this.gameSpeed;
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed); // Change 'obsticles' to 'obstacles'
        Phaser.Actions.IncX(this.environment.getChildren(), - 0.5);
    
        this.respawnTime += delta * this.gameSpeed * 0.08;
        if (this.respawnTime >= 1500) {
          this.placeObstacle(); // Change 'placeObsticle' to 'placeObstacle'
          this.respawnTime = 0;
        }
    
        this.obstacles.getChildren().forEach(obstacle => { // Change 'obsticles' to 'obstacles'
          if (obstacle.getBounds().right < 0) { // Change 'obsticle' to 'obstacle'
            this.obstacles.killAndHide(obstacle); // Change 'obsticles' to 'obstacles'
          }
        })
    
        this.environment.getChildren().forEach(env => {
          if (env.getBounds().right < 0) {
            env.x = this.game.config.width + 30;
          }
        })
    
        if (this.alex.body.deltaAbsY() > 0) { // Change 'dino' to 'alex'
          this.alex.anims.stop(); // Change 'dino' to 'alex'
          this.alex.setTexture('alex', 0); // Change 'dino' to 'alex'
        } else {
          this.alex.body.height <= 58 ? this.alex.play('alex-down-anim', true) : this.alex.play('alex-run', true); // Change 'dino' to 'alex', 'dino-down-anim' to 'alex-down-anim', 'dino-run' to 'alex-run'
        }
      }
    }
    