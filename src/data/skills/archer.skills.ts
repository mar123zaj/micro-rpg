import { Skill } from '../../types/skill.type';

const skills: Skill[] = [
  {
    info: {
      name: 'Bow buff',
      description: 'This is buff that gives\nsome additional attack\npower.',
      cost: 5,
    },
    graphics: {
      iconName: 'skill_fire',
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('bow buff');
    },
  },
];

export default skills;
