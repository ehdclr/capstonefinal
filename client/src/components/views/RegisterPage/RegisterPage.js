import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

import { Link, useNavigate } from "react-router-dom";
import "../RegisterPage/RegisterPage.css";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [SecondPassword, setSecondPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSecondPasswordHandler = (event) => {
    setSecondPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (Name === "") {
      return alert("이름을 입력해주세요.");
    }
    if (Password === "") {
      return alert("비밀번호를 입력해주세요.");
    }
    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
      secondpassword: SecondPassword,
    };

    dispatch(registerUser(body)).then((response, err) => {
      if (response.payload.success === true) {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        if (response.payload.error.code == 11000)
          alert("이미 존재하는 회원입니다.");
        if (response.payload.error.name == "IndyError")
          alert("이미 지갑이 존재합니다.")
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
          <h1>Register</h1>
          <hr className="hr" />
        </div>
        <div
          className="form"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <label className="label">Email</label>
          <input
            id="in"
            className="input_box"
            type="email"
            value={Email}
            onChange={onEmailHandler}
          />

          <label className="label">Name</label>
          <input
            id="in"
            className="input_box"
            type="text"
            value={Name}
            onChange={onNameHandler}
          />

          <label className="label">Password</label>
          <input
            id="in"
            className="input_box"
            type="password"
            value={Password}
            minLength="5"
            onChange={onPasswordHandler}
          />

          <label className="label">Confirm Password</label>
          <input
            id="in"
            className="input_box"
            type="password"
            value={ConfirmPassword}
            minLength="5"
            onChange={onConfirmPasswordHandler}
          />

          <label className="label">Second Password</label>
          <input
            id="in"
            className="input_box"
            type="password"
            value={SecondPassword}
            onChange={onSecondPasswordHandler}
          />
          <br />
          <button id="button1" className="input_box" htmlType="submit">
            Register
          </button>
          <Link className="link" to="/">
            Home
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
