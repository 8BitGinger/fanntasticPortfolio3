import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import profilePic from '../assets/pictures/profile-standard.webp';

// Updated: Vertical tapes need tighter widths but wider rotation to feel like a "fan"
const genres = [
  {
    id: 'pop',
    label: 'Pop',
    track: '/music/pop.mp3',
    rotate: -45,
    x: -160,
    y: 30,
  },
  {
    id: 'rap',
    label: 'Rap',
    track: '/music/rap.mp3',
    rotate: -22,
    x: -80,
    y: 5,
  },
  {
    id: 'country',
    label: 'Country',
    track: '/music/country.mp3',
    rotate: 0,
    x: 0,
    y: 0,
  },
  {
    id: 'lofi',
    label: 'Lo-Fi',
    track: '/music/lofi.mp3',
    rotate: 22,
    x: 80,
    y: 5,
  },
  {
    id: 'rock',
    label: 'Rock',
    track: '/music/rock.mp3',
    rotate: 45,
    x: 160,
    y: 30,
  },
];

export default function CassetteSelector() {
  const navigate = useNavigate();

  const handleHover = (trackPath) => {
    if (!document.querySelector(`link[href="${trackPath}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'audio';
      link.href = trackPath;
      document.head.appendChild(link);
    }
  };

  const handleSelect = (g) => {
    const event = new CustomEvent('theme-switch', {
      detail: { theme: g.id, track: g.track, volume: 0.3 },
    });
    window.dispatchEvent(event);

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
          {genres.map((g, index) => (
            <motion.div
              key={g.id}
              style={{
                transformOrigin: 'bottom center',
                position: 'absolute',
                bottom: 0,
                left: '50%', // Centered within the ghost-wrapper
                marginLeft: '-45px', // Half of the new 90px width
                zIndex: index,
                cursor: 'pointer',
              }}
              initial={{ rotate: g.rotate, x: g.x, y: g.y }}
              onMouseEnter={() => handleHover(g.track)}
              whileHover={{
                y: -80, // Lift higher since they are vertical
                x: g.x,
                rotate: 0,
                scale: 1.2,
                zIndex: 100,
                transition: { type: 'spring', stiffness: 150, damping: 25 },
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
          ))}
        </div>
        <h2 className="title2">Ryan J. Fann</h2>
      </div>
    </div>
  );
}
