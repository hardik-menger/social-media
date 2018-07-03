import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorreducer from "./errorreducer";
import pagereducer from "./pageReducer";
export default combineReducers({
  auth: authReducer,
  error: errorreducer,
  pages: pagereducer
});
