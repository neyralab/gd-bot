import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import workspaceSlice from './workspaceSlice';
import filesSlice from './filesSlice';
import modalSlice from './modalSlice';
import gameSlice from './gameSlice';
import taskSlice from './taskSlice';
import paymentSlice from './paymentSlice';

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  files: filesSlice,
  modal: modalSlice,
  game: gameSlice,
  task: taskSlice,
  payment: paymentSlice,
});

export default rootReducer;
