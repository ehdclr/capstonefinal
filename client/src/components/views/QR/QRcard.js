import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getIdcard } from "../../../_actions/user_action";
import "../QR/qrGen.css";
import QRgen from "../Modal/QRgen/QRgen";

function QRcard() {
  const [QrgenOpen, setQrgenOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // useEffect(() => {
  //   axios.get('/api/users/idcard')
  //     .then(response => {
  //       console.log(response);
  //       setImageUrl(response.data.data.images);
  //       setName(response.data.data.name);
  //       setId("******-*******");
  //       setAge(response.data.data.age);
  //       setAddress(response.data.data.address);
  //     });
  // }, []);
  
  dispatch(getIdcard()).then((response) => {
    if (response.payload.success == true) {
      setImageUrl(response.payload.data.images);
      setName(response.payload.data.name);
      setId("******-*******");
      setAge(response.payload.data.age);
      setAddress(response.payload.data.address);
    }
    });

  const clickMe = () => {
    setQrgenOpen(true);
  };
  return (
    <div className="app">
      {QrgenOpen && <QRgen setOpenModal = {setQrgenOpen} />}
      <div className="headerQr">
        <h1>ID card</h1>
      </div>
      <hr className="hr" />
      <div className="main1">
        <div className="formContainer">
          <div className="cardImg">
            <img className="img" src={imageUrl} />
          </div>
          <div className="idcardContent">
            <div className="name">이름 : {name}</div>
            <div className="id">주민번호 : {id}</div>
            <div className="age">나이 : {age}</div>
            <div className="address">주소 : {address}</div>
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
          성인인증 QR생성
        </button>
      </div>
    </div>
  );
}

export default QRcard;
