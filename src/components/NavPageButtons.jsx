import { Link, useLocation } from 'react-router-dom';
import { FaFastBackward, FaFastForward } from 'react-icons/fa';
import '../assets/styles/navPageButtons.css';

const PAGE_ORDER = ['/', '/about', '/projects', '/mini-apps', '/contact'];

const NavPageButtons = ({ theme }) => {
  const location = useLocation();
  const currentIndex = PAGE_ORDER.indexOf(location.pathname);

  // Hidden on the home/selector page (and any unrecognized route).
  if (currentIndex <= 0) return null;

  const prevLink = PAGE_ORDER[(currentIndex - 1 + PAGE_ORDER.length) % PAGE_ORDER.length];
  const nextLink = PAGE_ORDER[(currentIndex + 1) % PAGE_ORDER.length];

  return (
    <aside className={`nav-page-buttons nav-page-buttons--${theme}`}>
      <Link to={prevLink} className="nav-page-btn" aria-label="Previous page">
        <FaFastBackward />
      </Link>
      <Link to={nextLink} className="nav-page-btn" aria-label="Next page">
        <FaFastForward />
      </Link>
    </aside>
  );
};

export default NavPageButtons;
