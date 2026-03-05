import React from 'react';
import '../assets/styles/about.css';
import '../assets/styles/skills.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillBars from '../components/SkillBars';

const themeData = {
  rock: {
    title: '8 Bit-Rebel',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I build things that break the mold. With a passion for heavy riffs and even heavier code, I specialize in creating custom OBS tools and web sites that punch through the noise to tell a story. When I'm not writing functions, I'm probably writing campaigns.",
    image: '/images/profile-rock.webp',
    background: '/images/rock-background.webp',
  },
  jazz: {
    title: '8Bit-Architect',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'Welcome to the late-night lounge. I approach coding like improvisation—finding the perfect rhythm and elegant solutions to complex problems. I specialize in creating seamless user experiences and intuitive interfaces.',
    image: '/images/profile-jazz.webp',
    background: '/images/jazz-background.webp',
  },
  pop: {
    title: '8Bit-Visionary',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I believe code should be as catchy as a top-40 hit and as polished as a neon skyline. I specialize in building vibrant OBS tools, engaging TTRPG experiences, and web sites that absolutely pop off the screen. For me, development isn't just about pure function—it's about creating joyful, frictionless experiences that your community will love.",
    image: '/images/profile-pop.webp',
    background: '/images/pop-background.webp',
  },
  rap: {
    title: '8Bit-Flow-Master',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "In development, just like on the mic, it's all about the hustle and the flow. I engineer custom OBS tools, dynamic web apps, and raw TTRPG experiences that never skip a beat. Whether I'm dropping high-performance code, building out a fresh campaign, or optimizing a stream's setup, I bring relentless energy and street-level authenticity to every project I touch.",
    image: '/images/profile-rap.webp',
    background: '/images/rap-background.webp',
  },
  country: {
    title: '8Bit-Storyteller',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'Just like a classic country ballad, the best applications and tabletop games are built on honest, compelling storytelling. I handcraft solid websites, reliable OBS tools and weave rich TTRPG campaigns that bring people together around the virtual campfire. I believe in hard work, strong foundations, and writing code that stands the test of time.',
    image: '/images/profile-country.webp',
    background: '/images/country-background.webp',
  },
  lofi: {
    title: '8Bit-Vibe-Coder',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'There is a certain kind of magic that happens at 2 AM with a hot coffee and a steady, ambient beat. I specialize in deep-focus development, quietly crafting visual story-based websites, seamless OBS tools and vast TTRPG worlds while the rest of the world sleeps. My approach is all about creating a relaxed, intuitive user experience—building software.',
    image: '/images/profile-lofi.webp',
    background: '/images/lofi-background.webp',
  },
};

export default function About({ theme }) {
  const content = themeData[theme] || themeData['jazz'];

  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Hero wrapper ── */}
      <div
        className={`about-wrapper wrapper-${theme}`}
        style={{ backgroundImage: `url(${content.background})` }}
      >
        <div className="about-content">
          <div className="profile-image-container">
            <img
              src={content.image}
              alt={`8BitGinger - ${content.title}`}
              className="profile-image"
              fetchpriority="high"
              onError={(e) => (e.target.src = 'https://placehold.co/600x400')}
            />
          </div>

          <h1 className={`about-title ${theme}`}>{content.title}</h1>
          <p className="subtitle">{content.subtitle}</p>
          <p className="about-paragraph">{content.text}</p>

          <Link to="/" className="link">
            Switch Tapes?
          </Link>
        </div>
      </div>

      {/* ── Skills — outside the hero, own blurred section ── */}
      <div className={`about-section about-section--${theme}`}>
        <SkillBars theme={theme} />
      </div>
    </motion.div>
  );
}
