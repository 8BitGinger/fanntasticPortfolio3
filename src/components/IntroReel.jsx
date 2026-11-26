import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, MapPin } from 'lucide-react';
import { SiApplemusic } from 'react-icons/si';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import projectList from '../data/projectList';
import InlineVideo from './InlineVideo';
import { unlockSfx, playSfx } from '../Utils/introSfx';
import '../assets/styles/introReel.css';

import profilePic from '../assets/pictures/profilePic.webp';
import newsPic from '../assets/pictures/ryanNews.webp';
import devPic from '../assets/pictures/devPic.webp';
import musicPic from '../assets/pictures/musicPic.webp';
import ttrpgPic from '../assets/pictures/ttrpgPic.webp';
import logoPic from '../assets/pictures/navbarIcon.webp';
import ginger8BitCover from '../assets/pictures/ginger8Bit.webp';
import auraveilCover from '../assets/pictures/auraveil.webp';
import vndalCover from '../assets/pictures/VNDAL.webp';
import blacklistDahliaCover from '../assets/pictures/blacklistDahlia.webp';
import cashHarlanCover from '../assets/pictures/cashHarlan.webp';
import cindervoidVid from '../assets/video/cindervoidVid.mp4';
import gumshoeVid from '../assets/video/gumshoeVid.mp4';

/* ─────────────────────────────────────────────────────────────
   SCRIPT: edit the wording here.
   ───────────────────────────────────────────────────────────── */
const ROLES = ['Broadcast Engineer', 'Fullstack Developer', 'Music Producer', 'Game Designer'];

const BROADCAST_POINTS = [
  'One of a three-engineer team keeping KAMC & KLBK on the air, 24/7',
  'Built a professional podcast studio from scratch for EL+',
  "Writes custom OBS tools for the stations' digital broadcasts",
];

const TECH = ['React', 'TypeScript', 'Python', 'Node.js', 'Firebase', 'GraphQL', 'Canvas', 'Web Audio', 'WebSockets'];

const ARTISTS = [
  { name: '8BitGinger', src: ginger8BitCover },
  { name: 'Auraveil', src: auraveilCover },
  { name: 'VNDAL', src: vndalCover },
  { name: 'Blacklist Dahlia', src: blacklistDahliaCover },
  { name: 'Cash Harlan', src: cashHarlanCover },
];

const GAMES = [
  { name: 'Cindervoid RPG', src: cindervoidVid },
  { name: 'Gumshoe RPG', src: gumshoeVid },
];

// Lines from Ryan's own writing elsewhere on the site.
const DRIVES = [
  { tag: 'Craft', text: "Build it right, or don't put your name on it." },
  { tag: 'Style', text: 'Soulful, not sterile.' },
  { tag: 'Growth', text: 'Always leveling up.' },
];

const NEXT_UP = [
  { title: 'RyFi Studio', text: 'A full music DAW that runs in the browser' },
  { title: 'Content Showcase', text: 'Videos, music, and art, all in one gallery' },
  { title: 'Creator Tools', text: 'More OBS and broadcast tools for streamers' },
];

const GOAL = 'The goal: tools that take creators from passive hobby to professional production.';

const PROJECT_COUNT = projectList.length;
const MOSAIC = projectList.slice(0, 16).map((p) => p.img);

/* ─────────────────────────────────────────────────────────────
   TIMELINE: scene order, length (ms), transition, sound cues.
   ───────────────────────────────────────────────────────────── */
const OPEN_LINE = 'Who is the';
const OPEN_TYPE_START = 500;
const OPEN_TYPE_STEP = 75;

