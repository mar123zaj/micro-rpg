import config from '../configs/class-selection.config';
import Fonts from '../configs/Fonts';

interface Keys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
}

interface ClassInfoBox {
  icon?: Phaser.GameObjects.Image;
  text?: Phaser.GameObjects.DynamicBitmapText;
}

export enum CharacterClass {
  SWORDSMAN,
  ARCHER,
  MAGE,
}

export default class ClassSelectionScene extends Phaser.Scene {
  private keys: Keys;
  private swordsman: ClassInfoBox = {};
  private archer: ClassInfoBox = {};
  private mage: ClassInfoBox = {};
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;

  constructor() {
    super('ClassSelectionScene');
  }

  preload(): void {
    this.load.image(config.swordsmanIcon.name, config.swordsmanIcon.file);
    this.load.image(config.archerIcon.name, config.archerIcon.file);
    this.load.image(config.mageIcon.name, config.mageIcon.file);
    this.load.image(config.classSelectedFrame.name, config.classSelectedFrame.file);
    this.load.bitmapFont('default', ...Fonts.default);
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as Keys;

    const { width, height } = this.game.renderer;

    const oneThirdHeight = height / 3;

    this.swordsman.icon = this.add.image(0, 0, config.swordsmanIcon.name).setDepth(1).setScale(3);
    this.archer.icon = this.add.image(0, 0, config.archerIcon.name).setDepth(1).setScale(3);
    this.mage.icon = this.add.image(0, 0, config.mageIcon.name).setDepth(1).setScale(3);

    this.setClassInfoBoxesPositions([this.swordsman, this.archer, this.mage], width, oneThirdHeight);

    this.swordsman.text.setText([
      'Swordsman',
      '',
      'Health: 160',
      'Mana: 50',
      '',
      'Attack: 90',
      'Critical: 2%',
      'Speed: Normal',
    ]);
    this.archer.text.setText([
      'Archer',
      '',
      'Health: 100',
      'Mana: 50',
      '',
      'Attack: 150',
      'Critical: 6%',
      'Speed: Fast',
    ]);
    this.mage.text.setText(['Mage', '', 'Health: 80', 'Mana: 150', '', 'Attack: 70', 'Critical: -', 'Speed: Slow']);
  }

  isSelected({ icon }: ClassInfoBox): boolean {
    return icon.alpha === 1;
  }

  setClassInfoBoxesPositions(classInfoBoxes: ClassInfoBox[], width: number, height: number): void {
    classInfoBoxes.forEach((classInfoBox, index) => {
      console.log(`classInfoBox.icon.name: ${classInfoBox.icon.name}`);
      classInfoBox.icon.setY(height);
      classInfoBox.icon.setX(width * 0.25 * (index + 1));

      classInfoBox.text = this.add.dynamicBitmapText(width * 0.25 * (index + 1) - 25, height + 50, 'default', '', 8);

      if (index !== 0) {
        classInfoBox.text.setAlpha(0.5);
        classInfoBox.icon.setAlpha(0.5);
      }
    });
  }

  resetClassInfoBoxesAlpha(): void {
    this.swordsman.icon.setAlpha(0.5);
    this.swordsman.text.setAlpha(0.5);
    this.archer.icon.setAlpha(0.5);
    this.archer.text.setAlpha(0.5);
    this.mage.icon.setAlpha(0.5);
    this.mage.text.setAlpha(0.5);
  }

  selectClassInfoBox(classInfoBox: ClassInfoBox): void {
    this.resetClassInfoBoxesAlpha();
    classInfoBox.icon.setAlpha(1);
    classInfoBox.text.setAlpha(1);
  }

  update(time: number): void {
    const left = this.keys.left.isDown;
    const right = this.keys.right.isDown;
    const enter = this.keys.enter.isDown;

    if (time < this.keyPressLockedUntil) {
      return;
    }

    if (left || right || enter) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (this.isSelected(this.swordsman)) {
      if (left) {
        this.selectClassInfoBox(this.mage);
      } else if (right) {
        this.selectClassInfoBox(this.archer);
      } else if (enter) {
        console.log('Choose swordsman');
        this.scene.start('DungeonScene', { playerClass: CharacterClass.SWORDSMAN });
      }
    } else if (this.isSelected(this.archer)) {
      if (left) {
        this.selectClassInfoBox(this.swordsman);
      } else if (right) {
        this.selectClassInfoBox(this.mage);
      } else if (enter) {
        console.log('Choose archer');
        this.scene.start('DungeonScene', { playerClass: CharacterClass.ARCHER });
      }
    } else if (this.isSelected(this.mage)) {
      if (left) {
        this.selectClassInfoBox(this.archer);
      } else if (right) {
        this.selectClassInfoBox(this.swordsman);
      } else if (enter) {
        console.log('Choose mage');
        this.scene.start('DungeonScene', { playerClass: CharacterClass.MAGE });
      }
    }
  }
}