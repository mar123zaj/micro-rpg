import Phaser from 'phaser';
import Graphics from '../configs/Graphics';

export default class SkillsSeller {
  public readonly sprite: Phaser.Physics.Arcade.Sprite;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.sprite = scene.physics.add.sprite(x, y, Graphics.skillsSeller.name, 0);

    this.sprite.setSize(12, 8);
    this.sprite.setOffset(2, 8);
    this.sprite.anims.play(Graphics.skillsSeller.animations.idle.key);
    this.sprite.setDepth(5);
  }
}
