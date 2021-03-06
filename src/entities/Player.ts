import Phaser from 'phaser';
import { AnimSet } from '../configs/Graphics';
import { Event } from '../enums/events.enum';
import eventsCenter from '../EventsCenter';
import { Skill, SkillMechanics } from '../types/skill.type';

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
  two: Phaser.Input.Keyboard.Key;
  three: Phaser.Input.Keyboard.Key;
  four: Phaser.Input.Keyboard.Key;
  five: Phaser.Input.Keyboard.Key;
  six: Phaser.Input.Keyboard.Key;
  seven: Phaser.Input.Keyboard.Key;
  eight: Phaser.Input.Keyboard.Key;
  nine: Phaser.Input.Keyboard.Key;
  zero: Phaser.Input.Keyboard.Key;
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
  skills: Skill[] = [];
  skillsBindMapping: Record<string, SkillMechanics> = {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
    seven: null,
    eight: null,
    nine: null,
    zero: null,
  };

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
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
      four: Phaser.Input.Keyboard.KeyCodes.FOUR,
      five: Phaser.Input.Keyboard.KeyCodes.FIVE,
      six: Phaser.Input.Keyboard.KeyCodes.SIX,
      seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
      eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
      nine: Phaser.Input.Keyboard.KeyCodes.NINE,
      zero: Phaser.Input.Keyboard.KeyCodes.ZERO,
    }) as Keys;

    eventsCenter.on(Event.SKILL_PURCHASED, this.addPurchasedSkill, this);
    eventsCenter.on(Event.BIND_SKILL_MECHANICS_TO_BUTTON, this.bindSkillMechanicsToButton, this);
    eventsCenter.on(Event.UNBIND_SKILL_MECHANICS_FROM_BUTTON, this.unbindSkillMechanicsFromButton, this);
  }

  bindSkillMechanicsToButton(skillMechanics: SkillMechanics, buttonNumber: number): void {
    switch (buttonNumber) {
      case 0:
        this.skillsBindMapping.zero = skillMechanics;
        break;
      case 1:
        this.skillsBindMapping.one = skillMechanics;
        break;
      case 2:
        this.skillsBindMapping.two = skillMechanics;
        break;
      case 3:
        this.skillsBindMapping.three = skillMechanics;
        break;
      case 4:
        this.skillsBindMapping.four = skillMechanics;
        break;
      case 5:
        this.skillsBindMapping.five = skillMechanics;
        break;
      case 6:
        this.skillsBindMapping.six = skillMechanics;
        break;
      case 7:
        this.skillsBindMapping.seven = skillMechanics;
        break;
      case 8:
        this.skillsBindMapping.eight = skillMechanics;
        break;
      case 9:
        this.skillsBindMapping.nine = skillMechanics;
        break;
    }
  }

  unbindSkillMechanicsFromButton(buttonNumber: number): void {
    switch (buttonNumber) {
      case 0:
        this.skillsBindMapping.zero = null;
        break;
      case 1:
        this.skillsBindMapping.one = null;
        break;
      case 2:
        this.skillsBindMapping.two = null;
        break;
      case 3:
        this.skillsBindMapping.three = null;
        break;
      case 4:
        this.skillsBindMapping.four = null;
        break;
      case 5:
        this.skillsBindMapping.five = null;
        break;
      case 6:
        this.skillsBindMapping.six = null;
        break;
      case 7:
        this.skillsBindMapping.seven = null;
        break;
      case 8:
        this.skillsBindMapping.eight = null;
        break;
      case 9:
        this.skillsBindMapping.nine = null;
        break;
    }
  }

  addPurchasedSkill(skill: Skill): void {
    if (this.wasSkillAlreadyPurchased(skill)) {
      return;
    }

    this.skills.push(skill);
    eventsCenter.emit(Event.UPDATE_PLAYER_SKILLS_SCENE, this.skills);
  }

  wasSkillAlreadyPurchased(skill: Skill): boolean {
    const {
      info: { name: skillName },
    } = skill;

    return this.skills.some((skill) => skill.info.name === skillName);
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

    if (!this.sprite.body.enable) {
      return;
    }

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

    const one = this.keys.one.isDown;
    const two = this.keys.two.isDown;
    const three = this.keys.three.isDown;
    const four = this.keys.four.isDown;
    const five = this.keys.five.isDown;
    const six = this.keys.six.isDown;
    const seven = this.keys.seven.isDown;
    const eight = this.keys.eight.isDown;
    const nine = this.keys.nine.isDown;
    const zero = this.keys.zero.isDown;

    let skillMechanics: SkillMechanics;
    // TODO: To refactor
    if (one) {
      skillMechanics = this.skillsBindMapping['one'];
    } else if (two) {
      skillMechanics = this.skillsBindMapping['two'];
    } else if (three) {
      skillMechanics = this.skillsBindMapping['three'];
    } else if (four) {
      skillMechanics = this.skillsBindMapping['four'];
    } else if (five) {
      skillMechanics = this.skillsBindMapping['five'];
    } else if (six) {
      skillMechanics = this.skillsBindMapping['six'];
    } else if (seven) {
      skillMechanics = this.skillsBindMapping['seven'];
    } else if (eight) {
      skillMechanics = this.skillsBindMapping['eight'];
    } else if (nine) {
      skillMechanics = this.skillsBindMapping['nine'];
    } else if (zero) {
      skillMechanics = this.skillsBindMapping['zero'];
    }

    if (skillMechanics) {
      try {
        skillMechanics(this.scene);
      } catch (error) {
        return;
      }
    }

    this.sprite.anims.play(moveAnim, true);
    this.body.velocity.normalize().scale(this.speed);
  }
}
