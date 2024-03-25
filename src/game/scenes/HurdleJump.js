import Phaser from 'phaser';

class HurdleJump extends Phaser.Scene {
    constructor() {
        super('HurdleJump');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('obstacle', 'assets/obstacle.png');
    }

    create() {
        // Player setup
        this.player = this.physics.add.sprite(100, 300, 'player').setScale(0.5);
        this.player.setCollideWorldBounds(true);

        // Obstacles setup
        this.obstacles = this.physics.add.group();
        this.obstacleSpeed = -200; // Initial obstacle speed
        this.obstacleDelay = 1000; // Initial obstacle delay
        this.nextObstacleTime = 0;

        // Score setup
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Set up collision detection
        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);

        // Listen for space key to jump
        this.input.keyboard.on('keydown-SPACE', this.jump, this);
    }

    update(time, delta) {
        // Check if it's time to create a new obstacle
        if (time > this.nextObstacleTime) {
            this.createObstacle();
            this.nextObstacleTime = time + this.obstacleDelay;
        }

        // Increase difficulty over time
        this.obstacleSpeed -= delta / 10000;
    }

    jump() {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    }

    createObstacle() {
        const obstacle = this.obstacles.create(800, 300, 'obstacle').setScale(0.5);
        obstacle.setVelocityX(this.obstacleSpeed);
        obstacle.setGravityY(-500);
        obstacle.setBounce(1);
        obstacle.setSize(50, 100);
        obstacle.setOffset(10, 0);
        obstacle.body.onWorldBounds = true;
        obstacle.body.world.on('worldbounds', function() {
            this.obstacles.killAndHide(obstacle);
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }, this);
    }

    gameOver() {
        this.physics.pause();
        this.scene.pause();
        const gameOverText = this.add.text(400, 200, 'Game Over\nScore: ' + this.score, { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5);
        const restartText = this.add.text(400, 300, 'Press SPACE to Restart', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        restartText.setInteractive();
        restartText.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }, // Adjust gravity to make jumping feel right
            debug: false
        }
    },
    scene: HurdleJump
};

const game = new Phaser.Game(config);
