import Phaser from 'phaser';
import DungeonScene from './scenes/DungeonScene';
import MenuScene from './scenes/MenuScene';
import UIScene from './scenes/UIScene';

new Phaser.Game({
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  render: { pixelArt: true },
  physics: { default: 'arcade', arcade: { debug: false, gravity: { y: 0 } } },
  scene: [MenuScene, DungeonScene, UIScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
});
