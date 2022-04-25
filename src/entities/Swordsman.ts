import Graphics from '../configs/Graphics';
import Player from './Player';

export class Swordsman extends Player {
  sword: Phaser.GameObjects.Rectangle;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(scene);
    this.animation = Graphics.swordsman;
    this.sprite = scene.physics.add.sprite(x, y, this.animation.name, 0);
    this.sprite.setSize(4, 4);
    this.sprite.setOffset(8, 10);
    this.sprite.anims.play(this.animation.animations.idle.key);
    this.sprite.setDepth(5);

    this.sword = scene.add.rectangle(0, 0, 8, 8);
    scene.physics.add.existing(this.sword);
    this.sword.setPosition(x + 4, y + 4);

    this.speed = 55;
    this.criticalHitChance = 0.02;
    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
  }

  update(time: number): void {
    if (time < this.attackUntil || time < this.staggerUntil) {
      return;
    }

    super.update(time);

    this.sword.setPosition(this.isFacingLeft() ? this.sprite.x - 4 : this.sprite.x + 4, this.sprite.y + 2);
    // TODO: Improve buffs and effects
    if (this.keys.one.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + this.attackDuration;
      this.attackLockedUntil = time + this.attackDuration + this.attackCooldown;

      const skillAnim = this.animation.animations.swordBuff.key;
      this.sprite.anims.play(skillAnim, true);

      this.body.setVelocity(0, 0);
      return;
    }

    if (this.keys.space.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + this.attackDuration;
      this.attackLockedUntil = time + this.attackDuration + this.attackCooldown;
      const attackAnim = this.animation.animations.attack.key;
      this.sprite.anims.play(attackAnim, true);
      this.scene.add.shader(this.animation.name);

      if (this.isCriticalHit()) {
        // TODO: Increase attack power when critical
        this.scene.cameras.main.shake(150, 0.003);
      }

      this.attacking = true;
      this.body.setVelocity(0, 0);
      return;
    }

    this.attacking = false;
    this.body.velocity.normalize().scale(this.speed);
    this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
  }
}
