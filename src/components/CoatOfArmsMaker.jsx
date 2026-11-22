import React, { useId, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Anchor,
  Bird,
  Castle,
  Clover,
  Crown,
  Download,
  Feather,
  Fish,
  Flame,
  Gamepad2,
  Heart,
  Key,
  Leaf,
  Moon,
  Music,
  Shield,
  Shuffle,
  Star,
  Sun,
  Sword,
} from 'lucide-react';
import '../assets/styles/coatOfArms.css';

// ── Heraldic vocabulary ──────────────────────────────────────
// Tinctures are split into metals and colours so we can apply the
// heraldic "rule of tincture": never put metal on metal or colour on colour.
const TINCTURES = {
  or: { name: 'Or', hex: '#e3b23c', kind: 'metal' },
  argent: { name: 'Argent', hex: '#eceff2', kind: 'metal' },
  gules: { name: 'Gules', hex: '#c41e3a', kind: 'colour' },
  azure: { name: 'Azure', hex: '#1f4e9e', kind: 'colour' },
  vert: { name: 'Vert', hex: '#1d7a3c', kind: 'colour' },
  purpure: { name: 'Purpure', hex: '#6a2c8c', kind: 'colour' },
  sable: { name: 'Sable', hex: '#1b1b1f', kind: 'colour' },
};
const TINCTURE_KEYS = Object.keys(TINCTURES);

const SHIELDS = {
  heater: {
    label: 'Heater',
    d: 'M10 10 H190 V105 C190 165 145 205 100 230 C55 205 10 165 10 105 Z',
  },
  iberian: {
    label: 'Iberian',
    d: 'M10 10 H190 V140 A90 90 0 0 1 10 140 Z',
  },
  french: {
    label: 'French',
    d: 'M10 10 H190 V185 Q190 212 160 212 H124 Q104 212 100 232 Q96 212 76 212 H40 Q10 212 10 185 Z',
  },
};

const DIVISIONS = {
  plain: { label: 'Plain', blazon: (a) => a },
  perPale: { label: 'Per pale', blazon: (a, b) => `Per pale ${a} and ${b}` },
  perFess: { label: 'Per fess', blazon: (a, b) => `Per fess ${a} and ${b}` },
  perBend: { label: 'Per bend', blazon: (a, b) => `Per bend ${a} and ${b}` },
  perChevron: { label: 'Per chevron', blazon: (a, b) => `Per chevron ${a} and ${b}` },
  perSaltire: { label: 'Per saltire', blazon: (a, b) => `Per saltire ${a} and ${b}` },
  quarterly: { label: 'Quarterly', blazon: (a, b) => `Quarterly ${a} and ${b}` },
  paly: { label: 'Paly', blazon: (a, b) => `Paly of six ${a} and ${b}` },
  barry: { label: 'Barry', blazon: (a, b) => `Barry of six ${a} and ${b}` },
  chequy: { label: 'Chequy', blazon: (a, b) => `Chequy ${a} and ${b}` },
  gyronny: { label: 'Gyronny', blazon: (a, b) => `Gyronny of eight ${a} and ${b}` },
};

const ORDINARIES = {
  none: { label: 'None' },
  chief: { label: 'Chief', blazon: 'a chief' },
  fess: { label: 'Fess', blazon: 'a fess' },
  pale: { label: 'Pale', blazon: 'a pale' },
  bend: { label: 'Bend', blazon: 'a bend' },
  bendSinister: { label: 'Bend sinister', blazon: 'a bend sinister' },
  chevron: { label: 'Chevron', blazon: 'a chevron' },
  cross: { label: 'Cross', blazon: 'a cross' },
  saltire: { label: 'Saltire', blazon: 'a saltire' },
  bordure: { label: 'Bordure', blazon: 'a bordure' },
};
// Ordinaries that pass through the middle of the shield, so a single
// central charge sits *on* them rather than on the field.
const COVERS_CENTER = new Set(['fess', 'pale', 'bend', 'bendSinister', 'chevron', 'cross', 'saltire']);

