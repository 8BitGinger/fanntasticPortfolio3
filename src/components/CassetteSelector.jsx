import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import profilePic from '../assets/pictures/profile-standard.webp';
import { vibeManager } from '../Utils/VibeManager'; 

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

  const spreadMultiplier = isMobile ? 40 : 120;
  const rotationMultiplier = isMobile ? 0.6 : 1;

  const handleHover = (trackPath) => {
    if (!document.querySelector(`link[href="${trackPath}"]`)) {
      const link = document.createElement('link');
      link.as = 'audio';
      link.href = trackPath;
      document.head.appendChild(link);
    }
  };

  const handleSelect = (g) => {
    // ✅ Single source of truth for audio — vibeManager only
    vibeManager.play(g.track);

    // ✅ Theme event carries ONLY visual/theme data — no volume, no track playback trigger
    const event = new CustomEvent('theme-switch', {
      detail: { theme: g.id }
    });
    window.dispatchEvent(event);

    setTimeout(() => navigate('/about'), 600);
  };

  return (
    <div className="selector-page">


      <div className="content-wrapper">
        <img src={profilePic} alt="Logo" className="logo" />
        <h1 className="title neon-flicker">Select Your Vibe</h1>

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