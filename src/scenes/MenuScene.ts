import Logo from '../../assets/ui/menu/logo.png';
import OptionsButton from '../../assets/ui/menu/options_button.png';
import PlayButton from '../../assets/ui/menu/play_button.png';
import Background from '../../assets/ui/menu/background.jpg';
import Pointer from '../../assets/ui/menu/pointer.png';

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

  constructor() {
    super('menu');
  }

  preload(): void {
    this.load.image('logo', Logo);
    this.load.image('options_button', OptionsButton);
    this.load.image('play_button', PlayButton);
    this.load.image('background', Background);
    this.load.image('pointer', Pointer);
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as Keys;

    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, 'logo').setDepth(1);

    this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);

    this.playButton = this.add
      .image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play_button')
      .setDepth(1);

    this.optionsButton = this.add
      .image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'options_button')
      .setDepth(1);

    this.pointer = this.add.image(this.playButton.x - this.playButton.width, this.playButton.y, 'pointer');
    this.pointer.setScale(4);
  }

  update(): void {
    const up = this.keys.up.isDown;
    const down = this.keys.down.isDown;
    const enter = this.keys.enter.isDown;

    if (up) {
      this.pointer.setY(this.playButton.y);
    } else if (down) {
      this.pointer.setY(this.optionsButton.y);
    } else if (enter) {
      this.scene.start('DungeonScene');
    }
  }
}
