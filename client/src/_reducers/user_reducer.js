import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  ID_USER,
  QRSCAN_ADMIN,
} from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;
    case ID_USER:
      return { ...state, id: action.payload };
      break;
    case QRSCAN_ADMIN:
      return { ...state, qrScan: action.payload };
    
    default:
      return state;
  }
}
