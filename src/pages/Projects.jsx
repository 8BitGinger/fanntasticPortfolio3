import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import projectList from '../data/projectList';
import '../assets/styles/projects.css';
import { getCategoryIcon, categoryLabels } from '../data/projectList';
import SEO from '../components/SEO';
import ProjectModal from '../components/ProjectModal';

const DRAG_THRESHOLD = 80;
const INSERT_DELAY_MS = 380;

function getShortestOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState(null);
  const [insertingTitle, setInsertingTitle] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = useMemo(() => {
    const seen = new Set(projectList.map((p) => p.category));
    return ['all', ...Array.from(seen)];
  }, []);

  const displayProjects = useMemo(() => {
    if (activeCategory === 'all') return projectList;
    return projectList.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const count = displayProjects.length;

  const goTo = (index) => {
    setActiveIndex(((index % count) + count) % count);
  };
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const insertTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(insertTimeoutRef.current);
  }, []);

  const handleOpenModal = (project) => {
    if (insertingTitle) return;
    setInsertingTitle(project.title);
    insertTimeoutRef.current = setTimeout(() => {
      setModalProject(project);
      setInsertingTitle(null);
    }, INSERT_DELAY_MS);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalProject) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, count, modalProject]);

  return (
    <div className="projects-wrapper">
      <SEO
        title="Projects | 8BitGinger - Web Apps, OBS Tools & Games"
        description="A showcase of full-stack web apps, custom OBS streaming tools, TTRPG systems, and AI-assisted projects built by Ryan Fann."
        path="/projects"
      />
      <h1 className="projects-page-title">Project Showcase</h1>

      <div className="category-filters" role="tablist" aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            className={`category-filter-btn ${
              activeCategory === category ? 'is-active' : ''
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category !== 'all' && getCategoryIcon(category)}
            <span>
              {category === 'all' ? 'All' : categoryLabels[category] || category}
            </span>
          </button>
        ))}
      </div>

      {count > 0 && (
        <>
          <div className="cassette-rack">
            <button
              type="button"
              className="rack-control rack-control--prev"
              onClick={goPrev}
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="cassette-track">
              {displayProjects.map((project, index) => {
                const offset = getShortestOffset(index, activeIndex, count);

                // Every card stays in the DOM (not just the ones near the
                // center) so prerendered/crawled HTML includes every
                // project, not just whichever handful are near the active
                // index. Far-off cards are already invisible via opacity
                // below, so this doesn't change what's on screen.
                const isActive = offset === 0;
                const absOffset = Math.abs(offset);
                const scale = isActive ? 1 : absOffset === 1 ? 0.78 : absOffset === 2 ? 0.6 : 0.48;
                const opacity = isActive ? 1 : absOffset === 1 ? 0.85 : absOffset === 2 ? 0.45 : 0;
                const stepX = isMobile ? 160 : 230;
                const rotateY = Math.max(-54, Math.min(54, offset * (isMobile ? -16 : -20)));
                const x = offset * stepX;
                const zIndex = 10 - absOffset;
                const isInserting = insertingTitle === project.title;

                return (
                  <motion.div
                    key={project.title}
                    className={`tape-card ${isActive ? 'tape-card--active' : ''}`}
                    style={{ zIndex, pointerEvents: opacity === 0 ? 'none' : 'auto' }}
                    animate={
                      isInserting
                        ? { x, y: 140, scale: 0.4, opacity: 0, rotateX: -55, rotateY: 0 }
                        : { x, y: 0, scale, opacity, rotateY, rotateX: 0 }
                    }
                    initial={false}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    drag={isActive && !insertingTitle ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -DRAG_THRESHOLD) goNext();
                      else if (info.offset.x > DRAG_THRESHOLD) goPrev();
                    }}
                    onClick={() => (isActive ? handleOpenModal(project) : goTo(index))}
                    aria-hidden={!isActive}
                  >
                    <div className="tape-card__label">
                      <span className="tape-card__category">
                        {getCategoryIcon(project.category)}
                        {categoryLabels[project.category] || project.category}
                      </span>
                    </div>
                    <div className="tape-card__window">
                      <img
                        loading="lazy"
                        src={project.img}
                        alt={project.title}
                        className="tape-card__img"
                        draggable={false}
                      />
                    </div>
                    <div className="tape-card__reels">
                      <span className="tape-card__reel" />
                      <span className="tape-card__reel" />
                    </div>
                    <div className="tape-card__title">{project.title}</div>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              className="rack-control rack-control--next"
              onClick={goNext}
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="tape-counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </div>
          <p className="tape-hint">Click the centered tape for details</p>
        </>
      )}

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
}
