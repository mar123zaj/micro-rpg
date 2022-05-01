import { Skill } from '../../types/skill.type';

const skills: Skill[] = [
  {
    info: {
      name: 'Heal buff',
      description: 'This is buff that gives\nsome additional health points.',
      iconName: 'skill',
      cost: 5,
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('heal buff');
    },
  },
];

export default skills;
