import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import defaultThemes from '../../pages/game/themes';
import levels from '../../pages/game/levels';
import {
  beforeGame,
  endGame,
  gameLevels,
  getGameContractAddress,
  getGameInfo,
  getGamePlans,
  getPendingGames,
  startGame
} from '../../effects/gameEffect';
import { setUser } from './userSlice';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    isInitializing: false,
    isInitialized: false,
    contractAddress: null,
    gameId: null,
    themes: [],
    isTransactionLoading: false,
    status: 'finished', // 'waiting', 'playing', 'finished';
    theme: null,
    themeIndex: null,
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
    roundTimerTimestamp: null,
    roundTimeoutId: null,
    lockTimerTimestamp: null,
    lockIntervalId: null,
    counter: {
      isActive: false,
      count: null,
      isFinished: true
    },
    roundFinal: {
      isActive: false,
      roundPoints: null
    },
    nextTheme: {
      theme: null,
      themeIndex: null,
      direction: null,
      isSwitching: false
    }, // for animation purposes only
    pendingGames: []
  },
  reducers: {
    setPendingGames: (state, { payload }) => {
      state.pendingGames = payload;
    },
    setIsInitializing: (state, { payload }) => {
      state.isInitializing = payload;
    },
    setIsInitialized: (state, { payload }) => {
      state.isInitialized = payload;
    },
    setContractAddress: (state, { payload }) => {
      state.contractAddress = payload;
    },
    setThemes: (state, { payload }) => {
      state.themes = payload;
    },
    setGameId: (state, { payload }) => {
      state.gameId = payload;
    },
    setIsTransactionLoading: (state, { payload }) => {
      state.isTransactionLoading = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setLevels: (state, { payload }) => {
      state.levels = payload;
    },
    setTheme: (state, { payload }) => {
      state.theme = payload;

      if (payload && state.themes && state.themes.length) {
        state.themeIndex =
          state.themes.findIndex((t) => t.id === state.theme.id) || 0;
      } else {
        state.themeIndex = null;
      }
    },
    setBalance: (state, { payload }) => {
      state.balance = payload;
    },
    addBalance: (state, { payload }) => {
      state.balance = {
        label: state.balance.label + payload,
        value: state.balance.value + payload
      };
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
    setLockIntervalId: (state, { payload }) => {
      clearInterval(state.lockIntervalId);
      state.lockIntervalId = payload;
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
    },
    setCounterIsActive: (state, { payload }) => {
      state.counter.isActive = payload;
    },
    setCounterCount: (state, { payload }) => {
      state.counter.count = payload;
    },
    setCounterIsFinished: (state, { payload }) => {
      state.counter.isFinished = payload;
    },
    setRoundFinal: (state, { payload }) => {
      state.roundFinal = payload;
    }
  }
});

const lockTimerCountdown = (dispatch, endTime) => {
  dispatch(setLockTimerTimestamp(endTime));

  const intervalId = setInterval(() => {
    const now = Date.now();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockIntervalId(null));
      dispatch(setStatus('waiting'));
      dispatch(setThemeAccess({ themeId: 'hawk', status: true }));
    }
  }, 1000);

  dispatch(setLockIntervalId(intervalId));
};

export const initGame = createAsyncThunk(
  'game/initGame',
  async (_, { dispatch }) => {
    dispatch(setIsInitializing(true));
    dispatch(setIsInitialized(false));

    try {
      const [levels, gameInfo, cAddress, games, pendingGames] =
        await Promise.all([
          gameLevels(),
          getGameInfo(),
          getGameContractAddress(),
          getGamePlans(),
          getPendingGames({ tierId: 4 })
        ]);
      console.log({ pendingGames });
      dispatch(setLevels(levels));
      dispatch(setBalance({ label: gameInfo.points, value: 0 }));
      dispatch(setExperiencePoints(gameInfo.points));
      dispatch(setContractAddress(cAddress));
      dispatch(setPendingGames(pendingGames));

      const now = Date.now();
      if (now <= gameInfo.game_ends_at) {
        dispatch(setStatus('finished'));

        const endTime = gameInfo.game_ends_at;
        lockTimerCountdown(dispatch, endTime);
      } else {
        dispatch(setStatus('waiting'));
      }

      const newThemes = defaultThemes.map((theme) => {
        const { tierIdBN, tierId, ...findGame } = games.find(
          (game) => game.multiplier === theme.multiplier
        );
        return findGame
          ? { ...findGame, ...theme, tierId: findGame.id }
          : theme;
      });
      dispatch(setThemes(newThemes));

      if (pendingGames.length > 0) {
        dispatch(setThemeAccess({ themeId: 'ghost', status: true }));
        const pendingGame = pendingGames[0];
        dispatch(
          setTheme(newThemes.find((el) => el.tierId === pendingGame.tier.id))
        );
        dispatch(setGameId(pendingGame.id));
      } else {
        dispatch(setTheme(newThemes[0]));
      }

      dispatch(setIsInitializing(false));
      dispatch(setIsInitialized(true));
    } catch (error) {
      console.log('Error', error);
      dispatch(setIsInitializing(false));
      dispatch(setIsInitialized(false));
    }
  }
);

