import {
  createAsyncThunk,
  ThunkDispatch,
  UnknownAction
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  addBalance,
  setAdvertisementModal,
  setAdvertisementOfferModal,
  setAllowThemeChange,
  setBalance,
  setContractAddress,
  setCounterCount,
  setCounterIsActive,
  setCounterIsFinished,
  setExperienceLevel,
  setExperiencePoints,
  setGameId,
  setGameInfo,
  setGameModal,
  setIsGameDisabled,
  setIsInitialized,
  setIsInitializing,
  setLevels,
  setLockIntervalId,
  setLockTimerTimestamp,
  setMaxLevel,
  setNextTheme,
  setPendingGames,
  setReachedNewLevel,
  setRecentlyFinishedLocker,
  setRoundFinal,
  setRoundTimeoutId,
  setRoundTimerTimestamp,
  setStatus,
  setSystemModal,
  setTheme,
  setThemeAccess,
  setThemes
} from './game.slice';
import { RootState } from '..';
import {
  GameSubTheme,
  GameTheme,
  NextThemeDirection
} from '../../../pages/game/game.types';
import { getAdvertisementVideo } from '../../../effects/advertisementEffect';
import {
  beforeGame,
  endGame,
  gameLevels,
  getGameContractAddress,
  getGameInfo,
  getGamePlans,
  getPendingGames,
  startGame
} from '../../../effects/gameEffect';
import { isDesktopPlatform, isWebPlatform } from '../../../utils/client';

import { getToken } from '../../../effects/set-token';
import { getUserEffect } from '../../../effects/userEffects';
import { setUser } from '../userSlice';
import { tg } from '../../../App';
import { isEnabledMobileOnly } from '../../../utils/featureFlags';
import {
  themes as defaultThemes,
  levelSubThemes
} from '../../../pages/game/themes';
import { selectLevel, selectPendingGames } from './game.selectors';
import { Timeout } from '../../../types';

const lockTimerCountdown = (
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
  endTime: number
) => {
  dispatch(setLockTimerTimestamp(endTime));

  const intervalId = setInterval(() => {
    const now = Date.now();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockIntervalId(null));
      dispatch(setStatus('waiting'));
      dispatch(setThemeAccess({ themeId: 'hawk', status: true }));
      dispatch(setAdvertisementOfferModal(null));
    }
  }, 1000);

  dispatch(setLockIntervalId(intervalId));
};

const updateSubTheme = (
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
  state: RootState,
  themes: GameTheme[],
  level: number
) => {
  /** In the hawk theme (tier id 1) we might have subthemes. It depend on levels.
   * Each level has its own color scheme and images */
  const levelSubTheme =
    (levelSubThemes as GameSubTheme[]).find((el) => el.level === level) ||
    (levelSubThemes[0] as GameSubTheme);

  const newThemes: GameTheme[] = themes.map((theme) => {
    if (theme.id === 'hawk') {
      return { ...theme, ...levelSubTheme } as GameTheme;
    }
    return theme;
  });

  dispatch(setThemes(newThemes));
  if (state.game.theme) {
    const foundTheme = newThemes.find((el) => el.id === state.game.theme!.id);
    if (foundTheme) {
      dispatch(setTheme(foundTheme));
    }
  }

  return newThemes;
};

const getAdvertisementOffer = async (
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>
) => {
  const videoInfo = await getAdvertisementVideo();

  if (videoInfo && videoInfo.data.id && videoInfo.data.video) {
    dispatch(
      setAdvertisementOfferModal({
        points: videoInfo.points,
        videoUrl: videoInfo.data.video,
        videoId: videoInfo.data.id
      })
    );
  }
};

