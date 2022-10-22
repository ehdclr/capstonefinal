import React, { useState } from "react";
import { Fab, TextareaAutosize } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { qrScan } from "../../../_actions/user_action";
import QrScan from "react-qr-reader";
import { message } from "antd";
import Loading from "../Loading/Loading";
import "../QR/qrGen.css";

function QRscanner() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [qrState, setQrState] = useState(false);
  const [text, setText] = useState("");
  const [qrscan, setQrscan] = useState("");
  const [loading, setLoading] = useState(false);
  const handleScan = (data) => {
    if (data) {
      setLoading(true)
      setQrState(true);
      setQrscan(data);
      let body = {
        qrData: data,
      };
      dispatch(qrScan(body)).then((response) => {
        if (response.payload.success === true) {
          console.log(response);
          setLoading(false);
          setQrState(false);
          setText(message.success("성인 인증 완료"));

          setTimeout(function () {
            // window.location.reload();
          }, 2500);
        } else {
          setLoading(false);
          setQrState(false);
        }
      });
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      {loading && <Loading />}
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
        {qrState ? null : (
          <QrScan
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ height: 240, width: 350, marginTop: 50 }}
          />
        )}

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