const SCENES = [
  {
    id: 'open',
    label: 'Who?',
    dur: 5500,
    enter: 'fade',
    cues: [
      ...[...OPEN_LINE].flatMap((ch, i) => (ch === ' ' ? [] : [[OPEN_TYPE_START + i * OPEN_TYPE_STEP, 'tick']])),
      [800, 'rise'],
      [1700, 'boom'],
      [3100, 'blip'],
    ],
  },
  {
    id: 'identity',
    label: 'Player One',
    dur: 6500,
    enter: 'iris',
    cues: [[0, 'whoosh'], [250, 'shutter'], ...ROLES.map((_, i) => [2200 + i * 350, 'blip'])],
  },
  {
    id: 'broadcast',
    label: 'By Day',
    dur: 8000,
    enter: 'wipe',
    cues: [[0, 'whoosh'], [350, 'shutter'], ...BROADCAST_POINTS.map((_, i) => [2200 + i * 1100, 'blip'])],
  },
  {
    id: 'builder',
    label: 'By Night',
    dur: 8500,
    enter: 'push',
    cues: [[0, 'whoosh'], ...MOSAIC.map((_, i) => [200 + i * 70, 'tick']), [2800, 'blip']],
  },
  {
    id: 'music',
    label: 'The Sound',
    dur: 7500,
    enter: 'zoom',
    cues: [[0, 'whoosh'], ...ARTISTS.map((_, i) => [1300 + i * 180, 'pop'])],
  },
  {
    id: 'worlds',
    label: 'The Worlds',
    dur: 7000,
    enter: 'glitch',
    cues: [[0, 'glitch'], [1500, 'shutter'], [1800, 'shutter']],
  },
  {
    id: 'drives',
    label: 'The Drive',
    dur: 8000,
    enter: 'dip',
    cues: [[0, 'whoosh'], ...DRIVES.map((_, i) => [700 + i * 2400, 'bell'])],
  },
  {
    id: 'next',
    label: 'Next Level',
    dur: 7000,
    enter: 'diagonal',
    cues: [[0, 'whoosh'], ...NEXT_UP.map((_, i) => [1000 + i * 800, 'blip'])],
  },
  {
    id: 'outro',
    label: 'Press Start',
    dur: 4500,
    enter: 'iris',
    cues: [[0, 'whoosh'], [400, 'chime']],
  },
];

