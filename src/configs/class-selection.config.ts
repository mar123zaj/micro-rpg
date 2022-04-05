import Archer from '../../assets/ui/class-selection/archer.png';
import Mage from '../../assets/ui/class-selection/mage.png';
import Swordsman from '../../assets/ui/class-selection/swordsman.png';
import ClassSelectedFrame from '../../assets/ui/class-selection/class_selected_frame.png';
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
