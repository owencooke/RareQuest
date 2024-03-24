import { Scene, Cameras } from "phaser";
import { startDialogue } from "../components/Dialogue";

const dialogue = [
    { name: "Character A", text: "Hello there!" },
    { name: "Character B", text: "Hi! How can I help you?" },
    // Add more dialogue blocks as needed
];

export class Hospital extends Scene {
    constructor() {
        super("Hospital");
        this.player;
        this.doctor;
        this.dialogueInProgess = false;
    }

    create() {
        this.allowMovement = true;
        this.currentDirection = "up";
        this.playerSpeed = 200;
        this.doctorCollision = false;

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

        this.player = this.physics.add
            .sprite(
                startingPoint.x + layerX,
                startingPoint.y + layerY,
                "adam-run"
            )
            .setScale(2);

        this.player.setCollideWorldBounds(true);
        this.player.anims.play("run-down", true);
        this.player.setSize(8, 8);
        this.player.setOffset(4, 24);

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

        this.anims.create({
            key: "doctorA-animation",
            frames: this.anims.generateFrameNumbers("doctorA", {
                start: 395,
                end: 396,
            }),
            frameRate: 8,
            repeat: -1,
        });
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
        // this.cameras.main.startFollow(this.player);

        // Enable keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.allowMovement) return;

        this.player.setVelocity(0);
        const speed = (this.cursors.shift.isDown ? 2 : 1) * this.playerSpeed;

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

    handleExitDoor() {
        this.allowMovement = false;
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
            this.scene.start("City")
        );
    }

    handleDoctorCollision() {
        if (this.cursors.space.isDown && !this.dialogueInProgess) {
            this.dialogueInProgess = true;
            startDialogue(
                this,
                dialogue,
                () => (this.dialogueInProgess = false)
            );
        }
    }
}

