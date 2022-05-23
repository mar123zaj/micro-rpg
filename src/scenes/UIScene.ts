import Phaser from 'phaser';
import Skill1 from '../../public/assets/ui/icons/button1.png';
import Skill2 from '../../public/assets/ui/icons/button2.png';
import Skill3 from '../../public/assets/ui/icons/button3.png';
import SkillPlaceholder from '../../public/assets/ui/skill_placeholder.png';
import SkillPlaceholderWhite from '../../public/assets/ui/skill_placeholder_white.png';
import Fonts from '../configs/Fonts';
import { Event } from '../enums/events.enum';
import { SkillButton } from '../enums/skills.enum';
import eventsCenter from '../EventsCenter';

export default class UIScene extends Phaser.Scene {
  private skillButton1: Phaser.GameObjects.Image;
  private skillButton2: Phaser.GameObjects.Image;
  private skillButton3: Phaser.GameObjects.Image;
  private container: Phaser.GameObjects.Container;
  private skillsButtonsContainers: Phaser.GameObjects.Container[] = [];

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
    for (let i = 1; i <= 10; i++) {
      const buttonNumber = i !== 10 ? i : 0;

      const skillFrame = this.add.image(0, 0, 'skill_placeholder_white').setOrigin(1, 0);
      const displayText = this.add.dynamicBitmapText(0, 0, 'default', buttonNumber.toString(), 8).setOrigin(1, 0);

      this.skillsButtonsContainers.push(this.add.container(skillX, 0, [displayText, skillFrame]));

      skillX += skillFrame.width + 2;
    }

    this.container = this.add.container(width / 2 - 34 * 5, height * 0.9, this.skillsButtonsContainers);

    eventsCenter.on(Event.TURN_ON_HIGHLIGHT_SKILL_BUTTON, this.turnOnHighlightSkillButtonHandler, this);
    eventsCenter.on(Event.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, this.turnOffHighlightSkillButtonHandler, this);
    eventsCenter.on(Event.BIND_SKILL_ICON, this.bindSkillIconToButton, this);
    eventsCenter.on(Event.UNBIND_SKILL_ICON, this.unbindSkillIconToButton, this);
  }

  private bindSkillIconToButton(skillIconName: string, buttonNumber: number): void {
    console.log('bindSkillIconToButton');
    const buttonNumberMapped = buttonNumber !== 0 ? buttonNumber - 1 : 9;
    const skillButtonContainer = this.skillsButtonsContainers[buttonNumberMapped];
    console.log({ skillsButtonsContainers: this.skillsButtonsContainers });
    const skillIcon = this.add.image(0, 0, skillIconName).setOrigin(1, 0);
    console.log({ skillIcon });

    skillButtonContainer.addAt(skillIcon);
  }

  private unbindSkillIconToButton(buttonNumber: number): void {
    console.log('unbindSkillIconToButton');
    console.log({ buttonNumber });
    const buttonNumberMapped = buttonNumber !== 0 ? buttonNumber - 1 : 10;
    console.log({ buttonNumberMapped });
    const skillButtonContainer = this.skillsButtonsContainers[buttonNumberMapped];

    console.log({ skillButtonContainer });
    const containerAfterRemove = skillButtonContainer.removeAt(0, true);

    console.log({ containerAfterRemove });
  }

  private turnOnHighlightSkillButtonHandler(skill: SkillButton): void {
    // TODO: To refactor
    switch (+skill) {
      case SkillButton.ONE:
        this.skillsButtonsContainers[0].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.TWO:
        this.skillsButtonsContainers[1].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.THREE:
        this.skillsButtonsContainers[2].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.FOUR:
        this.skillsButtonsContainers[3].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.FIVE:
        this.skillsButtonsContainers[4].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.SIX:
        this.skillsButtonsContainers[5].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.SEVEN:
        this.skillsButtonsContainers[6].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.EIGHT:
        this.skillsButtonsContainers[7].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.NINE:
        this.skillsButtonsContainers[8].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
      case SkillButton.ZERO:
        this.skillsButtonsContainers[9].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0x8afbff));
        break;
    }
  }

  private turnOffHighlightSkillButtonHandler(skill: SkillButton): void {
    // TODO: To refactor
    switch (+skill) {
      case SkillButton.ONE:
        this.skillsButtonsContainers[0].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.TWO:
        this.skillsButtonsContainers[1].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.THREE:
        this.skillsButtonsContainers[2].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.FOUR:
        this.skillsButtonsContainers[3].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.FIVE:
        this.skillsButtonsContainers[4].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.SIX:
        this.skillsButtonsContainers[5].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.SEVEN:
        this.skillsButtonsContainers[6].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.EIGHT:
        this.skillsButtonsContainers[7].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.NINE:
        this.skillsButtonsContainers[8].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
      case SkillButton.ZERO:
        this.skillsButtonsContainers[9].list.forEach((child) => (child as Phaser.GameObjects.Image).setTint(0xffffff));
        break;
    }
  }

  static skillKeyPressHandler(skill: SkillButton, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      if (!keys.has(event.code)) {
        keys.add(event.code);
        eventsCenter.emit(Event.TURN_ON_HIGHLIGHT_SKILL_BUTTON, skill);
      }
    };
  }

  static skillKeyReleaseHandler(skill: SkillButton, keys: Set<string>): (event: KeyboardEvent) => void {
    return function (event): void {
      keys.delete(event.code);
      eventsCenter.emit(Event.TURN_OFF_HIGHLIGHT_SKILL_BUTTON, skill);
    };
  }
}
