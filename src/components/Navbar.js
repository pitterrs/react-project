import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { Img } from "react-image";
import jdlogo from "../images/jdlogo.svg";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar-aux">
        <Link to="/" className="navbar-logo-aux" onClick={closeMobileMenu}>
          <Img src={jdlogo} />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <FontAwesomeIcon
            icon={click ? faTimes : faBars}
            style={{ color: "#367c2b" }}
          />
        </div>
        <ul className={click ? "nav-menu-aux active" : "nav-menu-aux"}>
          <li className="nav-item-aux">
            <Link to="/" className="nav-links-aux" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item-aux">
            <Link to="/schedules" className="nav-links-aux" >Schedules Lines</Link>
          </li>
          <li className="nav-item-aux">
            <Link
              to="/help"
              className="nav-links-aux"
              onClick={closeMobileMenu}
            >
              Help
            </Link>
          </li>
          <li className="nav-item-aux">
            <Link
              to="/contact-us"
              className="nav-links-aux"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
