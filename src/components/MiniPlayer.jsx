import { useState, useEffect, useRef } from 'react';
import { vibeManager } from '../Utils/VibeManager';

export default function MiniPlayer({ theme }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [visible, setVisible] = useState(false);
  const [trackLabel, setTrackLabel] = useState('');
  const intervalRef = useRef(null);

  const TRACK_LABELS = {
    '/music/pop.mp3':     'Pop Vibes',
    '/music/rap.mp3':     'Rap Flow',
    '/music/country.mp3': 'Country Roads',
    '/music/lofi.mp3':    'Lo-Fi Chill',
    '/music/rock.mp3':    'Rock Out',
    '/music/jazz.mp3':    'Jazz Mode',
  };

  // Show player and sync state whenever a new theme/track is selected
  useEffect(() => {
    const handleThemeSwitch = (e) => {
      setVisible(true);
      setIsPlaying(true);

      // Sync label from the track vibeManager just loaded
      const audio = window.currentAudio;
      if (audio) {
        setTrackLabel(TRACK_LABELS[audio.src.replace(window.location.origin, '')] || 'Now Playing');
        setVolume(audio.volume);
      }
    };

    window.addEventListener('theme-switch', handleThemeSwitch);
    return () => window.removeEventListener('theme-switch', handleThemeSwitch);
  }, []);

  // Also show if we land on a page where audio is already running (e.g. back navigation)
  useEffect(() => {
    const audio = window.currentAudio;
    if (audio && !audio.paused) {
      setVisible(true);
      setIsPlaying(true);
      setTrackLabel(TRACK_LABELS[audio.src.replace(window.location.origin, '')] || 'Now Playing');
      setVolume(audio.volume);
    }
  }, []);

  const togglePlay = () => {
    const audio = window.currentAudio;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const audio = window.currentAudio;
    if (audio) audio.volume = val;
  };

  if (!visible) return null;

  return (
    <div className={`mini-player mini-player--${theme || 'default'}`}>
      <span className="mini-player__label">{trackLabel}</span>

      <button
        className="mini-player__btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          // Pause icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1"/>
            <rect x="9" y="2" width="4" height="12" rx="1"/>
          </svg>
        ) : (
          // Play icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5l10 5.5-10 5.5V2.5z"/>
          </svg>
        )}
      </button>

      <div className="mini-player__volume">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="mini-player__slider"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}