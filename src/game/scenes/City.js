import { Scene, Cameras } from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { startDialogue } from "../components/Dialogue";

const DOCTOR_SYMBOLS_SCALE = {
    Pediatrician: 0.125,
    Pulmonologist: 0.125,
    Dermatologist: 0.125,
    Neurologist: 0.125,
    Ophthalmologist: 0.05,
};

export class City extends Scene {
    constructor() {
        super("City");
        this.playerSpawn = { x: 32 * 51, y: 32 * 30 };
    }

    init(data) {
        // Check if data.playerSpawn is provided and valid
        if (data.playerSpawn && typeof data.playerSpawn.x === 'number' && typeof data.playerSpawn.y === 'number') {
            this.playerSpawn = {
                x: data.playerSpawn.x,
                y: data.playerSpawn.y,
            };
        } else {
            // Default case: Set a default spawn position if not provided
            // This can be the initial spawn point or any safe location you prefer
            this.playerSpawn = {
                x: 32 * 51, // Example default x position
                y: 32 * 30, // Example default y position
            };
        }
    }
    
    preload() {
        // Load the question mark button image
        this.load.image('question', 'assets/question.png');
    }

    create() {
        this.allowMovement = true;
        this.currentDirection = "down";
        this.playerSpeed = 200;

        // Create city map layers from tileset
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const map = this.make.tilemap({
            key: "city",
            tileWidth: 32,
            tileHeight: 32,
        });
        const exteriors = map.addTilesetImage("exteriors_32", "exteriors_32");
        map.createLayer("Ground", exteriors, 0, 0);
        map.createLayer("GroundDecor", exteriors, 0, 0);
        const buildingsLayer = map.createLayer("Buildings", exteriors, 0, 0);
        buildingsLayer.setCollisionByExclusion([-1]);

        // Add player sprite before above layers (roofs)
        this.player = new MyPlayer(
            this,
            this.playerSpawn.x,
            this.playerSpawn.y,
            "down"
        );
        this.physics.add.collider(this.player, buildingsLayer);

        // Bind door objects to next scene handler
        this.physics.add.collider(
            this.player,
            this.physics.add.staticGroup(map.createFromObjects("Doors")),
            this.handleEnterDoor,
            null,
            this
        );


    // Insert the button code here
    let buttonX = this.cameras.main.width - 80; // 30 pixels from the right edge of the camera viewport
    let buttonY = 80; // 30 pixels from the top of the camera viewport
    this.questionButton = this.add.image(buttonX, buttonY, 'question').setScrollFactor(0).setInteractive();
    this.questionButton.setScale(0.1, 0.1);
    this.questionButton.setOrigin(0.5, 0.5);
    this.questionButton.setDepth(100);

    // Adjust the button's position on resize
    this.scale.on('resize', (gameSize) => {
        // No need to manually adjust camera size here; it's handled by Phaser
        this.questionButton.setPosition(this.cameras.main.width - 30, 30);
    });

    this.questionButton.on('pointerdown', () => {
        console.log('Question button clicked!');
        
        // Capture the player's current position
        const playerPosition = { x: this.player.x, y: this.player.y };

        // Transition to the Rules scene, passing the player's current position
        this.scene.start('Rules', { playerSpawn: playerPosition });
    });

        map.createLayer("Roofs", exteriors, 0, 0);
        map.createLayer("RoofDecor", exteriors, 0, 0);

        // Setup doctor symbols for buildings
        let doorsGroup = this.physics.add.staticGroup(
            map.createFromObjects("Doctor Symbols")
        );
        doorsGroup.getChildren().forEach((door) => {
            door.setTexture(door.name);
            door.setScale(DOCTOR_SYMBOLS_SCALE[door.name]);
        }, this);

        // Set world bounds and collision
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);

        // Enable keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.allowMovement) {
            this.player.move2D(this.cursors);
        }
    }

    // Doctor types should be stored as Object names in the "Doors" layer of City map
    handleEnterDoor(_, door) {
        this.allowMovement = false;
        const doctorType = door.name;
        const doorPosition = { x: door.x, y: door.y };
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
            this.scene.start("Hospital", {
                doctorType,
                doorPosition,
            })
        );
    }
}

