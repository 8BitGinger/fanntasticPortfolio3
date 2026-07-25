import { useState, useEffect, useRef } from 'react';

const THEME_COLORS = {
  default: 'rgba(8, 213, 228, 0.9)',
  rock:    'rgba(255, 0, 0, 0.9)',
  jazz:    'rgba(136, 117, 109, 0.9)',
  pop:     'rgba(255, 20, 147, 0.9)',
  lofi:    'rgba(88, 61, 184, 0.9)',
  rap:     'rgba(42, 161, 18, 0.9)',
  country: 'rgba(153, 115, 61, 0.9)',
};

const TRACK_LABELS = {
  '/music/pop.mp3':     'Pop Vibes',
  '/music/rap.mp3':     'Rap Flow',
  '/music/country.mp3': 'Country Roads',
  '/music/lofi.mp3':    'Lo-Fi Chill',
  '/music/rock.mp3':    'Rock Out',
  '/music/jazz.mp3':    'Speak-Easy Jazz',
};

// Module-level singletons — survive re-renders and theme switches
let audioCtx      = null;
let analyser      = null;
let sourceNode    = null;
let connectedAudio = null;

function getAnalyser(audioEl) {
  if (!audioEl) return null;
  if (connectedAudio === audioEl && analyser) return analyser;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (sourceNode) {
    try { sourceNode.disconnect(); } catch (_) {}
  }

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.75;

  sourceNode = audioCtx.createMediaElementSource(audioEl);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  connectedAudio = audioEl;
  return analyser;
}

export default function MiniPlayer({ theme }) {
  const [isPlaying, setIsPlaying]   = useState(true);
  const [volume, setVolume]         = useState(0.3);
  const [visible, setVisible]       = useState(false);
  const [trackLabel, setTrackLabel] = useState('');

  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  // ✅ Color lives in a ref — the draw loop always reads the latest value
  // without needing to be restarted when theme changes
  const colorRef    = useRef(THEME_COLORS[theme] || THEME_COLORS.default);

  // Keep colorRef in sync with theme prop — no loop restart needed
  useEffect(() => {
    colorRef.current = THEME_COLORS[theme] || THEME_COLORS.default;
  }, [theme]);

  // ── Draw loop ────────────────────────────────────────────────
  const startVisualizer = (audioEl) => {
    if (audioCtx?.state === 'suspended') audioCtx.resume();

    const node = getAnalyser(audioEl);
    if (!node) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cancel any existing loop before starting a new one
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const ctx         = canvas.getContext('2d');
    const bufferLength = node.frequencyBinCount;
    const dataArray   = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      node.getByteFrequencyData(dataArray);

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const barCount  = 20;
      const gap       = 2;
      const barW      = (W - gap * (barCount - 1)) / barCount;
      const usableBins = Math.floor(bufferLength * 0.6);

      // ✅ Read color from ref — always current, no stale closure
      const color = colorRef.current;

      for (let i = 0; i < barCount; i++) {
        const binIndex = Math.floor((i / barCount) * usableBins);
        const value    = dataArray[binIndex] / 255;
        const barH     = Math.max(2, value * H);
        const x        = i * (barW + gap);
        const y        = H - barH;

        const grad = ctx.createLinearGradient(0, y, 0, H);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color.replace('0.9', '0.25'));

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 2);
        ctx.fill();
      }
    };

    draw();
  };

  const stopVisualizer = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  // ── New track selected ───────────────────────────────────────
  useEffect(() => {
    const handleThemeSwitch = () => {
      const audio = window.currentAudio;
      if (!audio) return;

      setVisible(true);
      setIsPlaying(true);
      setTrackLabel(
        TRACK_LABELS[audio.src.replace(window.location.origin, '').split('?')[0]] || 'Now Playing'
      );
      setVolume(audio.volume);

      // Stop old loop, wire up new audio element, restart
      stopVisualizer();
      setTimeout(() => startVisualizer(audio), 100);
    };

    window.addEventListener('theme-switch', handleThemeSwitch);
    return () => window.removeEventListener('theme-switch', handleThemeSwitch);
  // ✅ No [theme] dependency here — colorRef handles the color update
  // so we don't need to re-register the listener on every theme change
  }, []);

  // ── Resume on back-navigation ────────────────────────────────
  useEffect(() => {
    const audio = window.currentAudio;
    if (audio && !audio.paused) {
      setVisible(true);
      setIsPlaying(true);
      setTrackLabel(
        TRACK_LABELS[audio.src.replace(window.location.origin, '').split('?')[0]] || 'Now Playing'
      );
      setVolume(audio.volume);
      setTimeout(() => startVisualizer(audio), 100);
    }
  }, []);

  // ── Cleanup ──────────────────────────────────────────────────
  useEffect(() => () => stopVisualizer(), []);

  // ── Controls ─────────────────────────────────────────────────
  const togglePlay = () => {
    const audio = window.currentAudio;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
      if (audioCtx?.state === 'suspended') audioCtx.resume();
      startVisualizer(audio);
    } else {
      audio.pause();
      setIsPlaying(false);
      stopVisualizer();
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

      <div className="mini-player__viz-wrap">
        <span className="mini-player__label">{trackLabel}</span>
        <canvas
          ref={canvasRef}
          className="mini-player__canvas"
          width={120}
          height={28}
        />
      </div>

      <button
        className="mini-player__btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1"/>
            <rect x="9" y="2" width="4" height="12" rx="1"/>
          </svg>
        ) : (
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