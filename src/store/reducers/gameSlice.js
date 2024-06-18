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
    // soundIsActive: localStorage.getItem('gameSound')
    //   ? localStorage.getItem('gameSound') === 'true'
    //   : true,
    soundIsActive: false,
    roundTimerTimestamp: null,
    roundTimeoutId: null,
    lockTimerTimestamp: null,
    lockTimeoutId: null
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
    setRoundTimeoutId: (state, { payload }) => {
      clearTimeout(state.roundTimeoutId);
      state.roundTimeoutId = payload;
    },
    setLockTimerTimestamp: (state, { payload }) => {
      state.lockTimerTimestamp = payload;
    },
    setLockTimeoutId: (state, { payload }) => {
      clearTimeout(state.lockTimeoutId);
      state.lockTimeoutId = payload;
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
    dispatch(setRoundTimeoutId(null));
    dispatch(setStatus('playing'));

    const endTime = Date.now() + 60 * 1000; // 1 minute from now
    dispatch(setRoundTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      const state = getState();
      dispatch(setStatus('finished'));
      dispatch(setRoundTimerTimestamp(null));
      dispatch(setRoundTimeoutId(null));

      if (state.game.theme.id === 'hawk') {
        dispatch(startNewFreeGameCountdown());
      }
    }, 60 * 1000); // 1 minute in milliseconds

    dispatch(setRoundTimeoutId(timeoutId));
  }
);

export const startNewFreeGameCountdown = createAsyncThunk(
  'game/startNewFreeGameCountdown',
  async (_, { dispatch }) => {
    dispatch(setLockTimeoutId(null));

    const endTime = Date.now() + 60 * 3 * 60 * 1000; // 3 hours from now
    dispatch(setLockTimerTimestamp(endTime));

    const timeoutId = setTimeout(
      () => {
        dispatch(setLockTimerTimestamp(null));
        dispatch(setLockTimeoutId(null));
        dispatch(setStatus('waiting'));
      },
      60 * 3 * 60 * 1000
    ); // 3 hours in milliseconds

    dispatch(setLockTimeoutId(timeoutId));
  }
);

export const {
  setStatus,
  setTheme,
  setBalance,
  setSoundIsActive,
  setRoundTimerTimestamp,
  setRoundTimeoutId,
  setLockTimerTimestamp,
  setLockTimeoutId
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
