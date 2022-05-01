import Phaser from 'phaser';
import DecisionWindow from '../../public/assets/ui/decision_window.png';
import WindowButton from '../../public/assets/ui/window_button.png';
import { Event } from '../enums/events.enum';
import eventsCenter from '../EventsCenter';

interface Keys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
}

export enum Decision {
  YES,
  NO,
}

export default class DecisionWindowScene extends Phaser.Scene {
  private keys: Keys;
  private intervalKeyPress = 150;
  private keyPressLockedUntil = 0;
  private decisionButtons: Phaser.GameObjects.Container[];
  private selectedButtonIndex: number;
  private eventNameSuffix: string;

  constructor() {
    super('DecisionWindowScene');
  }

  init(data: { eventNameSuffix: string }): void {
    this.eventNameSuffix = data.eventNameSuffix;
  }

  preload(): void {
    this.load.image('decision_window', DecisionWindow);
    this.load.image('window_button', WindowButton);
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
    const decisionWindow = this.add.image(0, 0, 'decision_window').setOrigin(0);
    const text = this.add.dynamicBitmapText(12, 10, 'default', 'Do you want to buy this skill?', 8);

    const yesWindowButton = this.add.image(0, 0, 'window_button').setOrigin(0);
    const yesButtonText = this.add.dynamicBitmapText(6, 4, 'default', 'Yes', 8);
    const yesButtonContainer = this.add
      .container(78 - yesWindowButton.width / 2, 36 - yesWindowButton.height / 2, [yesWindowButton, yesButtonText])
      .setAlpha(1);

    const noWindowButton = this.add.image(0, 0, 'window_button').setOrigin(0);
    const noButtonText = this.add.dynamicBitmapText(8, 4, 'default', 'No', 8);

    const noButtonContainer = this.add
      .container(128 - noWindowButton.width / 2, 36 - noWindowButton.height / 2, [noWindowButton, noButtonText])
      .setAlpha(0.5);

    this.decisionButtons = [yesButtonContainer, noButtonContainer];
    this.selectedButtonIndex = 0;

    this.add.container(width / 2 - decisionWindow.width / 2, (height - decisionWindow.height) / 2, [
      decisionWindow,
      text,
      yesButtonContainer,
      noButtonContainer,
    ]);
  }

  resetDecisionButtonsAlpha(): void {
    this.decisionButtons.forEach((decisionButton) => decisionButton.setAlpha(0.5));
  }

  markDecisionButtonAsSelected(decisionBox: Phaser.GameObjects.Container): void {
    this.resetDecisionButtonsAlpha();
    decisionBox.setAlpha(1);
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

    if (left) {
      this.selectedButtonIndex = this.selectedButtonIndex === 0 ? 1 : 0;
      const decisionButton = this.decisionButtons[this.selectedButtonIndex];
      this.markDecisionButtonAsSelected(decisionButton);
    } else if (right) {
      this.selectedButtonIndex = this.selectedButtonIndex === 0 ? 1 : 0;
      const decisionButton = this.decisionButtons[this.selectedButtonIndex];
      this.markDecisionButtonAsSelected(decisionButton);
    }

    if (enter) {
      if (this.selectedButtonIndex === 0) {
        eventsCenter.emit(`${Event.YES_DECISION_BUTTON_SELECTED}_${this.eventNameSuffix}`);
      } else if (this.selectedButtonIndex === 1) {
        eventsCenter.emit(`${Event.NO_DECISION_BUTTON_SELECTED}_${this.eventNameSuffix}`);
      }
      this.scene.stop();
    }
  }
}
