import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  ID_USER,
  PASSWORD2_USER,
} from "./types";

export function loginUser(dataTosubmit) {
  const request = axios
    .post("/api/users/login", dataTosubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataTosubmit) {
  const request = axios
    .post("/api/users/register", dataTosubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function idUser(dataTosubmit) {
  const request = axios
    .post("/api/users/idcard", dataTosubmit)
    .then((response) => response.data);

  return {
    type: ID_USER,
    payload: request,
  };
}

export function password2User(dataTosubmit) {
  const request = axios
    .post("/api/users/secondpassword", dataTosubmit)
    .then((response) => response.data);

  return {
    type: PASSWORD2_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
