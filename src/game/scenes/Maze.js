// make a maze scene
import { Scene, } from 'phaser';

export class Maze extends Scene {
  constructor() {
    super('Maze');
    this.player;
    this.currentDirection = 'right';
    this.playerSpeed = 200;
    this.cursors;
    this.endPoint;
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    const map = this.make.tilemap({ key: 'maze', tileWidth: 32, tileHeight: 32 },);

    // Load tilesets
    const interiors = map.addTilesetImage('interiors_32', 'interiors_32');
    // const roomBuilder = map.addTilesetImage('room_builder_32', 'room_builder_32');
    // const modernExteriors = map.addTilesetImage('modern_exteriors_32', 'modern_exteriors_32');
    // Create layers
    const groundLayer = map.createLayer('Walls', [interiors], 0, 0);
    // const wallLayer = map.createLayer('Walls', [roomBuilder, modernExteriors]);

    // Set up collision
    // wallLayer.setCollisionByProperty({ collides: true });

    // Set up world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Get starting point
    const startPoint = map.findObject("Player", obj => obj.name === "StartPoint");
    const endPoint = map.findObject("Player", obj => obj.name === "EndPoint");
    const holes = map.getObjectLayer('Holes').objects;
    this.endPoint = this.add.zone(endPoint.x, endPoint.y, 32, 32);
    this.physics.world.enable(this.endPoint);

    // Add player sprite
    this.player = this.physics.add.sprite(startPoint.x, startPoint.y, 'adam-run').setScale(1);
    // this.physics.add.collider(this.player, wallLayer);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('run-right', true);

    this.cursors = this.input.keyboard.createCursorKeys();


  }


  update() {
    this.player.setVelocity(0);
    const speed = (this.cursors.shift.isDown ? 2 : 1) * this.playerSpeed;

    // Check for player reaching endPoint
    if (this.physics.overlap(this.player, this.endPoint)) {
      this.scene.start('City');
    }




    // Handle player keyboard movement and animation
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("run-up", true);
      this.currentDirection = "up";
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("run-down", true);
      this.currentDirection = "down";
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("run-left", true);
      this.currentDirection = "left";
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("run-right", true);
      this.currentDirection = "right";
    } else {
      this.player.anims.stop();
      this.player.setTexture(
        "adam-run",
        this.currentDirection === "right"
          ? 0
          : this.currentDirection === "up"
            ? 6
            : this.currentDirection === "left"
              ? 12
              : 18
      );
    }
  }


}