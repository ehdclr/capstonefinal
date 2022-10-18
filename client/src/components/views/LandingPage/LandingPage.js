import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../LandingPage/LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "react-pro-sidebar/dist/css/styles.css";
const Logo = require("../../../images/Logo2.png");
const s3image = require("../../../images/s3.png");
const ec2image = require("../../../images/ec2.png");
const reactimage = require("../../../images/react.png");
const mongoimage = require("../../../images/mongo.png");

<script
  src="https://kit.fontawesome.com/2be04788dd.js"
  crossorigin="anonymous"
></script>;

function LandingPage() {
  const navigate = useNavigate();

  const clickMe = () => {
    navigate("/second");
  };
  return (
    <div>
      <section id="home">
        <div className="home__container">
          <img src={Logo} alt="" className="home__avatar" />
          <h1 className="home__title">Decentralized Identifier</h1>
          {/* <h3 className="home__description">최종장박봉</h3> */}
          <button className="home__contact" onClick={clickMe}>
            Register
          </button>
        </div>
      </section>

      <section id="work" className="section">
        <div className="section__container">
          <h1 className="home__title">Tech Stack</h1>

          <div className="work__projects">
            <div
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              <img src={s3image} alt="" className="project__img" />
              <div className="project__description">
                <h3>Amazon S3</h3>
              </div>
            </div>
            <div
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              <img src={ec2image} alt="" className="project__img" />
              <div className="project__description">
                <h3>Amazon EC2</h3>
              </div>
            </div>
            <div
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              <img src={mongoimage} alt="" className="project__img" />
              <div className="project__description">
                <h3>Mongo DB</h3>
              </div>
            </div>
            <div
              className="project"
              data-type="back-end"
              target="blank"
              datatype="back-end"
            >
              <img src={reactimage} alt="" className="project__img" />
              <div className="project__description">
                <h3>React</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}

      <section id="contact" className="section">
        <h1 className="contact__title">BMD</h1>
        <div className="contact__links">
          <Link to="">
            <FontAwesomeIcon className="heart" icon={faHeart} />
          </Link>
          <Link to={{ pathname: "//github.com/ehdclr" }} target="_blank">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </Link>
          <Link to={{ pathname: "//github.com/yejin32" }} target="_blank">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </Link>
          <Link to={{ pathname: "" }} target="_blank">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </Link>
          <Link to={{ pathname: "//github.com/Joohy2" }} target="_blank">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </Link>
          <Link to={{ pathname: "//github.com/redb0ng" }} target="_blank">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </Link>
          <Link to="">
            <FontAwesomeIcon className="heart" icon={faHeart} />
          </Link>
        </div>
        <p className="contact__rights">2022 최종장박봉 - All rights reserved</p>
      </section>
    </div>
  );
}

export default LandingPage;
