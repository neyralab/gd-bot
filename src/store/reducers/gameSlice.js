import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  themes as defaultThemes,
  levelSubThemes
} from '../../pages/game/themes';
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
    status: 'waiting', // 'waiting', 'playing', 'finished';
    theme: null,
    levels: [],
    themeAccess: {
      hawk: true, // tier id 1
      gold: false, // tier id 3
      ghost: false // tier id 4
    },
    balance: { value: 0, label: 0 },
    experienceLevel: 1,
    experiencePoints: 0,
    maxLevel: 0,
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
    },
    setMaxLevel: (state, { payload }) => {
      state.maxLevel = payload;
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

const undateSubTheme = (dispatch, state, themes, level) => {
  /** In the hawk theme (tier id 1) we might have subthemes. It depend on levels.
   * Each level has its own color scheme and images */
  const levelSubTheme =
    levelSubThemes.find((el) => el.level === level) || levelSubThemes[0];

  const newThemes = themes.map((theme) => {
    if (theme.id === 'hawk') {
      return { ...theme, ...levelSubTheme };
    }
    return theme;
  });

  dispatch(setThemes(newThemes));
  if (state.game.theme) {
    const foundTheme = newThemes.find((el) => el.id === state.game.theme.id);
    dispatch(setTheme(foundTheme));
  }

  return newThemes;
};

export const initGame = createAsyncThunk(
  'game/initGame',
  async (_, { dispatch, getState }) => {
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

      const state = getState();
      const maxLevel = levels.length;
      const level = state.user.data.current_level.level;
      if (level > maxLevel) {
        level = maxLevel;
      }

      dispatch(setLevels(levels));
      dispatch(setMaxLevel(levels.length));
      dispatch(setExperienceLevel(level));
      dispatch(setBalance({ label: gameInfo.points, value: 0 }));
      dispatch(setExperiencePoints(gameInfo.points));
      dispatch(setContractAddress(cAddress));
      dispatch(setPendingGames(pendingGames));

      const now = Date.now();
      if (now <= gameInfo.game_ends_at) {
        const endTime = gameInfo.game_ends_at;
        lockTimerCountdown(dispatch, endTime);
      }

      /** This function combines backend tiers and frontend themes */
      let newThemes = defaultThemes.map((theme) => {
        const findLevel = levels.find((el) => el.id === level);
        const { tierIdBN, tierId, ...findGame } = games.find(
          (game) => game.multiplier === theme.multiplier
        );
        let newTheme = findGame
          ? {
              ...findGame,
              ...theme,
              tierId: findGame.id,
              multiplier:
                theme.id === 'hawk' ? findLevel.multiplier : findGame.multiplier
            }
          : theme;
        return newTheme;
      });

      /** This function combines frontend color schemes and images for hawk theme.
       * Hawk theme can have different colors depends on level */
      newThemes = undateSubTheme(dispatch, state, newThemes, level);

      if (pendingGames.length > 0) {
        dispatch(setThemeAccess({ themeId: 'ghost', status: true }));
        const pendingGame = pendingGames[0];
        dispatch(
          setTheme(newThemes.find((el) => el.tierId === pendingGame.tier_id))
        );
        dispatch(setGameId(pendingGame.uuid || pendingGame.id));
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
    dispatch(setReachedNewLevel(false));
    const state = getState();
    const level = selectLevel(state);
    const gameTime = level?.play_time * 1000;

    const endTime = Date.now() + gameTime;
    dispatch(setRoundTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      dispatch(finishRound());
    }, gameTime);

    dispatch(setRoundTimeoutId(timeoutId));

    if (state.game.theme.id === 'hawk') {
      const game = await beforeGame(null, state.game.theme.tierId);
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
    const filteredGames = pendingGames.filter((el) => el.uuid !== gameId);
    console.log({ filteredGames });

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
      const firstPendingGame = filteredGames[0];
      console.log({ firstPendingGame });
      dispatch(setGameId(firstPendingGame.uuid || firstPendingGame?.id));
    }

    if (state.game.theme.id === 'hawk') {
      dispatch(startNewFreeGameCountdown());
    }
    console.log({ gameId });
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

    if (state.game.reachedNewLevel) {
      undateSubTheme(dispatch, state, state.game.themes, state.game.experienceLevel); // Update the hawk subtheme that depends on level
      setTimeout(() => {
        dispatch(
          switchTheme({
            themeId: state.game.theme.id,
            direction: 'updateCurrent',
            timeout: 0
          })
        ); // Switch theme with updateCurrent status to run update theme animation
      }, 100);
    }
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

    /** If user reached new level */
    if (newPoints >= level.tapping_to) {
      const newLevel = state.game.experienceLevel + 1;
      if (newLevel >= state.game.maxLevel) return;

      dispatch(setExperienceLevel(newLevel));
      dispatch(setReachedNewLevel(true)); // Update the new level trigger
    }

    dispatch(setExperiencePoints(newPoints));
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
  async ({ themeId, direction, timeout = 500 }, { dispatch, getState }) => {
    const state = getState();
    const themes = state.game.themes;

    if (state.game.status === 'playing') return;
    if (!state.game.counter.isFinished) return;

    const newTheme = themes.find((el) => el.id === themeId);

    dispatch(
      setNextTheme({
        theme: newTheme,
        direction: direction,
        isSwitching: true
      })
    );

    setTimeout(() => {
      dispatch(setTheme(newTheme));
      dispatch(
        setNextTheme({
          theme: null,
          direction: null,
          isSwitching: false
        })
      );
    }, timeout);

    if (newTheme.id !== 'hawk') {
      const newPendingGames = await getPendingGames({
        tierId: newTheme.tierId
      });
      console.log({ newPendingGames });
      dispatch(setPendingGames(newPendingGames));
      newPendingGames.length &&
        dispatch(setThemeAccess({ themeId: newTheme.id, status: true }));
    } else {
      dispatch(setStatus('waiting'));
    }
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
    dispatch(setReachedNewLevel(false));
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
  setRoundFinal,
  setMaxLevel
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
