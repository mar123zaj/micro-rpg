import Phaser from 'phaser';
import Skill1 from '../../assets/ui/icons/button1.png';
import Skill2 from '../../assets/ui/icons/button2.png';
import Skill3 from '../../assets/ui/icons/button3.png';
import Fonts from '../assets/Fonts';
import eventsCenter from '../EventsCenter';
import { EventsEnum } from '../enums/events.enum';
import { Skill } from '../enums/skills.enum';

interface Keys {
  ONE: Phaser.Input.Keyboard.Key;
  TWO: Phaser.Input.Keyboard.Key;
  THREE: Phaser.Input.Keyboard.Key;
}

export default class UIScene extends Phaser.Scene {
  private keys: Keys;
  private skillButton1: Phaser.GameObjects.Image;
  private skillButton2: Phaser.GameObjects.Image;
  private skillButton3: Phaser.GameObjects.Image;
  text?: Phaser.GameObjects.DynamicBitmapText;

  constructor() {
    super('ui');
  }

  preload(): void {
    this.load.image('skill1', Skill1);
    this.load.image('skill2', Skill2);
    this.load.image('skill3', Skill3);
    this.load.bitmapFont('default', ...Fonts.default);
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this.skillButton1 = this.add.image(width / 2, height * 0.9, 'skill1').setOrigin(1, 0);
    this.skillButton2 = this.add.image(width / 2 + this.skillButton1.width, height * 0.9, 'skill2').setOrigin(1, 0);
    this.skillButton3 = this.add
      .image(width / 2 + this.skillButton1.width + this.skillButton2.width, height * 0.9, 'skill3')
      .setOrigin(1, 0);

    eventsCenter.on(EventsEnum.TURN_ON_HIGHLIGHT_SKILL_BUTTON, this.turnOnHighlightSkillButtonHandler, this);
    eventsCenter.on(EventsEnum.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, this.turnOffHighlightSkillButtonHandler, this);
  }

  private turnOnHighlightSkillButtonHandler(skill: Skill): void {
    switch (+skill) {
      case Skill.ONE:
        this.skillButton1.setTint(0x8afbff);
        break;
      case Skill.TWO:
        this.skillButton2.setTint(0x8afbff);
        break;
      case Skill.THREE:
        this.skillButton3.setTint(0x8afbff);
    }
  }

  private turnOffHighlightSkillButtonHandler(skill: Skill): void {
    switch (+skill) {
      case Skill.ONE:
        this.skillButton1.setTint(0xffffff);
        break;
      case Skill.TWO:
        this.skillButton2.setTint(0xffffff);
        break;
      case Skill.THREE:
        this.skillButton3.setTint(0xffffff);
    }
  }

  static skillKeyPressHandler(skill: Skill, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      if (!keys.has(event.code)) {
        keys.add(event.code);
        eventsCenter.emit(EventsEnum.TURN_ON_HIGHLIGHT_SKILL_BUTTON, skill);
      }
    };
  }

  static skillKeyReleaseHandler(skill: Skill, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      keys.delete(event.code);
      eventsCenter.emit(EventsEnum.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, skill);
    };
  }
}
