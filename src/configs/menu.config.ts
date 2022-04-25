import Background from '../../public/assets/ui/menu/background.png';
import ExitButton from '../../public/assets/ui/menu/exit_button.png';
import Logo from '../../public/assets/ui/menu/logo.png';
import OptionsButton from '../../public/assets/ui/menu/options_button.png';
import PlayButton from '../../public/assets/ui/menu/play_button.png';
import Pointer from '../../public/assets/ui/menu/pointer.png';
import { GraphicSet } from './Graphics';

const logo: GraphicSet = {
  name: 'logo',
  file: Logo,
};

const playButton: GraphicSet = {
  name: 'playButton',
  file: PlayButton,
};

const optionsButton: GraphicSet = {
  name: 'optionsButton',
  file: OptionsButton,
};

const exitButton: GraphicSet = {
  name: 'exitButton',
  file: ExitButton,
};

const background: GraphicSet = {
  name: 'background',
  file: Background,
};

const pointer: GraphicSet = {
  name: 'pointer',
  file: Pointer,
};

export default {
  logo,
  playButton,
  optionsButton,
  exitButton,
  background,
  pointer,
};