// `fillable` icons have closed outlines that read well as solid silhouettes;
// the rest are line art and get drawn as thick outlined strokes instead.
const CHARGES = {
  none: { label: 'None' },
  mullet: { label: 'Mullet (star)', name: 'mullet', plural: 'mullets', Icon: Star, fillable: true },
  crown: { label: 'Crown', name: 'crown', plural: 'crowns', Icon: Crown, fillable: true },
  crescent: { label: 'Crescent', name: 'crescent', plural: 'crescents', Icon: Moon, fillable: true },
  sun: { label: 'Sun', name: 'sun in splendour', plural: 'suns in splendour', Icon: Sun, fillable: true },
  heart: { label: 'Heart', name: 'heart', plural: 'hearts', Icon: Heart, fillable: true },
  flame: { label: 'Flame', name: 'flame', plural: 'flames', Icon: Flame, fillable: true },
  martlet: { label: 'Martlet (bird)', name: 'martlet', plural: 'martlets', Icon: Bird, fillable: true },
  fish: { label: 'Fish', name: 'fish naiant', plural: 'fish naiant', Icon: Fish, fillable: true },
  trefoil: { label: 'Trefoil', name: 'trefoil', plural: 'trefoils', Icon: Clover, fillable: true },
  leaf: { label: 'Leaf', name: 'leaf', plural: 'leaves', Icon: Leaf, fillable: true },
  tower: { label: 'Castle', name: 'castle', plural: 'castles', Icon: Castle, fillable: true },
  anchor: { label: 'Anchor', name: 'anchor', plural: 'anchors', Icon: Anchor, fillable: false },
  sword: { label: 'Sword', name: 'sword', plural: 'swords', Icon: Sword, fillable: false },
  key: { label: 'Key', name: 'key', plural: 'keys', Icon: Key, fillable: false },
  quill: { label: 'Quill', name: 'quill', plural: 'quills', Icon: Feather, fillable: false },
  note: { label: 'Musical note', name: 'musical note', plural: 'musical notes', Icon: Music, fillable: false },
  gamepad: { label: 'Gamepad', name: 'gamepad', plural: 'gamepads', Icon: Gamepad2, fillable: true },
};

