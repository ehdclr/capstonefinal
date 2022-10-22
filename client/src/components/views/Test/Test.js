import React from "react";
import axios from "axios";

const Test = (props) => {
  const handleFileInput = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    return axios
      .post("/api/users/image", formData, {
        header: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        console.log({ res });
        props.fileToParents(res.data.image);
      })
      .catch((err) => {
        // alert("실패");
      });
  };

  return (
    <div>
      <input type="file" name="file" onChange={(e) => handleFileInput(e)} />
    </div>
  );
};

export default Test;
