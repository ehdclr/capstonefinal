import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button } from "antd";
//import { Icon } from "@ant-design/icons";
import "./Sections/Navbar.css";
const Logo = require("../../../videos/logo.jpg");

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
            style={{ height: "60px", width: "60px", marginTop: "-25px" }}
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
