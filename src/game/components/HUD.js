import { GameObjects } from "phaser";

const VALUES = ["Engagement", "Integrity", "Inclusion", "Collaboration"];
const MAX_BATTERY_VALUE = 5;
const BATTERY_OUTLINE = 0x000000;
const BATTERY_RADIUS = 8;

// Local storage functions
function saveCounter(name, value) {
    sessionStorage.setItem(name, value);
}

function getCounter(name) {
    return parseInt(sessionStorage.getItem(name)) || 0;
}

class HUD extends GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.counters = {};
        this.createCounters();
        this.createHelpButton();
        scene.add.existing(this);
        this.setScrollFactor(0);
    }

    createHelpButton() {
        let offset = 64;
        let buttonX = this.scene.cameras.main.width - offset;
        let buttonY = offset;
        this.questionButton = this.scene.add
            .image(buttonX, buttonY, "question")
            .setScrollFactor(0)
            .setInteractive();
        this.questionButton.setScale(0.1, 0.1);
        this.questionButton.setOrigin(0.5, 0.5);
        this.questionButton.setDepth(100);

        this.questionButton.on("pointerdown", () => {
            // Transition to the Rules scene, passing the player's current position
            this.scene.scene.start("Rules", {
                nextScene: this.scene.scene.key,
                playerSpawn: {
                    x: this.scene.player.x,
                    y: this.scene.player.y,
                },
                doctorType: this.scene.doctorType,
                minigame: this.scene.minigame,
            });
        });
    }

    createCounters() {
        let offsetY = 32;
        VALUES.forEach((name) => {
            const value = getCounter(name);
            this.counters[name] = this.addCounter(name, value, offsetY);
            offsetY += 64;
        });
    }

    addCounter(name, value, offsetY) {
        const counterText = this.scene.add
            .text(10, offsetY, name, {
                fontFamily: "'Press Start 2P'",
                fontSize: "12px",
                color: "#ffffff",
            })
            .setOrigin(0);

        const batteryBar = this.scene.add.graphics();
        this.drawBatteryMeter(
            batteryBar,
            10,
            offsetY + 18,
            value / MAX_BATTERY_VALUE
        );

        this.add([counterText, batteryBar]);
        return { text: counterText, batteryBar: batteryBar };
    }

    drawBatteryMeter(graphics, x, y, percentage) {
        const width = 150;
        const height = 20;
        const padding = 2;
        const innerWidth = width - padding * 2;
        const innerHeight = height - padding * 2;
        const sectionWidth = innerWidth / MAX_BATTERY_VALUE;

        // Draw outer border with rounded corners
        graphics.lineStyle(2, BATTERY_OUTLINE, 1);
        graphics.strokeRoundedRect(x, y, width, height, BATTERY_RADIUS);

        // Draw inner battery bar with rounded corners
        graphics.fillStyle(0x686868, 1);
        graphics.fillRoundedRect(
            x + padding,
            y + padding,
            innerWidth,
            innerHeight,
            BATTERY_RADIUS
        );

        // Fill the battery according to the percentage
        if (percentage > 0) {
            graphics.fillStyle(0x00ff00, 1);
            const filledWidth = innerWidth * percentage;
            graphics.fillRoundedRect(
                x + padding,
                y + padding,
                filledWidth,
                innerHeight,
                BATTERY_RADIUS
            );
        }

        // Draw vertical lines to divide the battery bar into sections
        for (let i = 1; i < MAX_BATTERY_VALUE; i++) {
            graphics.lineStyle(1, BATTERY_OUTLINE, 1);
            graphics.beginPath();
            graphics.moveTo(x + padding + i * sectionWidth, y + padding);
            graphics.lineTo(
                x + padding + i * sectionWidth,
                y + padding + innerHeight
            );
            graphics.strokePath();
        }
    }
}

function addToHUDScore(name) {
    const currentValue = getCounter(name);
    if (currentValue < MAX_BATTERY_VALUE) {
        saveCounter(name, currentValue + 1);
    }
}

export { HUD, addToHUDScore };

