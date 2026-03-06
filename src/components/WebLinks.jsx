import React from 'react'
import { BsTwitterX } from "react-icons/bs";
import { VscGithub } from "react-icons/vsc";
import { FaLinkedin } from "react-icons/fa6";
import '../assets/styles/weblinks.css'


const WebLinks = ({ theme }) => {
  return (
    <aside className={`web-links web-links--${theme}`}>
      
      <ul className={`web-links-list web-links-list--${theme}`}>
                <li>
          <a href="https://x.com/the8BitGinger" target="_blank" rel="noopener noreferrer">
            <BsTwitterX size={28} />
          </a>
        </li>
        <li>
          <a href="https://github.com/8BitGinger" target="_blank" rel="noopener noreferrer">
            <VscGithub size={28} />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/ryanfanntastic/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={28} />
          </a>
        </li>


      </ul>
    </aside>
  )
}

export default WebLinks