import React from 'react';
import '../assets/styles/miniApps.css';
import PageHeader from '../components/PageHeader';
import WeatherWidget from '../components/WeatherWidget';
import DiceRoller from '../components/DiceRoller';
import SEO from '../components/SEO';

export default function MiniApps({ theme }) {
  return (
    <div className={`mini-apps-wrapper mini-apps-wrapper--${theme}`}>
      <SEO
        title="Mini Apps | 8BitGinger - Weather & Dice Roller"
        description="A small collection of standalone mini apps built by Ryan Fann, including a live weather lookup and a TTRPG dice roller."
        path="/mini-apps"
      />

      <PageHeader theme={theme} title="Mini Apps" />

      <p className="mini-apps-intro">
        A few small, self-contained tools I built just for fun — a live weather lookup and a
        dice roller for tabletop sessions. More to come.
      </p>

      <div className="mini-apps-grid">
        <WeatherWidget theme={theme} />
        <DiceRoller theme={theme} />
      </div>
    </div>
  );
}
