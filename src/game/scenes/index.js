import { Boot } from "./Boot";
import { City } from "./City";
import { Hospital } from "./hospital/Hospital";
import { MainMenu } from "./MainMenu";
import { Preloader } from "./Preloader";

// IMPORTANT: you must import and add your new scene to this array for it to be renderable!!
export const scenes = [Boot, Preloader, MainMenu, City, Hospital];

