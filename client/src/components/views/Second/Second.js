import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { password2User } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "antd/dist/antd.min.css";

function Second() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [Email, setEmail] = useState("");
  const [SecondPassword, setSecondPassword] = useState("");

  // const onEmailHandler = (event) => {
  //   setEmail(event.currentTarget.value);
  // };

  const onSecondPasswordHandler = (event) => {
    setSecondPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      secondpassword: SecondPassword,
    };

    dispatch(password2User(body)).then((response) => {
      if (response.payload.secPasswordsuccess) {
        navigate("/qr_generator");
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
        backgroundImage: "url(img/gh.jpg) ",
        backgroundSize: "cover",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <div className="Logo">
          2차 비밀번호
          <hr />
        </div>

        <label className="label">Second Password</label>
        <input
          className="input_box"
          type="password"
          value={SecondPassword}
          onChange={onSecondPasswordHandler}
        />
        <br />
        <Button id="button" className="input_box" htmlType="submit">
          인증
        </Button>
        <br />
        <br />
      </form>
    </div>
  );
}

export default Second;
