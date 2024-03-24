import Phaser from 'phaser';

export class TileJump extends Phaser.Scene {
    constructor() {
        super("TileJump");
        this.tileWidth = 70;
        this.tileHeight = 70;
        this.playerWidth = 16;
        this.playerHeight = 32;
        this.platforms = null;
        this.spacing = 200;
        this.cursors = null;
        this.score = 0;
        this.player;
        this.isPlayerAirborne = false;
    }

    preload() {
        this.load.image("tile1", "./assets/tile1.png");

        // Load player
        this.load.spritesheet("adam-run", "./assets/Adam_run_16x16.png", {
            frameWidth: 16,
            frameHeight: 32,
        });
    }

    create() {
        this.cameras.main.backgroundColor.setTo(71, 156, 222);

        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.initPlatforms();
        
        this.scoreLabel = this.add.text(this.game.config.width / 2, 100, "0", {
            font: "100px Arial",
            fill: "#fff"
        }).setOrigin(0.5).setDepth(1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createPlayer();

        this.time.addEvent({
            delay: 1400,
            callback: this.addPlatform,
            callbackScope: this,
            loop: true
        });

        let exitButton = this.add.text(this.game.config.width - 10, 10, 'Exit', { font: '24px Arial', fill: '#fff' })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true });
    
        exitButton.on('pointerdown', () => this.scene.start('MainMenu')); // Replace 'MainMenu' with the key of your main menu scene

        this.physics.add.collider(this.player, this.platforms, (player, platform) => {
            if (!platform.cleared && this.isPlayerAirborne && player.body.touching.down) {
                this.incrementScore();
                platform.cleared = true;
                this.isPlayerAirborne = false; // Ensure this is reset only when a jump and land cycle is complete
            }
        });
    }

    addTile(x, y) {
        let tile = this.platforms.get(x, y, "tile1");
        if (!tile) return;

        tile.setActive(true).setVisible(true);
        tile.setAngle(180);
        tile.body.velocity.y = 150;
        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
        tile.body.debugShowBody = false;
        tile.cleared = false;
    }

    addPlatform(y = -this.tileHeight * 2) {
        let tilesNeeded = Math.ceil(this.game.config.width / this.tileWidth) + 1;
        let hole = Phaser.Math.Between(1, tilesNeeded - 3);

        for (let i = 0; i < tilesNeeded; i++) {
            if (i !== hole && i !== hole + 1) {
                this.addTile(i * this.tileWidth, y);
            }
        }
    }

    initPlatforms() {
        let bottom = this.game.config.height - this.tileHeight;
        for (let y = bottom; y > -this.spacing; y -= this.spacing) {
            this.addPlatform(y);
        }
    }

    createPlayer() {
    // Corrected the instantiation of the player sprite
    this.player = this.physics.add.sprite(
        this.game.config.width / 2,
        this.game.config.height - this.spacing * 2 - 3 * this.tileHeight,
        "adam-run"
    ).setScale(2);

    // Set the player's physics properties
    this.player.setGravityY(2000);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);

    // Animation creation for the player
    this.anims.create({
        key: "run-right",
        frames: this.anims.generateFrameNumbers("adam-run", { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1,
    });

    this.anims.create({
        key: "run-up",
        frames: this.anims.generateFrameNumbers("adam-run", { start: 6, end: 11 }),
        frameRate: 12,
        repeat: -1,
    });

    this.anims.create({
        key: "run-left",
        frames: this.anims.generateFrameNumbers("adam-run", { start: 12, end: 17 }),
        frameRate: 12,
        repeat: -1,
    });

    this.anims.create({
        key: "run-down",
        frames: this.anims.generateFrameNumbers("adam-run", { start: 18, end: 18 }),
        frameRate: 12,
        repeat: 1,
    });

    // Set initial animation
    this.player.anims.play("run-down", true);
}


    update() {
    this.physics.collide(this.player, this.platforms);

    // The jump condition checks if the up key is pressed and the player is touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-1000);
        this.isPlayerAirborne = true;
    }

    // Movement logic for left and right movements.
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-290);
        this.player.anims.play("run-left", true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(290);
        this.player.anims.play("run-right", true);
    } else {
        this.player.setVelocityX(0);
    }

    // Game over condition if the player touches the bottom of the game world.
    if (this.player.body.position.y >= this.game.config.height - this.player.body.height) {
        this.gameOver();
    }
}

    gameOver() {
        this.score = 0;
        this.scene.start('GameOverTileJump');
    }

    incrementScore() {
        this.score += 1;
        this.scoreLabel.text = this.score.toString();

        if (this.score === 5) {
            this.score = 0;
            // Display the congratulatory message
            this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Congratulations!', { font: '48px Arial', fill: '#fff' }).setOrigin(0.5);
            this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, 'Click anywhere to play again', { font: '24px Arial', fill: '#fff' }).setOrigin(0.5);
            
            // Pause the game logic (but not the scene itself)
            this.physics.pause();
            this.time.removeAllEvents();

            // Make the scene listen for a click to restart
            this.input.once('pointerdown', () => {
                this.scene.restart();
            });
        }
    }
}
