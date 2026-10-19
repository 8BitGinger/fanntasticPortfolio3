import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion'; // ← add this
import CassetteSelector from './components/CassetteSelector';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import NavPageButtons from './components/NavPageButtons';
import About from './pages/About';
import Projects from './pages/Projects';
import MiniApps from './pages/MiniApps';
import Contact from './pages/Contact';
import MiniPlayer from './components/MiniPlayer';
import { vibeManager } from './Utils/VibeManager';
import './assets/styles/mini-player.css';
import './App.css';

function App() {
  const [theme, setTheme] = useState('default');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' && !document.documentElement.dataset.theme) {
      vibeManager.play('/music/jazz.mp3');
      setTheme('jazz');
      document.documentElement.dataset.theme = 'jazz';
      window.dispatchEvent(
        new CustomEvent('theme-switch', { detail: { theme: 'jazz' } })
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleThemeSwitch = (e) => {
      const { theme: newTheme } = e.detail;
      setTheme(newTheme);
      document.documentElement.dataset.theme = newTheme;
    };

    window.addEventListener('theme-switch', handleThemeSwitch);
    return () => window.removeEventListener('theme-switch', handleThemeSwitch);
  }, []);

  return (
    <div className="app-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/videos/retro-bgEdit.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      <Navbar />
      <ScrollToTop />

      <div className="page-content">
        {/* 
          AnimatePresence needs:
          - location.key as the key so it detects route changes
          - mode="wait" so the exit animation finishes before the next page enters
        */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.key}>
            <Route path="/" element={<CassetteSelector />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/mini-apps" element={<MiniApps theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
          </Routes>
        </AnimatePresence>
      </div>

      <MiniPlayer theme={theme} />
      <NavPageButtons theme={theme} />
    </div>
  );
}

export default App;