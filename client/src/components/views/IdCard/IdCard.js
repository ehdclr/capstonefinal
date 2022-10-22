import React, { useState, useRef } from "react";

import { useDispatch } from "react-redux";
import { idUser } from "../../../_actions/user_action";
import { Link, useNavigate } from "react-router-dom";
import "../IdCard/IdCard.css";
import Test from "../Test/Test";
import Loading from "../Loading/Loading";
const people = require("../../../images/profile.jpg");

const IdCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [Id, setId] = useState("");
  const [Age, setAge] = useState("");
  const [Address, setAddress] = useState("");
  const [Images, setImages] = useState("");
  const [loading, setLoading] = useState(false);

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };

  const onAgeHandler = (event) => {
    setAge(event.currentTarget.value);
  };

  const onAddressHandler = (event) => {
    setAddress(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    let body = {
      name: Name,
      id: Id,
      address: Address,
      age: Age,
      images: Images,
    };

    dispatch(idUser(body)).then((response) => {
      if (response.payload.success) {
        alert("민증 등록");
        navigate("/second");
      } if(response.payload.success===false) {
        alert("민증 등록 실패");
        setLoading(false);
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
      }}
    >
      {loading && <Loading />}
      <form
        className="Img"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0",
        }}
        onSubmit={onSubmitHandler}
      >
        <div className="Logo">
          <h1>Idcard</h1>
          <hr className="hr" />
        </div>
        <br />
        <br />
        <div
          className="form"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <div className="imgupload">
            <Test fileToParents={updateImages}></Test>
          </div>
          <label className="label"> Name</label>
          <input
            id="in"
            className="input_box"
            //placeholder="user@naver.com"
            type="text"
            value={Name}
            onChange={onNameHandler}
          ></input>
          {/* <input className='input_box' type="email" value={Email} onChange={onEmailHandler}   /> */}
          <label className="label">Resident Registration Number</label>
          <input
            id="in"
            className="input_box"
            type="text"
            value={Id}
            onChange={onIdHandler}
          />
          <label className="label">Age</label>
          <input
            id="in"
            className="input_box"
            type="number"
            value={Age}
            onChange={onAgeHandler}
          />
          <label className="label">Address</label>
          <input
            id="in"
            className="input_box"
            type="text"
            value={Address}
            onChange={onAddressHandler}
          />

          <button id="button" type="submit">
            Submit
          </button>
          {/* <Button id="button" htmlType="submit">
          Login
        </Button>
        <br /> */}

          <Link className="link" to="/">
            Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default IdCard;
