import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Marquee } from "react-fast-marquee"; // Import the marquee
import projectList from '../data/projectList'; // Import your project data
import '../assets/styles/projects.css'; // Import the CSS for styling

export default function Projects() {
  const sections = [
    { id: 'web', title: 'Websites & Scripts', size: 'large' },
    { id: 'obs', title: 'OBS Plugins & Tutorials', size: 'small' },
    { id: 'ttrpg', title: 'Game Design', size: 'large' },
    { id: 'ai', title: 'AI Skills', size: 'medium' },
    
  ];

 return (
    <div className="projects-wrapper">

      {sections.map((section) => (
        <MarqueeSection key={section.id} section={section} />
      ))}
    </div>
  );
}

// 🎡 Sub-component for each scrolling row
function MarqueeSection({ section }) {
  const [isHovered, setIsHovered] = useState(false);
  const filteredProjects = projectList.filter(p => p.category === section.id);

  if (filteredProjects.length === 0) return null;

  // 🧠 THE FIX: If a section is short (like OBS), we repeat it many times 
  // so there is NEVER a gap on screen.

  const repeatCount = section.size === 'small' ? 8 : section.size === 'medium' ? 4 : 2;
  const displayProjects = Array(repeatCount).fill(filteredProjects).flat();

  return (
    <div className="project-section">
      <h2 className="section-header">{section.title}</h2>
      <div 
        className="marquee-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="marquee-content"
          animate={{
            x: isHovered ? 0 : ["0%", "-50%"], // Only move when NOT hovered
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20, // Adjust speed here
              ease: "linear",
            },
          }}
          
          // If we pause, we don't want it to "snap" back to 0, 
          // but for now, this is the most stable Framer approach.
          style={{ display: 'flex', width: 'max-content' }}
        >
          {displayProjects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="card-image-wrapper">
                <img src={project.img} alt={project.title} className="card-image" />
              </div>
              <div className="card-content">
                <h3 className="card-title">{project.title}</h3>
                <p className="card-subtitle">{project.subtitle}</p>
                <div className="card-links">
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live</a>}
                  {project.git && <a href={project.git} target="_blank" rel="noreferrer">Git</a>}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}