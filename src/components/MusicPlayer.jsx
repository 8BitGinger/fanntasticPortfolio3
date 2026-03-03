import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import '../assets/styles/musicplayer.css';

export default function MusicPlayer() {
  const [hasAudio, setHasAudio] = useState(false); // The "Wake Up" switch
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const handleThemeChange = (e) => {
      console.log('Music Player heard the theme switch!', e.detail); // Check your console!
      setTimeout(() => {
        if (window.currentAudio) {
          setHasAudio(true);
          setIsPlaying(true);
        }
      }, 100);
    };

    window.addEventListener('theme-switch', handleThemeChange);
    return () => window.removeEventListener('theme-switch', handleThemeChange);
  }, []);

  const togglePlay = () => {
    if (!window.currentAudio) return;
    if (window.currentAudio.paused) {
      window.currentAudio.play();
      setIsPlaying(true);
    } else {
      window.currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (window.currentAudio) {
      window.currentAudio.volume = val;
    }
  };

  // If no audio has been picked yet, we stay hidden
  if (!hasAudio) return null;

  return (
    <div className="music-player-container">
      <button className="play-pause-btn" onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div className="volume-controls">
        <div className="volume-icon">
          {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="volume-slider"
        />
      </div>
    </div>
  );
}
