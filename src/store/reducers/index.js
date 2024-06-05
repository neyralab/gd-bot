import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import workspaceSlice from './workspaceSlice';
import filesSlice from './filesSlice';
import modalSlice from './modalSlice';

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  files: filesSlice,
  modal: modalSlice
});

export default rootReducer;
