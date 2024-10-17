import { InitialState } from "./game.types";

export const initialState: InitialState = {
  isInitializing: false,
  isInitialized: false,
  isCanvasLoaded: false,
  contractAddress: null,
  gameId: null,
  themes: [],
  isTransactionLoading: false,
  status: 'waiting',
  theme: null,
  levels: [],
  themeAccess: {
    hawk: true, // tier id 1
    gold: false, // tier id 3
    ghost: false, // tier id 4
    premium: false // tier id 5
  },
  balance: {
    value: 0, // taps
    label: 0 // points
  },
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
  /** nextTheme is for animation purposes only */
  nextTheme: {
    theme: null,
    direction: null,
    isSwitching: false
  },
  allowThemeChange: false,
  pendingGames: [],
  gameInfo: null,
  recentlyFinishedLocker: false, //  To prevent accidental tap to start another game when just finished
  /** Shows an offer to watch an advertisement
   * When the free game is finished, this modal should appear
   * and offer our user to watch an advertisement to play another game.
   * If user accepts the offer, advertisement modal should be seen
   */
  advertisementOfferModal: null,
  advertisementModal: null,
  /** Fancy modal with some information/notification.
   * Right now is used to show 'We need some time to review the transaction'
   * Check GameModal component for parameters
   */
  gameModal: null,
  /** Alerts
   * Check SystemModalWrapper component and it's child SystemModal for parameters
   */
  systemModal: null,
  isGameDisabled: false
};
