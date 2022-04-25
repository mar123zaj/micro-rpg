import Archer from '../../public/assets/ui/class-selection/archer.png';
import ClassSelectedFrame from '../../public/assets/ui/class-selection/class_selected_frame.png';
import Mage from '../../public/assets/ui/class-selection/mage.png';
import Swordsman from '../../public/assets/ui/class-selection/swordsman.png';
import { GraphicSet } from './Graphics';

const swordsmanIcon: GraphicSet = {
  name: 'swordsmanIcon',
  file: Swordsman,
};

const archerIcon: GraphicSet = {
  name: 'archerIcon',
  file: Archer,
};

const mageIcon: GraphicSet = {
  name: 'mageIcon',
  file: Mage,
};

const classSelectedFrame: GraphicSet = {
  name: 'classSelectedFrame',
  file: ClassSelectedFrame,
};

export default {
  swordsmanIcon,
  archerIcon,
  mageIcon,
  classSelectedFrame,
};
