import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../QR/qrGen.css";

function QRcard() {
  const navigate = useNavigate();

  const clickMe = () => {
    navigate("/qr_generator");
  };
  return (
    <div className="app">
      <div className="headerQr">ID card</div>
      <hr className="hr" />
      <div className="main1">
        <div className="formContainer">
          <div className="cardImg">
            /
            <img className="img" src="dsfdsf" />
          </div>
          <div className="idcardContent">
            <div className="name">OOO</div>
            <div className="id">000000-000000</div>
            <div className="age">20</div>
            <div className="address">서울시 -------------------</div>
          </div>
        </div>
      </div>
      <div className="main3">
        <button
          id="input_button"
          className="input_button"
          htmlType="submit"
          onClick={clickMe}
        >
          QR
        </button>
      </div>
    </div>
  );
}

export default QRcard;