const MOTTOS = [
  'Fortune Favours the Bold',
  'Press Start to Continue',
  'By Code and Courage',
  'Ever Upward',
  'Stay Curious',
  'Fear No Bug',
  'Roll for Initiative',
  'Loud and Unafraid',
  'Build It Anyway',
  'One More Level',
  'Ship It',
  'Fortis et Fidelis',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickOfKind = (kind, exclude) =>
  pick(TINCTURE_KEYS.filter((k) => TINCTURES[k].kind === kind && k !== exclude));
const oppositeKind = (key) => (TINCTURES[key].kind === 'metal' ? 'colour' : 'metal');
const article = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

const DEFAULT_ARMS = {
  shield: 'heater',
  division: 'perPale',
  field1: 'azure',
  field2: 'or',
  ordinary: 'chevron',
  ordinaryTincture: 'gules',
  charge: 'mullet',
  chargeCount: 3,
  chargeTincture: 'argent',
  motto: 'Press Start to Continue',
};

// Which tincture does the charge actually sit on? Used both for random
// generation and for checking the rule of tincture.
function chargeGround(arms) {
  if (arms.chargeCount === 1 && COVERS_CENTER.has(arms.ordinary)) return arms.ordinaryTincture;
  if (arms.division === 'plain') return arms.field1;
  return null; // sits across a divided field — exempt
}

function randomArms() {
  const division = pick(Object.keys(DIVISIONS));
  const ordinary = Math.random() < 0.2 ? 'none' : pick(Object.keys(ORDINARIES).filter((o) => o !== 'none'));
  const charge = Math.random() < 0.15 ? 'none' : pick(Object.keys(CHARGES).filter((c) => c !== 'none'));
  const field1 = pick(TINCTURE_KEYS);
  const field2 = pickOfKind(oppositeKind(field1));
  const ordinaryTincture = pickOfKind(oppositeKind(field1));
  const arms = {
    shield: pick(Object.keys(SHIELDS)),
    division,
    field1,
    field2,
    ordinary,
    ordinaryTincture,
    charge,
    chargeCount: Math.random() < 0.5 ? 1 : 3,
    chargeTincture: 'argent',
    motto: pick(MOTTOS),
  };
  const ground = chargeGround(arms) || field1;
  arms.chargeTincture = pickOfKind(oppositeKind(ground), ground);
  return arms;
}

function checkTincture(arms) {
  const problems = [];
  const kind = (k) => TINCTURES[k].kind;
  if (arms.division === 'plain' && arms.ordinary !== 'none' && kind(arms.ordinaryTincture) === kind(arms.field1)) {
    problems.push(`${ORDINARIES[arms.ordinary].label.toLowerCase()} is ${kind(arms.field1)} on ${kind(arms.field1)}`);
  }
  if (arms.charge !== 'none') {
    const ground = chargeGround(arms);
    if (ground && kind(arms.chargeTincture) === kind(ground)) {
      problems.push(`charge is ${kind(ground)} on ${kind(ground)}`);
    }
  }
  return problems;
}

function blazonFor(arms) {
  const t = (k) => TINCTURES[k].name;
  const parts = [DIVISIONS[arms.division].blazon(t(arms.field1), t(arms.field2))];
  if (arms.ordinary !== 'none') parts.push(`${ORDINARIES[arms.ordinary].blazon} ${t(arms.ordinaryTincture)}`);
  if (arms.charge !== 'none') {
    const c = CHARGES[arms.charge];
    parts.push(
      arms.chargeCount === 1
        ? `${article(c.name)} ${c.name} ${t(arms.chargeTincture)}`
        : `three ${c.plural} ${t(arms.chargeTincture)}`
    );
  }
  return `${parts.join(', ')}.`;
}

// ── SVG pieces ───────────────────────────────────────────────
function FieldDivision({ division, c2 }) {
  switch (division) {
    case 'perPale':
      return <rect x="100" y="0" width="100" height="240" fill={c2} />;
    case 'perFess':
      return <rect x="0" y="112" width="200" height="128" fill={c2} />;
    case 'perBend':
      return <polygon points="0,0 0,240 200,240" fill={c2} />;
    case 'perChevron':
      return <polygon points="0,228 100,104 200,228 200,240 0,240" fill={c2} />;
    case 'perSaltire':
      return (
        <>
          <polygon points="0,0 100,115 0,240" fill={c2} />
          <polygon points="200,0 100,115 200,240" fill={c2} />
        </>
      );
    case 'quarterly':
      return (
        <>
          <rect x="100" y="0" width="100" height="112" fill={c2} />
          <rect x="0" y="112" width="100" height="128" fill={c2} />
        </>
      );
    case 'paly':
      return [1, 3, 5].map((i) => (
        <rect key={i} x={(200 / 6) * i} y="0" width={200 / 6} height="240" fill={c2} />
      ));
    case 'barry':
      return [1, 3, 5].map((i) => <rect key={i} x="0" y={40 * i} width="200" height="40" fill={c2} />);
    case 'chequy': {
      const cells = [];
      for (let r = 0; r < 7; r += 1) {
        for (let c = 0; c < 6; c += 1) {
          if ((r + c) % 2) cells.push(<rect key={`${r}-${c}`} x={c * 34} y={r * 35} width="34" height="35" fill={c2} />);
        }
      }
      return cells;
    }
    case 'gyronny': {
      const ring = [
        [0, 0], [100, 0], [200, 0], [200, 115], [200, 240], [100, 240], [0, 240], [0, 115],
      ];
      return ring
        .map((p, i) => (i % 2 ? null : (
          <polygon key={i} points={`100,115 ${p.join(',')} ${ring[(i + 1) % 8].join(',')}`} fill={c2} />
        )))
        .filter(Boolean);
    }
    default:
      return null;
  }
}

function Ordinary({ ordinary, color, shieldPath }) {
  switch (ordinary) {
    case 'chief':
      return <rect x="0" y="0" width="200" height="70" fill={color} />;
    case 'fess':
      return <rect x="0" y="88" width="200" height="46" fill={color} />;
    case 'pale':
      return <rect x="76" y="0" width="48" height="240" fill={color} />;
    case 'bend':
      return <line x1="0" y1="0" x2="200" y2="240" stroke={color} strokeWidth="44" />;
    case 'bendSinister':
      return <line x1="200" y1="0" x2="0" y2="240" stroke={color} strokeWidth="44" />;
    case 'chevron':
      return (
        <polyline
          points="-10,232 100,108 210,232"
          fill="none"
          stroke={color}
          strokeWidth="40"
          strokeLinejoin="miter"
        />
      );
    case 'cross':
      return (
        <>
          <rect x="80" y="0" width="40" height="240" fill={color} />
          <rect x="0" y="92" width="200" height="40" fill={color} />
        </>
      );
    case 'saltire':
      return (
        <>
          <line x1="0" y1="0" x2="200" y2="230" stroke={color} strokeWidth="34" />
          <line x1="200" y1="0" x2="0" y2="230" stroke={color} strokeWidth="34" />
        </>
      );
    case 'bordure':
      return <path d={shieldPath} fill="none" stroke={color} strokeWidth="30" />;
    default:
      return null;
  }
}

function Charge({ chargeKey, x, y, size, color, outline }) {
  const { Icon, fillable } = CHARGES[chargeKey];
  const common = { x: x - size / 2, y: y - size / 2, size, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <g>
      <Icon {...common} color={outline} fill={fillable ? outline : 'none'} strokeWidth={3.4} />
      <Icon {...common} color={color} fill={fillable ? color : 'none'} strokeWidth={1.9} />
      {fillable && <Icon {...common} color={outline} fill="none" strokeWidth={0.7} />}
    </g>
  );
}

function chargePositions(count, ordinary) {
  const shift = ordinary === 'chief' ? 24 : 0;
  if (count === 1) return [{ x: 100, y: 112 + shift / 2, size: 70 }];
  return [
    { x: 60, y: 60 + shift, size: 44 },
    { x: 140, y: 60 + shift, size: 44 },
    { x: 100, y: 160 + shift / 3, size: 44 },
  ];
}

// ── UI bits ──────────────────────────────────────────────────
function Swatches({ label, value, onChange }) {
  return (
    <div className="coa__swatch-row">
      <span className="coa__label">{label}</span>
      <div className="coa__swatches" role="radiogroup" aria-label={label}>
        {TINCTURE_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={value === k}
            title={`${TINCTURES[k].name} (${TINCTURES[k].kind})`}
            className={`coa__swatch ${value === k ? 'is-selected' : ''} coa__swatch--${TINCTURES[k].kind}`}
            style={{ '--swatch': TINCTURES[k].hex }}
            onClick={() => onChange(k)}
          />
        ))}
      </div>
    </div>
  );
}

