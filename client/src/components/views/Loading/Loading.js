import React from "react";
import { Background, LoadingText } from "./LoadingStyle";
import Spinner from "../../../images/Spinner.gif";

const Loading = () => {
  return (
    <Background>
      <LoadingText>잠시만 기다려 주세요.</LoadingText>
      <img src={Spinner} alt="로딩중" width="10%" />
    </Background>
  );
};

export default Loading;
