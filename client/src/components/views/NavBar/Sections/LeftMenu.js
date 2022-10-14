import React from "react";
import { Menu } from "antd";

import { useNavigate } from "react-router-dom";

function LeftMenu(props) {
  const navigate = useNavigate();

  const clickMe = () => {
    navigate("/");
  };
  return (
    <ul className="navbar__menu">
      <li className="navbar__menu__item active" onClick={clickMe}>
        Home
      </li>
    </ul>
  );
}

export default LeftMenu;
