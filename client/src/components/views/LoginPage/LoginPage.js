import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { Link, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../LoginPage/LoginPage.css";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        navigate("/");
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",

        backgroundSize: "cover",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <div className="Logo">
          <h1>Welcome</h1>
          <hr className="hr" />
        </div>
        <br />
        <br />
        <div
          className="form"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <label className="label"> Email</label>
          <input
            id="in"
            className="input_box"
            placeholder="user@naver.com"
            type="email"
            value={Email}
            onChange={onEmailHandler}
          ></input>
          <label className="label">Password</label>
          <input
            id="in"
            className="input_box"
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          />
          <br />
          <button id="button1" className="input_box" htmlType="submit">
            Login
          </button>
          <br />
          <br />
          <Link className="link" to="/register">
            Register
          </Link>
          <FontAwesomeIcon className="heart" icon={faHeart} />
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
