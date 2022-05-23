import { Skill } from '../../types/skill.type';

const skills: Skill[] = [
  {
    info: {
      name: 'Heal buff',
      description: 'This is buff that gives\nsome additional health points.',
      cost: 5,
    },
    graphics: {
      iconName: 'skill_fire',
    },
    mechanics: (scene: Phaser.Scene, data: Record<string, any>): void => {
      console.log('heal buff');
    },
  },
];

export default skills;
