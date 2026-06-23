import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/styles/aboutTabs.css';

const AboutTabs = ({ theme, tabs }) => {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === activeId) || tabs[0];

  return (
    <div className={`about-tabs about-tabs--${theme}`}>
      <div className="about-tabs__nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            className={`about-tabs__btn about-tabs__btn--${theme} ${
              tab.id === activeId ? 'is-active' : ''
            }`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          className="about-tabs__panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AboutTabs;
