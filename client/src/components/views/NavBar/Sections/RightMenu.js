/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Sections/Navbar.css";

function RightMenu() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
  };

  const onSignHandler = () => {
    // axios.post(`/api/users/login`).then((response) => {
    navigate("/login");
    // });
  };

  const onRegisterHandler = () => {
    // axios.post(`/api/users/register`).then((response) => {

    navigate("/register");
    // });
  };

  const clickMe = () => {
    navigate("/idcard");
  };

  const clickSecond = () => {
    navigate("/second");
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <ul className="navbar__menu">
        <li button className="navbar__menu__item" onClick={onSignHandler}>
          Login
        </li>
        <li button className="navbar__menu__item" onClick={onRegisterHandler}>
          Sign Up
        </li>
      </ul>
    );
  } else {
    return (
      <ul className="navbar__menu">
        <li className="navbar__menu__item" onClick={clickSecond}>
          Wallet
        </li>
        <li className="navbar__menu__item" onClick={clickMe}>
          Register
        </li>
        <li button className="navbar__menu__item" onClick={onClickHandler}>
          Logout
        </li>
      </ul>
    );
  }
}

export default RightMenu;
