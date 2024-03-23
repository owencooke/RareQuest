// make a maze scene
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Maze extends Scene {
  constructor() {
    super('Maze');
    this.player;
    this.cursors;
    this.currentDirection = 'down';
  }

  preload() {
    this.load.tilemapTiledJSON('maze', './assets/maze.json');
    this.load.image('maze-tiles', './assets/maze-tiles.png');
    this.load.spritesheet('player', './assets/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }


}