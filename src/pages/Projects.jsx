import React from 'react';
import projectList from '../data/projectList'; 
import '../assets/styles/projects.css';
import { getCategoryIcon } from '../data/projectList';


export default function Projects() {
  // Triple the list to ensure it's long enough to never show a gap
  const displayProjects = [...projectList, ...projectList, ...projectList];

  return (
    <div className="projects-wrapper">
      <h1 className="projects-page-title">Portfolio</h1>
      
      <div className="marquee-container">
        <div className="marquee-content">
          {displayProjects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="card-image-wrapper">
                <img 
                  loading='lazy' 
                  src={project.img} 
                  alt={project.title} 
                  className="card-image" 
                />
              </div>
<div className="card-content">
  <div className="card-header">
    <h3 className="card-title">{project.title}</h3>
    <div className="category-icon-pill" title={project.category}>
      {getCategoryIcon(project.category)}
    </div>
  </div>
  
  <p className="card-subtitle">{project.subtitle}</p>
  
  <div className="card-links">
    {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live</a>}
    {project.git && <a href={project.git} target="_blank" rel="noreferrer">Git</a>}
  </div>
</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}