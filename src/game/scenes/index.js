import { Boot } from "./Boot";
import { Game } from "./Game";
import { GameOver } from "./GameOver";
import { MainMenu } from "./MainMenu";
import { Preloader } from "./Preloader";
import { ChooseCharacter } from "./ChooseCharacter";
import { Maze } from "./Maze";

// IMPORTANT: you must import and add your new scene to this array for it to be renderable!!
export const scenes = [
    Boot,
    Preloader,
    MainMenu,
    ChooseCharacter,
    Game,
    GameOver,
    Maze
];

