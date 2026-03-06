import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CassetteSelector from './components/CassetteSelector';
import Navbar from './components/Navbar';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import MiniPlayer from './components/MiniPlayer'; // ← add this
import './assets/styles/mini-player.css';          // ← adjust path to match your styles folder

function App() {
  const [theme, setTheme] = useState('default');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' && !document.documentElement.dataset.theme) {
      setTheme('jazz');
      document.documentElement.dataset.theme = 'jazz';
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

      <div className="page-content">
        <Routes>
          <Route path="/" element={<CassetteSelector />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/projects" element={<Projects theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
        </Routes>
      </div>

      {/* Floats above all pages, hidden until a track is selected */}
      <MiniPlayer theme={theme} />
    </div>
  );
}

export default App;