import Phaser from 'phaser';
import Graphics from '../configs/Graphics';
import { Archer } from '../entities/Archer';
import FOVLayer from '../entities/FOVLayer';
import Map from '../entities/Map';
import SkillsSeller from '../entities/SkillsSeller';
import Slime from '../entities/Slime';
import { Swordsman } from '../entities/Swordsman';
import { EventsEnum } from '../enums/events.enum';
import { Skill } from '../enums/skills.enum';
import eventsCenter from '../EventsCenter';
import { PlayerClass } from './ClassSelectionScene';
import PlayerSkillsScene from './PlayerSkillsScene';
import SkillShopScene from './SkillShopScene';
import UIScene from './UIScene';

const worldTileHeight = 81;
const worldTileWidth = 81;

interface Keys {
  enter: Phaser.Input.Keyboard.Key;
  esc: Phaser.Input.Keyboard.Key;
  tab: Phaser.Input.Keyboard.Key;
  k: Phaser.Input.Keyboard.Key;
}

export default class DungeonScene extends Phaser.Scene {
  playerClass: PlayerClass;
  lastX: number;
  lastY: number;
  player: Swordsman | Archer | null;
  slimes: Slime[];
  slimeGroup: Phaser.GameObjects.Group | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  roomDebugGraphics?: Phaser.GameObjects.Graphics;
  coins: Phaser.Physics.Arcade.Group;
  attackLockedUntil = 0;
  shopLockedUntil = 0;
  keyPressLockedUntil = 0;
  private intervalKeyPress = 300;
  skillsSeller: SkillsSeller;
  isSkillsShopOpened = false;
  isPlayerSkillsUIOpened = false;
  playerSkillsScene?: Phaser.Scenes.ScenePlugin;
  keys: Keys;
  private uiKeys: Set<string> = new Set();

  preload(): void {
    this.load.image(Graphics.environment.name, Graphics.environment.file);
    this.load.image(Graphics.util.name, Graphics.util.file);
    this.load.spritesheet(Graphics.barbarian.name, Graphics.barbarian.file, {
      frameHeight: Graphics.barbarian.height,
      frameWidth: Graphics.barbarian.width,
    });
    this.load.spritesheet(Graphics.skillsSeller.name, Graphics.skillsSeller.file, {
      frameHeight: Graphics.skillsSeller.height,
      frameWidth: Graphics.skillsSeller.width,
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
    this.load.image(Graphics.coins1.name, Graphics.coins1.file);
    this.load.image(Graphics.coins2.name, Graphics.coins2.file);
    this.load.image(Graphics.coins3.name, Graphics.coins3.file);

    for (let i = 100; i > 0; i -= 10) {
      this.load.image(`enemyHealthBar${i}`, `assets/ui/health/enemy_health_bar_${i}.png`);
    }
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
    this.playerClass = data.playerClass;
  }

  slimePlayerCollide(_: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): boolean {
    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }
    this.player.stagger();
    return true;
  }

  beReadyToOpenSkillsShop(): void {
    if (this.time.now < this.shopLockedUntil) return;

    const enter = this.keys.enter.isDown;
    if (enter) {
      if (this.isSkillsShopOpened) return;

      this.scene.run('SkillShopScene', { playerClass: this.playerClass });
      this.playerSkillsScene = this.scene.run('PlayerSkillsScene', { active: false, playerSkills: [] });
      this.isSkillsShopOpened = true;
      this.shopLockedUntil = this.time.now + 1500;
      this.player.sprite.disableBody();
    }
  }

  slimeSwordCollide(_: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): void {
    if (this.time.now < this.attackLockedUntil) {
      return;
    }

    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }

    if (this.player.isAttacking()) {
      this.attackLockedUntil = this.time.now + this.player.attackDuration;
      slime.attacked(15);

      if (slime.isDead()) {
        this.slimes = this.slimes.filter((s) => s != slime);
        slime.eliminate();
        if (slime.rewardSize) {
          this.throwCoins(slime.body.x, slime.body.y, slime.rewardSize);
        }
      }
    }
  }

  throwCoins(x: number, y: number, quantity: number): void {
    const newCoins = this.coins.get(x, y, Graphics.coins1.name) as Phaser.Physics.Arcade.Image;

    newCoins.setActive(true);
    newCoins.setVisible(true);
    newCoins.setData('quantity', quantity);
  }

  playerCollectsCoins(player: Phaser.GameObjects.GameObject, coins: Phaser.GameObjects.GameObject): void {
    const coinsSprite = coins as Phaser.Physics.Arcade.Image;

    coinsSprite.setVisible(false);
    coinsSprite.disableBody();

    const coinsQuantity = coins.getData('quantity');
    this.player.addCoins(coinsQuantity);
  }

