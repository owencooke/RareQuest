import { Scene } from "phaser";

const CHAR_FRAMES_PER_ROW = 56;

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const progressBarWidth = this.scale.width * 0.5;

        // Outline of the bar
        this.add
            .rectangle(centerX, centerY, progressBarWidth, 32)
            .setStrokeStyle(2, 0x87ceeb);

        // Create a gradient texture for the progress bar
        const graphics = this.make.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 1, 28);
        graphics.generateTexture("progress-bar-fill", 1, 28);
        graphics.destroy();

        // Progress bar itself, using the gradient texture
        const bar = this.add
            .image(centerX - progressBarWidth / 2, centerY, "progress-bar-fill")
            .setOrigin(0, 0.5);

        // Add text above the progress bar
        this.loadingText = this.add
            .text(centerX, centerY - 50, "Loading...", {
                fontSize: "20px",
                fill: "#ffffff",
            })
            .setOrigin(0.5, 0.5);
        // Update the loading bar

        this.load.on("progress", (progress) => {
            bar.setScale(progressBarWidth * progress, 1);
            this.loadingText.setText(
                `Loading... ${Math.round(progress * 100)}%`
            );
        });
    }

    preload() {
        this.cameras.main.setBackgroundColor("#87CEEB");
        // Load city
        this.load.tilemapTiledJSON("city", "./assets/city.json");
        this.load.tilemapTiledJSON("maze", "./assets/maze.json");
        this.load.image("exteriors_32", "./assets/exteriors_32.png");
        this.load.image("background", "./assets/menu.png");
        this.load.image(
            "modern_exteriors_32",
            "./assets/modern_exteriors_32.png"
        );
        this.load.image("home", "./assets/home.png");

        // Load minigame assets
        this.load.image("bg", "./assets/balancebg.jpg");
        this.load.image("tile1", "./assets/tile1.png");

        // Load building icons for each doctor
        this.load.image("Pediatrician", "./assets/doctor_symbols/bear.png");
        this.load.image("Pulmonologist", "./assets/doctor_symbols/lungs.png");
        this.load.image("Dermatologist", "./assets/doctor_symbols/derm.png");
        this.load.image("Neurologist", "./assets/doctor_symbols/brain.png");
        this.load.image("Ophthalmologist", "./assets/doctor_symbols/eye.png");

        // Load player
        this.load.spritesheet("detective", "./assets/detective_v2_16.png", {
            frameWidth: 16,
            frameHeight: 32,
        });

        // Load Hospital Room
        // this.load.tilemapTiledJSON("hospitalRoom", "./assets/test.json");
        this.load.tilemapTiledJSON(
            "hospitalRoom",
            "./assets/hospitalRoom.json"
        );
        this.load.image(
            "Room_Builder_Arched_Entryways_32x32",
            "./assets/Room_Builder_Arched_Entryways_32x32.png"
        );
        this.load.image(
            "Room_Builder_Floors_32x32",
            "./assets/Room_Builder_Floors_32x32.png"
        );
        this.load.image(
            "Room_Builder_Walls_32x32",
            "./assets/Room_Builder_Walls_32x32.png"
        );
        this.load.image("19_Hospital_32x32", "./assets/19_Hospital_32x32.png");
        // Load DoctorA
        this.load.spritesheet("doctorA", "./assets/doctorA.png", {
            frameWidth: 16,
            frameHeight: 32,
        });

        // Load dialogue textbox
        this.load.spritesheet("textbox", "./assets/textboxes.png", {
            frameWidth: 321,
            frameHeight: 80,
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.createPlayerRunAnimations();

        this.anims.create({
            key: "doctorA-animation",
            frames: this.anims.generateFrameNumbers("doctorA", {
                start: 395,
                end: 396,
            }),
            frameRate: 8,
            repeat: -1,
        });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("MainMenu");
    }

    createPlayerRunAnimations() {
        const runRow = 2 * CHAR_FRAMES_PER_ROW;

        this.anims.create({
            key: "run-right",
            frames: this.anims.generateFrameNumbers("detective", {
                start: runRow,
                end: runRow + 5,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-up",
            frames: this.anims.generateFrameNumbers("detective", {
                start: runRow + 6,
                end: runRow + 11,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-left",
            frames: this.anims.generateFrameNumbers("detective", {
                start: runRow + 12,
                end: runRow + 17,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "run-down",
            frames: this.anims.generateFrameNumbers("detective", {
                start: runRow + 18,
                end: runRow + 23,
            }),
            frameRate: 12,
            repeat: -1,
        });
    }
}

