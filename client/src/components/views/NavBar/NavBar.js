import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import "./Sections/Navbar.css";
const Logo = require("../../../images/Logo2.png");

function NavBar() {
  return (
    <nav
      className="menu"
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
      }}
    >
      <div className="menu__logo">
        <a href="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ height: "60px", width: "60px", marginTop: "-15px" }}
          />
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu />
        </div>
        <div className="menu_rigth">
          <RightMenu />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
