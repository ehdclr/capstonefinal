import React, { useState } from "react";
import { Fab, TextareaAutosize } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";
import QrScan from "react-qr-reader";
import "../QR/qrGen.css";

function QRscanner() {
  const [qrscan, setQrscan] = useState("");
  const handleScan = (data) => {
    if (data) {
      setQrscan(data);
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
        <QrScan
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ height: 240, width: 400, marginTop: 50 }}
        />
        <div className="textAreaIn">
          <TextareaAutosize
            style={{
              fontSize: 20,
              width: 320,
              height: 100,
              marginTop: 200,
            }}
            rowsMax={4}
            defaultValue={qrscan}
            value={qrscan}
          />
        </div>
      </div>
    </div>
  );
}

export default QRscanner;