export const checkAdvertisementOffer = createAsyncThunk(
  'game/checkAdvertisementOffer',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    if (state.game.lockTimerTimestamp) {
      getAdvertisementOffer(dispatch);
    }
  }
);

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

      const state = getState() as RootState;
      const maxLevel = levels.length;
      let level = state.user.data?.current_level.level || 0;
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
        getAdvertisementOffer(dispatch);
      }

      if ((isDesktopPlatform(tg) || isWebPlatform(tg)) && isEnabledMobileOnly) {
        dispatch(setIsGameDisabled(true));
      }

      /** This function combines backend tiers and frontend themes */
      let newThemes = (defaultThemes as GameTheme[])
        .filter((theme) =>
          games.some((game) => game.multiplier === theme.multiplier)
        )
        .map((theme) => {
          const findLevel = levels.find((el) => el.id === level);
          if (!findLevel) return;

          const game = games.find(
            (game) => game.multiplier === theme.multiplier
          );

          if (game) {
            const { tierIdBN, tierId, ...findGame } = game;
            return {
              ...findGame,
              ...theme,
              tierId: findGame.id,
              multiplier:
                theme.id === 'hawk' ? findLevel.multiplier : findGame.multiplier
            };
          }

          return theme;
        })
        .filter((theme): theme is GameTheme => theme !== undefined);

      /** This function combines frontend color schemes and images for hawk theme.
       * Hawk theme can have different colors depends on level */
      newThemes = updateSubTheme(dispatch, state, newThemes, level);

      console.log(newThemes);

      if (pendingGames.length > 0) {
        const pendingGame = pendingGames[0];
        const pendingTheme = newThemes.find(
          (el) => el.tierId === pendingGame.tier_id
        );

        if (!pendingTheme || !pendingGame) return;

        const gameWithTier = { ...pendingGame, tier: pendingTheme.tierId };

        dispatch(
          setThemeAccess({
            themeId: pendingTheme.id,
            status: true
          })
        );
        dispatch(setTheme(pendingTheme));
        dispatch(setGameId(pendingGame.uuid || pendingGame.id));
        dispatch(setGameInfo(gameWithTier));
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
    setRoundFinal({ roundPoints: null, isActive: false });
    dispatch(setRoundTimeoutId(null));
    dispatch(setStatus('playing'));
    dispatch(setReachedNewLevel(false));

    const state = getState() as RootState;
    if (!state.game.theme) return;

    const gameTime = state.game.theme.game_time * 1000;

    const endTime = Date.now() + gameTime;
    dispatch(setRoundTimerTimestamp(endTime));

    const timeoutId = setTimeout(() => {
      dispatch(finishRound());
    }, gameTime);

    dispatch(setRoundTimeoutId(timeoutId));

    if (state.game.theme.id !== 'ghost') {
      try {
        const game = await beforeGame(null, state.game.theme.tierId!);
        try {
          await startGame(game.uuid || game.id, null);
          dispatch(setGameId(game?.uuid || game?.id));
          dispatch(setGameInfo(game));
        } catch (err) {
          const error = err as AxiosError<{ errors: string }>;
          console.log({ startGameErr: err, m: error?.response?.data });
          dispatch(
            setSystemModal({
              type: 'START_GAME_ERROR',
              message: error?.response?.data?.errors || 'Unexpected Error'
            })
          );
        }
      } catch (err) {
        const error = err as AxiosError<{ errors: string }>;
        console.log({ beforeGameErr: err, m: error?.response?.data });

        dispatch(
          setSystemModal({
            type: 'BEFORE_GAME_ERROR',
            message: error?.response?.data?.errors || 'Unexpected Error'
          })
        );
      }
    }
  }
);

export const finishRound = createAsyncThunk(
  'game/finishRound',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const pendingGames = selectPendingGames(state);
    const gameId = state.game.gameId;
    const filteredGames = pendingGames.filter((el) => el.uuid !== gameId);
    console.log({ filteredGames });

    dispatch(setStatus(filteredGames.length ? 'waiting' : 'finished'));
    dispatch(setRoundTimerTimestamp(null));
    dispatch(setRoundTimeoutId(null));
    dispatch(
      setThemeAccess({
        themeId: state.game.theme!.id,
        status: !!filteredGames.length
      })
    );
    if (filteredGames.length) {
      const firstPendingGame = filteredGames[0];
      console.log({ firstPendingGame });
      dispatch(setGameId(firstPendingGame.uuid || firstPendingGame?.id));
      dispatch(setGameInfo(firstPendingGame));
    }

    if (state.game.theme!.id === 'hawk') {
      dispatch(startNewFreeGameCountdown());

      setTimeout(() => {
        // wait for animation
        getAdvertisementOffer(dispatch);
      }, 2000);
    }
    console.log({ gameId });

    const taps = state.game.balance.value;
    dispatch(setBalance({ value: 0, label: state.game.balance.label }));

    if (
      state.game.theme!.id !== 'hawk' &&
      state.game.theme!.id !== 'gold' &&
      state.game.gameInfo!.txid
    ) {
      /** This modal should be seen only if the game was paid
       * AND it was bought with TON.
       * If txid is not null, that means the game was bought with TON
       */
      dispatch(setGameModal('TIME_FOR_TRANSACTION'));
    }

    endGame({ id: gameId!, taps: taps })
      .then(() => {
        dispatch(
          setRoundFinal({
            roundPoints:
              state.game.balance.value * state.game.theme!.multiplier || null,
            isActive: true
          })
        );
        dispatch(setPendingGames(filteredGames));
        getToken().then((token) => {
          if (!token) return;
          getUserEffect(token).then((user) => {
            dispatch(setUser(user));
          });
        });
      })
      .catch((err) => {
        console.log({ endGameErr: err, m: err?.response.data });
        dispatch(
          setSystemModal({
            type: 'END_GAME_ERROR',
            message: err?.response?.data?.errors || 'Unexpected Error'
          })
        );
      });

    if (state.game.reachedNewLevel) {
      updateSubTheme(
        dispatch,
        state,
        state.game.themes,
        state.game.experienceLevel
      ); // Update the hawk subtheme that depends on level
    }

    if (state.game.theme!.id === 'gold') {
      setTimeout(() => {
        dispatch(
          switchTheme({
            themeId: 'hawk',
            direction: 'next',
            timeout: 2500
          })
        );
      }, 2500); // Firstly we run finish animation (works by default in ShipModel component) and then switch animation (this dispatch).
    }

    dispatch(activateRecentlyFinishedLocker());
  }
);

