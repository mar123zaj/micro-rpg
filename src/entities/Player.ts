import Phaser from 'phaser';
import { AnimSet } from '../configs/Graphics';

const staggerDuration = 200;
const staggerSpeed = 100;

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  one: Phaser.Input.Keyboard.Key;
}

// TODO: Split character classes into three different classes
export default class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  animation: AnimSet;
  keys: Keys;
  speed: number;
  // TODO: Implement critical power
  criticalHitChance: number;
  coins = 0;

  attacking = false;
  facingUp = false;
  staggered = false;
  attackUntil = 0;
  staggerUntil = 0;
  attackLockedUntil = 0;
  time = 0;
  scene: Phaser.Scene;
  body: Phaser.Physics.Arcade.Body;
  attackDuration = 800;
  attackCooldown = 800;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      w: 'w',
      a: 'a',
      s: 's',
      d: 'd',
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
    }) as Keys;
  }

  isAttacking(): boolean {
    return this.attacking;
  }

  stagger(): void {
    if (this.time > this.staggerUntil) {
      this.staggered = true;
      this.scene.cameras.main.shake(150, 0.001);
      this.scene.cameras.main.flash(50, 100, 0, 0);
    }
  }

  isFacingLeft(): boolean {
    return this.sprite.flipX;
  }

  isCriticalHit(): boolean {
    return Math.random() < this.criticalHitChance;
  }

  addCoins(quantity: number): void {
    this.coins += quantity;
  }

  update(time: number): void {
    this.time = time;
    let moveAnim = '';

    if (this.staggered && !this.body.touching.none) {
      this.staggerUntil = this.time + staggerDuration;
      this.staggered = false;

      this.body.setVelocity(0);
      if (this.body.touching.down) {
        this.body.setVelocityY(-staggerSpeed);
      } else if (this.body.touching.up) {
        this.body.setVelocityY(staggerSpeed);
      } else if (this.body.touching.left) {
        this.body.setVelocityX(staggerSpeed);
        this.sprite.setFlipX(true);
      } else if (this.body.touching.right) {
        this.body.setVelocityX(-staggerSpeed);
        this.sprite.setFlipX(false);
      }
    }

    this.body.setVelocity(0);

    const left = this.keys.left.isDown || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const up = this.keys.up.isDown || this.keys.w.isDown;
    const down = this.keys.down.isDown || this.keys.s.isDown;

    if (!this.body.blocked.left && left) {
      this.body.setVelocityX(-this.speed);
      this.sprite.setFlipX(true);
    } else if (!this.body.blocked.right && right) {
      this.body.setVelocityX(this.speed);
      this.sprite.setFlipX(false);
    }

    if (!this.body.blocked.up && up) {
      this.body.setVelocityY(-this.speed);
    } else if (!this.body.blocked.down && down) {
      this.body.setVelocityY(this.speed);
    }

    if (left || right) {
      moveAnim = this.animation.animations.walk.key;
      this.facingUp = false;
    } else if (down) {
      moveAnim = this.animation.animations.walk.key;
      this.facingUp = false;
    } else if (up) {
      moveAnim = this.animation.animations.walkBack.key;
      this.facingUp = true;
    } else if (this.facingUp) {
      moveAnim = this.animation.animations.idleBack.key;
    } else {
      moveAnim = this.animation.animations.idle.key;
    }

    this.sprite.anims.play(moveAnim, true);
    this.body.velocity.normalize().scale(this.speed);
  }
}
