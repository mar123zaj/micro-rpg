import Phaser from 'phaser';
import Graphics, { AnimSet } from '../configs/Graphics';
import { PlayerClass } from '../scenes/ClassSelectionScene';

const speed = 70;
const attackSpeed = 500;
const attackDuration = 800;
const staggerDuration = 200;
const staggerSpeed = 100;
const attackCooldown = attackDuration;

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

export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private animation: AnimSet;
  private keys: Keys;

  private attackUntil: number;
  private staggerUntil: number;
  private attackLockedUntil: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private flashEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private body: Phaser.Physics.Arcade.Body;
  private attacking: boolean;
  private time: number;
  private staggered: boolean;
  private scene: Phaser.Scene;
  private facingUp: boolean;
  weapon: Phaser.GameObjects.Rectangle;

  constructor(x: number, y: number, scene: Phaser.Scene, playerClass: PlayerClass) {
    this.scene = scene;
    console.log({ playerClass });
    switch (playerClass) {
      case PlayerClass.SWORDSMAN:
        this.animation = Graphics.swordsman;
        break;
      case PlayerClass.ARCHER:
        this.animation = Graphics.swordsman;
        break;
      case PlayerClass.MAGE:
        this.animation = Graphics.swordsman;
        break;
    }
    this.sprite = scene.physics.add.sprite(x, y, this.animation.name, 0);
    this.sprite.setSize(4, 4);
    this.sprite.setOffset(8, 10);
    this.sprite.anims.play(this.animation.animations.idle.key);
    this.facingUp = false;
    this.sprite.setDepth(5);

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

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
    this.attacking = false;
    this.staggerUntil = 0;
    this.staggered = false;
    const particles = scene.add.particles(this.animation.name);
    particles.setDepth(6);
    this.emitter = particles.createEmitter({
      alpha: { start: 0.7, end: 0, ease: 'Cubic.easeOut' },
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      },
    });
    this.emitter.stop();

    this.flashEmitter = particles.createEmitter({
      alpha: { start: 0.5, end: 0, ease: 'Cubic.easeOut' },
      follow: this.sprite,
      quantity: 1,
      lifespan: 100,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      },
    });
    this.flashEmitter.stop();

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
    this.time = 0;

    this.weapon = scene.add.rectangle(0, 0, 8, 8); // as any as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
    scene.physics.add.existing(this.weapon);

    this.weapon.setPosition(x + 4, y + 4);
  }

  isAttacking(): boolean {
    return this.attacking;
  }

  stagger(): void {
    if (this.time > this.staggerUntil) {
      this.staggered = true;
      // TODO
      this.scene.cameras.main.shake(150, 0.001);
      this.scene.cameras.main.flash(50, 100, 0, 0);
    }
  }

  update(time: number): void {
    this.time = time;
    const keys = this.keys;
    let attackAnim = '';
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
      //this.sprite.anims.play(this.animation.animations.stagger.key);
      this.flashEmitter.start();
      // this.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
    }
    this.weapon.setPosition(this.sprite.flipX ? this.sprite.x - 4 : this.sprite.x + 4, this.sprite.y + 2);

    if (time < this.attackUntil || time < this.staggerUntil) {
      return;
    }

    this.body.setVelocity(0);

    const left = keys.left.isDown || keys.a.isDown;
    const right = keys.right.isDown || keys.d.isDown;
    const up = keys.up.isDown || keys.w.isDown;
    const down = keys.down.isDown || keys.s.isDown;

    if (!this.body.blocked.left && left) {
      this.body.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (!this.body.blocked.right && right) {
      this.body.setVelocityX(speed);
      this.sprite.setFlipX(false);
    }

    if (!this.body.blocked.up && up) {
      this.body.setVelocityY(-speed);
    } else if (!this.body.blocked.down && down) {
      this.body.setVelocityY(speed);
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

    if (keys.space.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration + attackCooldown;
      attackAnim = this.animation.animations.attack.key;
      this.sprite.anims.play(attackAnim, true);

      this.attacking = true;
      this.body.setVelocity(0, 0);
      return;
    }

    if (keys.one.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration + attackCooldown;
      const skillAnim = this.animation.animations.swordBuff.key;
      this.sprite.anims.play(skillAnim, true);

      return;
    }

    this.attacking = false;
    this.sprite.anims.play(moveAnim, true);
    this.body.velocity.normalize().scale(speed);
    this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
    if (this.emitter.on) {
      this.emitter.stop();
    }
    if (this.flashEmitter.on) {
      this.flashEmitter.stop();
    }
  }
}
