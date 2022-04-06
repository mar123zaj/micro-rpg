import Phaser from 'phaser';
import Graphics from '../configs/Graphics';
import FOVLayer from '../entities/FOVLayer';
import Map from '../entities/Map';
import Player from '../entities/Player';
import Slime from '../entities/Slime';
import { Skill } from '../enums/skills.enum';
import { PlayerClass } from './ClassSelectionScene';
import UIScene from './UIScene';

const worldTileHeight = 81;
const worldTileWidth = 81;
export default class DungeonScene extends Phaser.Scene {
  playerClass: PlayerClass;
  lastX: number;
  lastY: number;
  player: Player | null;
  slimes: Slime[];
  slimeGroup: Phaser.GameObjects.Group | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  roomDebugGraphics?: Phaser.GameObjects.Graphics;
  private keys: Set<string> = new Set();

  preload(): void {
    this.load.image(Graphics.environment.name, Graphics.environment.file);
    this.load.image(Graphics.util.name, Graphics.util.file);
    this.load.spritesheet(Graphics.barbarian.name, Graphics.barbarian.file, {
      frameHeight: Graphics.barbarian.height,
      frameWidth: Graphics.barbarian.width,
    });
    this.load.spritesheet(Graphics.swordsman.name, Graphics.swordsman.file, {
      frameHeight: Graphics.swordsman.height,
      frameWidth: Graphics.swordsman.width,
    });
    this.load.spritesheet(Graphics.archer.name, Graphics.archer.file, {
      frameHeight: Graphics.archer.height,
      frameWidth: Graphics.archer.width,
    });
    this.load.spritesheet(Graphics.greenSlime.name, Graphics.greenSlime.file, {
      frameHeight: Graphics.greenSlime.height,
      frameWidth: Graphics.greenSlime.width,
    });
    this.load.spritesheet(Graphics.redSlime.name, Graphics.redSlime.file, {
      frameHeight: Graphics.redSlime.height,
      frameWidth: Graphics.redSlime.width,
    });
    this.load.image(Graphics.arrow.name, Graphics.arrow.file);
  }

  constructor() {
    super('DungeonScene');
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.tilemap = null;
    this.slimes = [];
    this.slimeGroup = null;
  }

  init(data: { playerClass: PlayerClass }): void {
    console.log({ data });
    this.playerClass = data.playerClass;
  }

  slimePlayerCollide(_: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): boolean {
    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }

    if (this.player.isAttacking()) {
      this.slimes = this.slimes.filter((s) => s != slime);
      slime.kill();
      return false;
    } else {
      this.player.stagger();
      return true;
    }
  }

  slimeWeaponCollide(_: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): boolean {
    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }

    if (this.player.isAttacking()) {
      this.slimes = this.slimes.filter((s) => s != slime);
      slime.kill();
      return false;
    }
  }

  slimeArrowCollide(arrow: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): boolean {
    const arrowSprite = arrow as Phaser.Physics.Arcade.Image;
    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }

    if (this.player.isAttacking()) {
      this.slimes = this.slimes.filter((s) => s != slime);
      slime.kill();
      arrowSprite.setVisible(false);
      arrowSprite.disableBody();
      return false;
    }
  }

  arrowWallCollide(arrow: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject): void {
    const arrowSprite = arrow as Phaser.Physics.Arcade.Image;
    setTimeout(() => {
      arrowSprite.setVisible(false);
      arrowSprite.disableBody();
    }, 1000);
  }

  create(): void {
    Object.values(Graphics.barbarian.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.barbarian.name, anim.frames),
        });
      }
    });

    Object.values(Graphics.swordsman.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.swordsman.name, anim.frames),
        });
      }
    });

    Object.values(Graphics.archer.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.archer.name, anim.frames),
        });
      }
    });

    // TODO: move this parts to the class representative's static methods
    Object.values(Graphics.greenSlime.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.greenSlime.name, anim.frames),
        });
      }
    });

    Object.values(Graphics.redSlime.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.redSlime.name, anim.frames),
        });
      }
    });

    const map = new Map(worldTileWidth, worldTileHeight, this);
    this.tilemap = map.tilemap;

    this.fov = new FOVLayer(map);

    this.player = new Player(
      this.tilemap.tileToWorldX(map.startingX),
      this.tilemap.tileToWorldY(map.startingY),
      this,
      this.playerClass,
    );

    this.slimes = map.slimes;
    this.slimeGroup = this.physics.add.group(this.slimes.map((s) => s.sprite));

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, map.width * Graphics.environment.width, map.height * Graphics.environment.height);
    this.cameras.main.startFollow(this.player.sprite);

    this.physics.add.collider(this.player.sprite, map.wallLayer);
    this.physics.add.collider(this.slimeGroup, map.wallLayer);

    this.physics.add.collider(this.player.sprite, map.doorLayer);
    this.physics.add.collider(this.slimeGroup, map.doorLayer);

    this.physics.add.overlap(this.player.sprite, this.slimeGroup, this.slimePlayerCollide, undefined, this);
    this.physics.add.collider(this.player.sprite, this.slimeGroup, undefined, this.slimePlayerCollide, this);

    if (this.player.isSwordsman()) {
      this.physics.add.overlap(this.player.weapon, this.slimeGroup, this.slimeWeaponCollide, undefined, this);
      this.physics.add.collider(this.player.weapon, this.slimeGroup, undefined, this.slimeWeaponCollide, this);
    } else if (this.player.isArcher()) {
      this.physics.add.collider(this.player.arrows, map.wallLayer, this.arrowWallCollide);
      this.physics.add.overlap(this.player.arrows, this.slimeGroup, this.slimeArrowCollide, undefined, this);
      this.physics.add.collider(this.player.arrows, this.slimeGroup, undefined, this.slimeArrowCollide, this);
    }

    for (const slime of this.slimes) {
      this.physics.add.collider(slime.sprite, map.wallLayer);
    }

    this.input.keyboard.on('keydown-ONE', UIScene.skillKeyPressHandler(Skill.ONE, this.keys));
    this.input.keyboard.on('keyup-ONE', UIScene.skillKeyReleaseHandler(Skill.ONE, this.keys));

    this.input.keyboard.on('keydown-TWO', UIScene.skillKeyPressHandler(Skill.TWO, this.keys));
    this.input.keyboard.on('keyup-TWO', UIScene.skillKeyReleaseHandler(Skill.TWO, this.keys));

    this.input.keyboard.on('keydown-THREE', UIScene.skillKeyPressHandler(Skill.THREE, this.keys));
    this.input.keyboard.on('keyup-THREE', UIScene.skillKeyReleaseHandler(Skill.THREE, this.keys));

    this.scene.run('ui');
  }

  update(time: number, delta: number): void {
    this.player.update(time);

    const camera = this.cameras.main;

    for (const slime of this.slimes) {
      slime.update(time);
    }

    const player = new Phaser.Math.Vector2({
      x: this.tilemap.worldToTileX(this.player.sprite.body.x),
      y: this.tilemap.worldToTileY(this.player.sprite.body.y),
    });

    const bounds = new Phaser.Geom.Rectangle(
      this.tilemap.worldToTileX(camera.worldView.x) - 1,
      this.tilemap.worldToTileY(camera.worldView.y) - 1,
      this.tilemap.worldToTileX(camera.worldView.width) + 2,
      this.tilemap.worldToTileX(camera.worldView.height) + 2,
    );

    this.fov.update(player, bounds, delta);
  }
}
