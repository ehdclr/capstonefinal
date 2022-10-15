import React, { useState, useRef } from "react";

import { useDispatch } from "react-redux";
import { idUser } from "../../../_actions/user_action";
import { Link, useNavigate } from "react-router-dom";
import "../IdCard/IdCard.css";
import Test from "../Test/Test";
const people = require("../../../images/profile.jpg");

const IdCard = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);

  const imgRef = useRef();

  const onChangeImage = () => {
    const reader = new FileReader();
    const file = imgRef.current.files[0];
    console.log(file);

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageUrl(reader.result);
      console.log("이미지주소", reader.result);
    };
  };

  // const onClickFileBtn = (e) => {
  //   imgRef.current.click();
  // };

  const [Name, setName] = useState("");
  const [Id, setId] = useState("");
  const [Age, setAge] = useState("");
  const [Address, setAddress] = useState("");
  const [Images, setImages] = useState("");

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
      } else {
        alert("민증 등록 실패");
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
          Idcard
          <hr className="hr" />
        </div>
        <br />
        <br />
        <div
          className="form"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          {/* <React.Fragment>
            <img
              src={imageUrl ? imageUrl : people}
              style={{ width: "200px", height: "200px" }}
            ></img>
            <input
              className="inputImg"
              type="file"
              ref={imgRef}
              onChange={onChangeImage}
            />
          </React.Fragment> */}
          <Test fileToParents={updateImages}></Test>
          <label className="label1"> 이름</label>
          <input
            className="input_box"
            //placeholder="user@naver.com"
            type="text"
            value={Name}
            onChange={onNameHandler}
          ></input>
          {/* <input className='input_box' type="email" value={Email} onChange={onEmailHandler}   /> */}
          <label className="label">주민번호</label>
          <input
            className="input_box"
            type="text"
            value={Id}
            onChange={onIdHandler}
          />
          <label className="label">나이</label>
          <input
            className="input_box"
            type="number"
            value={Age}
            onChange={onAgeHandler}
          />
          <label className="label">주소</label>
          <input
            className="input_box"
            type="text"
            value={Address}
            onChange={onAddressHandler}
          />

          <button id="button" type="submit">
            등록
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
