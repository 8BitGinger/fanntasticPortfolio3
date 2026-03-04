import { useEffect, useRef, useState } from 'react';
import skills from '../Utils/skills';
import { motion } from 'framer-motion';

const LEVEL_ORDER = ['Advanced', 'Intermediate', 'Experienced', 'Beginner'];

const sorted = [...skills].sort(
  (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
);

export default function SkillBars({ theme }) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  // Trigger animation when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Re-trigger if theme changes (page doesn't remount, bars should re-fire)
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [theme]);

  return (
    <motion.div
         initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}

    className={`skills-section skills-section--${theme}`} ref={ref}>
      <h2 className={`skills-heading ${theme}`}>Web Skills</h2>

      <div className="skills-list">
        {sorted.map((skill, i) => (
          <div
            className="skill-row"
            key={skill.name}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="skill-meta">
              <span className={`skill-name ${theme}`}>{skill.name}</span>
              <span className="skill-level">{skill.level}</span>
            </div>

            <div className="skill-track">
              <div
                className={`skill-fill skill-fill--${theme}`}
                style={{
                  width: animate ? `${skill.value}%` : '0%',
                  transitionDelay: animate ? `${i * 60}ms` : '0ms',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}