export const startRound = createAsyncThunk(
  'game/startRound',
  async (_, { dispatch, getState }) => {
    setRoundFinal({ roundPoins: null, isActive: false });
    dispatch(setRoundTimeoutId(null));
    dispatch(setStatus('playing'));
    const state = getState();
    const level = selectLevel(state);
    const gameTime = level?.play_time * 1000;

    const endTime = Date.now() + gameTime;
    dispatch(setRoundTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      dispatch(finishRound());
    }, gameTime);

    dispatch(setRoundTimeoutId(timeoutId));

    if (state.game.theme.multiplier === 1) {
      const game = await beforeGame(null, 1);
      const g = await startGame(game.uuid || game.id, null);
      dispatch(setGameId(game?.uuid || game?.id));
    }
  }
);

export const finishRound = createAsyncThunk(
  'game/finishRound',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const pendingGames = selectPendingGames(state);
    const gameId = state.game.gameId;
    const filteredGames = pendingGames.filter((el) => el?.id !== gameId);

    dispatch(setStatus(filteredGames.length ? 'waiting' : 'finished'));
    dispatch(setRoundTimerTimestamp(null));
    dispatch(setRoundTimeoutId(null));
    dispatch(
      setThemeAccess({
        themeId: state.game.theme.id,
        status: !!filteredGames.length
      })
    );
    if (filteredGames.length) {
      dispatch(setGameId(filteredGames[0]?.id));
    }

    if (state.game.theme.id === 'hawk') {
      dispatch(startNewFreeGameCountdown());
    }

    endGame({ id: gameId, taps: state.game.balance.value })
      .then((data) => {
        dispatch(
          setRoundFinal({
            roundPoints: state.game.balance.value,
            isActive: true
          })
        );
        dispatch(setUser({ ...state.user.data, points: data?.data || 0 }));
        dispatch(setBalance({ value: 0, label: state.game.balance.label }));
        dispatch(setPendingGames(filteredGames));
      })
      .catch((err) => {
        console.log({ endGameErr: err, m: err?.response.data });
      });
  }
);

export const startNewFreeGameCountdown = createAsyncThunk(
  'game/startNewFreeGameCountdown',
  async (_, { dispatch, getState }) => {
    const state = getState();
    dispatch(setLockIntervalId(null));
    dispatch(setThemeAccess({ themeId: 'hawk', status: false }));
    const level = selectLevel(state);
    const freezeTime = level?.recharge_mins * 60 * 1000;
    const endTime = Date.now() + freezeTime;
    lockTimerCountdown(dispatch, endTime);
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
      clearInterval(state.game.lockIntervalId);
      dispatch(setLockIntervalId(null));
    }
  }
);

export const startCountdown = createAsyncThunk(
  'game/startCountdown',
  async ({ seconds, startNextRound }, { dispatch, getState }) => {
    const state = getState();
    if (state.game.counter.isActive) return;

    dispatch(setCounterIsActive(true));
    dispatch(setCounterCount(seconds));
    dispatch(setCounterIsFinished(false));

    let innerCount = seconds;

    let intervalId;

    intervalId = setInterval(() => {
      let prevCount = innerCount;
      let newCount = prevCount - 1;
      newCount = newCount < 1 ? 0 : newCount;

      if (prevCount <= 1) {
        clearInterval(intervalId);
        dispatch(setCounterIsFinished(true));
        if (startNextRound) {
          dispatch(startRound());
        }
        setTimeout(() => {
          dispatch(setCounterIsActive(false));
        }, 2000);
      }
      dispatch(setCounterCount(newCount));
      innerCount = newCount;
    }, 1000);
  }
);