const CoatOfArmsMaker = ({ theme }) => {
  const [arms, setArms] = useState(DEFAULT_ARMS);
  const [spinKey, setSpinKey] = useState(0);
  const svgRef = useRef(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const clipId = `coa-clip-${uid}`;
  const shadeId = `coa-shade-${uid}`;
  const mottoPathId = `coa-motto-${uid}`;

  const set = (key) => (value) => setArms((prev) => ({ ...prev, [key]: value }));
  const shieldPath = SHIELDS[arms.shield].d;
  const blazon = useMemo(() => blazonFor(arms), [arms]);
  const problems = useMemo(() => checkTincture(arms), [arms]);
  const outlineFor = (k) => (k === 'sable' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.7)');

  const motto = arms.motto.trim().toUpperCase();
  // Shrink the font so the whole motto fits along the ~180-unit banner.
  const mottoSize = Math.max(6, Math.min(11, (180 / Math.max(motto.length, 1) - 0.6) / 0.74));

  const handleRandomize = () => {
    setArms(randomArms());
    setSpinKey((k) => k + 1);
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const markup = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement('canvas');
      canvas.width = 224 * scale;
      canvas.height = 285 * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'coat-of-arms.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, 'image/png');
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  return (
    <div className={`coa coa--${theme}`}>
      <div className="coa__header">
        <Shield size={22} />
        <h3>Coat of Arms Maker</h3>
      </div>

      <div className="coa__body">
        <div className="coa__stage">
          <motion.svg
            key={spinKey}
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-12 0 224 285"
            className="coa__svg"
            role="img"
            aria-label={`Coat of arms: ${blazon}`}
            initial={spinKey ? { rotateY: 90, opacity: 0.4 } : false}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <defs>
              <clipPath id={clipId}>
                <path d={shieldPath} />
              </clipPath>
              <radialGradient id={shadeId} cx="35%" cy="25%" r="85%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
                <stop offset="55%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
              </radialGradient>
              <path id={mottoPathId} d="M8 266 Q100 250 192 266" />
            </defs>

            <g clipPath={`url(#${clipId})`}>
              <rect x="0" y="0" width="200" height="240" fill={TINCTURES[arms.field1].hex} />
              <FieldDivision division={arms.division} c2={TINCTURES[arms.field2].hex} />
              <Ordinary
                ordinary={arms.ordinary}
                color={TINCTURES[arms.ordinaryTincture].hex}
                shieldPath={shieldPath}
              />
              {arms.charge !== 'none' &&
                chargePositions(arms.chargeCount, arms.ordinary).map((p, i) => (
                  <Charge
                    key={i}
                    chargeKey={arms.charge}
                    {...p}
                    color={TINCTURES[arms.chargeTincture].hex}
                    outline={outlineFor(arms.chargeTincture)}
                  />
                ))}
              <rect x="0" y="0" width="200" height="240" fill={`url(#${shadeId})`} />
            </g>
            <path d={shieldPath} fill="none" stroke="#14110c" strokeWidth="4" />
            <path d={shieldPath} fill="none" stroke="#c9a227" strokeWidth="1.2" />

            {motto && (
              <g>
                <path d="M12 254 L-10 257 L0 267 L-10 279 L12 277 Z" fill="#cdbf9c" stroke="#5c4a2a" strokeWidth="1" />
                <path d="M188 254 L210 257 L200 267 L210 279 L188 277 Z" fill="#cdbf9c" stroke="#5c4a2a" strokeWidth="1" />
                <path d="M4 256 Q100 238 196 256 L196 278 Q100 260 4 278 Z" fill="#efe6cf" stroke="#5c4a2a" strokeWidth="1.2" />
                <text
                  fill="#3b2d16"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize={mottoSize}
                  fontWeight="700"
                  letterSpacing="0.6"
                  dominantBaseline="middle"
                >
                  <textPath href={`#${mottoPathId}`} startOffset="50%" textAnchor="middle">
                    {motto}
                  </textPath>
                </text>
              </g>
            )}
          </motion.svg>

          <p className="coa__blazon">
            <span className="coa__label">Blazon</span>
            {blazon}
          </p>
          <span
            className={`coa__rule ${problems.length ? 'coa__rule--bad' : 'coa__rule--good'}`}
            title="Heraldry's rule of tincture: never place metal on metal or colour on colour."
          >
            {problems.length ? `A herald winces: ${problems.join('; ')}` : 'Herald-approved tinctures'}
          </span>
        </div>

        <div className="coa__controls">
          <div className="coa__chips" role="radiogroup" aria-label="Shield shape">
            {Object.entries(SHIELDS).map(([k, s]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={arms.shield === k}
                className={`coa__chip ${arms.shield === k ? 'is-selected' : ''}`}
                onClick={() => set('shield')(k)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <label className="coa__field">
            <span className="coa__label">Division</span>
            <select value={arms.division} onChange={(e) => set('division')(e.target.value)}>
              {Object.entries(DIVISIONS).map(([k, d]) => (
                <option key={k} value={k}>{d.label}</option>
              ))}
            </select>
          </label>
          <Swatches label="Field" value={arms.field1} onChange={set('field1')} />
          {arms.division !== 'plain' && (
            <Swatches label="Field 2" value={arms.field2} onChange={set('field2')} />
          )}

          <label className="coa__field">
            <span className="coa__label">Ordinary</span>
            <select value={arms.ordinary} onChange={(e) => set('ordinary')(e.target.value)}>
              {Object.entries(ORDINARIES).map(([k, o]) => (
                <option key={k} value={k}>{o.label}</option>
              ))}
            </select>
          </label>
          {arms.ordinary !== 'none' && (
            <Swatches label="Ordinary" value={arms.ordinaryTincture} onChange={set('ordinaryTincture')} />
          )}

          <div className="coa__field-row">
            <label className="coa__field">
              <span className="coa__label">Charge</span>
              <select value={arms.charge} onChange={(e) => set('charge')(e.target.value)}>
                {Object.entries(CHARGES).map(([k, c]) => (
                  <option key={k} value={k}>{c.label}</option>
                ))}
              </select>
            </label>
            {arms.charge !== 'none' && (
              <div className="coa__chips coa__chips--count" role="radiogroup" aria-label="Number of charges">
                {[1, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={arms.chargeCount === n}
                    className={`coa__chip ${arms.chargeCount === n ? 'is-selected' : ''}`}
                    onClick={() => set('chargeCount')(n)}
                  >
                    ×{n}
                  </button>
                ))}
              </div>
            )}
          </div>
          {arms.charge !== 'none' && (
            <Swatches label="Charge" value={arms.chargeTincture} onChange={set('chargeTincture')} />
          )}

          <label className="coa__field">
            <span className="coa__label">Motto</span>
            <input
              type="text"
              maxLength={32}
              value={arms.motto}
              placeholder="Leave blank for no banner"
              onChange={(e) => set('motto')(e.target.value)}
            />
          </label>

          <div className="coa__actions">
            <motion.button type="button" className="coa__btn coa__btn--primary" onClick={handleRandomize} whileTap={{ scale: 0.95 }}>
              <Shuffle size={16} /> Randomize
            </motion.button>
            <motion.button type="button" className="coa__btn" onClick={handleDownload} whileTap={{ scale: 0.95 }}>
              <Download size={16} /> PNG
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoatOfArmsMaker;
