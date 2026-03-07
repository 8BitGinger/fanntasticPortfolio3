import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { vibeManager } from '../Utils/VibeManager';
import profilePic from '../../public/images/profile-standard.webp'; 


/**
 * MOCK DATA & ASSETS
 */
const genres = [
  { id: 'pop', label: 'Pop', track: '/music/pop.mp3', rotate: -45, xFactor: -1.2, y: 18, color: '#ff00ea' },
  { id: 'rap', label: 'Rap', track: '/music/rap.mp3', rotate: -22, xFactor: -0.7, y: 5, color: '#00f2ff' },
  { id: 'country', label: 'Country', track: '/music/country.mp3', rotate: 0, xFactor: 0, y: 0, color: '#ffcc00' },
  { id: 'lofi', label: 'Lo-Fi', track: '/music/lofi.mp3', rotate: 22, xFactor: 0.7, y: 5, color: '#9d00ff' },
  { id: 'rock', label: 'Rock', track: '/music/rock.mp3', rotate: 45, xFactor: 1.2, y: 18, color: '#ff3c00' },
];

/**
 * Individual Cassette Component with 3D Tilt and Performance-Optimized Neon Glow
 */
function ThreeDNeonCassette({ genre, isMobile, onClick, onMouseEnter, xOffset, finalRotate, index }) {
  const cardRef = useRef(null);
  
  // Motion values for local tilt
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for smooth "squishy" movement
  const springX = useSpring(localX, { stiffness: 150, damping: 20 });
  const springY = useSpring(localY, { stiffness: 150, damping: 20 });

  // Map mouse movement to subtle 3D rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Dynamic shadow offset based on tilt
  const shadowX = useTransform(springX, [-0.5, 0.5], [15, -15]);
  const shadowY = useTransform(springY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    localX.set(xPct);
    localY.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    localX.set(0);
    localY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        transformOrigin: 'bottom center',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        zIndex: index,
        cursor: 'pointer',
        perspective: '1000px',
      }}
      initial={{
        rotate: finalRotate,
        x: `calc(-50% + ${xOffset}px)`,
        y: isMobile ? genre.y * 0.5 : genre.y,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter(e);
      }}
      whileHover={{
        y: isMobile ? -30 : -80,
        x: `calc(-50% + ${xOffset}px)`,
        rotate: 0,
        scale: isMobile ? 1.1 : 1.25,
        zIndex: 100,
        transition: { type: 'spring', stiffness: 150, damping: 25 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative"
        }}
      >
        {/* THE SHADOW PLANE: Optimized GPU-friendly Neon Glow */}
        <motion.div
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            x: shadowX,
            y: shadowY,
            backgroundColor: genre.color,
            translateZ: "-40px",
            filter: "blur(30px)",
            position: "absolute",
            top: "8px",
            bottom: "8px",
            left: "8px",
            right: "8px",
            borderRadius: "12px",
          }}
        />

        {/* THE CASSETTE IMAGE CONTAINER (Uses custom CSS classes) */}
        <div 
          className="tape-container vertical"
          style={{ transform: "translateZ(0px)" }}
        >
          <img
            src={`/images/tape-${genre.id}.webp`}
            alt={genre.label}
            onError={(e) => { e.target.style.display = 'none'; }}
            className="tape-image"
          />
          
          {/* Subtle Glare Layer (Inline to replace Tailwind) */}
          <div 
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(to top right, rgba(255,255,255,0.1), transparent)",
              pointerEvents: "none",
              zIndex: 20,
              borderRadius: "4px"
            }} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Main Application Component
 */
export default function CassetteSelector() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const spreadMultiplier = isMobile ? 40 : 120; // Reverted to your original spread logic
  const rotationMultiplier = isMobile ? 0.6 : 1;

  const handleHover = (trackPath) => {
    // Preload simulation
    if (typeof document !== 'undefined' && !document.querySelector(`link[href="${trackPath}"]`)) {
      const link = document.createElement('link');
      link.as = 'audio';
      link.href = trackPath;
      document.head.appendChild(link);
    }
  };

  const handleSelect = (g) => {
    // ✅ Play the track using your audio manager
    vibeManager.play(g.track);

    const event = new CustomEvent('theme-switch', {
      detail: { theme: g.id }
    });
    window.dispatchEvent(event);

    // ✅ Navigate to the about page after the animation delay
    setTimeout(() => navigate('/about'), 600);
  };

  return (
    <div className="selector-page">
      <div className="content-wrapper">
        
        {/* Using your existing .logo class design */}
        <img 
          src={profilePic}
            alt="Logo" 
            className="logo" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          
          <h1 className="title neon-wrapper" data-text="Select Your Vibe">
            Select Your Vibe
          </h1>

          <div className="ghost-wrapper vertical-fan">
            {genres.map((g, index) => (
              <ThreeDNeonCassette
                key={g.id}
                genre={g}
                index={index}
                isMobile={isMobile}
                xOffset={g.xFactor * spreadMultiplier}
                finalRotate={g.rotate * rotationMultiplier}
                onMouseEnter={() => handleHover(g.track)}
                onClick={() => handleSelect(g)}
              />
            ))}
      </div>
      
      <h2 className="title2">Ryan J. Fann</h2>

    </div>
  </div>
);
}