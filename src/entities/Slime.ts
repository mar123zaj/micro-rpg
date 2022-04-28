import Phaser from 'phaser';
import Graphics, { AnimSet } from '../configs/Graphics';

const speed = 20;

export default class Slime {
  public readonly sprite: Phaser.Physics.Arcade.Sprite;
  public readonly body: Phaser.Physics.Arcade.Body;
  private nextAction: number;
  private animSet: AnimSet;
  private fullHP: number;
  hp: number;
  rewardSize: number;
  private healthBar: Phaser.GameObjects.Image;
  scene: Phaser.Scene;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.scene = scene;
    const isGreenSlime = Math.random() < 0.8;

    this.animSet = isGreenSlime ? Graphics.greenSlime : Graphics.redSlime;
    this.rewardSize = isGreenSlime ? Phaser.Math.Between(0, 7) : Phaser.Math.Between(0, 10);
    const fullHP = isGreenSlime ? Phaser.Math.Between(80, 120) : Phaser.Math.Between(100, 150);

    this.fullHP = fullHP;
    this.hp = fullHP;

    this.sprite = scene.physics.add.sprite(x, y, this.animSet.name, 0);
    this.sprite.setSize(12, 10);
    this.sprite.setOffset(10, 14);
    this.sprite.anims.play(this.animSet.animations.idle.key);
    this.sprite.setDepth(10);
    this.healthBar = scene.add.image(0, 0, 'enemyHealthBar100');
    this.healthBar.setDepth(10);

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
    this.nextAction = 0;
    this.body.bounce.set(0, 0);
    this.body.setImmovable(true);
  }

  attacked(hitPower: number): void {
    this.hp -= hitPower;
    this.setHealthBar();
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  setHealthBar(): void {
    const health = (this.hp / this.fullHP) * 100;

    if (90 >= health && health > 80) {
      this.healthBar.setTexture('enemyHealthBar90');
    } else if (80 >= health && health > 70) {
      this.healthBar.setTexture('enemyHealthBar80');
    } else if (70 >= health && health > 60) {
      this.healthBar.setTexture('enemyHealthBar70');
    } else if (60 >= health && health > 50) {
      this.healthBar.setTexture('enemyHealthBar60');
    } else if (50 >= health && health > 40) {
      this.healthBar.setTexture('enemyHealthBar50');
    } else if (40 >= health && health > 30) {
      this.healthBar.setTexture('enemyHealthBar40');
    } else if (30 >= health && health > 20) {
      this.healthBar.setTexture('enemyHealthBar30');
    } else if (20 >= health && health > 10) {
      this.healthBar.setTexture('enemyHealthBar20');
    } else if (10 >= health && health > 0) {
      this.healthBar.setTexture('enemyHealthBar10');
    }
  }

  update(time: number): void {
    this.healthBar.setPosition(this.sprite.x, this.sprite.y - 8);
    if (time < this.nextAction) {
      return;
    }

    if (Phaser.Math.Between(0, 1) === 0) {
      this.body.setVelocity(0);
      this.sprite.anims.play(this.animSet.animations.idle.key, true);
    } else {
      this.sprite.anims.play(this.animSet.animations.move.key, true);
      const direction = Phaser.Math.Between(0, 3);
      this.body.setVelocity(0);

      if (!this.body.blocked.left && direction === 0) {
        this.body.setVelocityX(-speed);
      } else if (!this.body.blocked.right && direction <= 1) {
        this.body.setVelocityX(speed);
      } else if (!this.body.blocked.up && direction <= 2) {
        this.body.setVelocityY(-speed);
      } else if (!this.body.blocked.down && direction <= 3) {
        this.body.setVelocityY(speed);
      } else {
        console.log(`Couldn't find direction for greenSlime: ${direction}`);
      }
    }

    this.nextAction = time + Phaser.Math.Between(1000, 3000);
  }

  eliminate(): void {
    this.sprite.anims.play(this.animSet.animations.death.key, false);
    this.sprite.disableBody();
    this.healthBar.destroy();
  }
}
