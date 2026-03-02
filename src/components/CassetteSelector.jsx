import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import profilePic from '../assets/pictures/profile-standard.webp';

// 1. Widened 'x' gaps for bigger hitboxes, and added a 'y' drop for a perfect arc
const genres = [
  { id: 'pop',       label: 'Pop',       track: '/music/pop.mp3',       rotate: -35, x: -100, y: 20 },
  { id: 'cinematic', label: 'Cinematic', track: '/music/cinematic.mp3', rotate: -21, x: -60,  y: 10 },
  { id: 'rap',       label: 'Rap',       track: '/music/rap.mp3',       rotate: -7,  x: -20,  y: 0 },
  { id: 'country',   label: 'Country',   track: '/music/country.mp3',   rotate: 7,   x: 20,   y: 0 },
  { id: 'lofi',      label: 'Lo-Fi',     track: '/music/lofi.mp3',      rotate: 21,  x: 60,   y: 10 },
  { id: 'rock',      label: 'Rock',      track: '/music/rock.mp3',      rotate: 35,  x: 100,  y: 20 },
];

export default function CassetteSelector() {
  const navigate = useNavigate(); 

  const handleHover = (trackPath) => {
    // Check if we've already preloaded this track to avoid duplicate tags
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
      detail: { theme: g.id, track: g.track, volume: 0.3 }
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

        <div className="ghost-wrapper"> 
          {genres.map((g, index) => (
            <motion.div
              key={g.id}
              style={{ 
                transformOrigin: "bottom center", 
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: index,
                cursor: "pointer"
              }}
              initial={{ rotate: g.rotate, x: g.x, y: g.y }}
              
              // 2. Trigger the preload on mouse enter
              onMouseEnter={() => handleHover(g.track)}

              whileHover={{ 
                y: -60,           
                x: g.x,           
                rotate: 0,        
                scale: 1.15,      
                zIndex: 50,       
                transition: { type: "tween", ease: "easeOut", duration: 0.25 } 
              }}
              
              whileTap={{ 
                scale: 1.05, 
                y: -20,
                zIndex: 50,
                transition: { duration: 0.1 } 
              }}
              
              onClick={() => handleSelect(g)}
            >
              <div className="tape-container">
                <img 
                  loading='lazy'
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