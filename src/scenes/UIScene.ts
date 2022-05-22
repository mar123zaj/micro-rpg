import Phaser from 'phaser';
import Skill1 from '../../public/assets/ui/icons/button1.png';
import Skill2 from '../../public/assets/ui/icons/button2.png';
import Skill3 from '../../public/assets/ui/icons/button3.png';
import SkillPlaceholder from '../../public/assets/ui/skill_placeholder.png';
import SkillPlaceholderWhite from '../../public/assets/ui/skill_placeholder_white.png';
import Fonts from '../configs/Fonts';
import { Event } from '../enums/events.enum';
import { Skill } from '../enums/skills.enum';
import eventsCenter from '../EventsCenter';

export default class UIScene extends Phaser.Scene {
  private skillButton1: Phaser.GameObjects.Image;
  private skillButton2: Phaser.GameObjects.Image;
  private skillButton3: Phaser.GameObjects.Image;
  private container: Phaser.GameObjects.Container;
  private skills: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('ui');
  }

  preload(): void {
    this.load.image('skill1', Skill1);
    this.load.image('skill2', Skill2);
    this.load.image('skill3', Skill3);
    this.load.image('skill_placeholder', SkillPlaceholder);
    this.load.image('skill_placeholder_white', SkillPlaceholderWhite);
    this.load.bitmapFont('default', ...Fonts.default);
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    let skillX = 0;
    for (let i = 0; i < 10; i++) {
      const skillFrame = this.add.image(skillX, 0, 'skill_placeholder_white').setOrigin(1, 0);
      this.skills.push(skillFrame);

      skillX += skillFrame.width + 2;
    }

    this.container = this.add.container(width / 2 - this.skills[0].width * 5 - 10, height * 0.9, this.skills);
    // this.skillButton1 = this.add.image(width / 2, height * 0.9, 'skill1').setOrigin(1, 0);
    // this.skillButton2 = this.add.image(width / 2 + this.skillButton1.width, height * 0.9, 'skill2').setOrigin(1, 0);
    // this.skillButton3 = this.add
    //   .image(width / 2 + this.skillButton1.width + this.skillButton2.width, height * 0.9, 'skill3')
    //   .setOrigin(1, 0);

    eventsCenter.on(Event.TURN_ON_HIGHLIGHT_SKILL_BUTTON, this.turnOnHighlightSkillButtonHandler, this);
    eventsCenter.on(Event.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, this.turnOffHighlightSkillButtonHandler, this);
  }

  private turnOnHighlightSkillButtonHandler(skill: Skill): void {
    // TODO: To refactor
    switch (+skill) {
      case Skill.ONE:
        this.skills[0].setTint(0x8afbff);
        break;
      case Skill.TWO:
        this.skills[1].setTint(0x8afbff);
        break;
      case Skill.THREE:
        this.skills[2].setTint(0x8afbff);
        break;
      case Skill.FOUR:
        this.skills[3].setTint(0x8afbff);
        break;
      case Skill.FIVE:
        this.skills[4].setTint(0x8afbff);
        break;
      case Skill.SIX:
        this.skills[5].setTint(0x8afbff);
        break;
      case Skill.SEVEN:
        this.skills[6].setTint(0x8afbff);
        break;
      case Skill.EIGHT:
        this.skills[7].setTint(0x8afbff);
        break;
      case Skill.NINE:
        this.skills[8].setTint(0x8afbff);
        break;
      case Skill.ZERO:
        this.skills[9].setTint(0x8afbff);
        break;
    }
  }

  private turnOffHighlightSkillButtonHandler(skill: Skill): void {
    // TODO: To refactor
    switch (+skill) {
      case Skill.ONE:
        this.skills[0].setTint(0xffffff);
        break;
      case Skill.TWO:
        this.skills[1].setTint(0xffffff);
        break;
      case Skill.THREE:
        this.skills[2].setTint(0xffffff);
        break;
      case Skill.FOUR:
        this.skills[3].setTint(0xffffff);
        break;
      case Skill.FIVE:
        this.skills[4].setTint(0xffffff);
        break;
      case Skill.SIX:
        this.skills[5].setTint(0xffffff);
        break;
      case Skill.SEVEN:
        this.skills[6].setTint(0xffffff);
        break;
      case Skill.EIGHT:
        this.skills[7].setTint(0xffffff);
        break;
      case Skill.NINE:
        this.skills[8].setTint(0xffffff);
        break;
      case Skill.ZERO:
        this.skills[9].setTint(0xffffff);
        break;
    }
  }

  static skillKeyPressHandler(skill: Skill, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      if (!keys.has(event.code)) {
        keys.add(event.code);
        eventsCenter.emit(Event.TURN_ON_HIGHLIGHT_SKILL_BUTTON, skill);
      }
    };
  }

  static skillKeyReleaseHandler(skill: Skill, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      keys.delete(event.code);
      eventsCenter.emit(Event.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, skill);
    };
  }
}
