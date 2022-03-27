import MenuConfig from '../configs/menu.config';

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
}

export default class MenuScene extends Phaser.Scene {
  private keys: Keys;
  private pointer: Phaser.GameObjects.Image;
  private playButton: Phaser.GameObjects.Image;
  private optionsButton: Phaser.GameObjects.Image;
  private exitButton: Phaser.GameObjects.Image;
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;
  private buttonMargin = 15;

  constructor() {
    super('menu');
  }

  preload(): void {
    this.load.image(MenuConfig.logo.name, MenuConfig.logo.file);
    this.load.image(MenuConfig.playButton.name, MenuConfig.playButton.file);
    this.load.image(MenuConfig.optionsButton.name, MenuConfig.optionsButton.file);
    this.load.image(MenuConfig.exitButton.name, MenuConfig.exitButton.file);
    this.load.image(MenuConfig.background.name, MenuConfig.background.file);
    this.load.image(MenuConfig.pointer.name, MenuConfig.pointer.file);
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as Keys;

    const { width, height } = this.game.renderer;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.add.image(halfWidth, height * 0.1, MenuConfig.logo.name).setDepth(1);

    this.add.image(halfWidth, halfHeight, MenuConfig.background.name).setDisplaySize(width, height);

    this.playButton = this.add.image(0, 0, MenuConfig.playButton.name).setDepth(1);
    this.optionsButton = this.add.image(0, 0, MenuConfig.optionsButton.name).setDepth(1);
    this.exitButton = this.add.image(0, 0, MenuConfig.exitButton.name).setDepth(1);
    this.setButtonsPosition([this.playButton, this.optionsButton, this.exitButton], halfWidth, halfHeight);

    this.pointer = this.add.image(
      this.playButton.x - this.playButton.width,
      this.playButton.y,
      MenuConfig.pointer.name,
    );
    this.pointer.setScale(3);
  }

  isPointerOn(button: Phaser.GameObjects.Image): boolean {
    return this.pointer.y < button.y + this.buttonMargin && this.pointer.y > button.y - this.buttonMargin;
  }

  setButtonsPosition(buttons: Phaser.GameObjects.Image[], width: number, height: number): void {
    buttons.forEach((button, index, buttons) => {
      button.setX(width);
      if (index > 0) {
        const previousButtonsHeight = buttons
          .slice(0, index)
          .map((btn) => btn.height)
          .reduce((previousHeight, currentHeight) => previousHeight + currentHeight);
        console.log(JSON.stringify(previousButtonsHeight, null, 4));
        button.setY(height + previousButtonsHeight + this.buttonMargin * index);
      } else {
        button.setY(height);
      }
    });
  }

  update(time: number): void {
    const up = this.keys.up.isDown;
    const down = this.keys.down.isDown;
    const enter = this.keys.enter.isDown;

    if (time < this.keyPressLockedUntil) {
      return;
    }

    if (up || down) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (this.isPointerOn(this.playButton)) {
      if (up) {
        this.pointer.setY(this.exitButton.y);
      } else if (down) {
        this.pointer.setY(this.optionsButton.y);
      } else if (enter) {
        this.scene.start('DungeonScene');
      }
    } else if (this.isPointerOn(this.optionsButton)) {
      if (up) {
        this.pointer.setY(this.playButton.y);
      } else if (down) {
        this.pointer.setY(this.exitButton.y);
      } else if (enter) {
        console.log('Options');
        // TODO: Open options when created
        // this.scene.start('OptionsScene');
      }
    } else if (this.isPointerOn(this.exitButton)) {
      if (up) {
        this.pointer.setY(this.optionsButton.y);
      } else if (down) {
        this.pointer.setY(this.playButton.y);
      } else if (enter) {
        console.log('Exit');
        // TODO: Exit from game
      }
    }
  }
}
