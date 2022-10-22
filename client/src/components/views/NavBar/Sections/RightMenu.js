/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const clickScanner = () => {
    navigate("/qr_scanner");
  };

  const onClickDrop = () => {
    function scrollIntoView(selector) {
      const scrollTo = document.querySelector(selector);
      scrollTo.scrollIntoView({ behavior: "smooth" });
    }
    const navbarMenu = document.querySelector(".navbarmenu");
    navbarMenu.addEventListener("click", (event) => {
      const target = event.target;
      const link = target.dataset.link;
      if (link == null) {
        return;
      }
      navbarMenu.classList.remove("open");
      scrollIntoView(link);
    });
    const navbarToggleBtn = document.querySelector(".navbartoggle-btn");
    navbarToggleBtn.addEventListener("click", () => {
      navbarMenu.classList.toggle("open");
    });

    const navbar = document.querySelector("#navbar");
    // const navbarHeight = navbar.getBoundingClientRect().height;
    // document.addEventListener('scroll', () => {
    //     console.log(window.scrollY);
    //     console.log(navbarHeight: ${navbarHeight});
    //     if(window.scrollY > navbarHeight){
    //         navbar.classList.add('navbar--dark');
    //     }else {
    //         navbar.classList.remove('navbar--dark')
    //     }
    // });
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
  } else if (user.userData && user.userData.isAdmin) {
    return (
      <ul className="navbar__menu">
        <li className="navbar__menu__item" onClick={clickScanner}>
          Scanner
        </li>
        <li button className="navbar__menu__item" onClick={onClickHandler}>
          Logout
        </li>
      </ul>
    );
  } else if (user.userData && user.userData.isAuth) {
    return (
      <ul className="navbar__menu">
        <li className="navbar__menu__item" onClick={clickSecond}>
          Wallet
        </li>
        <li className="navbar__menu__item" onClick={clickMe}>
          Issue
        </li>
        <li button className="navbar__menu__item" onClick={onClickHandler}>
          Logout
        </li>
      </ul>
    );
  }
  <FontAwesomeIcon
    type="button"
    className="navbar__toggle-btn"
    onClick={onClickDrop}
    icon={faHeart}
  />;
}

export default RightMenu;
