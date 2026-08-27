import React from 'react';
import '../assets/styles/about.css';
import '../assets/styles/aboutBento.css';
import '../assets/styles/skills.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillBars from '../components/SkillBars';
import WebLinks from '../components/WebLinks';
import NavPageButtons from '../components/NavPageButtons';
import PageHeader from '../components/PageHeader';
import Cards from '../components/Cards';
import AboutTabs from '../components/AboutTabs';
import { Code2, Music2, Mic2, Gamepad2 } from 'lucide-react';
import ArtistInfo from '../components/ArtistInfo';

import obsImg from '../assets/pictures/obsPic.png';
import ttrpgImg from '../assets/pictures/ttrpgPic.png';
import devImg from '../assets/pictures/devPic.png';
import gumshoeVid from '../assets/video/gumshoeVid.mp4';
import cindervoidVid from '../assets/video/cindervoidVid.mp4';
import PageBreak from '../components/PageBreak';
import fxWizardImg from '../assets/pictures/project-pics/fxWizardProject.webp';
import obsShowTimerImg from '../assets/pictures/project-pics/obsShowTimerProject.png';
import profilePic from '../assets/pictures/profilePic.png';
import twinJobsImg from '../assets/pictures/twinJobs.png';
import musicPic from '../assets/pictures/musicPic.png';
import twinJobsSmallImg from '../assets/pictures/twinJobsSmall.png';
import { SiApplemusic } from 'react-icons/si';
import vNDALAlbumCover from '../assets/pictures/VNDAL.png';
import auraveilAlbumCover from '../assets/pictures/auraveil.png';
import cashHarlanAlbumCover from '../assets/pictures/cashHarlan.png';
import blacklistDahliaAlbumCover from '../assets/pictures/blacklistDahlia.jpg';
import bit8Pic from '../assets/pictures/ginger8Bit.jpg';

const themeData = {
  rock: {
    title: '8Bit Rebel',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I build things that break the mold. With a passion for heavy riffs and even heavier code, I specialize in creating custom Web apps and Game systems that punch through the noise to tell a story. When I'm not writing functions, I'm probably setting up a podcast or creating my next game.",
    image: '/images/profile-rock.webp',
    background: '/images/rock-background.webp',
  },
  jazz: {
    title: '8Bit Improviser',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'Welcome to the late-night lounge. I approach coding like improvisation—finding the perfect rhythm and elegant solutions to complex problems. I specialize in creating seamless user experiences and intuitive interfaces.',
    image: '/images/profile-jazz.webp',
    background: '/images/jazz-background.webp',
  },
  pop: {
    title: '8Bit Visionary',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I believe code should be as catchy as a top-40 hit and as polished as a neon skyline. I specialize in building vibrant OBS tools, engaging TTRPG experiences, and web sites that absolutely pop off the screen. For me, development isn't just about pure function—it's about creating joyful, frictionless experiences that your community will love.",
    image: '/images/profile-pop.webp',
    background: '/images/pop-background.webp',
  },
  rap: {
    title: '8Bit Flow-Master',
    subtitle: "Ryan '8BitGinger' Fann",
    text: "In development, just like on the mic, it's all about the hustle and the flow. I engineer custom OBS tools, dynamic web apps, and raw Game experiences that never skip a beat. Whether I'm dropping bars of code, slinging a fresh campaign, or optimizing a stream's setup, I bring relentless energy and street-level authenticity to every project I touch.",
    image: '/images/profile-rap.webp',
    background: '/images/rap-background.webp',
  },
  country: {
    title: '8Bit Storyteller',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'Just like a classic country ballad, the best applications and tabletop games are built on honest, compelling storytelling. I handcraft solid websites, reliable OBS tools and weave rich TTRPG campaigns that bring people together around the virtual campfire. I believe in hard work, strong foundations, and writing code that stands the test of time.',
    image: '/images/profile-country.webp',
    background: '/images/country-background.webp',
  },
  lofi: {
    title: '8Bit Vibe-Coder',
    subtitle: "Ryan '8BitGinger' Fann",
    text: 'There is a certain kind of magic that happens at 2 AM with a hot coffee and a steady, ambient beat. I specialize in deep-focus development, quietly crafting visual story-based websites, seamless OBS tools and vast TTRPG worlds while the rest of the world sleeps. My approach is all about creating a relaxed, intuitive user experience.',
    image: '/images/profile-lofi.webp',
    background: '/images/lofi-background.webp',
  },
};

