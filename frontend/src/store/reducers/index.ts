import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import workspaceSlice from './workspaceSlice';
import uiSlice from './uiSlice';
import gameSlice from './game/game.slice';
import taskSlice from './taskSlice';
import paymentSlice from './paymentSlice';
import driveSlice from './drive/drive.slice';

const rootReducer = combineReducers({
  user: userSlice,
  workspace: workspaceSlice,
  ui: uiSlice,
  game: gameSlice,
  task: taskSlice,
  payment: paymentSlice,
  drive: driveSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
