import { Scene, Cameras } from "phaser";
import { startDialogue } from "../../components/Dialogue";
import script from "./script.json";
import { MyPlayer } from "../../components/MyPlayer";

class Hospital extends Scene {
    constructor() {
        super("Hospital");
        this.player;
        this.doctor;
    }

    init(data) {
        this.dialogue = script[data.doctorType];
        this.doctorType = data.doctorType;
        this.minigameScene = data.minigame;
    }

    create() {
        this.dialogueInProgess = false;
        this.dialogueOccured = false;
        this.allowMovement = true;
        // Load the hospital room tilemap
        const map = this.make.tilemap({
            key: "hospitalRoom",
            tileWidth: 32,
            tileHeight: 32,
        });

        // Add tileset images
        const floor = map.addTilesetImage(
            "Room_Builder_Floors_32x32",
            "Room_Builder_Floors_32x32"
        );
        const entrance = map.addTilesetImage(
            "Room_Builder_Arched_Entryways_32x32",
            "Room_Builder_Arched_Entryways_32x32"
        );
        const walls = map.addTilesetImage(
            "Room_Builder_Walls_32x32",
            "Room_Builder_Walls_32x32"
        );
        const interior = map.addTilesetImage(
            "19_Hospital_32x32",
            "19_Hospital_32x32"
        );

        const layerX = (this.game.config.width - map.widthInPixels) / 2;
        const layerY = (this.game.config.height - map.heightInPixels) / 2;
        // Create layers
        map.createLayer("floor", floor, layerX, layerY);
        const wallsLayer = map.createLayer("walls", walls, layerX, layerY);
        wallsLayer.setCollisionByExclusion([-1]);
        // wallsLayer.setOrigin(200,400);
        const entranceLayer = map.createLayer(
            "entrance",
            entrance,
            layerX,
            layerY
        );
        entranceLayer.setCollisionByExclusion([-1]);

        const interiorLayer = map.createLayer(
            "objects",
            interior,
            layerX,
            layerY
        );
        interiorLayer.setCollisionByExclusion([-1]);
        const interiorLayer2 = map.createLayer(
            "objects2",
            interior,
            layerX,
            layerY
        );
        interiorLayer2.setCollisionByExclusion([-1]);

        //Get the object layer made in the map to indicate where the plaer starts when map is loaded
        const startingPoint = map.getObjectLayer("Player").objects[0];

        this.player = new MyPlayer(
            this,
            startingPoint.x + layerX,
            startingPoint.y + layerY,
            "up"
        );

        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, interiorLayer);
        this.physics.add.collider(this.player, interiorLayer2);

        // Bind entrance layer to next scene handler
        this.physics.add.collider(
            this.player,
            entranceLayer,
            this.handleExitDoor,
            null,
            this
        );

        // Create doctor
        const doctor = map.getObjectLayer("doctor").objects[0];
        this.doctor = this.physics.add
            .staticSprite(doctor.x + layerX, doctor.y + layerY, "doctorA")
            .setScale(2);
        this.doctor.setOffset(4, 24);
        this.doctor.anims.play("doctorA-animation", true);

        // Start dialogue upon collision with the doctor
        this.physics.add.collider(
            this.player,
            entranceLayer,
            this.handleExitDoor,
            null,
            this
        );

        this.physics.add.collider(
            this.player,
            this.doctor,
            this.handleDoctorCollision,
            null,
            this
        );

        const minigameTriggerZone = this.add.zone(
            this.doctor.x + 200,
            this.doctor.y + 30,
            48,
            64
        );
        this.physics.world.enable(minigameTriggerZone);
        minigameTriggerZone.body.setAllowGravity(false);
        this.physics.add.overlap(
            this.player,
            minigameTriggerZone,
            this.handleMinigame,
            null,
            this
        );

        const triggerDialogueZone = this.add.zone(
            this.doctor.x,
            this.doctor.y + 12,
            48,
            64
        );
        this.physics.world.enable(triggerDialogueZone);
        triggerDialogueZone.body.setAllowGravity(false);
        this.physics.add.overlap(
            this.player,
            triggerDialogueZone,
            this.handleDoctorCollision,
            null,
            this
        );

        // Set world bounds and collision
        this.physics.world.setBounds(
            layerX,
            layerY,
            map.widthInPixels + layerX,
            map.heightInPixels + layerY
        );
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.centerOn(
            map.widthInPixels / 2,
            map.heightInPixels / 2
        );

        // Enable keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.allowMovement) {
            this.player.move2D(this.cursors);
        }
    }

    handleExitDoor() {
        this.allowMovement = false;
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
            this.scene.start("City", { doctorType: this.doctorType })
        );
    }

    handleDoctorCollision() {
        if (this.cursors.space.isDown && !this.dialogueInProgess) {
            this.allowMovement = false;
            this.dialogueInProgess = true;
            this.dialogueOccured = true;
            startDialogue(this, this.dialogue, () => {
                this.dialogueInProgess = false;
                this.allowMovement = true;
            });
        }
    }

    handleMinigame() {
        if (this.cursors.space.isDown && !this.dialogueInProgess) {
            if (this.dialogueOccured) {
                this.scene.start("MinigameMenu", {
                    minigame: this.minigameScene,
                });
            } else {
                this.dialogueInProgess = true;
                startDialogue(
                    this,
                    [
                        {
                            name: this.doctorType,
                            text: `Hey! You have to come talk to me first!`,
                        },
                    ],
                    () => {
                        this.dialogueInProgess = false;
                    }
                );
            }
        }
    }
}

function startSpecialistScene(sceneRef, doctorType) {
    let minigame;
    switch (doctorType) {
        case "Pulmonologist":
            minigame = "Pong";
            break;
        case "Neurologist":
            minigame = "Maze";
            break;
        case "Pediatrician":
            minigame = "TileJump";
            break;
        case "Dermatologist":
            minigame = "ZebraCatcher";
            break;
        case "Ophthalmologist":
            minigame = "SpyGame";
            break;
        default:
            minigame = undefined;
    }

    sceneRef.scene.start("Hospital", {
        doctorType: doctorType,
        minigame,
    });
}

export { Hospital, startSpecialistScene };

