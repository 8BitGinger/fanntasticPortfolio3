import React, { useState } from 'react';
import { Play, Rewind, FastForward, Disc, Code, Music, Box, Youtube, MapPin, Cpu, Layers } from 'lucide-react';
import '../assets/styles/aboutCassette.css';

/**
 * CassetteComponent - A modular, interactive 3D component.
 * This version uses strictly standard CSS (no Tailwind).
 */
const CassetteAbout = ({theme}) => {
  const [activeSide, setActiveSide] = useState('A');

  const flipTape = () => {
    setActiveSide(prev => (prev === 'A' ? 'B' : 'A'));
  };

  // Content Data
  const content = {
    A: {
      title: "Ryan J. Fann",
      subtitle: "The Master Recording",
      bio: "This is the practical side of the tape—the foundational tracks that built my career. Born and bred in Lubbock, Texas, my journey started with the discipline of coding school and evolved into a deep dive into full-stack development. This side is all about the logic: architecting databases and ensuring every 'track' of code is clean and scalable.",
      tracks: [
        { id: "01", title: "The Foundation", desc: "Full-Stack architecture with MongoDB & Node.js", icon: <Layers size={18} /> },
        { id: "02", title: "Logical Loops", desc: "Dedicated Web Apps and Scripts", icon: <Code size={18} /> },
        { id: "03", title: "Signal & Noise", desc: "API Integrations and clean data documentation", icon: <Cpu size={18} /> },
        { id: "04", title: "Live from Lubbock", desc: "Software solutions built for the West Texas landscape", icon: <MapPin size={18} /> },
      ]
    },
    B: {
      title: "8BitGinger",
      subtitle: "The Experimental Remix",
      bio: "Flip the tape, and you’ll find the 8BitGinger alias—where the logic of a developer meets the heart of a creator. Whether it’s composing AI-driven soundtracks with Suno, 3D printing intricate tabletop miniatures, or building out my YouTube channel, Side B is where I experiment with the synergy of high-tech code and lo-fi creativity.",
      tracks: [
        { id: "05", title: "Generative Jams", desc: "Suno-generated tracks and AI Prompting", icon: <Music size={18} /> },
        { id: "06", title: "Resin & Craft", desc: "3D printing miniatures and vinyl cutting", icon: <Box size={18} /> },
        { id: "07", title: "The Visual Mix", desc: "Content Creation & Game Design", icon: <Youtube size={18} /> },
        { id: "08", title: "Bootleg Experiments", desc: "Creative Sparks and experimental UI code", icon: <Disc size={18} /> },
      ]
    }
  };

  const current = content[activeSide];
  const isSideB = activeSide === 'B';

  return (
    <div className={`portfolio-container ${theme} ${isSideB ? 'theme-side-b' : 'theme-side-a'}`}>
  

      <div className="inner-flex">
        {/* THE TAPE DECK */}
        <div className="perspective-container" style={{ width: '100%', maxWidth: '400px', height: '250px' }}>
          <div className={`cassette-tape ${isSideB ? 'is-flipped' : ''}`} onClick={flipTape}>
            
            {/* SIDE A */}
            <div className="side side-a">
              <div className="label-container label-a">
                <div className="strip strip-a"></div>
                <h2 className="label-text-a" style={{fontFamily: 'monospace', fontWeight: 'bold', margin: 0, fontSize: '1.25rem'}}>Ryan J. Fann</h2>
                <p style={{fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px', textTransform: 'uppercase'}}>Master Recording // Lubbock TX</p>
              </div>
              <div className="reels-container">
                <Disc className="reel-icon" style={{color: '#94a3b8'}} size={40} />
                <div className="hub-flex" style={{display: 'flex', gap: '8px'}}><div className="hub"></div><div className="hub"></div></div>
                <Disc className="reel-icon" style={{color: '#94a3b8'}} size={40} />
              </div>
              <div className="tape-info">
                <span>90 MIN</span>
                <span style={{fontWeight: 'bold'}}>SIDE A</span>
              </div>
            </div>

            {/* SIDE B */}
            <div className="side side-b">
              <div className="label-container label-b">
                <div className="strip strip-b"></div>
                <h2 className="label-text-b" style={{fontFamily: 'monospace', fontWeight: 'bold', color: '#d946ef', fontStyle: 'italic', margin: 0, fontSize: '1.25rem'}}>8BitGinger</h2>
                <p style={{fontSize: '9px', color: '#71717a', fontFamily: 'monospace', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Experimental Remix // Creator</p>
              </div>
              <div className="reels-container">
                <Disc className="reel-icon" style={{color: '#701a75'}} size={40} />
                <div className="hub-flex" style={{display: 'flex', gap: '8px'}}><div className="hub"></div><div className="hub"></div></div>
                <Disc className="reel-icon" style={{color: '#701a75'}} size={40} />
              </div>
              <div className="tape-info">
                <span>HI-BIAS</span>
                <span style={{fontWeight: 'bold', color: '#d946ef'}}>SIDE B</span>
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button 
            onClick={flipTape} 
            className={`flip-button ${!isSideB ? 'btn-theme-a' : 'btn-theme-b'}`}
          >
            <Rewind size={12} /> Flip Side <FastForward size={12} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="header-section">
          <h2 className="main-title">
            {current.title}
          </h2>
          <p className="subtitle">
            {current.subtitle}
          </p>
          <p className="bio-text">
            {current.bio}
          </p>

          <div className="track-grid">
            {current.tracks.map((track) => (
              <div key={track.id} className={`track-card wrapper-${theme} ${!isSideB ? 'card-theme-a' : 'card-theme-b'}`}>
                <div className={`icon-box ${!isSideB ? 'icon-theme-a' : 'icon-theme-b'}`}>
                  {track.icon}
                </div>
                <div className="track-info-container">
                  <div className="track-meta">
                    <span className="track-id">{track.id}</span>
                    <h4 className="track-name">{track.title}</h4>
                  </div>
                  <p className="track-desc">{track.desc}</p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassetteAbout;