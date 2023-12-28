import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import workspaceSlice from "./workspaceSlice";

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
});

export default rootReducer;