  slimeArrowCollide(arrow: Phaser.GameObjects.GameObject, slimeSprite: Phaser.GameObjects.GameObject): void {
    if (this.time.now < this.attackLockedUntil) {
      return;
    }

    const arrowSprite = arrow as Phaser.Physics.Arcade.Image;
    const slime = this.slimes.find((s) => s.sprite === slimeSprite);
    if (!slime) {
      console.log('Missing slime for sprite collision!');
      return;
    }

    if (this.player.isAttacking()) {
      this.attackLockedUntil = this.time.now + this.player.attackDuration;

      const attackMultiplier = (this.player as Archer).calculateAttackMultiplier(slime.sprite.x);
      slime.attacked(15 * attackMultiplier);

      arrowSprite.disableBody();
      arrowSprite.setVisible(false);

      if (slime.isDead()) {
        this.slimes = this.slimes.filter((s) => s != slime);
        slime.eliminate();
      }
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
    this.keys = this.input.keyboard.addKeys({
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
      tab: Phaser.Input.Keyboard.KeyCodes.TAB,
      k: Phaser.Input.Keyboard.KeyCodes.K,
    }) as Keys;

    Object.values(Graphics.skillsSeller.animations).forEach((anim) => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(Graphics.skillsSeller.name, anim.frames),
        });
      }
    });

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

    this.coins = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    const map = new Map(worldTileWidth, worldTileHeight, this);
    this.tilemap = map.tilemap;

    this.fov = new FOVLayer(map);
    switch (this.playerClass) {
      case PlayerClass.SWORDSMAN:
        this.player = new Swordsman(
          this.tilemap.tileToWorldX(map.startingX),
          this.tilemap.tileToWorldY(map.startingY),
          this,
        ) as Swordsman;
        break;
      case PlayerClass.ARCHER:
        this.player = new Archer(
          this.tilemap.tileToWorldX(map.startingX),
          this.tilemap.tileToWorldY(map.startingY),
          this,
        );
        break;
      case PlayerClass.MAGE:
        // TODO: Implement mage
        break;
    }

    this.skillsSeller = map.skillsSeller;
    this.skillsSeller.sprite.setPosition(this.player.sprite.x, this.player.sprite.y);

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

    this.physics.add.overlap(
      this.player.sprite,
      this.skillsSeller.sprite,
      this.beReadyToOpenSkillsShop,
      undefined,
      this,
    );

    this.physics.add.overlap(this.player.sprite, this.coins, this.playerCollectsCoins, undefined, this);

    if (this.playerClass === PlayerClass.SWORDSMAN) {
      this.physics.add.overlap(
        (this.player as Swordsman).sword,
        this.slimeGroup,
        this.slimeSwordCollide,
        undefined,
        this,
      );
      this.physics.add.collider(
        (this.player as Swordsman).sword,
        this.slimeGroup,
        undefined,
        this.slimeSwordCollide,
        this,
      );
    } else if (this.playerClass === PlayerClass.ARCHER) {
      this.physics.add.collider((this.player as Archer).arrows, map.wallLayer, this.arrowWallCollide);
      this.physics.add.overlap(
        (this.player as Archer).arrows,
        this.slimeGroup,
        this.slimeArrowCollide,
        undefined,
        this,
      );
      this.physics.add.collider(
        (this.player as Archer).arrows,
        this.slimeGroup,
        undefined,
        this.slimeArrowCollide,
        this,
      );
    }

    for (const slime of this.slimes) {
      this.physics.add.collider(slime.sprite, map.wallLayer);
    }

    this.input.keyboard.on('keydown-ONE', UIScene.skillKeyPressHandler(Skill.ONE, this.uiKeys));
    this.input.keyboard.on('keyup-ONE', UIScene.skillKeyReleaseHandler(Skill.ONE, this.uiKeys));

    this.input.keyboard.on('keydown-TWO', UIScene.skillKeyPressHandler(Skill.TWO, this.uiKeys));
    this.input.keyboard.on('keyup-TWO', UIScene.skillKeyReleaseHandler(Skill.TWO, this.uiKeys));

    this.input.keyboard.on('keydown-THREE', UIScene.skillKeyPressHandler(Skill.THREE, this.uiKeys));
    this.input.keyboard.on('keyup-THREE', UIScene.skillKeyReleaseHandler(Skill.THREE, this.uiKeys));

    this.scene.run('ui');
  }

  update(time: number, delta: number): void {
    this.player.update(time);

    const esc = this.keys.esc.isDown;
    const tab = this.keys.tab.isDown;
    const k = this.keys.k.isDown;

    if (time < this.keyPressLockedUntil) {
      return;
    }

    if (esc || k || tab) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (tab && this.isSkillsShopOpened && this.isSkillsShopOpened) {
      const skillShopScene = this.scene.get('SkillShopScene') as SkillShopScene;
      const playerSkillsScene = this.scene.get('PlayerSkillsScene') as PlayerSkillsScene;

      if (skillShopScene.active && !playerSkillsScene.active) {
        eventsCenter.emit(EventsEnum.DEACTIVATE_SKILLS_SHOP_SCENE);
        eventsCenter.emit(EventsEnum.ACTIVATE_PLAYER_SKILLS_SCENE);
      } else if (!skillShopScene.active && playerSkillsScene.active) {
        eventsCenter.emit(EventsEnum.ACTIVATE_SKILLS_SHOP_SCENE);
        eventsCenter.emit(EventsEnum.DEACTIVATE_PLAYER_SKILLS_SCENE);
      }
    }

    if (esc) {
      this.scene.stop('SkillShopScene');
      this.scene.stop('PlayerSkillsScene');
      this.isSkillsShopOpened = false;
      this.isPlayerSkillsUIOpened = false;
      this.player.sprite.enableBody(false, this.player.sprite.x, this.player.sprite.y, true, true);
    }

    if (k) {
      if (this.isSkillsShopOpened) {
        return;
      }

      if (this.isPlayerSkillsUIOpened) {
        this.scene.stop('PlayerSkillsScene');
        this.isPlayerSkillsUIOpened = false;
        this.player.sprite.enableBody(false, this.player.sprite.x, this.player.sprite.y, true, true);
        return;
      }

      this.scene.run('PlayerSkillsScene', { active: true, playerSkills: [] });
      this.isPlayerSkillsUIOpened = true;
      this.player.sprite.disableBody();
    }

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
