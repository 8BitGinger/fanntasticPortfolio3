import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CassetteSelector from './components/CassetteSelector';
import Navbar from './components/Navbar';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  const [theme, setTheme] = useState('default');
  const location = useLocation();

  // Apply a default visual theme if landing directly on a non-home route
  useEffect(() => {
    if (location.pathname !== '/' && !document.documentElement.dataset.theme) {
      setTheme('jazz');
      document.documentElement.dataset.theme = 'jazz';
      // ✅ No audio here — browsers block autoplay on direct page loads anyway
    }
  }, [location.pathname]);

  // Listen for cassette selection — theme/visual only, no audio
  useEffect(() => {
    const handleThemeSwitch = (e) => {
      const { theme: newTheme } = e.detail; // ✅ Only destructure theme — vibeManager owns audio
      setTheme(newTheme);
      document.documentElement.dataset.theme = newTheme;
    };

    window.addEventListener('theme-switch', handleThemeSwitch);
    return () => window.removeEventListener('theme-switch', handleThemeSwitch);
  }, []);

  return (
    <div className="app-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/videos/retro-bg.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
      {/* ✅ <audio> ref removed — vibeManager handles all playback */}

      <Navbar />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<CassetteSelector />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/projects" element={<Projects theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;