import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import workspaceSlice from './workspaceSlice';
import modalSlice from './modalSlice';
import gameSlice from './gameSlice';
import taskSlice from './taskSlice';
import paymentSlice from './paymentSlice';
import driveSlice from './driveSlice';

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  modal: modalSlice,
  game: gameSlice,
  task: taskSlice,
  payment: paymentSlice,
  drive: driveSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
