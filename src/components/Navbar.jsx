import { Link, NavLink, useLocation } from 'react-router-dom';
import '../assets/styles/navbar.css'; 
import navbarIcon from '../assets/pictures/navbarIcon.png'; 

export default function Navbar() {
  const location = useLocation();

  // Hide the navbar entirely if the user is on the Splash/Selector page


  // 🎷 The Stealth Jazz Trigger
  const handleNavClick = () => {
    // If the HTML tag does NOT have a theme yet, dispatch the Jazz event!
    if (!document.documentElement.dataset.theme) {
      const event = new CustomEvent('theme-switch', {
        detail: { theme: 'jazz', track: '/music/jazz.mp3', volume: 0.2 }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <nav className="navbar">
      {/* Left Side: Logo & Brand */}
      <div className="nav-brand">
        <Link to="/" className="nav-logo"> 
          <img src={navbarIcon} alt="8BitGinger Logo" className="logo-image" />
          <span className="nav-title">8BitGinger</span>
        </Link>
      </div>

      {/* Right Side: Navigation Links */}
      <ul className="nav-links">
        <li>
          {/* Added onClick={handleNavClick} */}
          <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">About</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
        <li>
          {/* Added onClick={handleNavClick} */}
          <NavLink to="/projects" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">Projects</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
        <li>
          {/* Added onClick={handleNavClick} */}
          <NavLink to="/contact" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">Contact</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}