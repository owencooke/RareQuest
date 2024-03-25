import { Scene, Cameras } from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import { startSpecialistScene } from "./hospital/Hospital";
import { HUD } from "../components/HUD";

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
        if (data.doctorType) {
            this.doctorType = data.doctorType;
        }
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
        const doors = map.createFromObjects("Doors");
        if (this.doctorType) {
            doors.forEach((door) => {
                if (this.doctorType === door.name) {
                    // this.player.setOrigin(door.x, door.y + 32);
                    this.player.setX(door.x);
                    this.player.setY(door.y + 32);
                }
            });
        }

        this.physics.add.collider(
            this.player,
            this.physics.add.staticGroup(doors),
            this.handleEnterDoor,
            null,
            this
        );

        // Insert the button code here
        let buttonX = this.cameras.main.width - 80; // 30 pixels from the right edge of the camera viewport
        let buttonY = 80; // 30 pixels from the top of the camera viewport
        this.questionButton = this.add
            .image(buttonX, buttonY, "question")
            .setScrollFactor(0)
            .setInteractive();
        this.questionButton.setScale(0.1, 0.1);
        this.questionButton.setOrigin(0.5, 0.5);
        this.questionButton.setDepth(100);

        this.questionButton.on("pointerdown", () => {
            // Capture the player's current position
            const playerPosition = { x: this.player.x, y: this.player.y };

            // Transition to the Rules scene, passing the player's current position
            this.scene.start("Rules", { playerSpawn: playerPosition });
        });

        map.createLayer("Roofs", exteriors, 0, 0);
        map.createLayer("RoofDecor", exteriors, 0, 0);

        // Setup doctor symbols for buildings
        map.createFromObjects("Doctor Symbols").forEach((door) => {
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

        this.hud = new HUD(this);
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
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
            startSpecialistScene(this, doctorType)
        );
    }
}