export const switchTheme = createAsyncThunk(
  'game/switchTheme',
  async ({ direction, timeout = 500 }, { dispatch, getState }) => {
    const state = getState();
    const themes = state.game.themes;
    const themeIndex = state.game.themeIndex;

    if (state.game.status === 'playing') return;
    if (!state.game.counter.isFinished) return;

    let newThemeIndex;

    if (direction === 'next') {
      newThemeIndex = (themeIndex + 1) % themes.length;
      if (newThemeIndex >= themes.length || newThemeIndex <= 0) return;
    } else if (direction === 'prev') {
      newThemeIndex = (themeIndex - 1 + themes.length) % themes.length;
      if (newThemeIndex >= themes.length - 1 || newThemeIndex < 0) return;
    }

    dispatch(
      setNextTheme({
        theme: themes[newThemeIndex],
        themeIndex: newThemeIndex,
        direction: direction,
        isSwitching: true
      })
    );

    setTimeout(() => {
      dispatch(setTheme(themes[newThemeIndex]));
      dispatch(
        setNextTheme({
          theme: null,
          themeIndex: null,
          direction: null,
          isSwitching: false
        })
      );
    }, timeout);
  }
);

export const gameCleanup = createAsyncThunk(
  'game/gameCleanup',
  async (_, { dispatch }) => {
    /** Right now in cleanup we need only this
     * In the future we might need to clean all the game.
     * If it so, please pay attention that we have setTimeouts that are very tricky.
     * Some of the timeoutIds you will need to store in this slice
     * and then clearTimeout() them in this function
     */
    dispatch(setRoundFinal({ roundPoins: null, isActive: false }));
  }
);

export const {
  setPendingGames,
  setIsInitializing,
  setIsInitialized,
  setContractAddress,
  setThemes,
  setGameId,
  setIsTransactionLoading,
  setStatus,
  setTheme,
  setBalance,
  addBalance,
  setRoundTimerTimestamp,
  setRoundTimeoutId,
  setLockTimerTimestamp,
  setLockIntervalId,
  setThemeAccess,
  setExperienceLevel,
  setExperiencePoints,
  setReachedNewLevel,
  setNextTheme,
  setLevels,
  setCounterIsActive,
  setCounterCount,
  setCounterIsFinished,
  setRoundFinal
} = gameSlice.actions;
export default gameSlice.reducer;

export const selectIsInitialized = (state) => state.game.isInitialized;
export const selectIsInitializing = (state) => state.game.isInitializing;
export const selectIsTransactionLoading = (state) =>
  state.game.isTransactionLoading;
export const selectContractAddress = (state) => state.game.contractAddress;
export const selectGameId = (state) => state.game.gameId;
export const selectStatus = (state) => state.game.status;
export const selectTheme = (state) => state.game.theme;
export const selectThemes = (state) => state.game.themes;
export const selectThemeIndex = (state) => state.game.themeIndex;
export const selectThemeAccess = (state) => state.game.themeAccess;
export const selectBalance = (state) => state.game.balance;
export const selectRoundTimerTimestamp = (state) =>
  state.game.roundTimerTimestamp;
export const selectLockTimerTimestamp = (state) =>
  state.game.lockTimerTimestamp;
export const selectExperienceLevel = (state) => state.game.experienceLevel;
export const selectExperiencePoints = (state) => state.game.experiencePoints;
export const selectReachNewLevel = (state) => state.game.reachedNewLevel;
export const selectNextTheme = (state) => state.game.nextTheme;
export const selectLevels = (state) => state.game.levels;
export const selectPendingGames = (state) => state.game.pendingGames;
export const selectLevel = (state) => {
  const userLevel = selectExperienceLevel(state);
  const levels = selectLevels(state);
  return levels?.find((l) => l.id === userLevel);
};
