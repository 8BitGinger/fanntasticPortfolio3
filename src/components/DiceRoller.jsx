import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Skull } from 'lucide-react';
import '../assets/styles/diceRoller.css';

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100];
const SHAPE_CLASS = {
  4: 'die-btn--triangle',
  6: 'die-btn--square',
  8: 'die-btn--diamond',
  10: 'die-btn--pentagon',
  12: 'die-btn--hexagon',
  20: 'die-btn--octagon',
  100: 'die-btn--circle',
};

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(sides, count, modifier) {
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const sum = rolls.reduce((a, b) => a + b, 0) + modifier;
  return { rolls, sum };
}

function parseNotation(notation) {
  const match = notation
    .trim()
    .toLowerCase()
    .match(/^(\d*)d(\d+)\s*([+-]\s*\d+)?$/);
  if (!match) return null;
  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3].replace(/\s/g, ''), 10) : 0;
  if (count < 1 || count > 50 || sides < 2) return null;
  return { count, sides, modifier };
}

const SPARKS = Array.from({ length: 10 }, (_, i) => i);
// Decelerating tick delays for the slot-machine roll effect — a fixed-length
// sequence so the roll always finishes in exactly this many steps.
const CYCLE_DELAYS = [35, 45, 60, 75, 95];

const DiceRoller = ({ theme }) => {
  const [sides, setSides] = useState(20);
  const [count, setCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [notation, setNotation] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState(null);
  const [result, setResult] = useState(null);
  const [critState, setCritState] = useState(null); // 'crit' | 'fail' | null
  const [history, setHistory] = useState([]);

  const cycleTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(cycleTimeoutRef.current), []);

  const performRoll = (rollSides, rollCount, rollModifier) => {
    clearTimeout(cycleTimeoutRef.current);
    setResult(null);
    setCritState(null);
    setIsRolling(true);

    // A fixed, finite sequence of delays (not an open-ended loop checked
    // against elapsed time) so the roll is *structurally* guaranteed to
    // finish after exactly CYCLE_DELAYS.length ticks, regardless of how
    // much real time each tick's render/paint actually costs on the device.
    let step = 0;
    const tick = () => {
      setDisplayValue(rollDie(rollSides));
      step += 1;
      if (step < CYCLE_DELAYS.length) {
        cycleTimeoutRef.current = setTimeout(tick, CYCLE_DELAYS[step]);
      } else {
        const { rolls, sum } = rollDice(rollSides, rollCount, rollModifier);
        const label = `${rollCount}d${rollSides}${
          rollModifier ? (rollModifier > 0 ? `+${rollModifier}` : rollModifier) : ''
        }`;
        const entry = { label, rolls, sum, id: Date.now(), sides: rollSides };
        setResult(entry);
        setHistory((prev) => [entry, ...prev].slice(0, 8));
        setIsRolling(false);
        if (rollSides === 20) {
          if (rolls.includes(20)) setCritState('crit');
          else if (rolls.includes(1)) setCritState('fail');
        }
      }
    };
    cycleTimeoutRef.current = setTimeout(tick, CYCLE_DELAYS[0]);
  };

  const handleQuickRoll = (dieSides) => {
    setSides(dieSides);
    performRoll(dieSides, count, modifier);
  };

  const handleRollCurrent = () => performRoll(sides, count, modifier);

  const handleNotationSubmit = (e) => {
    e.preventDefault();
    const parsed = parseNotation(notation);
    if (!parsed) return;
    setSides(parsed.sides);
    setCount(parsed.count);
    setModifier(parsed.modifier);
    performRoll(parsed.sides, parsed.count, parsed.modifier);
  };

  return (
    <div className={`dice-roller dice-roller--${theme}`}>
      <div className="dice-roller__header">
        <Dices size={22} />
        <h3>Dice Roller</h3>
      </div>

      <div className="dice-roller__quick-picks">
        {DIE_TYPES.map((d) => (
          <motion.button
            key={d}
            type="button"
            className={`die-btn ${SHAPE_CLASS[d]} ${sides === d ? 'is-selected' : ''}`}
            onClick={() => handleQuickRoll(d)}
            whileTap={{ scale: 0.85, rotate: -8 }}
            whileHover={{ scale: 1.08 }}
          >
            <span>d{d}</span>
          </motion.button>
        ))}
      </div>

      <div className="dice-roller__controls">
        <label>
          Count
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>
        <label>
          Modifier
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value) || 0)}
          />
        </label>
        <motion.button
          type="button"
          className="dice-roller__roll-btn"
          onClick={handleRollCurrent}
          whileTap={{ scale: 0.95 }}
        >
          Roll {count}d{sides}
          {modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ''}
        </motion.button>
      </div>

      <form className="dice-roller__notation" onSubmit={handleNotationSubmit}>
        <input
          type="text"
          placeholder="Custom roll, e.g. 3d6+2"
          value={notation}
          onChange={(e) => setNotation(e.target.value)}
        />
        <button type="submit">Roll</button>
      </form>

      <div className={`dice-roller__result ${critState ? `dice-roller__result--${critState}` : ''}`}>
        {critState === 'crit' && (
          <div className="dice-roller__burst">
            {SPARKS.map((i) => (
              <motion.span
                key={i}
                className="dice-roller__spark"
                style={{ '--angle': `${(360 / SPARKS.length) * i}deg` }}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              className="dice-roller__cycling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="dice-roller__cycling-number"
                key={displayValue}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {displayValue ?? '–'}
              </motion.span>
            </motion.div>
          ) : result ? (
            <motion.div
              key={result.id}
              className="dice-roller__sum"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={
                critState === 'fail'
                  ? { opacity: 1, scale: 1, x: [0, -10, 10, -8, 8, -4, 4, 0] }
                  : { opacity: 1, scale: 1 }
              }
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {critState === 'crit' && (
                <span className="dice-roller__crit-tag dice-roller__crit-tag--success">
                  Critical!
                </span>
              )}
              {critState === 'fail' && (
                <span className="dice-roller__crit-tag dice-roller__crit-tag--fail">
                  <Skull size={14} /> Fumble
                </span>
              )}
              <span className="dice-roller__sum-label">{result.label}</span>
              <span className="dice-roller__sum-total">{result.sum}</span>
              <div className="dice-roller__pips">
                {result.rolls.map((r, i) => (
                  <motion.span
                    key={i}
                    className={`dice-roller__pip ${
                      result.sides === 20 && r === 20 ? 'dice-roller__pip--nat20' : ''
                    } ${result.sides === 20 && r === 1 ? 'dice-roller__pip--nat1' : ''}`}
                    initial={{ opacity: 0, scale: 0, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 14 }}
                  >
                    {r}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="dice-roller__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Pick a die or type a roll
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {history.length > 0 && (
        <ul className="dice-roller__history">
          {history.map((h) => (
            <li key={h.id}>
              <span>{h.label}</span>
              <span>= {h.sum}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiceRoller;
