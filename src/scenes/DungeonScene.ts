import Phaser from 'phaser';
import Graphics from '../assets/Graphics';
import FOVLayer from '../entities/FOVLayer';
import Player from '../entities/Player';
import Slime from '../entities/Slime';
import Map from '../entities/Map';
import eventsCenter from '../EventsCenter';
import { EventsEnum } from '../enums/events.enum';
import { Skill } from '../enums/skills.enum';
import UIScene from './UIScene';

const worldTileHeight = 81;
const worldTileWidth = 81;
export default class DungeonScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;
  slimes: Slime[];
  slimeGroup: Phaser.GameObjects.Group | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  roomDebugGraphics?: Phaser.GameObjects.Graphics;
  private swordHitbox: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private keys: Set<string> = new Set();

  preload(): void {
    this.load.image(Graphics.environment.name, Graphics.environment.file);
    this.load.image(Graphics.util.name, Graphics.util.file);
    this.load.spritesheet(Graphics.player.name, Graphics.player.file, {
      frameHeight: Graphics.player.height,
      frameWidth: Graphics.player.width,
    });
    this.load.spritesheet(Graphics.greenSlime.name, Graphics.greenSlime.file, {
      frameHeight: Graphics.greenSlime.height,
      frameWidth: Graphics.greenSlime.width,
    });
    this.load.spritesheet(Graphics.redSlime.name, Graphics.redSlime.file, {
      frameHeight: Graphics.redSlime.height,
      frameWidth: Graphics.redSlime.width,
    });
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

  create(): void {
    Object.values(Graphics.player.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.player.name, anim.frames),
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

    this.player = new Player(this.tilemap.tileToWorldX(map.startingX), this.tilemap.tileToWorldY(map.startingY), this);

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
    this.physics.add.overlap(this.player.weapon, this.slimeGroup, this.slimeWeaponCollide, undefined, this);
    this.physics.add.collider(this.player.sprite, this.slimeGroup, undefined, this.slimePlayerCollide, this);
    this.physics.add.overlap(this.player.weapon, this.slimeGroup, this.slimeWeaponCollide, undefined, this);

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
