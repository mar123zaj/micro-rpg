import SkillsSeller from '../../public/assets/characters/npc/skills_seller.png';
import Archer from '../../public/assets/characters/playable/archer.png';
import Barbarian from '../../public/assets/characters/playable/barbarian.png';
import Swordsman from '../../public/assets/characters/playable/swordsman.png';
import GreenSlime from '../../public/assets/enemies/GreenSlime.png';
import RedSlime from '../../public/assets/enemies/RedSlime.png';
import Arrow from '../../public/assets/items/arrow.png';
import Coins1 from '../../public/assets/items/coins_1.png';
import Coins2 from '../../public/assets/items/coins_2.png';
import Coins3 from '../../public/assets/items/coins_3.png';
import Environment from '../../public/assets/tilesets/micro_tileset.png';
import Util from '../../public/assets/Util.png';

type AnimConfig = {
  key: string;
  frames: Phaser.Types.Animations.GenerateFrameNumbers;
  defaultTextureKey?: string;
  frameRate?: integer;
  duration?: integer;
  skipMissedFrames?: boolean;
  delay?: integer;
  repeat?: integer;
  repeatDelay?: integer;
  yoyo?: boolean;
  showOnStart?: boolean;
  hideOnComplete?: boolean;
};

export type GraphicSet = {
  name: string;
  file: string;
  width?: number;
  height?: number;
  margin?: number;
  spacing?: number;
};

export type AnimSet = GraphicSet & {
  animations: { [k: string]: AnimConfig };
};

const environment = {
  name: 'environment',
  width: 8,
  height: 8,
  margin: 0,
  spacing: 0,
  file: Environment,
  indices: {
    floor: {
      outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17],
      outerCorridor: [0x0d, 0x0d, 0x0d, 0x1d, 0x0f, 0x1f],
    },
    block: 0x17, // 23
    doors: {
      horizontal: 64, // 129
      vertical: 67, // 146
      destroyed: 65, // 53
    },
    walls: {
      alone: 0x14, // 20
      intersections: {
        e_s: 0x00, // 0
        n_e_s_w: 0x01, // 1
        e_w: 0x02, // 2
        s_w: 0x03, // 3
        n_e_s: 0x10, // 16
        w: 0x11, // 17
        e: 0x12, // 18
        n_s_w: 0x13, // 19
        n_s: 0x20, // 32
        s: 0x21, // 33
        e_s_w: 0x22, // 34
        n_e: 0x30, // 48
        n_e_w: 0x31, // 49
        n: 0x32, // 50
        n_w: 0x33, // 51
        e_door: 20, // 101
        w_door: 20, // 102
      },
    },
  },
};

const barbarian: AnimSet = {
  name: 'barbarian',
  width: 20,
  height: 20,
  file: Barbarian,
  animations: {
    idle: {
      key: 'barbarianIdle',
      frames: { start: 13, end: 16 },
      frameRate: 6,
      repeat: -1,
    },
    idleBack: {
      key: 'barbarianIdleBack',
      frames: { start: 13, end: 16 },
      frameRate: 6,
      repeat: -1,
    },
    walk: {
      key: 'barbarianWalk',
      frames: { start: 17, end: 20 },
      frameRate: 10,
      repeat: -1,
    },
    walkBack: {
      key: 'barbarianWalkBack',
      frames: { start: 17, end: 20 },
      frameRate: 10,
      repeat: -1,
    },
    attack: {
      key: 'barbarianAttack',
      frames: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      frameRate: 18,
    },
  },
};

const skillsSeller: AnimSet = {
  name: 'skillsSeller',
  width: 16,
  height: 16,
  file: SkillsSeller,
  animations: {
    idle: {
      key: 'skillsSellerIdle',
      frames: { start: 0, end: 3 },
      frameRate: 6,
      repeat: -1,
    },
  },
};

const swordsman: AnimSet = {
  name: 'swordsman',
  width: 20,
  height: 16,
  file: Swordsman,
  animations: {
    idle: {
      key: 'swordsmanIdle',
      frames: { start: 7, end: 10 },
      frameRate: 6,
      repeat: -1,
    },
    idleBack: {
      key: 'swordsmanIdleBack',
      frames: { start: 7, end: 10 },
      frameRate: 6,
      repeat: -1,
    },
    walk: {
      key: 'swordsmanWalk',
      frames: { start: 11, end: 18 },
      frameRate: 10,
      repeat: -1,
    },
    walkBack: {
      key: 'swordsmanWalkBack',
      frames: { start: 11, end: 18 },
      frameRate: 10,
      repeat: -1,
    },
    attack: {
      key: 'swordsmanAttack',
      frames: { frames: [0, 1, 2, 3, 4, 5, 6] },
      frameRate: 18,
    },
    swordBuff: {
      key: 'swordBuff',
      frames: { frames: [0, 3, 4, 19, 20, 21] },
      frameRate: 10,
    },
  },
};

const archer: AnimSet = {
  name: 'archer',
  width: 16,
  height: 16,
  file: Archer,
  animations: {
    idle: {
      key: 'archerIdle',
      frames: { start: 8, end: 11 },
      frameRate: 6,
      repeat: -1,
    },
    idleBack: {
      key: 'archerIdleBack',
      frames: { start: 8, end: 11 },
      frameRate: 6,
      repeat: -1,
    },
    walk: {
      key: 'archerWalk',
      frames: { start: 12, end: 19 },
      frameRate: 10,
      repeat: -1,
    },
    walkBack: {
      key: 'archerWalkBack',
      frames: { start: 12, end: 19 },
      frameRate: 10,
      repeat: -1,
    },
    attack: {
      key: 'archerAttack',
      frames: { frames: [0, 1, 2, 3, 4, 5, 6, 7] },
      frameRate: 18,
    },
  },
};

const greenSlime: AnimSet = {
  name: 'greenSlime',
  width: 32,
  height: 32,
  file: GreenSlime,
  animations: {
    idle: {
      key: 'greenslimeIdle',
      frames: { start: 0, end: 5 },
      frameRate: 6,
      repeat: -1,
    },
    move: {
      key: 'greenslimeMove',
      frames: { start: 8, end: 14 },
      frameRate: 8,
      repeat: -1,
    },
    death: {
      key: 'greenslimeDeath',
      frames: { start: 32, end: 38 },
      frameRate: 16,
      hideOnComplete: true,
    },
  },
};

const redSlime: AnimSet = {
  name: 'redSlime',
  width: 32,
  height: 32,
  file: RedSlime,
  animations: {
    idle: {
      key: 'redslimeIdle',
      frames: { start: 0, end: 5 },
      frameRate: 6,
      repeat: -1,
    },
    move: {
      key: 'redslimeMove',
      frames: { start: 8, end: 14 },
      frameRate: 8,
      repeat: -1,
    },
    death: {
      key: 'redslimeDeath',
      frames: { start: 32, end: 38 },
      frameRate: 16,
      hideOnComplete: true,
    },
  },
};

const arrow = {
  name: 'arrow',
  file: Arrow,
};

const coins1 = {
  name: 'coins_1',
  file: Coins1,
};

const coins2 = {
  name: 'coins_2',
  file: Coins2,
};

const coins3 = {
  name: 'coins_3',
  file: Coins3,
};

const util = {
  name: 'util',
  width: 16,
  height: 16,
  file: Util,
  indices: {
    black: 0x00,
  },
};

export default {
  environment,
  barbarian,
  skillsSeller,
  swordsman,
  archer,
  greenSlime,
  redSlime,
  arrow,
  coins1,
  coins2,
  coins3,
  util,
};
