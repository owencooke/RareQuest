// make a maze scene
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Maze extends Scene {
  constructor() {
    super('Maze');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.image(512, 384, 'background').setAlpha(0.5);

    this.add.text(512, 384, 'Maze', {
      fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('MainMenu');
  }
}