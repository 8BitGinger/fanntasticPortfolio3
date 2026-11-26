/* Light sound effects for the intro reel, synthesized with the Web Audio API
   so there are no audio files to download. Kept quiet on purpose: they accent
   the motion, they aren't a soundtrack. */

let ctx = null;
let master = null;
let noise = null;

const MASTER_VOLUME = 0.6;

export function unlockSfx() {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function noiseBuffer() {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

function envelope(t, attack, peak, decay) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  gain.connect(master);
  return gain;
}

function tone(type, from, to, t, duration, peak, attack = 0.005) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  osc.connect(envelope(t, attack, peak, duration));
  osc.start(t);
  osc.stop(t + attack + duration + 0.05);
}

function hiss(t, duration, filterType, from, to, peak, attack = 0.01, q = 1) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer();
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + attack + duration);
  src.connect(filter);
  filter.connect(envelope(t, attack, peak, duration));
  src.start(t);
  src.stop(t + attack + duration + 0.05);
}

const SOUNDS = {
  // typewriter key
  tick: (t) => tone('square', 1800, null, t, 0.025, 0.025),
  // UI blip for list items and chips
  blip: (t) => tone('square', 660, 990, t, 0.07, 0.03),
  // soft pop for cards landing
  pop: (t) => tone('sine', 420, 840, t, 0.09, 0.12),
  // camera shutter for photos
  shutter: (t) => {
    hiss(t, 0.04, 'highpass', 3000, 3000, 0.1);
    hiss(t + 0.06, 0.03, 'highpass', 4000, 4000, 0.06);
  },
  // scene transition
  whoosh: (t) => hiss(t, 0.45, 'bandpass', 350, 2600, 0.16, 0.18, 0.8),
  // build-up before the title
  rise: (t) => hiss(t, 0.15, 'bandpass', 200, 3200, 0.07, 0.8, 1.2),
  // title impact
  boom: (t) => {
    tone('sine', 140, 38, t, 0.7, 0.45);
    hiss(t, 0.15, 'lowpass', 900, 200, 0.15);
  },
  // digital glitch
  glitch: (t) => {
    [0, 0.045, 0.1, 0.13].forEach((offset, i) => {
      tone('square', [320, 1180, 540, 920][i], null, t + offset, 0.03, 0.03);
    });
    hiss(t, 0.18, 'highpass', 1500, 1500, 0.06);
  },
  // gentle bell for quotes
  bell: (t) => {
    tone('sine', 1046, null, t, 0.9, 0.05, 0.01);
    tone('sine', 2093, null, t, 0.5, 0.015, 0.01);
  },
  // 8-bit "level up" for the outro
  chime: (t) => {
    [1047, 1319, 1568, 2093].forEach((freq, i) => tone('square', freq, null, t + i * 0.075, 0.1, 0.03));
  },
};

export function playSfx(name) {
  if (!ctx || ctx.state !== 'running' || !SOUNDS[name]) return;
  SOUNDS[name](ctx.currentTime + 0.01);
}
