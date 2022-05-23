import Phaser from 'phaser';
import DecisionWindow from '../../public/assets/ui/decision_window.png';
import IndicatingFrame from '../../public/assets/ui/indicating_frame.png';
import Skill1 from '../../public/assets/ui/skills/skill1.png';
import Skill2 from '../../public/assets/ui/skills/skill2.png';
import Skill3 from '../../public/assets/ui/skills/skill3.png';
import Skill4 from '../../public/assets/ui/skills/skill4.png';
import SkillsShop from '../../public/assets/ui/skills_shop_ui.png';
import WindowButton from '../../public/assets/ui/window_button.png';
import * as SKILLS from '../data/skills/skills';
import { Event } from '../enums/events.enum';
import eventsCenter from '../EventsCenter';
import { Skill } from '../types/skill.type';
import { PlayerClass } from './ClassSelectionScene';

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
}

type SkillShopInfo = {
  purchased?: boolean;
};

export default class SkillShopScene extends Phaser.Scene {
  private keys: Keys;
  private playerClass: PlayerClass;
  private skillsStartingPosition = { x: 12, y: 41 };
  private namePosition = { x: 12, y: 17 };
  private extraInfoPosition = { x: 12, y: 214 };
  private distanceBetweenSlots = 42;
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;
  private playerClassSkills: (Skill & SkillShopInfo)[];
  private selectedSkillIndex = 0;
  private indicatingFrame: Phaser.GameObjects.Image;
  private displayNameText: Phaser.GameObjects.DynamicBitmapText;
  private extraInfoText: Phaser.GameObjects.DynamicBitmapText;
  private nextBlinkTime = 0;
  private blinkInterval = 500;
  active: boolean;
  private decisionWindowEventNameSuffix = 'SkillShopScene';
  private container: Phaser.GameObjects.Container;

  constructor() {
    super('SkillShopScene');
  }

  preload(): void {
    this.load.image('skills_shop', SkillsShop);
    this.load.image('skill_fire', Skill1);
    this.load.image('skill_ice', Skill2);
    this.load.image('skill_ground', Skill3);
    this.load.image('skill_water', Skill4);
    this.load.image('indicating_frame', IndicatingFrame);
    this.load.image('decision_window', DecisionWindow);
    this.load.image('window_button', WindowButton);
  }

  init(data: { playerClass: PlayerClass }): void {
    this.playerClass = data.playerClass;
    this.active = true;
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as Keys;

    const { width, height } = this.sys.game.canvas;
    this.indicatingFrame = this.add
      .image(this.skillsStartingPosition.x, this.skillsStartingPosition.y, 'indicating_frame')
      .setOrigin(0);

    const shop = this.add.image(0, 0, 'skills_shop').setOrigin(0);
    this.container = this.add.container(width / 4 - shop.width / 2, (height - shop.height) / 2, [
      shop,
      this.indicatingFrame,
    ]);

    if (this.playerClass === PlayerClass.SWORDSMAN) {
      this.playerClassSkills = SKILLS.SWORDSMAN_SKILLS;
    } else if (this.playerClass === PlayerClass.ARCHER) {
      this.playerClassSkills = SKILLS.ARCHER_SKILLS;
    } else if (this.playerClass === PlayerClass.MAGE) {
      this.playerClassSkills = SKILLS.MAGE_SKILLS;
    }

    let x = this.skillsStartingPosition.x;
    let y = this.skillsStartingPosition.y;
    this.extraInfoText = this.add.dynamicBitmapText(
      this.extraInfoPosition.x,
      this.extraInfoPosition.y,
      'default',
      '',
      8,
    );
    this.displayNameText = this.add.dynamicBitmapText(this.namePosition.x, this.namePosition.y, 'default', '', 8);
    this.container.add([this.displayNameText, this.extraInfoText]);
    for (const [index, skill] of this.playerClassSkills.entries()) {
      console.log({ purchased: skill.purchased });
      const {
        info: { name, description, cost },
        graphics: { iconName },
      } = skill;

      skill.graphics.icon = this.add.image(x, y, iconName).setOrigin(0);
      if (skill.purchased) {
        skill.graphics.icon.setAlpha(0.5);
      }

      this.container.add(skill.graphics.icon);

      if (index === 0) {
        this.displayNameText.setText(name);
        this.extraInfoText.setText([`Cost: ${cost} coin(s)`, '', description]);
      }

      x += this.distanceBetweenSlots;
      if ((index + 1) % 4 === 0) {
        x = this.skillsStartingPosition.x;
        y += this.distanceBetweenSlots;
      }
    }

    eventsCenter.on(Event.ACTIVATE_SKILLS_SHOP_SCENE, this.activate, this);
    eventsCenter.on(Event.DEACTIVATE_SKILLS_SHOP_SCENE, this.deactivate, this);
    eventsCenter.on(
      `${Event.YES_DECISION_BUTTON_SELECTED}_${this.decisionWindowEventNameSuffix}`,
      this.skillBuyConfirmation,
      this,
    );
    eventsCenter.on(
      `${Event.NO_DECISION_BUTTON_SELECTED}_${this.decisionWindowEventNameSuffix}`,
      this.skillBuyRejection,
      this,
    );

    this.selectedSkillIndex = 0;
  }

