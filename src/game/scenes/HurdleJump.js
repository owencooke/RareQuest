import Phaser from 'phaser';
export class HurdleJump extends Phaser.Scene {
    constructor() {
        super('HurdleJump');
    }


    create() {
        // Player setup
        this.player = this.add.rectangle(100, 300, 50, 50, 0xff0000);
        this.physics.add.existing(this.player); // Enable physics for the player
    
        // Obstacles setup
        this.obstacles = this.physics.add.group();
    
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
        const obstacleHeight = Phaser.Math.Between(20, 80); // Randomize obstacle height
        const obstacle = this.add.rectangle(800, 350 - obstacleHeight / 2, 20, obstacleHeight, 0x00ff00); // Create a rectangle obstacle
        this.physics.add.existing(obstacle); // Enable physics for the obstacle
        this.obstacles.add(obstacle); // Add the obstacle to the obstacles group
    
        obstacle.setVelocityX(this.obstacleSpeed);
        obstacle.setGravityY(-500);
        obstacle.setBounce(1);
        obstacle.body.onWorldBounds = true;
        obstacle.body.world.on('worldbounds', function() {
            this.obstacles.killAndHide(obstacle);
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }, this);
    
        // Animation effect to make obstacles appear to come through
        this.tweens.add({
            targets: obstacle,
            duration: 500, // Duration of animation
            scaleX: 2, // Double the width
            scaleY: 0.5, // Half the height
            ease: 'Linear', // Linear easing
            yoyo: true, // Repeat the animation in reverse
            repeat: -1 // Repeat indefinitely
        });
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
