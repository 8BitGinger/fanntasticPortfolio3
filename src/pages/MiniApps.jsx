import React from 'react';
import '../assets/styles/miniApps.css';
import PageHeader from '../components/PageHeader';
import WeatherWidget from '../components/WeatherWidget';
import DiceRoller from '../components/DiceRoller';
import CoatOfArmsMaker from '../components/CoatOfArmsMaker';
import PasswordGenerator from '../components/PasswordGenerator';
import SEO from '../components/SEO';

export default function MiniApps({ theme }) {
  return (
    <div className={`mini-apps-wrapper mini-apps-wrapper--${theme}`}>
      <SEO
        title="Mini Apps | 8BitGinger - Weather, Dice, Heraldry & Passwords"
        description="A small collection of standalone mini apps built by Ryan Fann: a live weather lookup, a TTRPG dice roller, a coat of arms maker, and a genre-themed password generator."
        path="/mini-apps"
      />

      <PageHeader theme={theme} title="Mini Apps" />

      <p className="mini-apps-intro">
        A few small, self-contained tools I built just for fun: a live weather lookup, a dice
        roller for tabletop sessions, a coat of arms maker, and a password generator that spells
        itself out in whatever genre the site is playing. More to come.
      </p>

      <div className="mini-apps-grid">
        <WeatherWidget theme={theme} />
        <DiceRoller theme={theme} />
        <div className="mini-apps-grid__wide">
          <CoatOfArmsMaker theme={theme} />
        </div>
        <div className="mini-apps-grid__wide">
          <PasswordGenerator theme={theme} />
        </div>
      </div>
    </div>
  );
}