  private skillBuyConfirmation(): void {
    console.log('skill shop confirmation');
    const purchasedSkill = this.playerClassSkills[this.selectedSkillIndex];
    purchasedSkill.graphics.icon.setAlpha(0.5);
    purchasedSkill.purchased = true;
    eventsCenter.emit(Event.SKILL_PURCHASED, purchasedSkill);
    this.keyPressLockedUntil = this.time.now + 750;
    this.activate();
  }

  private skillBuyRejection(): void {
    this.keyPressLockedUntil = this.time.now + 750;
    this.activate();
  }

  private activate(): void {
    this.active = true;
    this.container.setAlpha(1);
  }

  private deactivate(): void {
    this.active = false;
    this.container.setAlpha(0.5);
  }

  private isOnFirstRow(): boolean {
    return this.selectedSkillIndex < 4;
  }

  private isOnLastRow(): boolean {
    return this.playerClassSkills.length - (this.selectedSkillIndex + 1) < 4;
  }

  private isOnFirstColumn(): boolean {
    return [0, 4, 8, 12].includes(this.selectedSkillIndex);
  }

  private isOnLastColumn(): boolean {
    return [3, 7, 11, 15].includes(this.selectedSkillIndex);
  }

  private isOnLastSkill(): boolean {
    return this.selectedSkillIndex + 1 === this.playerClassSkills.length;
  }

  blinkingIndicatingFrame(time: number): void {
    if (time > this.nextBlinkTime) {
      this.indicatingFrame.setVisible(!this.indicatingFrame.visible);
      this.nextBlinkTime = time + this.blinkInterval;
    }
  }

  update(time: number): void {
    if (!this.active) return;

    this.blinkingIndicatingFrame(time);

    const up = this.keys.up.isDown;
    const down = this.keys.down.isDown;
    const left = this.keys.left.isDown;
    const right = this.keys.right.isDown;
    const enter = this.keys.enter.isDown;

    if (time < this.keyPressLockedUntil) {
      return;
    }

    if (up || down || left || right || enter) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (enter) {
      const purchasedSkill = this.playerClassSkills[this.selectedSkillIndex];
      if (purchasedSkill.purchased) {
        return;
      }

      this.scene.run('DecisionWindowScene', { eventNameSuffix: this.decisionWindowEventNameSuffix });
      this.deactivate();
    }

    const { x, y } = this.indicatingFrame;

    if (up) {
      if (this.isOnFirstRow()) return;
      this.indicatingFrame.setY(y - this.distanceBetweenSlots);
      this.selectedSkillIndex -= 4;
    } else if (down) {
      if (this.isOnLastRow()) return;
      this.indicatingFrame.setY(y + this.distanceBetweenSlots);
      this.selectedSkillIndex += 4;
    } else if (left) {
      if (this.isOnFirstColumn()) return;
      this.indicatingFrame.setX(x - this.distanceBetweenSlots);
      this.selectedSkillIndex -= 1;
    } else if (right) {
      if (this.isOnLastColumn() || this.isOnLastSkill()) return;
      this.indicatingFrame.setX(x + this.distanceBetweenSlots);
      this.selectedSkillIndex += 1;
    }

    if (up || down || left || right) {
      const {
        info: { name, cost, description },
      } = this.playerClassSkills[this.selectedSkillIndex];
      this.displayNameText.setText(name);
      this.extraInfoText.setText([`Cost: ${cost} coin(s)`, '', description]);
    }
  }
}
