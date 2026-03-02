import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHamburger, FaTimes } from 'react-icons/fa'; 
import '../assets/styles/navbar.css'; 
import navbarIcon from '../assets/pictures/navbarIcon.png'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // if (location.pathname === '/') return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = () => {
    if (!document.documentElement.dataset.theme) {
      const event = new CustomEvent('theme-switch', {
        detail: { theme: 'jazz', track: '/music/jazz.mp3', volume: 0.2 }
      });
      window.dispatchEvent(event);
    }
    setIsOpen(false); // Close menu on click
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}> 
          <img src={navbarIcon} alt="8BitGinger Logo" className="logo-image" />
          <span className="nav-title">8BitGinger</span>
        </Link>
      </div>

      {/* 🍔 Hamburger Icon Toggle */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaHamburger />}
      </div>

      <ul className={isOpen ? "nav-links active" : "nav-links"}>
        <li>
          <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">About</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">Projects</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={handleNavClick} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-text">Contact</span>
            <div className="audio-bar"></div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}