export default function About({ theme }) {
  const content = themeData[theme] || themeData['jazz'];

  return (
    <div className="about-page">
      {/* ── Hero wrapper ── */}
      <motion.div
        className={`about-wrapper wrapper-${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ backgroundImage: `url(${content.background})` }}
      >
        <div className="about-content">
          <div className="profile-image-container">
            <img
              src={content.image}
              alt={`8BitGinger - ${content.title}`}
              className="profile-image"
              fetchPriority="high"
              onError={(e) =>
                (e.target.src = 'https://placehold.co/600x400/EEE/31343C')
              }
            />
          </div>

          <h1 className={`about-title ${theme}`}>{content.title}</h1>
          <p className={`subtitle subtitle-${theme}`}>{content.subtitle}</p>

          <p className="about-paragraph">{content.text}</p>

          <div className="weblinks-container">
            <WebLinks theme={theme} />
            <Link to="/" className="link">
              Switch Tapes?
            </Link>
          </div>
        </div>
      </motion.div>

      <PageHeader theme={theme} title="Music Info" />
        <ArtistInfo theme={theme} />
    


      <PageHeader theme={theme} title="Specs" />

      <div className="bento">
        <div className="bento-cell span-2">
          <Cards.PhotoCardLeft
            img={profilePic}
            title="Current Role"
            content={
              "Part of a tight-knit engineering trio, I serve as an IT Engineer ensuring KAMC and KLBKs infrastructure never misses a beat. Working alongside our Chief and my fellow engineer to maintain 24/7 stability, I specialize in the 'New Game+' builds—architecting the station’s professional podcast studio from scratch and scripting custom OBS tools to level up our digital broadcasts."
            }
            theme={theme}
          />
        </div>

      

        <div className="bento-cell quote">
          <Cards.ListCard
            theme={theme}
            title="The A-Side"
            content={[
              'Station Engineering: Servers, Networks, Broadcast Systems, and all the tech that keeps the signal strong',
              'The Podcast Lab: Building a state-of-the-art podcast studio from the ground up to support the launch of EL+',
              'Digital Modding: Custom OBS Tools, Streamlined Workflows, and all the little mods that make a BIG difference',
              'Collaboration: Working closely with News Production, Sports Teams, Anchors/Reports, and our Chief Engineer to ensure seamless operations across the board',
            ]}
          />
        </div>

        <div className={`bento-cell card card--${theme} card--span-2`}>
            <img src={twinJobsSmallImg} alt="Twin Jobs" className="card__img" />
        </div>



        <div className="bento-cell span-1">
          <div className={`card card--${theme} resume-tile`}>
            <span className="resume-tile__label">Want the full rundown?</span>
            <Link
              to="../downloads/Resume2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`link link--${theme} resume-btn`}
            >
              View PDF Resume
            </Link>
          </div>
        </div>

                <div className="bento-cell span-1">
          <Cards.ListCardReverse
            theme={theme}
            title="The B-Side"
            content={[
              'Fullstack Development: Building seamless web apps and custom OBS tools',
              'Game Design: Crafting immersive Games that captivate players',
              'Content Creation: Producing engaging media that resonates with communities',
              'Continuous Learning: Always leveling up my skills and knowledge',
            ]}
          />
        </div>
      </div>

      <PageBreak theme={theme} />

      <PageHeader theme={theme} title="Explore the Work" />

      <AboutTabs
        theme={theme}
        tabs={[
          {
            id: 'coding',
            label: 'Coding',
            icon: <Code2 size={16} />,
            content: (
              <div className="bento">
                <div className="bento-cell span-2">
                  <Cards.PhotoCardRight
                    img={devImg}
                    title="Fullstack Developer"
                    content="As a fullstack developer, I bring a versatile skill set that allows me to craft seamless web applications and custom OBS tools. From designing intuitive user interfaces to optimizing backend performance, I thrive on creating solutions that are both functional and engaging. Whether it's building a dynamic website or developing a tool to enhance streaming experiences, I am passionate about delivering high-quality, innovative projects that resonate with users and communities alike."
                    theme={theme}
                  />
                </div>
                <div className="bento-cell span-2">
                  <div className={`about-section about-section--${theme}`}>
                    <div className="about-section__inner">
                      <SkillBars theme={theme} />
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: 'music',
            label: 'Music Production',
            icon: <Music2 size={16} />,
            content: (
              <div className="bento">
                <div className="bento-cell span-2">
                  <Cards.PhotoCardLeft
                    img={musicPic}
                    title="Digital Music Producer"
                    content="I produce digital music that blends various genres and styles to create unique soundscapes. My work as a music producer allows me to explore the intersection of technology and creativity, crafting tracks that resonate with listeners and enhance multimedia projects."
                    theme={theme}
                  />
                </div>

                <div className="bento-cell bento-center span-2">
               <iframe allow="autoplay; encrypted-media; fullscreen; clipboard-write" frameBorder="0" height="800" style={{width: '100%', maxWidth: '660px', margin: 'auto', height: '450px', overflow: 'hidden', borderRadius: '10px'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/vibe/pl.u-JPAZDDPIXW4Wl9"></iframe>
                </div>

                <h2> ➤ My Artists</h2>
                <div className="bento-cell span-2">
                  <Cards.ChildCard theme={theme}>
                                  <Link
                      to="https://music.apple.com/us/artist/8bitginger/6790270313"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={bit8Pic}
                        alt="8Bit Ginger Album Cover"
                        className="music-preview"
                        loading="lazy"
                      />
                    </Link>
                    <Link
                      to="https://music.apple.com/us/artist/auraveil/6776076042"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={auraveilAlbumCover}
                        alt="Auraveil Album Cover"
                        className="music-preview"
                        loading="lazy"
                      />
                    </Link>

                    <Link
                      to="https://music.apple.com/us/artist/vndal/6775072343"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={vNDALAlbumCover}
                        alt="VNDAL Album Cover"
                        className="music-preview"
                        loading="lazy"
                      />
                    </Link>

                    <Link
                      to="https://music.apple.com/us/artist/blacklist-dahlia/6782773395"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={blacklistDahliaAlbumCover}
                        alt="Blacklist Dahlia Album Cover"
                        className="music-preview"
                        loading="lazy"
                      />
                    </Link>

                    <Link
                      to="https://music.apple.com/us/artist/cash-harlan/6779032164"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={cashHarlanAlbumCover}
                        alt="Cash Harlan Album Cover"
                        className="music-preview"
                        loading="lazy"
                      />
                    </Link>
      
                  </Cards.ChildCard>
                </div>
                <h3 className="music-credit span-2">
                  <SiApplemusic className={`icon2 icon2--${theme}`} />
                  All Artists available on Apple Music, Spotify, and YouTube
                </h3>
              </div>
            ),
          },
          {
            id: 'podcast',
            label: 'Podcast Engineering',
            icon: <Mic2 size={16} />,
            content: (
              <div className="bento">
                <div className="bento-cell span-2">
                  <Cards.PhotoCardRight
                    img={obsImg}
                    title="Custom OBS Tools"
                    content="I build custom OBS tools that help streamers create unique, engaging experiences for their audiences. From interactive overlays to dynamic scene management, my tools are designed to enhance the streaming experience and make it easier for creators to connect with their communities."
                    theme={theme}
                  />
                </div>

                <div className="bento-cell span-2">
                  <Cards.ChildCard theme={theme}>
                    <Link to="/projects">
                      <img
                        src={fxWizardImg}
                        alt="FX Wizard Logo"
                        className="obs-preview"
                        loading="lazy"
                      />
                    </Link>
                    <Link to="/projects">
                      <img
                        src={obsShowTimerImg}
                        alt="Custom OBS Tools"
                        className="obs-preview"
                        loading="lazy"
                      />
                    </Link>
                  </Cards.ChildCard>
                </div>
              </div>
            ),
          },
          {
            id: 'game',
            label: 'Game Creation',
            icon: <Gamepad2 size={16} />,
            content: (
              <div className="bento">
                <div className="bento-cell span-2">
                  <Cards.PhotoCardLeft
                    img={ttrpgImg}
                    title="Content & Game Creator"
                    content="I craft immersive TTRPG campaigns that transport players to fantastical worlds filled with rich storytelling and dynamic gameplay. Whether it's a high-stakes adventure or a character-driven narrative, my campaigns are designed to captivate and inspire players of all experience levels."
                    theme={theme}
                  />
                </div>

                <div className="bento-cell span-2">
                  <Cards.ChildCard theme={theme}>
                    <Link to="/projects" className="video-link">
                      <video
                        width="560"
                        height="315"
                        autoPlay
                        loop
                        muted
                        playsInline
                        loading="lazy"
                      >
                        <source src={cindervoidVid} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Link>

                    <Link to="/projects" className="video-link">
                      <video
                        width="560"
                        height="315"
                        autoPlay
                        loop
                        muted
                        playsInline
                        loading="lazy"
                      >
                        <source src={gumshoeVid} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Link>
                  </Cards.ChildCard>
                </div>
              </div>
            ),
          },
        ]}
      />

      <NavPageButtons theme={theme} btn1Link="/" btn2Link="/projects" />
    </div>
  );
}