export const startNewFreeGameCountdown = createAsyncThunk(
  'game/startNewFreeGameCountdown',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    dispatch(setLockIntervalId(null));
    dispatch(setThemeAccess({ themeId: 'hawk', status: false }));
    const level = selectLevel(state);
    const freezeTime = level!.recharge_mins * 60 * 1000;
    const endTime = Date.now() + freezeTime;
    lockTimerCountdown(dispatch, endTime);
  }
);

export const refreshFreeGame = createAsyncThunk(
  'game/refreshFreeGame',
  async ({ points }: { points: number }, { dispatch }) => {
    dispatch(setLockIntervalId(null));
    dispatch(setLockTimerTimestamp(null));
    dispatch(setAdvertisementModal(null));
    dispatch(setStatus('waiting'));
    dispatch(setThemeAccess({ themeId: 'hawk', status: true }));
    if (points) {
      dispatch(
        setRoundFinal({
          roundPoints: points,
          isActive: true
        })
      );
    }
  }
);

export const proceedTap = createAsyncThunk(
  'game/proceedTap',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const level = selectLevel(state);

    if (!level) return;

    const newPoints = state.game.experiencePoints + 1;

    if (newPoints > level.tapping_to) {
      /** If user reached new level */
      const newLevel = state.game.experienceLevel + 1;
      if (newLevel > state.game.maxLevel) return;

      dispatch(setExperienceLevel(newLevel));
      dispatch(setReachedNewLevel(true)); // Update the new level trigger
    }

    dispatch(addBalance(state.game.theme!.multiplier));
    dispatch(setExperiencePoints(newPoints));
  }
);

export const activateRecentlyFinishedLocker = createAsyncThunk(
  'game/activateRecentlyFinishedLocker',
  async (_, { dispatch }) => {
    /** To prevent accidental tap to start another game when just finished */
    dispatch(setRecentlyFinishedLocker(true));

    setTimeout(() => {
      dispatch(setRecentlyFinishedLocker(false));
    }, 3000);
  }
);

export const startCountdown = createAsyncThunk(
  'game/startCountdown',
  async (
    { seconds, startNextRound }: { seconds: number; startNextRound: boolean },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    if (state.game.counter.isActive) return;

    dispatch(setCounterIsActive(true));
    dispatch(setCounterCount(seconds));
    dispatch(setCounterIsFinished(false));

    let innerCount = seconds;

    let intervalId: Timeout;

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
  async (
    {
      themeId,
      direction,
      timeout = 500
    }: { themeId: string; direction: NextThemeDirection; timeout: number },
    { dispatch, getState }
  ) => {
    /** direction: next, prev, updateCurrent */
    /** themeId: hawk, gold, ghost */

    const state = getState() as RootState;
    const themes = state.game.themes;

    if (state.game.status === 'playing') return;
    if (!state.game.counter.isFinished) return;

    const newTheme = themes.find((el) => el.id === themeId);

    if (!newTheme) return;

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
      if (!newTheme.tierId) return;
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

export const confirmGoldPlay = createAsyncThunk(
  'game/confirmGoldPlay',
  async (_, { dispatch }) => {
    dispatch(setReachedNewLevel(false));
    dispatch(setThemeAccess({ themeId: 'gold', status: true }));
    dispatch(
      switchTheme({ themeId: 'gold', direction: 'next', timeout: 2500 })
    );
    dispatch(setStatus('waiting'));
  }
);

export const declineGoldPlay = createAsyncThunk(
  'game/declineGoldPlay',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    dispatch(setReachedNewLevel(false));
    dispatch(setThemeAccess({ themeId: 'gold', status: false }));

    if (state.game.theme!.id === 'hawk') {
      // only hawk has subthemes, and we need to update them
      dispatch(
        switchTheme({
          themeId: 'hawk',
          direction: 'next',
          timeout: 2500
        })
      );
    }
    dispatch(setStatus('waiting'));
  }
);

export const gameCleanup = createAsyncThunk(
  'game/gameCleanup',
  async (_, { dispatch }) => {
    dispatch(setRoundFinal({ roundPoints: null, isActive: false }));
    dispatch(setReachedNewLevel(false));
    dispatch(setGameModal(null));
    dispatch(setSystemModal(null));
    dispatch(setAllowThemeChange(false));
  }
);
