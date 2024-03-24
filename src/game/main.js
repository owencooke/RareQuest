import Phaser from "phaser";
import { scenes } from "./scenes";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    width: 1280,
    height: 800,
    type: Phaser.AUTO,
    scene: scenes,
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
