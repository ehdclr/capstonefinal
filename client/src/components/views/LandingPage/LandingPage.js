import React from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
import "../LandingPage/LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// import {} from "react-pro-sidebar/dist/css/styles.css";

<script
  src="https://kit.fontawesome.com/2be04788dd.js"
  crossorigin="anonymous"
></script>;

function LandingPage() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   axios.get("/api/hello").then((response) => console.log(response.data));
  // }, []);
  return (
    <div>
      <section id="home">
        <div className="home__container">
          <img src={"../../img/JBU.png"} alt="" className="home__avatar" />
          <h1 className="home__title">Chou_Chou</h1>
          <h3 className="home__description">Frontend Developer</h3>
          <button className="home__contact">Contact me</button>
        </div>
      </section>

      <section id="testimonials" className="section">
        <div className="section__container">
          <h1>Q&A</h1>
          <h3>BMD가 추구하는 방향</h3>

          <div className="testimonials">
            <div className="testimonial">
              <img
                src={"../../img/cd.png"}
                alt=""
                className="testimonial__avatar"
              />
              <div className="testimonial__speech-bubble">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus neque quos vitae mollitia dolore, deserunt aut et
                  ab distinctio sed doloremque beatae fuga saepe aliquid sit
                  odit animi ipsum eum.
                </p>
                <p className="name">
                  <a href="www.naver.com">이현종</a> /Joongbu
                </p>
              </div>
            </div>
          </div>

          <div className="testimonials">
            <div className="testimonial">
              <div className="testimonial__speech-bubble">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus neque quos vitae mollitia dolore, deserunt aut et
                  ab distinctio sed doloremque beatae fuga saepe aliquid sit
                  odit animi ipsum eum.
                </p>
                <p className="name">
                  <a href="www.naver.com">최유진</a> /Joongbu
                </p>
              </div>
              <img
                src={"../../img/cd.png"}
                alt=""
                className="testimonial__avatar"
              />
            </div>
          </div>

          <div className="testimonials">
            <div className="testimonial">
              <img
                src={"../../img/cd.png"}
                alt=""
                className="testimonial__avatar"
              />
              <div className="testimonial__speech-bubble">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus neque quos vitae mollitia dolore, deserunt aut et
                  ab distinctio sed doloremque beatae fuga saepe aliquid sit
                  odit animi ipsum eum.
                </p>
                <p className="name">
                  <a href="www.naver.com">이강봉</a> /Joongbu
                </p>
              </div>
            </div>
          </div>

          <div className="testimonials">
            <div className="testimonial">
              <div className="testimonial__speech-bubble">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus neque quos vitae mollitia dolore, deserunt aut et
                  ab distinctio sed doloremque beatae fuga saepe aliquid sit
                  odit animi ipsum eum.
                </p>
                <p className="name">
                  <a href="www.naver.com">박주형</a> /Joongbu
                </p>
              </div>
              <img
                src={"../../img/cd.png"}
                alt=""
                className="testimonial__avatar"
              />
            </div>
          </div>

          <div className="testimonials">
            <div className="testimonial">
              <img
                src={"../../img/cd.png"}
                alt=""
                className="testimonial__avatar"
              />
              <div className="testimonial__speech-bubble">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus neque quos vitae mollitia dolore, deserunt aut et
                  ab distinctio sed doloremque beatae fuga saepe aliquid sit
                  odit animi ipsum eum.
                </p>
                <p className="name">
                  <a href="www.naver.com">장예진</a> /Joongbu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section">
        <div className="section__container">
          <h1>My Work</h1>
          <h3>Projects</h3>
          <div className="work__categories">
            <button className="category__btn " data-filter="*">
              All <span className="category__count">8</span>
            </button>
            <button className="category__btn" data-filter="front-end">
              Front-end <span className="category__count">3</span>
            </button>
            <button className="category__btn" data-filter="back-end">
              Back-end <span className="category__count">3</span>
            </button>
            <button className="category__btn" data-filter="mobile">
              Mobile <span className="category__count">2</span>
            </button>
          </div>

          <div className="work__projects">
            <a
              href="www.naver.com"
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              <img src={"../../img/g.png"} alt="" className="project__img" />
              <div className="project__description">
                <h3>Youtube Site</h3>
                <span>Clone coding</span>
              </div>
            </a>
            <a
              href="www.naver.com"
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              {" "}
              <img src={"../../img/g.png"} alt="" className="project__img" />
              <div className="project__description">
                <h3>Youtube Site</h3>
                <span>Clone coding</span>
              </div>
            </a>
            <a
              href="www.naver.com"
              className="project"
              data-type="front-end"
              target="blank"
              datatype="front-end"
            >
              <img src={"../../img/g.png"} alt="" className="project__img" />
              <div className="project__description">
                <h3>Youtube Site</h3>
                <span>Clone coding</span>
              </div>
            </a>
            <a
              href="www.naver.com"
              className="project"
              data-type="back-end"
              target="blank"
              datatype="back-end"
            >
              <img src={"../../img/g.png"} alt="" className="project__img" />
              <div className="project__description">
                <h3>Youtube Site</h3>
                <span>Clone coding</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}

      <section id="contact" className="section">
        <h1 className="contact__title">BMD</h1>
        <h2 className="contact__email">znfqbx@naver.com</h2>
        <div className="contact__links">
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faHeart} />
          </a>
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </a>
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </a>
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </a>
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faGithub} />
          </a>
          <a href="www.naver.com">
            <FontAwesomeIcon className="heart" icon={faHeart} />
          </a>
        </div>
        <p className="contact__rights">2022 Chou_Chou - All rights reserved</p>
      </section>
    </div>
  );
}

export default LandingPage;
