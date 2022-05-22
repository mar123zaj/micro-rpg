import { Skill } from '../../types/skill.type';

const skills: Skill[] = [
  {
    info: {
      name: 'Sword buff',
      description: 'This is buff that gives\nsome additional attack\npower.',
      cost: 5,
    },
    graphics: {
      iconName: 'skill',
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('sword buff');
    },
  },
  {
    info: {
      name: 'Sword buff 2',
      description: 'This is buff that gives\nsome additional attack\npower.',
      cost: 5,
    },
    graphics: {
      iconName: 'skill',
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('sword buff');
    },
  },
  {
    info: {
      name: 'Sword buff 3',
      description: 'This is buff that gives\nsome additional attack\npower.',
      cost: 5,
    },
    graphics: {
      iconName: 'skill',
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('sword buff');
    },
  },
];

export default skills;
