import Graphics from '../configs/Graphics';
import Player from './Player';

export class Archer extends Player {
  arrows: Phaser.Physics.Arcade.Group;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(scene);

    this.animation = Graphics.archer;

    this.sprite = scene.physics.add.sprite(x, y, this.animation.name, 0);
    this.sprite.setSize(4, 4);
    this.sprite.setOffset(6, 12);
    this.sprite.anims.play(this.animation.animations.idle.key);
    this.sprite.setDepth(5);

    this.arrows = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.speed = 70;
    this.criticalHitChance = 0.06;
    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
  }

  shootWithArrow(): void {
    if (!this.arrows) {
      return;
    }

    const arrow = this.arrows.get(this.sprite.x, this.sprite.y, Graphics.arrow.name) as Phaser.Physics.Arcade.Image;

    if (!arrow) {
      return;
    }

    const vec = new Phaser.Math.Vector2(0, 0);
    vec.x = this.isFacingLeft() ? -1 : 1;

    const angle = vec.angle();

    arrow.setActive(true);
    arrow.setVisible(true);

    arrow.setRotation(angle);

    arrow.x += vec.x * 16;
    arrow.y += vec.y * 16;

    arrow.setVelocity(vec.x * 300, vec.y * 300);
  }

  update(time: number): void {
    if (time < this.attackUntil || time < this.staggerUntil) {
      return;
    }

    super.update(time);

    // TODO: Improve buffs and effects
    if (this.keys.one.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + this.attackDuration;
      this.attackLockedUntil = time + this.attackDuration + this.attackCooldown;

      this.sprite.setBlendMode(Phaser.BlendModes.ADD);

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

      this.shootWithArrow();

      this.attacking = true;
      this.body.setVelocity(0, 0);
      return;
    }

    this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
  }
}
