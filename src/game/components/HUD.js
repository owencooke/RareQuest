import { GameObjects } from "phaser";

const VALUES = ["Engagement", "Integrity", "Inclusion", "Collaboration"];
const MAX_BATTERY_VALUE = 5;
const BATTERY_OUTLINE = 0x000000;

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
        scene.add.existing(this);
        this.setScrollFactor(0);
    }

    createCounters() {
        let offsetY = 16;
        VALUES.forEach((name) => {
            const value = getCounter(name);
            this.counters[name] = this.addCounter(name, value, offsetY);
            offsetY += 70;
        });
    }

    addCounter(name, value, offsetY) {
        const counterText = this.scene.add
            .text(10, offsetY, name, {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
            })
            .setOrigin(0);

        const batteryBar = this.scene.add.graphics();
        this.drawBatteryMeter(
            batteryBar,
            10,
            offsetY + 30,
            value / MAX_BATTERY_VALUE
        );

        this.add([counterText, batteryBar]);
        return { text: counterText, batteryBar: batteryBar };
    }

    updateBattery(name, value) {
        const batteryBar = this.counters[name].batteryBar;
        batteryBar.clear();
        this.drawBatteryMeter(
            batteryBar,
            10,
            this.counters[name].text.y + 30,
            value / MAX_BATTERY_VALUE
        );
    }

    drawBatteryMeter(graphics, x, y, percentage) {
        const width = 150;
        const height = 20;
        const padding = 2;
        const innerWidth = width - padding * 2;
        const innerHeight = height - padding * 2;
        const sectionWidth = innerWidth / MAX_BATTERY_VALUE;

        // Draw outer border
        graphics.lineStyle(2, BATTERY_OUTLINE, 1);
        graphics.strokeRect(x, y, width, height);

        // Draw inner battery bar
        graphics.fillStyle(0x686868, 1);
        graphics.fillRect(x + padding, y + padding, innerWidth, innerHeight);

        // Fill the battery according to the percentage
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(
            x + padding,
            y + padding,
            innerWidth * percentage,
            innerHeight
        );

        // Draw vertical lines to divide the battery bar into sections
        for (let i = 1; i < 5; i++) {
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
    saveCounter(name, currentValue + 1);
}

export { HUD, addToHUDScore };

