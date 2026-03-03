import { Routes, Route, useLocation } from 'react-router-dom'; // <-- 1. Import useLocation
import { useState, useRef, useEffect } from 'react';
import CassetteSelector from './components/CassetteSelector';
import Navbar from './components/Navbar';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [theme, setTheme] = useState('default'); // Start blank!
  const audioRef = useRef(null);
  const location = useLocation(); // <-- 2. Get the current URL path

  // 3. The "Default Vibe" Setup (Now location-aware!)
  useEffect(() => {
    // ONLY apply the default if they are NOT on the home page AND haven't picked a theme
    if (location.pathname !== '/' && !document.documentElement.dataset.theme) {
      setTheme('jazz');
      document.documentElement.dataset.theme = 'jazz';

      if (audioRef.current) {
        audioRef.current.src = '/music/jazz.mp3';
        audioRef.current.volume = 0.2;
        // Note: We don't force .play() here because browsers block it on direct page loads.
        // The track is loaded and ready for whenever you add a play/pause toggle to your navbar!
      }
    }
  }, [location.pathname]); // Re-run this check whenever the URL changes

  // 4. The Cassette Click listener (remains unchanged)
  useEffect(() => {
    const handleThemeSwitch = (e) => {
      const { theme: newTheme, track, volume } = e.detail;
      setTheme(newTheme);
      document.documentElement.dataset.theme = newTheme;

      if (audioRef.current) {
        audioRef.current.src = track;
        audioRef.current.volume = volume || 0.2;
        audioRef.current
          .play()
          .catch((err) => console.log('Audio play blocked:', err));
      }
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
      <audio
        ref={audioRef}
        loop
        preload="none"
        controls={false}
        playsInline
      ></audio>

      <Navbar />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<CassetteSelector />} />

          {/* Pass the theme state into the About component */}
          <Route path="/about" element={<About theme={theme} />} />

          <Route path="/projects" element={<Projects theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
        </Routes>
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
