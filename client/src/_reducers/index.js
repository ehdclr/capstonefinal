import { combineReducers } from "redux";
import user from "./user_reducer";
import user2 from "./user2_reducer";

const rootReducer = combineReducers({
  user,
  user2,
});

export default rootReducer;
