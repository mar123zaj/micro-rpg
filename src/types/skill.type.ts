export type SkillInfo = {
  name: string;
  description: string;
  iconName: string;
  cost: number;
};

export type SkillMechanics = (scene: Phaser.Scene, data: Record<string, any>) => void;

export type Skill = {
  info: SkillInfo;
  mechanics: SkillMechanics;
};
