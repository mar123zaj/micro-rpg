import Phaser from 'phaser';
import IndicatingFrame from '../../public/assets/ui/indicating_frame.png';
import PlayerSKills from '../../public/assets/ui/player_skills_ui.png';
import Skill1 from '../../public/assets/ui/skills/skill1.png';
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

export default class PlayerSkillsScene extends Phaser.Scene {
  private keys: Keys;
  private playerClass: PlayerClass;
  private skillsStartingPosition = { x: 12, y: 41 };
  private namePosition = { x: 12, y: 17 };
  private extraInfoPosition = { x: 12, y: 214 };
  private distanceBetweenSlots = 42;
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;
  private playerSkills: Skill[] = [];
  private selectedSkillIndex = 0;
  private indicatingFrame: Phaser.GameObjects.Image;
  private displayNameText: Phaser.GameObjects.DynamicBitmapText;
  private extraInfoText: Phaser.GameObjects.DynamicBitmapText;
  active = true;
  private container: Phaser.GameObjects.Container;

  constructor() {
    super('PlayerSkillsScene');
  }

  preload(): void {
    this.load.image('player_skills', PlayerSKills);
    this.load.image('skill', Skill1);
    this.load.image('indicating_frame', IndicatingFrame);
  }

  init(data: { active?: boolean; playerSkills: Skill[] }): void {
    if (data.active !== null) this.active = data.active;
    this.playerSkills = data.playerSkills;
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
    const playerSkillsUI = this.add.image(0, 0, 'player_skills').setOrigin(0);
    this.indicatingFrame = this.add
      .image(this.skillsStartingPosition.x, this.skillsStartingPosition.y, 'indicating_frame')
      .setOrigin(0);

    this.displayNameText = this.add.dynamicBitmapText(this.namePosition.x, this.namePosition.y, 'default', '', 8);
    this.extraInfoText = this.add.dynamicBitmapText(
      this.extraInfoPosition.x,
      this.extraInfoPosition.y,
      'default',
      '',
      8,
    );
    this.container = this.add.container(
      (width * 3) / 4 - playerSkillsUI.width / 2,
      (height - playerSkillsUI.height) / 2,
      [playerSkillsUI, this.indicatingFrame, this.displayNameText, this.extraInfoText],
    );

    const containerAlpha = this.active ? 1 : 0.5;
    this.container.setAlpha(containerAlpha);
    this.selectedSkillIndex = 0;

    eventsCenter.on(Event.ACTIVATE_PLAYER_SKILLS_SCENE, this.activate, this);
    eventsCenter.on(Event.DEACTIVATE_PLAYER_SKILLS_SCENE, this.deactivate, this);
    eventsCenter.on(Event.UPDATE_PLAYER_SKILLS_SCENE, this.updateSkills, this);
  }

  updateSkills(skill: Skill): void {
    this.playerSkills.push(skill);
    let x = this.skillsStartingPosition.x;
    let y = this.skillsStartingPosition.y;
    for (const [index, skill] of this.playerSkills.entries()) {
      const { name, description, iconName, cost } = skill.info;
      const icon = this.add.image(x, y, iconName).setOrigin(0);
      this.container.add(icon);

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
    return this.playerSkills.length - (this.selectedSkillIndex + 1) < 4;
  }

  private isOnFirstColumn(): boolean {
    return [0, 4, 8, 12].includes(this.selectedSkillIndex);
  }

  private isOnLastColumn(): boolean {
    return [3, 7, 11, 15].includes(this.selectedSkillIndex);
  }

  private isOnLastSkill(): boolean {
    return this.selectedSkillIndex + 1 === this.playerSkills.length;
  }

  update(time: number): void {
    if (!this.active) return;

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

      if (this.playerSkills.length === 0) return;
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
      } = this.playerSkills[this.selectedSkillIndex];
      this.displayNameText.setText(name);
      this.extraInfoText.setText([`Cost: ${cost} coin(s)`, '', description]);
    }
  }
}
