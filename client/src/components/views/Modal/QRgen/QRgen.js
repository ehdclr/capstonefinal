import QRCode from "qrcode";
import { useEffect, useState } from "react";
import "./QRgenerator.css";
import axios from "axios";
import Loading from "../../Loading/Loading";
let urlrl;
function QRgen({ setOpenModal }) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");

  useEffect(() => {
    axios.post('/api/users/qrgen')
      .then(response => {
        setUrl(response.data.token);
        // urlrl = response.data.token
      setLoading(false)
      console.log(qr);
      })
  }, []);

  useEffect(() => {
    QRCode.toDataURL(
      url,
      {
        width: 300,
        margin: 2,
        color: {
          dark: "#335383FF",
          light: "#EEEEEEFF",
        },
      },
      (err, url) => {
        if (err) return console.error(err);
        setQr(url);
      }
    );
  }, [loading, url]);
  

  return (
    
    <div className="app modalBackground">
      {loading && <Loading />}
      <div className="modalContainer">
      <div className="modalHeader">
          <div className="headerText">QR Generator</div>
          <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>   
      </div>
        <div className="main1">
          
          
          {qr ? (
            <>
              <img src={qr} />  
            </>
          ) : null}
          </div>
        </div> 
    </div>
  );
}

export default QRgen;