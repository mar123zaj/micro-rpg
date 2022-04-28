import Phaser from 'phaser';
import IndicatingFrame from '../../public/assets/ui/indicating_frame.png';
import Skill1 from '../../public/assets/ui/skills/skill1.png';
import SkillsShop from '../../public/assets/ui/skills_shop.png';
import { EventsEnum } from '../enums/events.enum';
import eventsCenter from '../EventsCenter';
import { PlayerClass } from './ClassSelectionScene';

type SkillInfo = { name: string; description: string; icon: string; cost: number };

const SKILLS_INFO: Record<PlayerClass, SkillInfo[]> = {
  [PlayerClass.SWORDSMAN]: [
    {
      name: 'Sword buff',
      description: 'This is buff that gives\nsome additional attack\npower.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff2',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff3',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff4',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff5',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff6',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff7',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff8',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff9',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff9',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff9',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
    {
      name: 'Sword buff9',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
  ],
  [PlayerClass.ARCHER]: [
    {
      name: 'Sword buff',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
  ],
  [PlayerClass.MAGE]: [
    {
      name: 'Sword buff',
      description: 'This is buff that gives some additional attack power.',
      icon: 'skill',
      cost: 5,
    },
  ],
};

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
}

export default class SkillShopScene extends Phaser.Scene {
  private keys: Keys;
  private playerClass: PlayerClass;
  private skillsStartingPosition = { x: 12, y: 41 };
  private namePosition = { x: 12, y: 17 };
  private extraInfoPosition = { x: 12, y: 214 };
  private distanceBetweenSlots = 42;
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;
  private playerClassSkills: SkillInfo[];
  private selectedSkillIndex = 0;
  private indicatingFrame: Phaser.GameObjects.Image;
  private displayNameText: Phaser.GameObjects.DynamicBitmapText;
  private extraInfoText: Phaser.GameObjects.DynamicBitmapText;

  constructor() {
    super('SkillShopScene');
  }

  preload(): void {
    this.load.image('skills_shop', SkillsShop);
    this.load.image('skill', Skill1);
    this.load.image('indicating_frame', IndicatingFrame);
  }

  init(data: { playerClass: PlayerClass }): void {
    this.playerClass = data.playerClass;
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
    const shop = this.add.image(0, 0, 'skills_shop').setOrigin(0);
    this.indicatingFrame = this.add
      .image(this.skillsStartingPosition.x, this.skillsStartingPosition.y, 'indicating_frame')
      .setOrigin(0);
    const container = this.add.container(width / 4 - shop.width / 2, (height - shop.height) / 2, [
      shop,
      this.indicatingFrame,
    ]);
    //container.setSize(shop.width, shop.height);

    this.playerClassSkills = SKILLS_INFO[this.playerClass];
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
    container.add([this.displayNameText, this.extraInfoText]);
    for (const [index, skill] of this.playerClassSkills.entries()) {
      const { name, description, icon, cost } = skill;
      const skillIcon = this.add.image(x, y, icon).setOrigin(0);
      container.add(skillIcon);

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

    const shop2 = this.add.image(0, 0, 'skills_shop').setOrigin(0);
    const container2 = this.add.container((width * 3) / 4 - shop2.width / 2, (height - shop2.height) / 2, [shop2]);

    eventsCenter.on(EventsEnum.STOP_SKILLS_SHOP_SCENE, () => this.scene.stop(), this);
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

  update(time: number): void {
    const up = this.keys.up.isDown;
    const down = this.keys.down.isDown;
    const left = this.keys.left.isDown;
    const right = this.keys.right.isDown;
    const enter = this.keys.enter.isDown;

    if (time < this.keyPressLockedUntil) {
      return;
    }

    if (up || down || left || right) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
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

    const { name, cost, description } = this.playerClassSkills[this.selectedSkillIndex];
    this.displayNameText.setText(name);
    this.extraInfoText.setText([`Cost: ${cost} coin(s)`, '', description]);
  }
}
