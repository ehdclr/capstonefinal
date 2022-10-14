import React, { useState, useRef } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import { idUser } from "../../../_actions/user_action";
import { Link, useNavigate } from "react-router-dom";
import "../IdCard/IdCard.css";
const people = require("../../../videos/profile.jpg");

function IdCard() {
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

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      name: Name,
      id: Id,
      address: Address,
      age: Age,
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
        backgroundImage: "url(img/gh.jpg) ",
        backgroundSize: "cover",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <div className="Logo">
          {/* <FontAwesomeIcon icon={faHeart} /> */} Welcome
          <hr />
        </div>
        {/* <div><img alt="iPhone_01" src="img/e.jpg" alignItems= 'center'   height="400px"  width="500px"/></div> */}
        <br />
        <br />
        <React.Fragment>
          <img
            src={imageUrl ? imageUrl : people}
            style={{ width: "200px", height: "200px" }}
          ></img>
          <input type="file" ref={imgRef} onChange={onChangeImage} />
        </React.Fragment>
        <label className="label"> 이름</label>
        <Input
          className="input_box"
          //placeholder="user@naver.com"
          type="text"
          value={Name}
          onChange={onNameHandler}
        ></Input>
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
      </form>
    </div>
  );
}

export default IdCard;
