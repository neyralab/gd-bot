import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import workspaceSlice from './workspaceSlice';
import filesSlice from './filesSlice';
import modalSlice from './modalSlice';
import gameSlice from './gameSlice';

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  files: filesSlice,
  modal: modalSlice,
  game: gameSlice
});

export default rootReducer;
