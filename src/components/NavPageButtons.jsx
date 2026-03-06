import { Link } from "react-router-dom"
import { FaFastBackward } from "react-icons/fa";
import { FaFastForward } from "react-icons/fa";


const NavPageButtons = ({ theme, btn1Link, btn2Link }) => {
  return (
    <aside className={`weblinks-container float-btn-box weblinks-container--${theme}`}>
        <div className="btnBox">        
            <Link to={btn1Link} className={`link link--${theme}`}><FaFastBackward /></Link>
       <span className="small-text"> Rewind Page </span>
       </div>
        <div className="btnBox">
            <Link to={btn2Link} className={`link link--${theme}`}><FaFastForward /></Link>
       <span className="small-text">Fast Forward Page</span>
        </div>
    </aside>
  )
}

export default NavPageButtons;

