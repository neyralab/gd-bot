import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import workspaceSlice from "./workspaceSlice";
import filesSlice from "./filesSlice";

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  files: filesSlice,
});

export default rootReducer;
