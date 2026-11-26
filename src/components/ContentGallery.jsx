import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, Play, Hammer, Lightbulb, Wrench } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import contentList from '../data/contentList';
import InlineVideo from './InlineVideo';
import '../assets/styles/contentGallery.css';

const TYPE_META = {
  video: { label: 'Video', icon: <Film size={14} /> },
  youtube: { label: 'YouTube', icon: <FaYoutube size={14} /> },
  image: { label: 'Artwork', icon: <ImageIcon size={14} /> },
};

const youtubeEmbedUrl = ({ videoId, playlistId }) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0${
    playlistId ? `&list=${playlistId}` : ''
  }`;

/* The large framed piece currently on display. Only this one loads a player. */
function Exhibit({ item }) {
  if (item.type === 'youtube') {
    return (
      <iframe
        className="gallery-stage__media"
        src={youtubeEmbedUrl(item)}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }
  if (item.type === 'video') {
    return <InlineVideo className="gallery-stage__media" src={item.src} controls />;
  }
  return <img className="gallery-stage__media" src={item.src} alt={item.title} />;
}

function Thumbnail({ item }) {
  if (item.type === 'video') {
    // #t=0.1 makes mobile browsers show a still frame instead of a blank box
    return <video src={`${item.src}#t=0.1`} muted playsInline preload="metadata" />;
  }
  const src =
    item.type === 'youtube'
      ? `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`
      : item.src;
  return <img src={src} alt="" loading="lazy" />;
}

const ContentGallery = () => {
  const [activeId, setActiveId] = useState(contentList[0].id);
  const activeIndex = Math.max(
    0,
    contentList.findIndex((item) => item.id === activeId)
  );
  const active = contentList[activeIndex];

  return (
    <div className="gallery">
      <AnimatePresence mode="wait">
        <motion.figure
          key={active.id}
          className="gallery-stage"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          <div className="gallery-stage__frame">
            <Exhibit item={active} />
          </div>
          <figcaption className="gallery-placard">
            <span className="gallery-placard__type">
              {TYPE_META[active.type].icon}
              {TYPE_META[active.type].label}
            </span>
            <h2 className="gallery-placard__title">{active.title}</h2>
            <span className="gallery-placard__count">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(contentList.length).padStart(2, '0')}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <div className="gallery-wall">
        {contentList.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`gallery-thumb ${item.id === active.id ? 'is-active' : ''}`}
            aria-pressed={item.id === active.id}
            onClick={() => setActiveId(item.id)}
          >
            <span className="gallery-thumb__art">
              <Thumbnail item={item} />
              {item.type !== 'image' && (
                <span className="gallery-thumb__play">
                  <Play size={18} fill="currentColor" />
                </span>
              )}
            </span>
            <span className="gallery-thumb__title">{item.title}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={active.id}
        className="gallery-notes"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <section className="gallery-note">
          <h3>
            <Hammer size={16} /> The Process
          </h3>
          <p>{active.process}</p>
        </section>
        <section className="gallery-note">
          <h3>
            <Lightbulb size={16} /> The Purpose
          </h3>
          <p>{active.purpose}</p>
        </section>
        <section className="gallery-note">
          <h3>
            <Wrench size={16} /> The Toolkit
          </h3>
          <ul>
            {active.toolkit.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </section>
      </motion.div>
    </div>
  );
};

export default ContentGallery;
