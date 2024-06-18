import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import themes from '../../pages/tap/themes';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    status: 'waiting', // 'waiting', 'playing', 'finished';
    theme: themes[0],
    balance: 0,
    experienceMax: 1000,
    experienceCurrent: 0,
    soundIsActive: localStorage.getItem('gameSound')
      ? localStorage.getItem('gameSound') === 'true'
      : true,
    roundTimerTimestamp: null,
    lockTimerTimestamp: null
  },
  reducers: {
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setTheme: (state, { payload }) => {
      state.theme = payload;
    },
    setBalance: (state, { payload }) => {
      state.balance = payload;
    },
    setSoundIsActive: (state, { payload }) => {
      state.soundIsActive = payload;
      localStorage.setItem('gameSound', payload);
    },
    setRoundTimerTimestamp: (state, { payload }) => {
      state.roundTimerTimestamp = payload;
    },
    setLockTimerTimestamp: (state, { payload }) => {
      state.lockTimerTimestamp = payload;
    },
    setExperienceMax: (state, { payload }) => {
      state.experienceMax = payload;
    },
    setExperienceCurrent: (state, { payload }) => {
      state.experienceCurrent = payload;
    }
  }
});

export const startRound = createAsyncThunk(
  'game/startRound',
  async (_, { dispatch, getState }) => {
    // Set the status to 'playing' and initialize the timer with a future timestamp
    dispatch(setStatus('playing'));
    const endTime = Date.now() + 60 * 1000; // 1 minute from now
    dispatch(setRoundTimerTimestamp(endTime));

    setTimeout(() => {
      const state = getState();
      dispatch(setStatus('finished'));
      dispatch(setRoundTimerTimestamp(null));

      if (state.game.theme.id === 'hawk') {
        dispatch(startNewFreeGameCountdown());
      }
    }, 60 * 1000); // 1 minute in milliseconds
  }
);

export const startNewFreeGameCountdown = createAsyncThunk(
  'game/startNewFreeGameCountdown',
  async (_, { dispatch }) => {
    // Set the lockTimerTimestamp with a future timestamp
    const endTime = Date.now() + 60 * 3 * 60 * 1000; // 3 hours from now
    dispatch(setLockTimerTimestamp(endTime));

    setTimeout(
      () => {
        dispatch(setLockTimerTimestamp(null));
      },
      60 * 3 * 60 * 1000
    ); // 3 hours in milliseconds
  }
);

export const {
  setStatus,
  setTheme,
  setBalance,
  setSoundIsActive,
  setRoundTimerTimestamp,
  setLockTimerTimestamp
} = gameSlice.actions;
export default gameSlice.reducer;

export const selectStatus = (state) => state.game.status;
export const selectTheme = (state) => state.game.theme;
export const selectBalance = (state) => state.game.balance;
export const selectSoundIsActive = (state) => state.game.soundIsActive;
export const selectRoundTimerTimestamp = (state) =>
  state.game.roundTimerTimestamp;
export const selectLockTimerTimestamp = (state) =>
  state.game.lockTimerTimestamp;
