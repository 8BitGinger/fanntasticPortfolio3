import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, KeyRound, RefreshCw } from 'lucide-react';
import '../assets/styles/passwordGenerator.css';

const SETS = {
  lower: { label: 'a–z', chars: 'abcdefghijklmnopqrstuvwxyz' },
  upper: { label: 'A–Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  digits: { label: '0–9', chars: '0123456789' },
  symbols: { label: '!@#', chars: '!@#$%^&*()-_=+[]{};:,.?/~' },
};
const AMBIGUOUS = new Set(['I', 'l', '1', 'O', '0', 'o']);

// ── The twist: a phonetic alphabet for every genre on the site ─────────
// Each character in the password is spelled out using words from the
// currently selected music theme, so it can be read aloud or memorised.
const GENRE_ALPHABETS = {
  default: 'arcade boss cartridge dungeon emulator fireball glitch hitbox inventory joystick keycard lives mana noclip overworld pixel quest respawn sprite turbo upgrade vector warp xp yeti zapper',
  rock: 'amp bassline chord distortion encore feedback guitar headbang indie jam kickdrum loud mosh noise overdrive pick quake riff stagedive tour unplugged volume wah xlr yell zinger',
  jazz: 'alto bebop cool downbeat ensemble fedora groove horn improv jive keys lounge mute nightclub octave piano quintet ragtime scat trumpet upright vibraphone walkingbass xylophone yardbird zoot',
  pop: 'anthem bubblegum chorus dancefloor earworm fame glitter hook idol jingle karaoke lipgloss megastar neon outfit platinum queen remix sparkle tambourine upbeat video wink xoxo yeah zing',
  rap: 'adlib beat cypher drop emcee flow grill hype intro jump kicks lyric mic notebook oldschool punchline quotable rhyme sample turntable underground verse wordplay xtra yo zone',
  country: 'acoustic banjo cowboy dirtroad eagle fiddle gingham honkytonk interstate jukebox kentucky lasso mandolin nashville outlaw pickup quilt rodeo spurs tractor unbroken valley whiskey xing yeehaw zydeco',
  lofi: 'ambient bedroom cassette drizzle echo foggy grain headphones incense journal kettle latte midnight nap overcast plant quiet rain study tape umbrella vinyl window xray yawn zzz',
};
const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const SYMBOL_WORDS = {
  '!': 'bang', '@': 'at', '#': 'hash', $: 'dollar', '%': 'percent', '^': 'caret', '&': 'ampersand',
  '*': 'star', '(': 'open paren', ')': 'close paren', '-': 'dash', _: 'underscore', '=': 'equals',
  '+': 'plus', '[': 'open bracket', ']': 'close bracket', '{': 'open brace', '}': 'close brace',
  ';': 'semicolon', ':': 'colon', ',': 'comma', '.': 'dot', '?': 'question', '/': 'slash', '~': 'tilde',
};

// Crack time, expressed in something on-genre.
const GENRE_UNITS = {
  default: { seconds: 600, unit: 'ten-minute speedruns' },
  rock: { seconds: 240, unit: 'guitar solos' },
  jazz: { seconds: 420, unit: 'improvised sax solos' },
  pop: { seconds: 200, unit: 'radio-edit singles' },
  rap: { seconds: 45, unit: '16-bar verses' },
  country: { seconds: 210, unit: 'songs about trucks' },
  lofi: { seconds: 1500, unit: '25-minute study sessions' },
};

// Assumes an offline attack on a fast hash with a serious GPU rig.
const GUESSES_PER_SECOND = 1e10;
const UNIVERSE_AGE_S = 4.35e17;
const SCRAMBLE_STEPS = 14;
const DEFAULT_LENGTH = 16;
const DEFAULT_OPTIONS = { lower: true, upper: true, digits: true, symbols: true, noAmbiguous: false };

function secureRandomInt(max) {
  // Rejection sampling so every value is equally likely (no modulo bias).
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function buildPools(options) {
  return Object.keys(SETS)
    .filter((k) => options[k])
    .map((k) => {
      const chars = SETS[k].chars.split('');
      return options.noAmbiguous ? chars.filter((c) => !AMBIGUOUS.has(c)) : chars;
    });
}

function generatePassword(length, pools) {
  const all = pools.flat();
  // Regenerate until every selected character set shows up at least once.
  for (;;) {
    const chars = Array.from({ length }, () => all[secureRandomInt(all.length)]);
    if (pools.every((pool) => chars.some((c) => pool.includes(c)))) return chars.join('');
  }
}

function phoneticFor(char, alphabet) {
  if (/[a-z]/.test(char)) return { word: alphabet[char.charCodeAt(0) - 97], kind: 'lower' };
  if (/[A-Z]/.test(char)) return { word: alphabet[char.charCodeAt(0) - 65].toUpperCase(), kind: 'upper' };
  if (/[0-9]/.test(char)) return { word: DIGIT_WORDS[Number(char)], kind: 'digit' };
  return { word: SYMBOL_WORDS[char] || char, kind: 'symbol' };
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function bigNumber(n) {
  if (n < 1e15) return compact.format(n);
  const exp = Math.floor(Math.log10(n));
  const mantissa = (n / 10 ** exp).toFixed(1);
  return `${mantissa} × 10${String(exp).split('').map((d) => SUPERSCRIPT[d]).join('')}`;
}

function humanDuration(seconds) {
  if (seconds < 1) return 'instantly';
  const units = [
    ['year', 31557600],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  if (seconds > UNIVERSE_AGE_S) return `${bigNumber(seconds / UNIVERSE_AGE_S)}× the age of the universe`;
  for (const [name, size] of units) {
    if (seconds >= size) {
      const v = seconds / size;
      const shown = v >= 1000 ? bigNumber(v) : Math.round(v).toLocaleString();
      return `${shown} ${name}${Math.round(v) === 1 ? '' : 's'}`;
    }
  }
  return 'instantly';
}

function strengthFor(bits) {
  if (bits < 45) return { label: 'Weak', level: 'weak' };
  if (bits < 65) return { label: 'Fair', level: 'fair' };
  if (bits < 90) return { label: 'Strong', level: 'strong' };
  return { label: 'Legendary', level: 'legendary' };
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const PasswordGenerator = ({ theme }) => {
  const genre = GENRE_ALPHABETS[theme] ? theme : 'default';
  const alphabet = useMemo(() => GENRE_ALPHABETS[genre].split(' '), [genre]);

  const [length, setLength] = useState(DEFAULT_LENGTH);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  // The first password is made up front (no reveal animation). Skipped for
  // the headless prerender so no password ever gets baked into static HTML.
  const [password, setPassword] = useState(() =>
    typeof navigator !== 'undefined' && navigator.webdriver
      ? ''
      : generatePassword(DEFAULT_LENGTH, buildPools(DEFAULT_OPTIONS))
  );
  const [display, setDisplay] = useState(password);
  const [scrambling, setScrambling] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const copiedTimerRef = useRef(null);

  const pools = useMemo(() => buildPools(options), [options]);
  const poolSize = pools.flat().length;

  const generate = (len, opts) => {
    const genPools = buildPools(opts);
    if (!genPools.length) return;
    const next = generatePassword(len, genPools);
    const all = genPools.flat();
    setPassword(next);
    setCopied(false);
    clearInterval(timerRef.current);

    if (prefersReducedMotion()) {
      setDisplay(next);
      return;
    }

    // Slot-machine reveal: characters lock in left to right while the
    // rest keep spinning. (Purely visual — `next` is already final.)
    let step = 0;
    setScrambling(true);
    timerRef.current = setInterval(() => {
      step += 1;
      const locked = Math.ceil((next.length * step) / SCRAMBLE_STEPS);
      setDisplay(
        next.slice(0, locked) +
          Array.from({ length: next.length - locked }, () => all[secureRandomInt(all.length)]).join('')
      );
      if (step >= SCRAMBLE_STEPS) {
        clearInterval(timerRef.current);
        setScrambling(false);
      }
    }, 35);
  };

  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      clearTimeout(copiedTimerRef.current);
    },
    []
  );

  const toggle = (key) => {
    const next = { ...options, [key]: !options[key] };
    // Never allow every character set to be switched off.
    if (!Object.keys(SETS).some((k) => next[k])) return;
    setOptions(next);
    generate(length, next);
  };

  const handleLength = (value) => {
    setLength(value);
    generate(value, options);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (permissions / insecure context) — ignore.
    }
  };

  const bits = password ? length * Math.log2(poolSize) : 0;
  const strength = strengthFor(bits);
  const crackSeconds = 2 ** (bits - 1) / GUESSES_PER_SECOND;
  const genreUnit = GENRE_UNITS[genre];
  const phonetic = useMemo(
    () => password.split('').map((c) => ({ char: c, ...phoneticFor(c, alphabet) })),
    [password, alphabet]
  );

  return (
    <div className={`pwgen pwgen--${theme}`}>
      <div className="pwgen__header">
        <KeyRound size={22} />
        <h3>Password Generator</h3>
        <span className="pwgen__genre-tag">{genre === 'default' ? '8-bit' : genre} edition</span>
      </div>

      <div className="pwgen__body">
        <div className="pwgen__main">
          <div className={`pwgen__output ${scrambling ? 'is-scrambling' : ''}`}>
            <code aria-live="polite" aria-busy={scrambling}>
              {display || ' '}
            </code>
            <div className="pwgen__output-actions">
              <motion.button
                type="button"
                className="pwgen__icon-btn"
                onClick={() => generate(length, options)}
                whileTap={{ rotate: -180, scale: 0.9 }}
                aria-label="Generate a new password"
                title="Generate"
              >
                <RefreshCw size={18} />
              </motion.button>
              <motion.button
                type="button"
                className={`pwgen__icon-btn ${copied ? 'is-copied' : ''}`}
                onClick={handleCopy}
                whileTap={{ scale: 0.9 }}
                aria-label="Copy password"
                title="Copy"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </motion.button>
            </div>
          </div>

          <div className="pwgen__meter">
            <div className="pwgen__meter-track">
              <motion.div
                className={`pwgen__meter-fill pwgen__meter-fill--${strength.level}`}
                animate={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              />
            </div>
            <div className="pwgen__meter-meta">
              <span className={`pwgen__strength pwgen__strength--${strength.level}`}>{strength.label}</span>
              <span>{Math.round(bits)} bits of entropy</span>
            </div>
          </div>

          <p className="pwgen__crack">
            Time to crack: <strong>{humanDuration(crackSeconds)}</strong>
            {crackSeconds >= 1 && (
              <>
                <br />
                That's about <strong>{bigNumber(crackSeconds / genreUnit.seconds)}</strong> {genreUnit.unit}{' '}
                back to back.
              </>
            )}
          </p>

          <label className="pwgen__length">
            <span className="pwgen__label">
              Length <strong>{length}</strong>
            </span>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => handleLength(Number(e.target.value))}
            />
          </label>

          <div className="pwgen__toggles">
            {Object.entries(SETS).map(([k, s]) => (
              <button
                key={k}
                type="button"
                aria-pressed={options[k]}
                className={`pwgen__chip ${options[k] ? 'is-on' : ''}`}
                onClick={() => toggle(k)}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={options.noAmbiguous}
              className={`pwgen__chip ${options.noAmbiguous ? 'is-on' : ''}`}
              onClick={() => toggle('noAmbiguous')}
              title="Leave out look-alike characters: I l 1 O 0 o"
            >
              No look-alikes
            </button>
          </div>
        </div>

        <div className="pwgen__phonetic">
          <span className="pwgen__label">Say it like a {genre === 'default' ? 'gamer' : `${genre} fan`}</span>
          <ol className="pwgen__phonetic-list">
            {phonetic.map((p, i) => (
              <motion.li
                key={`${password}-${i}`}
                className={`pwgen__phonetic-item pwgen__phonetic-item--${p.kind}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 30) * 0.02 }}
              >
                <span className="pwgen__phonetic-char">{p.char}</span>
                <span className="pwgen__phonetic-word">{p.word}</span>
              </motion.li>
            ))}
          </ol>
          <p className="pwgen__fineprint">
            Generated in your browser with <code>crypto.getRandomValues</code>. Nothing is sent or stored.
            Switch the site's genre to change the alphabet. Crack time assumes {bigNumber(GUESSES_PER_SECOND)} guesses
            a second.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
