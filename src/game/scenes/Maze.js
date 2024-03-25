import { Scene } from "phaser";
import { MyPlayer } from "../components/MyPlayer";
import {createHomeButton} from "../components/HomeButton";

const winText = ["Looking at Sam's test results, his symptoms don't align with symptoms of most neurological disorders and his low response to the treatment plan indicates this as well. there may be other underlying conditions",
"It was mentioned Sam has occasional blurry vision. Some redness was also noticed in Sam's cornea.",
"Given the persistence of his visual issues, it may be prudent to consult with an ophthalmologist to rule out any underlying eye conditions contributing to Sam's symptoms."];

export class Maze extends Scene {
    constructor() {
        super("Maze");
        this.player;
        this.cursors;
        this.endPoint;
        this.holes1;
        this.holes2;
        this.winText = winText;
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const map = this.make.tilemap({
            key: "maze",
            tileWidth: 32,
            tileHeight: 32,
        });

        // Load tilesets
        const modernExteriors = map.addTilesetImage(
            "modern_exteriors_32",
            "modern_exteriors_32"
        );
        
        // Create layers
        map.createLayer("Ground", modernExteriors, 0, 0);
        const wallLayer = map.createLayer("Walls", modernExteriors, 0, 0);
        wallLayer.setCollisionByExclusion([-1]);

        // Set up world bounds
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels,
        );

        // Get starting point
        const startPoint = map.findObject(
            "Player",
            (obj) => obj.name === "StartPoint"
        );
        const endPoint = map.findObject(
            "Player",
            (obj) => obj.name === "EndPoint"
        );
        this.endPoint = this.add.zone(endPoint.x, endPoint.y, 64, 64);
        this.physics.world.enable(this.endPoint);

        const holeObjects = map.getObjectLayer("Holes").objects;
        const holes1 = holeObjects[0];
        const holes2 = holeObjects[1];
        this.holes1 = this.add
            .zone(holes1.x, holes1.y, 64, 64)
            .setOrigin(0.25, 0.25);
        this.holes2 = this.add
            .zone(holes2.x, holes2.y, 64, 64)
            .setOrigin(0.25, 0.25);
        this.physics.world.enable(this.holes1);
        this.physics.world.enable(this.holes2);

        // Add player sprite
        this.player = new MyPlayer(this, startPoint.x, startPoint.y, "right");
        this.player.setScale(1.5);
        this.physics.add.collider(this.player, wallLayer);

        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.homeButton = createHomeButton(this, "Neurologist");
        // this.cameras.main.setZoom(1.5);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    showCongratsMessage() {
        this.player.setVelocity(0);
        this.player.anims.stop();
        this.input.keyboard.shutdown();
        this.player.setActive(false);
        this.cameras.main.stopFollow();

        const box = this.add.graphics();
        box.fillStyle(0x000000, 0.5);
        box.fillRect(
            this.cameras.main.worldView.x + this.cameras.main.width / 2 - 300,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 - 50,
            600,
            100
        );

        const message = this.add
            .text(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y + this.cameras.main.height / 2,
                "Congratulations!",
                {
                    fontSize: "42px",
                    fill: "#ffffff",
                    fontStyle: "bold",
                    fontFamily: "Arial Black",
                }
            )
            .setOrigin(0.5);

        this.time.delayedCall(
            2000,
            () => {
                message.destroy();
                this.scene.start("MinigamePost", {
                    doctorType: "Neurologist",
                    winText: this.winText,
                })
            },
            [],
            this
        );
    }

    update() {
        if (this.physics.overlap(this.player, this.endPoint)) {
            this.showCongratsMessage();
        }

        if (
            this.physics.overlap(this.player, this.holes1) ||
            this.physics.overlap(this.player, this.holes2)
        ) {
            this.scene.restart();
        }

        this.player.move2D(this.cursors);
    }
}

