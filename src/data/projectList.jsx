import {
  FaGlobe,
  FaCode,
  FaDiceD20,
  FaBrain,
  FaLayerGroup,
} from 'react-icons/fa';

import { SiObsstudio } from 'react-icons/si';
import { HiMiniCircleStack } from 'react-icons/hi2';
import { MdOutlineDisabledByDefault } from 'react-icons/md';

import img1 from '../assets/pictures/project-pics/gumshoeProject.webp';
import img2 from '../assets/pictures/project-pics/socialEyesProject.webp';
import img3 from '../assets/pictures/project-pics/socialUpProject.webp';
import img4 from '../assets/pictures/project-pics/aiGenProject.webp';
import img5 from '../assets/pictures/project-pics/cindervoidProject.webp';
import img6 from '../assets/pictures/project-pics/workforceManagerProject.webp';
import img7 from '../assets/pictures/project-pics/silverKnightProject.webp';
import img9 from '../assets/pictures/project-pics/weeklyMoodalProject.webp';
import img10 from '../assets/pictures/project-pics/desktopCleanerProject.webp';
import img12 from '../assets/pictures/project-pics/readmeMakerProject.webp';
import img13 from '../assets/pictures/project-pics/casinoSlotProject.webp';
import img14 from '../assets/pictures/project-pics/fxWizardProject.webp';
import img16 from '../assets/pictures/project-pics/quizzedProject.webp';
import img18 from '../assets/pictures/project-pics/citrusProject.webp';

const projectList = [
  {
    img: img14,
    title: 'FX Wizard',
    subtitle: 'OBS, Websockets',
    link: 'https://youtu.be/XS1LC7rz8rU',
    git: 'https://github.com/8BitGinger/FXWizard',
    category: 'obs',
  },
  {
    img: img1,
    title: 'Gumshoe RPG',
    subtitle: 'React, Spline',
    link: 'https://gumshoerpg.com/',
    git: 'https://github.com/8BitGinger/GumshoeReact',
    category: 'game',
  },
  {
    img: img3,
    title: 'SocialUp↑',
    subtitle: 'React, Gemini API',
    link: 'https://social-up.vercel.app/',
    git: 'https://github.com/8BitGinger/socialUp',
    category: 'ai',
  },

  {
    img: img5,
    title: 'Cindervoid RPG',
    subtitle: 'Framer, React, Suno',
    link: 'https://www.cindervoid.fun',
    git: 'https://github.com/8BitGinger/cindervoidrpg',
    category: 'game',
  },

  {
    img: img4,
    title: 'AI Image Generator',
    subtitle: 'OpenAI API',
    link: 'https://aigen-dth3.onrender.com/',
    git: 'https://github.com/8BitGinger/aiGen',
    category: 'ai',
  },

  {
    img: img2,
    title: 'Social Eyes',
    subtitle: 'MERNg Stack',
    link: 'https://antisocialeyes.onrender.com/',
    git: 'https://github.com/8BitGinger/antiSocialMedia',
    category: 'fullstack',
  },

  // {
  //   img: img7,
  //   title: 'Silver Knight RPG',
  //   subtitle: 'Node.js, Inquirer',
  //   link: 'https://8bitginger.github.io/silverKnightRPG/',
  //   git: 'https://github.com/8BitGinger/silverKnightRPG',
  //   category: 'game',
  // },

  {
    img: img9,
    title: 'Weekly Moodal',
    subtitle: 'React, Express.js',
    link: 'https://jameslwilson364.github.io/weeklyMoodal/',
    git: 'https://github.com/jameslwilson364/weeklyMoodal',
    category: 'web',
  },

  // {
  //   img: img12,
  //   title: 'Readme Maker',
  //   subtitle: 'Node.js, Inquirer',
  //   link: 'https://8bitginger.github.io/readmeMaker/',
  //   git: 'https://github.com/8BitGinger/readmeMaker',
  //   category: 'script',
  // },

  {
    img: img6,
    title: 'Workforce Manager',
    subtitle: 'BackEnd CRM, Inquirer',
    link: 'https://8bitginger.github.io/workforceManager/',
    git: 'https://github.com/8BitGinger/workforceManager',
    category: 'backend',
  },

  {
    img: img18,
    title: 'Citrus Photo',
    subtitle: 'Python',
    link: '',
    git: 'https://github.com/8BitGinger/citrus',
    category: 'script',
  },

  {
    img: img13,
    title: 'Casino Slots',
    subtitle: 'JS, Sass',
    link: 'https://8bitginger.github.io/casinoSlot/',
    git: 'https://github.com/8BitGinger/casinoSlot',
    category: 'game',
  },

  // {
  //   img: img10,
  //   title: 'Desktop Cleaner',
  //   subtitle: 'Python',
  //   link: '',
  //   git: 'https://github.com/8BitGinger/desktopCleaner',
  //   category: 'script',
  // },

  // {
  //   img: img16,
  //   title: 'Quizzed',
  //   subtitle: 'Vanilla JS',
  //   link: 'https://8bitginger.github.io/quizzed/',
  //   git: 'https://github.com/8BitGinger/quizzed',
  //   category: 'web',
  // },
];

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'web':
      return <FaGlobe />;
    case 'obs':
      return <SiObsstudio />;
    case 'script':
      return <FaCode />;
    case 'game':
      return <FaDiceD20 />;
    case 'ai':
      return <FaBrain />;
    case 'backend':
      return <HiMiniCircleStack />;
    case 'fullstack':
      return <FaLayerGroup />;
    default:
      return <MdOutlineDisabledByDefault />;
  }
};

const iconList = {
  web: <FaGlobe />,
  obs: <SiObsstudio />,
  script: <FaCode />,
  game: <FaDiceD20 />,
  ai: <FaBrain />,
  backend: <HiMiniCircleStack />,
  fullstack: <FaLayerGroup />,
  default: <MdOutlineDisabledByDefault />,
};

const categoryColors = {
  web: '#4CAF50',
  obs: '#2196F3',
  script: '#FF9800',
  game: '#9C27B0',
  ai: '#E91E63',
  backend: '#607D8B',
  fullstack: '#795548',
  default: '#607D8B',
};

export { getCategoryIcon, categoryColors, iconList };
export default projectList;
