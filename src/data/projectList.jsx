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
import img9 from '../assets/pictures/project-pics/weeklyMoodalProject.webp';
import img13 from '../assets/pictures/project-pics/casinoSlotProject.webp';
import img14 from '../assets/pictures/project-pics/fxWizardProject.webp';
// import img18 from '../assets/pictures/project-pics/citrusProject.webp';
import img15 from '../assets/pictures/project-pics/geminiProject.webp';
import img7 from '../assets/pictures/project-pics/obsShowTimerProject.webp';
import img19 from '../assets/pictures/project-pics/ryfiProject.webp';

const projectList = [
  {
    img: img14,
    title: 'FX Wizard',
    subtitle: 'OBS, Websockets, Python',
    description:
      'A custom OBS plugin suite built with Python and WebSockets for dynamic scene control, visual effects, and real-time stream automation.',
    link: '',
    git: 'https://github.com/8BitGinger/FXWizard_v2',
    youtube: '',
    category: 'obs',
  },
  {
    img: img1,
    title: 'Gumshoe RPG',
    subtitle: 'React, Spline',
    description:
      'A noir detective-themed TTRPG companion site built with React and interactive 3D Spline scene to bring the world of Gumshoe to life.',
    link: 'https://gumshoerpg.com/',
    git: 'https://github.com/8BitGinger/GumshoeReact',
    youtube: '',
    category: 'game',
  },

  {
    img: img19,
    title: 'RyFi Records',
    subtitle: 'React, Firebase',
    description:
      'A full-stack music label site for RyFi Records, built with React and Firebase to showcase artists, releases, and streaming links.',
    link: 'https://www.ryfimusic.com/',
    git: 'https://github.com/8BitGinger/ryfiMusic',
    youtube: '',
    category: 'fullstack',
  },
  {
    img: img3,
    title: 'SocialUp↑',
    subtitle: 'Typescript, Gemini API',
    description:
      'An AI-powered social media assistant built with TypeScript and the Gemini API to help generate and refine social content.',
    link: 'https://social-up.vercel.app/',
    git: 'https://github.com/8BitGinger/socialUp',
    youtube: '',
    category: 'ai',
  },

  {
    img: img5,
    title: 'Cindervoid RPG',
    subtitle: 'Framer, React, Suno',
    description:
      'A dark fantasy TTRPG companion site built with React and Framer Motion, featuring a soundtrack created with Suno.',
    link: 'https://www.cindervoid.fun',
    git: 'https://github.com/8BitGinger/cindervoidrpg',
    youtube: '',
    category: 'game',
  },

  {
    img: img7,
    title: 'OBS Show Timer',
    subtitle: 'OBS, Websockets',
    description:
      'A lightweight OBS dock and talent display tool that displays a live, WebSocket-driven countdown timer for broadcasts and streams.',
    link: '',
    git: 'https://github.com/8BitGinger/obsDisplayTimer',
    youtube: '',
    category: 'obs',
  },

  {
    img: img4,
    title: 'AI Image Generator',
    subtitle: 'OpenAI API',
    description:
      'A web app that generates custom images from text prompts using the OpenAI API.',
    link: 'https://aigen-dth3.onrender.com/',
    git: 'https://github.com/8BitGinger/aiGen',
    youtube: '',
    category: 'ai',
  },

  {
    img: img2,
    title: 'Social Eyes',
    subtitle: 'MERNg Stack',
    description:
      'A full-stack social media platform built on the MERN stack with GraphQL, exploring social app architecture end to end.',
    link: 'https://antisocialeyes.onrender.com/',
    git: 'https://github.com/8BitGinger/antiSocialMedia',
    youtube: '',
    category: 'fullstack',
  },

  {
    img: img9,
    title: 'Weekly Moodal',
    subtitle: 'APIs, Dynamic Date',
    description:
      'A weekly mood-tracking web app that pulls dynamic date-based data to help users log and reflect on how they feel.',
    link: 'https://jameslwilson364.github.io/weeklyMoodal/',
    git: 'https://github.com/jameslwilson364/weeklyMoodal',
    youtube: '',
    category: 'web',
  },

  {
    img: img6,
    title: 'Workforce Manager',
    subtitle: 'BackEnd CRM, Inquirer',
    description:
      'A command-line CRM tool built with Node.js and Inquirer for managing employee roles, departments, and budgets from the terminal.',
    link: 'https://8bitginger.github.io/workforceManager/',
    git: 'https://github.com/8BitGinger/workforceManager',
    youtube: '',
    category: 'backend',
  },

  {
    img: img13,
    title: 'Casino Slots',
    subtitle: 'JS, Sass',
    description:
      'A browser-based slot machine game built with vanilla JavaScript and Sass, featuring animated reels and payout logic.',
    link: 'https://8bitginger.github.io/casinoSlot/',
    git: 'https://github.com/8BitGinger/casinoSlot',
    youtube: '',
    category: 'game',
  },

  {
    img: img15,
    title: "8Bit's Gemini",
    subtitle: 'Gemini API',
    description: "A conversational AI chat interface built around Google's Gemini API and designed to be a clone to gemini.",
    link: 'https://gemini-ryan.netlify.app/',
    git: 'https://github.com/8BitGinger/ryansGemini',
    youtube: '',
    category: 'ai',
  },
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

const categoryLabels = {
  web: 'Web',
  obs: 'OBS Tools',
  script: 'Scripts',
  game: 'Games',
  ai: 'AI',
  backend: 'Backend',
  fullstack: 'Full-Stack',
  default: 'Other',
};

export { getCategoryIcon, categoryColors, categoryLabels, iconList };
export default projectList;
