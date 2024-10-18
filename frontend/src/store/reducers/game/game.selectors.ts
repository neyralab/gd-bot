import { RootState } from '..';

export const selectIsInitialized = (state: RootState) =>
  state.game.isInitialized;
export const selectIsInitializing = (state: RootState) =>
  state.game.isInitializing;
export const selectIsTransactionLoading = (state: RootState) =>
  state.game.isTransactionLoading;
export const selectContractAddress = (state: RootState) =>
  state.game.contractAddress;
export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;
export const selectTheme = (state: RootState) => state.game.theme;
export const selectThemes = (state: RootState) => state.game.themes;
export const selectThemeAccess = (state: RootState) => state.game.themeAccess;
export const selectBalance = (state: RootState) => state.game.balance;
export const selectRoundTimerTimestamp = (state: RootState) =>
  state.game.roundTimerTimestamp;
export const selectLockTimerTimestamp = (state: RootState) =>
  state.game.lockTimerTimestamp;
export const selectExperienceLevel = (state: RootState) =>
  state.game.experienceLevel;
export const selectExperiencePoints = (state: RootState) =>
  state.game.experiencePoints;
export const selectReachNewLevel = (state: RootState) =>
  state.game.reachedNewLevel;
export const selectNextTheme = (state: RootState) => state.game.nextTheme;
export const selectLevels = (state: RootState) => state.game.levels;
export const selectPendingGames = (state: RootState) => state.game.pendingGames;
export const selectIsGameDisabled = (state: RootState) =>
  state.game.isGameDisabled;
export const selectLevel = (state: RootState) => {
  const userLevel = selectExperienceLevel(state);
  const levels = selectLevels(state);
  return levels?.find((l) => l.id === userLevel);
};
