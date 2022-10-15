import React, { useState } from "react";
import { Fab, TextareaAutosize } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { qrScan } from "../../../_actions/user_action"
import QrScan from "react-qr-reader";
import { message } from "antd";
import "../QR/qrGen.css";


function QRscanner() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [qrState, setQrState] = useState(false);
  const [text, setText] = useState("");
  const [qrscan, setQrscan] = useState("");
  const handleScan = (data) => {
    if (data) {
      setQrState(true)
      setQrscan(data);
      let body = {
        qrData: data
      };
      dispatch(qrScan(body)).then((response) => {
        if (response.payload.success===true) {
          console.log(response);
          setQrState(false);
          setText(message.success("성인 인증 완료"));
          
          setTimeout(function () {
            // window.location.reload();
          }, 2500);
          
        } else {
          setQrState(false);
        }
      })


    }
  };
  const handleError = (err) => {
    console.error(err);
  };




  return (
    <div>
      <div className="headerQr">
        <Link to="/">
          <Fab id="btnBack">
            <ArrowBack fontSize="large" />
          </Fab>
        </Link>
        <div className="top">QR Scanner</div>
      </div>
      <hr className="hr" />
      <div className="main2">
        {qrState ? null : (<QrScan
          
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ height: 240, width: 400, marginTop: 50 }}
      />) }
        
        <div className="textAreaIn">
          <TextareaAutosize
            style={{
              fontSize: 20,
              width: 320,
              height: 100,
              marginTop: 200,
            }}
            rowsMax={4}
            defaultValue={text}
            value={qrscan}
          />
        </div>
      </div>
    </div>
  );
}

export default QRscanner;
