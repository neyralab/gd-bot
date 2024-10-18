import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AdvertisementModalProps,
  AdvertisementOfferModalProps,
  GameStatus,
  GameTheme,
  GameId,
  GameModalType,
  GameSystemModalType,
  NextThemeDirection
} from '../../../pages/game/game.types';
import { Game, GameLevel, PendingGame } from '../../../effects/types/games';
import { initialState } from './game.state';
import { Balance } from './game.types';

const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    setPendingGames: (state, { payload }: PayloadAction<PendingGame[]>) => {
      state.pendingGames = payload;
    },
    setIsInitializing: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitializing = payload;
    },
    setIsInitialized: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitialized = payload;
    },
    setCanvasLoaded: (state, { payload }: PayloadAction<boolean>) => {
      state.isCanvasLoaded = payload;
    },
    setContractAddress: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.contractAddress = payload || null;
    },
    setThemes: (state, { payload }: PayloadAction<GameTheme[]>) => {
      state.themes = payload;
    },
    setGameId: (state, { payload }: PayloadAction<number>) => {
      state.gameId = payload;
    },
    setIsTransactionLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isTransactionLoading = payload;
    },
    setStatus: (state, { payload }: PayloadAction<GameStatus>) => {
      state.status = payload;
    },
    setLevels: (state, { payload }: PayloadAction<GameLevel[]>) => {
      state.levels = payload;
    },
    setTheme: (state, { payload }: PayloadAction<GameTheme>) => {
      state.theme = payload;
    },
    setBalance: (state, { payload }: PayloadAction<Balance>) => {
      state.balance = payload;
    },
    addBalance: (state, { payload }: PayloadAction<number>) => {
      state.balance = {
        label: state.balance.label + payload,
        value: state.balance.value + 1
      };
    },
    setRoundTimerTimestamp: (
      state,
      { payload }: PayloadAction<number | null>
    ) => {
      state.roundTimerTimestamp = payload;
    },
    setRoundTimeoutId: (
      state,
      { payload }: PayloadAction<NodeJS.Timeout | null>
    ) => {
      if (state.roundTimeoutId) {
        clearTimeout(state.roundTimeoutId);
      }
      state.roundTimeoutId = payload;
    },
    setLockTimerTimestamp: (
      state,
      { payload }: PayloadAction<number | null>
    ) => {
      state.lockTimerTimestamp = payload;
    },
    setLockIntervalId: (
      state,
      { payload }: PayloadAction<NodeJS.Timeout | null>
    ) => {
      if (state.lockIntervalId) {
        clearInterval(state.lockIntervalId);
      }
      state.lockIntervalId = payload;
    },
    setThemeAccess: (
      state,
      { payload }: PayloadAction<{ themeId: GameId; status: boolean }>
    ) => {
      state.themeAccess[payload.themeId] = payload.status;
    },
    setExperienceLevel: (state, { payload }: PayloadAction<number>) => {
      state.experienceLevel = payload;
    },
    setExperiencePoints: (state, { payload }: PayloadAction<number>) => {
      state.experiencePoints = payload;
    },
    setReachedNewLevel: (state, { payload }: PayloadAction<boolean>) => {
      state.reachedNewLevel = payload;
    },
    setNextTheme: (
      state,
      {
        payload
      }: PayloadAction<{
        theme: GameTheme | null;
        direction: NextThemeDirection;
        isSwitching: boolean;
      }>
    ) => {
      state.nextTheme = payload;
    },
    setAllowThemeChange: (state, { payload }: PayloadAction<boolean>) => {
      state.allowThemeChange = payload;
    },
    setCounterIsActive: (state, { payload }: PayloadAction<boolean>) => {
      state.counter.isActive = payload;
    },
    setCounterCount: (state, { payload }: PayloadAction<number>) => {
      state.counter.count = payload;
    },
    setCounterIsFinished: (state, { payload }: PayloadAction<boolean>) => {
      state.counter.isFinished = payload;
    },
    setRoundFinal: (
      state,
      {
        payload
      }: PayloadAction<{ isActive: boolean; roundPoints: number | null }>
    ) => {
      state.roundFinal = payload;
    },
    setMaxLevel: (state, { payload }: PayloadAction<number>) => {
      state.maxLevel = payload;
    },
    setRecentlyFinishedLocker: (state, { payload }: PayloadAction<boolean>) => {
      state.recentlyFinishedLocker = payload;
    },
    setAdvertisementOfferModal: (
      state,
      { payload }: PayloadAction<AdvertisementOfferModalProps | null>
    ) => {
      state.advertisementOfferModal = payload;
    },
    setAdvertisementModal: (
      state,
      { payload }: PayloadAction<AdvertisementModalProps | null>
    ) => {
      state.advertisementModal = payload;
    },
    setGameModal: (state, { payload }: PayloadAction<GameModalType | null>) => {
      state.gameModal = payload;
    },
    setSystemModal: (
      state,
      {
        payload
      }: PayloadAction<{ type: GameSystemModalType; message: string } | null>
    ) => {
      state.systemModal = payload;
    },
    setGameInfo: (state, { payload }: PayloadAction<Game | PendingGame>) => {
      state.gameInfo = payload;
    },
    setIsGameDisabled: (state, { payload }: PayloadAction<boolean>) => {
      state.isGameDisabled = payload;
    }
  }
});

export const {
  setPendingGames,
  setIsInitializing,
  setIsInitialized,
  setCanvasLoaded,
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
  setAllowThemeChange,
  setLevels,
  setCounterIsActive,
  setCounterCount,
  setCounterIsFinished,
  setRoundFinal,
  setMaxLevel,
  setRecentlyFinishedLocker,
  setAdvertisementOfferModal,
  setAdvertisementModal,
  setGameModal,
  setSystemModal,
  setGameInfo,
  setIsGameDisabled
} = gameSlice.actions;
export default gameSlice.reducer;

