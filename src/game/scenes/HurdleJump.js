import { Scene } from 'phaser'

export class HurdleJump extends Scene {
  constructor() {
    super('HurdleJump')
  }

  preload() {
    // No need to preload an image for the player since we're using a rectangle
  }

  create() {
    // phaser config load

  this.cameras.main.setBackgroundColor('#0000FF') // Set background color to blue

  // Create rectangles
  this.rectangles = this.add.group()
  this.time.addEvent({
    delay: 3000,
    callback: this.createRectangle,
    callbackScope: this,
    loop: true
  })

  // Create the player as a physics-enabled square rectangle and color it red
  const playerSize = 50
  const playerX = this.cameras.main.width / 2 // Center horizontally
  const playerY = this.cameras.main.height - playerSize / 2 // Bottom of the screen
  this.player = this.add.rectangle(playerX, playerY, playerSize, playerSize, 0xFF0000)

  // Ground
  
this.ground = this.add.rectangle(0, this.cameras.main.height, this.cameras.main.width, 10, 0x000000).setOrigin(0, 1)
this.physics.add.existing(this.ground, true) // Make ground static
this.physics.add.collider(this.player, this.ground)


  // Input for jumping
  this.cursors = this.input.keyboard.createCursorKeys()
}

  update() {
    // Move rectangles
    this.rectangles.getChildren().forEach(rectangle => {
      rectangle.x -= 2
      if (rectangle.x < -rectangle.width) {
        this.rectangles.remove(rectangle, true, true)
      }
    })

    // Jumping logic
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
    }
  }

  createRectangle() {
    let x = this.cameras.main.width
    let y = this.cameras.main.height
    let width = 50
    let height = 100
    let rectangle = this.add.rectangle(x, y, width, height, 0xFFFFFF).setOrigin(1, 1)
    this.rectangles.add(rectangle)
  }
}
