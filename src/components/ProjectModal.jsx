import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Github, Youtube } from 'lucide-react';
import { getCategoryIcon, categoryLabels } from '../data/projectList';

const panelTransition = { type: 'spring', stiffness: 220, damping: 24 };

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const techTags = project
    ? project.subtitle.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="project-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* LEFT PANEL — hinges open from the center seam */}
            <motion.div
              className="project-modal__media project-modal__panel project-modal__panel--left"
              initial={{ rotateY: -115, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -115, opacity: 0 }}
              transition={panelTransition}
            >
              <img src={project.img} alt={project.title} className="project-modal__img" />
              <span className="project-modal__category">
                {getCategoryIcon(project.category)}
                {categoryLabels[project.category] || project.category}
              </span>
            </motion.div>

            {/* RIGHT PANEL — hinges open a beat after the left, like a case cracking open */}
            <motion.div
              className="project-modal__body project-modal__panel project-modal__panel--right"
              initial={{ rotateY: 115, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 115, opacity: 0 }}
              transition={{ ...panelTransition, delay: 0.08 }}
            >
              <h2 className="project-modal__title">{project.title}</h2>

              <div className="project-modal__tags">
                {techTags.map((tag) => (
                  <span key={tag} className="project-modal__tag">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="project-modal__description">{project.description}</p>

              <div className="project-modal__links">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal__link-btn"
                    aria-label="Visit live site"
                    title="Live Site"
                  >
                    <Globe size={20} />
                  </a>
                )}
                {project.git && (
                  <a
                    href={project.git}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal__link-btn"
                    aria-label="View on GitHub"
                    title="GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.youtube && (
                  <a
                    href={project.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal__link-btn"
                    aria-label="Watch on YouTube"
                    title="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
