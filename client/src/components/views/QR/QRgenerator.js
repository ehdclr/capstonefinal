import QRCode from "qrcode";
import { useState } from "react";
import "../QR/qrGen.css";

function QRgenerator() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");

  const GenerateQRCode = () => {
    QRCode.toDataURL(
      url,
      {
        width: 400,
        margin: 2,
        color: {
          dark: "#335383FF",
          light: "#EEEEEEFF",
        },
      },
      (err, url) => {
        if (err) return console.error(err);

        console.log(url);
        setQr(url);
      }
    );
  };

  return (
    <div className="app">
      <div className="headerQr">QR Generator</div>
      <hr className="hr" />
      <div className="main1">
        <input
          className="qrInput"
          type="text"
          placeholder="vc value"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btnGen" onClick={GenerateQRCode}>
          Generate
        </button>
        {qr && (
          <>
            <img src={qr} />
            <a className="btnGen" href={qr} download="qrcode.png">
              Download
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default QRgenerator;
