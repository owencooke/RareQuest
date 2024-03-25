import { Boot } from "./Boot";
import { City } from "./City";

import { Hospital } from "./hospital/Hospital";
import { MainMenu } from "./MainMenu";
import { Story } from "./Story";
import { Preloader } from "./Preloader";
import { TileJump } from "./TileJump";
import { GameOverTileJump } from "./GameOverTileJump";
import { Maze } from "./Maze";
import { Pong, gameEnd } from "./Pong";
import { MinigameMenu } from "./MinigameMenu";

// IMPORTANT: you must import and add your new scene to this array for it to be renderable!!
export const scenes = [
    Boot,
    Preloader,
    MainMenu,
    Story,
    City,
    Hospital,
    TileJump,
    GameOverTileJump,
    Maze,
    Pong,
    gameEnd,
    MinigameMenu,
];
