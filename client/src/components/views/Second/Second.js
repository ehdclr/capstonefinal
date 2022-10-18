import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { password2User } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import "../Second/Second.css";

function Second() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SecondPassword, setSecondPassword] = useState("");

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

        backgroundSize: "cover",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <div className="Logo">
          2-Step Verification
          <hr className="hr" />
        </div>

        <br />
        <br />
        <div
          className="form"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label className="label">Second Password</label>
          <input
            className="input_box"
            type="password"
            value={SecondPassword}
            onChange={onSecondPasswordHandler}
          />
          <br />
          <button id="button" className="input_box" htmlType="submit">
            Submit
          </button>
          <br />
          <br />
        </div>
      </form>
    </div>
  );
}

export default Second;
