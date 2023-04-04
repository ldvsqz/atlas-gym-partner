import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { MenuData } from './MenuData';
import { IconContext } from 'react-icons';
import * as  FaIcons from "react-icons/fa";
import * as  AiIcons from "react-icons/ai";
import './Menu.css';
import Logout from '../Logout/Logout';

function Menu() {

  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => setSidebar(!sidebar)


  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <div>
            <Link to="#" className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar} >
              <li className='navbar-toggle'>
                <Link to='#' className='menu-bars'>
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              {MenuData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Logout/>
          </nav>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Menu;