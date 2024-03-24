import { Boot } from "./Boot";
import { City } from "./City";
import { Hospital } from "./hospitalRoom"
import { MainMenu } from "./MainMenu";
import { Preloader } from "./Preloader";
import { ChooseCharacter } from "./ChooseCharacter";
import { TileJump } from "./TileJump";
import { GameOverTileJump } from "./GameOverTileJump";
import { Maze } from "./Maze";

// IMPORTANT: you must import and add your new scene to this array for it to be renderable!!
export const scenes = [Boot, Preloader, MainMenu, City, Hospital    TileJump,
    GameOverTileJump,
];

