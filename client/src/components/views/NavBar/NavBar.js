import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./Sections/Navbar.css";
const Logo = require("../../../images/Logo2.png");

function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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
        <Button
          id="abc"
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <MenuOutlined type="align-right" />
        </Button>
        <Drawer
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
