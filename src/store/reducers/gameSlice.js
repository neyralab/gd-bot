import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import themes from '../../pages/game/themes';
import levels from '../../pages/game/levels';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    status: 'finished', // 'waiting', 'playing', 'finished';
    theme: themes[0],
    levels: [],
    themeAccess: {
      hawk: true,
      lotus: false,
      gold: false,
      ghost: false
    },
    balance: { value: 0, label: 0 },
    experienceLevel: 1,
    experiencePoints: 0,
    reachedNewLevel: false,
    // soundIsActive: localStorage.getItem('gameSound')
    //   ? localStorage.getItem('gameSound') === 'true'
    //   : true,
    soundIsActive: false,
    roundTimerTimestamp: null,
    roundTimeoutId: null,
    lockTimerTimestamp: null,
    lockTimeoutId: null,
    nextTheme: null // for animation purposes only
  },
  reducers: {
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setLevels: (state, { payload }) => {
      state.levels = payload;
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
    setThemeAccess: (state, { payload }) => {
      state.themeAccess[payload.themeId] = payload.status;
    },
    setExperienceLevel: (state, { payload }) => {
      state.experienceLevel = payload;
    },
    setExperiencePoints: (state, { payload }) => {
      state.experiencePoints = payload;
    },
    setReachedNewLevel: (state, { payload }) => {
      state.reachedNewLevel = payload;
    },
    setNextTheme: (state, { payload }) => {
      state.nextTheme = payload;
    }
  }
});

export const startRound = createAsyncThunk(
  'game/startRound',
  async (_, { dispatch, getState }) => {
    dispatch(setRoundTimeoutId(null));
    dispatch(setStatus('playing'));
    const state = getState();
    const level = selectLevel(state);
    const gameTime = level?.play_time * 1000;

    const endTime = Date.now() + gameTime; // 30 sec from now
    dispatch(setRoundTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      const state = getState();
      dispatch(setStatus('finished'));
      dispatch(setRoundTimerTimestamp(null));
      dispatch(setRoundTimeoutId(null));
      dispatch(setThemeAccess({ themeId: state.game.theme.id, status: false }));

      if (state.game.theme.id === 'hawk') {
        dispatch(startNewFreeGameCountdown());
      }
    }, gameTime); // 30 sec in milliseconds

    dispatch(setRoundTimeoutId(timeoutId));
  }
);

export const startNewFreeGameCountdown = createAsyncThunk(
  'game/startNewFreeGameCountdown',
  async (_, { dispatch, getState }) => {
    const state = getState();
    dispatch(setLockTimeoutId(null));
    dispatch(setThemeAccess({ themeId: 'hawk', status: false }));
    const level = selectLevel(state);
    const freezeTime = level?.recharge_mins * 60 * 1000;

    const endTime = Date.now() + freezeTime; // 15 min from now
    dispatch(setLockTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
      dispatch(setStatus('waiting'));
      dispatch(setThemeAccess({ themeId: 'hawk', status: true }));
    }, freezeTime); // 15 min from now milliseconds

    dispatch(setLockTimeoutId(timeoutId));
  }
);

export const addExperience = createAsyncThunk(
  'game/addExperience',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const level = selectLevel(state);

    if (!level) return;

    const newPoints = state.game.experiencePoints + 1;
    if (newPoints >= level.tapping_to) {
      dispatch(setExperienceLevel(state.game.experienceLevel + 1));
      const now = Date.now();
      const lock = new Date(now.getTime() + level.recharge_mins * 1000 * 60);
      dispatch(setLockTimerTimestamp(lock));
    }
    dispatch(setExperiencePoints(newPoints));
  }
);

export const confirmNewlevel = createAsyncThunk(
  'game/confirmNewLevel',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const levelIndex = levels.findIndex(
      (el) => el.id === state.game.experienceLevel
    );

    if (levelIndex >= levels.length - 1) return;

    dispatch(setStatus('waiting'));
    dispatch(setReachedNewLevel(false));
    dispatch(
      setBalance({
        value: state.game.balance.value + levels[levelIndex - 1].giftPoints,
        label: state.game.balance.label + levels[levelIndex - 1].giftPoints
      })
    );

    if (levels[levelIndex - 1].freeRound) {
      dispatch(setThemeAccess({ themeId: 'hawk', status: true }));
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }
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
  setLockTimeoutId,
  setThemeAccess,
  setExperienceLevel,
  setExperiencePoints,
  setReachedNewLevel,
  setNextTheme,
  setLevels
} = gameSlice.actions;
export default gameSlice.reducer;

export const selectStatus = (state) => state.game.status;
export const selectTheme = (state) => state.game.theme;
export const selectThemeAccess = (state) => state.game.themeAccess;
export const selectBalance = (state) => state.game.balance;
export const selectSoundIsActive = (state) => state.game.soundIsActive;
export const selectRoundTimerTimestamp = (state) =>
  state.game.roundTimerTimestamp;
export const selectLockTimerTimestamp = (state) =>
  state.game.lockTimerTimestamp;
export const selectExperienceLevel = (state) => state.game.experienceLevel;
export const selectExperiencePoints = (state) => state.game.experiencePoints;
export const selectReachNewLevel = (state) => state.game.reachedNewLevel;
export const selectNextTheme = (state) => state.game.nextTheme;
export const selectLevels = (state) => state.game.levels;
export const selectLevel = (state) => {
  const userLevel = selectExperienceLevel(state);
  const levels = selectLevels(state);
  return levels?.find((l) => l.id === userLevel + 1);
};
