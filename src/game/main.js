import Phaser from "phaser";
import { scenes } from "./scenes";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: scenes,
    // scale: {
    //     // Fit to window
    //     mode: Phaser.Scale.FIT,
    //     // Center vertically and horizontally
    //     autoCenter: Phaser.Scale.CENTER_BOTH,
    // },
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

