export type SkillInfo = {
  name: string;
  description: string;
  cost: number;
};

export type SkillGraphics = {
  iconName: string;
  icon?: Phaser.GameObjects.Image;
};

export type SkillBind = {
  buttonName: string;
  displayText: Phaser.GameObjects.DynamicBitmapText;
};

export type SkillMechanics = (scene: Phaser.Scene, data?: Record<string, any>) => void;

export type Skill = {
  info: SkillInfo;
  graphics: SkillGraphics;
  bind?: SkillBind;
  mechanics: SkillMechanics;
};
