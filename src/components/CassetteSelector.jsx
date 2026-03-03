import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import profilePic from '../assets/pictures/profile-standard.webp';

const genres = [
  {
    id: 'pop',
    label: 'Pop',
    track: '/music/pop.mp3',
    rotate: -45,
    xFactor: -1.2,
    y: 18,
  },
  {
    id: 'rap',
    label: 'Rap',
    track: '/music/rap.mp3',
    rotate: -22,
    xFactor: -0.7,
    y: 5,
  },
  {
    id: 'country',
    label: 'Country',
    track: '/music/country.mp3',
    rotate: 0,
    xFactor: 0,
    y: 0,
  },
  {
    id: 'lofi',
    label: 'Lo-Fi',
    track: '/music/lofi.mp3',
    rotate: 22,
    xFactor: 0.7,
    y: 5,
  },
  {
    id: 'rock',
    label: 'Rock',
    track: '/music/rock.mp3',
    rotate: 45,
    xFactor: 1.2,
    y: 18,
  },
];

export default function CassetteSelector() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // 🎯 TIGHTENED SPREAD: 40px for mobile makes them overlap beautifully
  const spreadMultiplier = isMobile ? 40 : 120;
  // 🎯 TIGHTENED ROTATION: Tapes stand more "upright" on mobile to save space
  const rotationMultiplier = isMobile ? 0.6 : 1;

  const handleHover = (trackPath) => {
    if (!document.querySelector(`link[href="${trackPath}"]`)) {
      const link = document.createElement('link');
      // link.rel = 'preload';
      link.as = 'audio';
      link.href = trackPath;
      document.head.appendChild(link);
    }
  };

  // Inside CassetteSelector.jsx

  const handleSelect = (g) => {
    // 1. Clear any old audio if it exists
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.src = '';
    }

    // 2. CREATE the audio object and attach it to the window
    const audio = new Audio(g.track);
    audio.volume = 0.3;
    audio.loop = true;
    audio.preload = 'none'; // We already preloaded on hover, so this is just a fallback
    audio.play().catch(() => console.log('Interaction required for audio'));

    // This is the global link the MusicPlayer looks for
    window.currentAudio = audio;

    // 3. Dispatch the theme switch event
    const event = new CustomEvent('theme-switch', {
      detail: { theme: g.id, track: g.track, volume: 0.3 },
    });
    window.dispatchEvent(event);

    // 4. Navigate
    setTimeout(() => navigate('/about'), 600);
  };

  return (
    <div className="selector-page">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/videos/retro-bg.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      <div className="content-wrapper">
        <img src={profilePic} alt="Logo" className="logo" />
        <h1 className="title">Select Your Vibe</h1>

        <div className="ghost-wrapper vertical-fan">
          {genres.map((g, index) => {
            const xOffset = g.xFactor * spreadMultiplier;
            const finalRotate = g.rotate * rotationMultiplier;

            return (
              <motion.div
                key={g.id}
                style={{
                  transformOrigin: 'bottom center',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  zIndex: index,
                  cursor: 'pointer',
                }}
                initial={{
                  rotate: finalRotate,
                  x: `calc(-50% + ${xOffset}px)`,
                  y: isMobile ? g.y * 0.5 : g.y,
                }}
                onMouseEnter={() => handleHover(g.track)}
                whileHover={{
                  y: isMobile ? -30 : -80,
                  x: `calc(-50% + ${xOffset}px)`,
                  rotate: 0,
                  scale: isMobile ? 1.1 : 1.2,
                  zIndex: 100,
                  transition: { type: 'spring', stiffness: 150, damping: 30 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(g)}
              >
                <div className="tape-container vertical">
                  <img
                    src={`/images/tape-${g.id}.webp`}
                    alt={g.label}
                    className="tape-image"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        <h2 className="title2">Ryan J. Fann</h2>
      </div>
    </div>
  );
}
