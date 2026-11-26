import React from 'react';
import { motion } from 'framer-motion';
import '../assets/styles/aiToolkit.css';

import geminiLogo from '../assets/pictures/ai-logos/gemini.svg';
import claudeLogo from '../assets/pictures/ai-logos/claude.svg';
import sunoLogo from '../assets/pictures/ai-logos/suno.svg';
import openAiLogo from '../assets/pictures/ai-logos/openai.svg';
import huggingFaceLogo from '../assets/pictures/ai-logos/huggingface.svg';
import elevenLabsLogo from '../assets/pictures/ai-logos/elevenlabs.svg';
import canvaLogo from '../assets/pictures/ai-logos/canva.svg';

const AI_TOOLS = [
  {
    role: 'Image & Video Gen',
    name: 'Gemini',
    blurb: 'My pick for generating images and video, from first concept to final visual.',
    logos: [{ src: geminiLogo, alt: 'Google Gemini logo' }],
  },
  {
    role: 'Code & Logic',
    name: 'Claude',
    blurb: 'My go-to for writing code and working through tricky logic.',
    logos: [{ src: claudeLogo, alt: 'Claude logo' }],
  },
  {
    role: 'Music',
    name: 'Suno',
    blurb: 'Where my AI-assisted music production happens.',
    logos: [{ src: sunoLogo, alt: 'Suno logo' }],
  },
  {
    role: 'API Calls',
    name: 'OpenAI & Hugging Face',
    blurb: 'What I reach for when an app needs to call a model through an API.',
    logos: [
      { src: openAiLogo, alt: 'OpenAI logo' },
      { src: huggingFaceLogo, alt: 'Hugging Face logo' },
    ],
  },
  {
    role: 'Voiceover',
    name: 'ElevenLabs',
    blurb: 'My recommendation for voiceover and narration.',
    logos: [{ src: elevenLabsLogo, alt: 'ElevenLabs logo' }],
  },
  {
    role: 'Mockups',
    name: 'Canva AI',
    blurb: 'Quick mockups, so I can see an idea before I build it.',
    logos: [{ src: canvaLogo, alt: 'Canva logo', wide: true }],
  },
];

const AiToolkit = ({ theme }) => (
  <div className="bento">
    {AI_TOOLS.map((tool, index) => {
      // Every other card flips the logo to the right.
      const flipped = index % 2 === 1;

      return (
        <div key={tool.role} className="bento-cell">
          <motion.div
            className={`card card--${theme} ai-card ${flipped ? 'ai-card--flip' : ''}`}
            initial={{ opacity: 0, x: flipped ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
          >
            <div className="ai-card__logos">
              {tool.logos.map((logo) => (
                <span key={logo.alt} className="ai-card__logo">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={logo.wide ? 'is-wide' : ''}
                    loading="lazy"
                  />
                </span>
              ))}
            </div>

            <div className="ai-card__text">
              <h2 className={`ai-card__role title-${theme}`}>{tool.role}</h2>
              <p className="ai-card__name">{tool.name}</p>
              <p className="ai-card__blurb">{tool.blurb}</p>
            </div>
          </motion.div>
        </div>
      );
    })}
  </div>
);

export default AiToolkit;
