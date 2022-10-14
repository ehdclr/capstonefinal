import { ID_USER } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case ID_USER:
      return { ...state, id: action.payload };
      break;

    default:
      return state;
  }
}
