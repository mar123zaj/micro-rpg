import Phaser from 'phaser';
import ClassSelectionScene from './scenes/ClassSelectionScene';
import DecisionWindowScene from './scenes/DecisionWindowScene';
import DungeonScene from './scenes/DungeonScene';
import MenuScene from './scenes/MenuScene';
import PlayerSkillsScene from './scenes/PlayerSkillsScene';
import SkillShopScene from './scenes/SkillShopScene';
import UIScene from './scenes/UIScene';

new Phaser.Game({
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  render: { pixelArt: true },
  physics: { default: 'arcade', arcade: { debug: true, gravity: { y: 0 } } },
  scene: [
    MenuScene,
    ClassSelectionScene,
    DungeonScene,
    UIScene,
    SkillShopScene,
    PlayerSkillsScene,
    DecisionWindowScene,
  ],
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
});