const SCENE_STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((sum, s) => sum + s.dur, 0));
const TOTAL = SCENE_STARTS[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;
const TRANSITION_MS = 900;
const CUES = SCENES.flatMap((scene, i) => scene.cues.map(([t, name]) => ({ t: SCENE_STARTS[i] + t, name })));

const sceneAt = (ms) => {
  let i = 0;
  while (i < SCENES.length - 1 && ms >= SCENE_STARTS[i + 1]) i += 1;
  return i;
};
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
// Animation delay, in seconds from the start of the scene.
const at = (seconds, extra) => ({ '--d': `${seconds}s`, ...extra });

/* Letters that rise in one after another. */
function Letters({ text, start = 0, step = 0.035 }) {
  let n = 0;
  const words = text.split(' ');
  return (
    <span className="letters" aria-label={text}>
      {words.map((word, w) => (
        <React.Fragment key={w}>
          <span className="letters__word" aria-hidden="true">
            {[...word].map((ch, c) => (
              <span key={c} className="a a-letter" style={at(start + step * n++)}>
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCENES
   ───────────────────────────────────────────────────────────── */
function OpenScene() {
  return (
    <>
      <div className="pixel-grid" />
      <p className="open__who" aria-label={OPEN_LINE}>
        {[...OPEN_LINE].map((ch, i) => (
          <span
            key={i}
            className="a a-type"
            aria-hidden="true"
            style={at((OPEN_TYPE_START + i * OPEN_TYPE_STEP) / 1000)}
          >
            {ch}
          </span>
        ))}
        <span className="caret" />
      </p>
      <h2 className="open__name a a-glitch" style={at(1.7)} data-text="8BitGinger?">
        8BitGinger?
      </h2>
      <p className="pixel-label open__loading a a-rise" style={at(3.1)}>
        Player 1 · Loading<span className="blink">_</span>
      </p>
    </>
  );
}

function IdentityScene({ profileImg, edition }) {
  return (
    <div className="split">
      <div className="identity__photo a a-iris" style={at(0.15)}>
        <img src={profileImg} alt="" />
      </div>
      <div className="copy">
        <p className="pixel-label a a-rise" style={at(0.6)}>
          Player One
        </p>
        <h2 className="headline">
          <Letters text="Ryan J. Fann" start={0.8} step={0.045} />
        </h2>
        <p className="body a a-rise" style={at(1.4)}>
          a.k.a. <strong className="accent">8BitGinger</strong>
          <span className="identity__place">
            <MapPin size="1em" /> Lubbock, TX
          </span>
        </p>
        <p className="identity__tape a a-rise" style={at(1.8)}>
          Tape loaded: {edition}
        </p>
        <ul className="roles">
          {ROLES.map((role, i) => (
            <li key={role} className="a a-pop" style={at(2.2 + i * 0.35)}>
              {role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BroadcastScene() {
  return (
    <>
      <img className="scene-bg kb" src={newsPic} alt="" />
      <div className="split">
        <figure className="broadcast__photo a a-wipe" style={at(0.3)}>
          <img src={profilePic} alt="" />
          <figcaption className="lower-third a a-left" style={at(1.1)}>
            <strong>Ryan Fann</strong>
            <span>IT Engineer · KAMC &amp; KLBK</span>
          </figcaption>
        </figure>
        <div className="copy">
          <p className="pixel-label a a-rise" style={at(0.6)}>
            By Day
          </p>
          <h2 className="headline">
            <Letters text="Broadcast IT Engineer" start={0.8} step={0.025} />
          </h2>
          <ul className="bullets body">
            {BROADCAST_POINTS.map((point, i) => (
              <li key={point} className="a a-left" style={at(2.2 + i * 1.1)}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function BuilderScene({ t }) {
  const progress = clamp01((t - 1400) / 1400);
  const count = Math.round(PROJECT_COUNT * (1 - Math.pow(1 - progress, 3)));
  return (
    <>
      <div className="mosaic-wrap">
        <div className="mosaic">
          {MOSAIC.map((src, i) => (
            <div key={i} className="mosaic__tile a a-flip" style={at(0.2 + i * 0.07)}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
      <div className="builder__shade" />
      <div className="copy builder__copy">
        <p className="pixel-label a a-rise" style={at(0.5)}>
          <img className="avatar" src={devPic} alt="" /> By Night
        </p>
        <h2 className="headline">
          <Letters text="Fullstack Developer" start={0.7} step={0.03} />
        </h2>
        <p className="stat a a-rise" style={at(1.3)}>
          <span className="stat__num">{count}</span>
          <span className="stat__label">projects built</span>
        </p>
        <p className="body a a-rise" style={at(3.0)}>
          Web apps, OBS tools, games, AI experiments, and creator utilities.
        </p>
        <ul className="chips">
          {TECH.map((tech, i) => (
            <li key={tech} className="a a-pop" style={at(3.6 + i * 0.12)}>
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const EQ_BARS = Array.from({ length: 28 }, (_, i) => i);

function MusicScene() {
  return (
    <>
      <img className="scene-bg kb" src={musicPic} alt="" />
      <div className="eq" aria-hidden="true">
        {EQ_BARS.map((i) => (
          <span key={i} style={{ '--s': `${0.45 + ((i * 7) % 5) * 0.12}s`, '--d': `${-((i * 3) % 7) * 0.1}s` }} />
        ))}
      </div>
      <p className="pixel-label a a-rise" style={at(0.3)}>
        The Sound
      </p>
      <h2 className="headline">
        <Letters text="AI-Assisted Music Producer" start={0.45} step={0.022} />
      </h2>
      <p className="body a a-rise" style={at(1.1)}>
        Dark trap to spiritual hip&#8209;hop. Country to nu&#8209;metal.
      </p>
      <div className="fan">
        {ARTISTS.map((artist, i) => (
          <img
            key={artist.name}
            className="fan__cover a a-fan"
            src={artist.src}
            alt=""
            style={at(1.3 + i * 0.18, { '--i': i - 2, '--ai': Math.abs(i - 2) })}
          />
        ))}
      </div>
      <p className="music__artists a a-rise" style={at(2.5)}>
        {ARTISTS.map((a) => a.name).join('  ·  ')}
      </p>
      <p className="platforms a a-rise" style={at(3.4)}>
        <span>
          <SiApplemusic /> Apple Music
        </span>
        <span>
          <FaSpotify /> Spotify
        </span>
        <span>
          <FaYoutube /> YouTube
        </span>
      </p>
    </>
  );
}

function WorldsScene() {
  return (
    <>
      <img className="scene-bg kb" src={ttrpgPic} alt="" />
      <div className="copy">
        <p className="pixel-label a a-rise" style={at(0.4)}>
          The Worlds
        </p>
        <h2 className="headline">
          <Letters text="Game & World Builder" start={0.6} step={0.03} />
        </h2>
        <p className="body a a-rise" style={at(1.2)}>
          Tabletop RPG systems, browser games, and the stories inside them.
        </p>
      </div>
      <div className="worlds__clips">
        {GAMES.map((game, i) => (
          <figure key={game.name} className="worlds__clip a a-rise" style={at(1.5 + i * 0.3)}>
            <InlineVideo src={game.src} />
            <figcaption className="pixel-label">{game.name}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

function DrivesScene({ backgroundImg }) {
  return (
    <>
      <img className="scene-bg kb" src={backgroundImg} alt="" />
      <p className="pixel-label a a-rise" style={at(0.2)}>
        What Drives Me
      </p>
      <div className="quotes">
        {DRIVES.map((quote, i) => {
          const start = 0.7 + i * 2.4;
          const isLast = i === DRIVES.length - 1;
          return (
            <blockquote
              key={quote.tag}
              className={`quote a ${isLast ? 'a-rise' : 'a-inout'}`}
              style={at(start, { '--life': '2.4s' })}
            >
              <span className="quote__tag">{quote.tag}</span>
              <Letters text={quote.text} start={start + 0.1} step={0.018} />
            </blockquote>
          );
        })}
      </div>
    </>
  );
}

function NextScene() {
  return (
    <>
      <div className="pixel-grid" />
      <span className="next__ghost a" aria-hidden="true">
        Next
      </span>
      <p className="pixel-label a a-rise" style={at(0.3)}>
        Next Level
      </p>
      <h2 className="headline">
        <Letters text="What's loading next" start={0.5} step={0.03} />
      </h2>
      <ul className="next__list">
        {NEXT_UP.map((item, i) => (
          <li key={item.title} className="a a-left" style={at(1.0 + i * 0.8)}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
            <span className="loadbar">
              <span className="loadbar__fill a a-fill" style={at(1.2 + i * 0.8)} />
            </span>
          </li>
        ))}
      </ul>
      <p className="body next__goal a a-rise" style={at(3.6)}>
        {GOAL}
      </p>
    </>
  );
}

function OutroScene() {
  return (
    <>
      <div className="pixel-grid" />
      <div className="outro__logo a a-pop" style={at(0.3)}>
        <img src={logoPic} alt="" />
      </div>
      <h2 className="outro__name">
        <Letters text="8BitGinger" start={0.8} step={0.05} />
      </h2>
      <p className="body a a-rise" style={at(1.5)}>
        Ryan J. Fann · Engineer · Developer · Producer
      </p>
      <p className="pixel-label a a-rise" style={at(2.1)}>
        <span className="blink">Press Start</span>
      </p>
    </>
  );
}

const SCENE_VIEWS = {
  open: OpenScene,
  identity: IdentityScene,
  broadcast: BroadcastScene,
  builder: BuilderScene,
  music: MusicScene,
  worlds: WorldsScene,
  drives: DrivesScene,
  next: NextScene,
  outro: OutroScene,
};

function Scene({ index, leaving, ...props }) {
  const scene = SCENES[index];
  const View = SCENE_VIEWS[scene.id];
  return (
    <div
      className={`scene scene-${scene.id} scene--${scene.enter} ${leaving ? 'is-leaving' : ''}`}
      aria-hidden={leaving || undefined}
    >
      <View {...props} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PLAYER
   ───────────────────────────────────────────────────────────── */
export default function IntroReel({ theme, profileImg, backgroundImg, edition }) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [epoch, setEpoch] = useState(0); // bumps on seek/replay so scenes restart
  const [seekAt, setSeekAt] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen] = useState(() => typeof document !== 'undefined' && !!document.fullscreenEnabled);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const elapsedRef = useRef(0);
  const cueCursorRef = useRef(-1);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Frame-by-frame control for scripts/render_intro_reel.py (automated
  // browsers only). The exporter starts the reel paused, then sets the time
  // for every frame itself so the picture lines up exactly with the sound.
  useEffect(() => {
    if (!navigator.webdriver) return;
    window.__INTRO_REEL__ = {
      cues: CUES,
      totalMs: TOTAL,
      begin: () => {
        elapsedRef.current = 0;
        setElapsed(0);
        setSeekAt(0);
        setEpoch((e) => e + 1);
        setEnded(false);
        setStarted(true);
        setPlaying(false);
      },
      setTime: (ms) => {
        elapsedRef.current = ms;
        setElapsed(ms);
      },
    };
  }, []);

  // The clock. CSS animations do the motion; this decides which scene is on
  // screen and fires the sound cues.
  useEffect(() => {
    if (!playing) return undefined;
    let raf;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const next = Math.min(elapsedRef.current + dt, TOTAL);
      if (!mutedRef.current) {
        CUES.forEach((cue) => {
          if (cue.t > cueCursorRef.current && cue.t <= next) playSfx(cue.name);
        });
      }
      cueCursorRef.current = next;
      elapsedRef.current = next;
      setElapsed(next);
      if (next >= TOTAL) {
        setPlaying(false);
        setEnded(true);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const sceneIndex = sceneAt(elapsed);

  // Keep the game clips in step with play/pause.
  useEffect(() => {
    stageRef.current?.querySelectorAll('video').forEach((video) => {
      if (playing) video.play()?.catch(() => {});
      else video.pause();
    });
  }, [playing, sceneIndex, epoch]);

  // Turn the site's music down while the reel plays with sound.
  useEffect(() => {
    const audio = window.currentAudio;
    if (!audio || !playing || muted) return undefined;
    const original = audio.volume;
    const ducked = Math.min(original, 0.04);
    audio.volume = ducked;
    return () => {
      if (audio.volume === ducked) audio.volume = original;
    };
  }, [playing, muted]);

  // Pause when scrolled away or when the tab is hidden.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.25) setPlaying(false);
      },
      { threshold: [0, 0.25] }
    );
    observer.observe(rootRef.current);
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const seek = (ms) => {
    unlockSfx();
    elapsedRef.current = ms;
    cueCursorRef.current = ms - 1;
    setElapsed(ms);
    setSeekAt(ms);
    setEpoch((e) => e + 1);
    setEnded(false);
    setStarted(true);
    setPlaying(true);
  };

  const play = () => {
    if (ended || !started) {
      seek(0);
      return;
    }
    unlockSfx();
    setPlaying(true);
  };

  const togglePlay = () => (playing ? setPlaying(false) : play());

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current.requestFullscreen?.().catch(() => {});
  };

  const t = elapsed - SCENE_STARTS[sceneIndex];
  const prevIndex = sceneIndex - 1;
  // Show the outgoing scene during the transition, unless we just jumped here.
  const showLeaving = prevIndex >= 0 && t < TRANSITION_MS && SCENE_STARTS[sceneIndex] > seekAt;
  const sceneProps = { profileImg, backgroundImg, edition };

  return (
    <section className="reel-section">
      <div
        ref={rootRef}
        className={`reel reel--${theme} ${playing ? 'is-playing' : 'is-paused'} ${
          isFullscreen ? 'is-fullscreen' : ''
        }`}
        aria-label="Intro video: Who is the 8BitGinger?"
      >
        <div ref={stageRef} className="reel__stage" onClick={started && !ended ? togglePlay : undefined}>
          {started && (
            <>
              {showLeaving && (
                <Scene
                  key={`${SCENES[prevIndex].id}-${epoch}`}
                  index={prevIndex}
                  t={SCENES[prevIndex].dur + t}
                  leaving
                  {...sceneProps}
                />
              )}
              <Scene key={`${SCENES[sceneIndex].id}-${epoch}`} index={sceneIndex} t={t} {...sceneProps} />
              {showLeaving && <span key={`sweep-${sceneIndex}-${epoch}`} className="reel__sweep" />}
              <span className="reel__chapter">
                <span className="reel__rec" />
                {String(sceneIndex + 1).padStart(2, '0')} · {SCENES[sceneIndex].label}
              </span>
            </>
          )}

          <div className="reel__grain" />
          <div className="reel__vignette" />

          {!started && (
            <button type="button" className="reel__poster" onClick={play}>
              <img className="reel__poster-bg" src={profileImg} alt="" />
              <span className="pixel-label">Intro · {formatTime(TOTAL)}</span>
              <span className="reel__poster-title">
                <span>Who is the</span>
                <strong>8BitGinger?</strong>
              </span>
              <span className="reel__play-big">
                <Play size="45%" fill="currentColor" />
              </span>
              <span className="reel__poster-note">Press play · light sound effects</span>
            </button>
          )}

          {ended && (
            <div className="reel__end">
              <button type="button" className="reel__replay" onClick={() => seek(0)}>
                <RotateCcw size={18} /> Watch again
              </button>
              <span className="reel__end-note">Keep scrolling for the specs</span>
            </div>
          )}
        </div>

        <div className="reel__controls">
          <button
            type="button"
            className="reel__btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="reel__time">
            {formatTime(elapsed)} / {formatTime(TOTAL)}
          </span>
          <div className="reel__track">
            {SCENES.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                className="reel__seg"
                style={{ flexGrow: scene.dur }}
                onClick={() => seek(SCENE_STARTS[i])}
                aria-label={`Jump to ${scene.label}`}
                title={scene.label}
              >
                <span className="reel__seg-bar">
                  <span
                    className="reel__seg-fill"
                    style={{ transform: `scaleX(${clamp01((elapsed - SCENE_STARTS[i]) / scene.dur)})` }}
                  />
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="reel__btn"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Turn sound on' : 'Mute'}
            title={muted ? 'Sound on' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {canFullscreen && (
            <button
              type="button"
              className="reel__btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
