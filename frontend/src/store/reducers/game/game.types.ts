import { Game, GameLevel, PendingGame } from '../../../effects/types/games';
import {
  AdvertisementModalProps,
  AdvertisementOfferModalProps,
  GameAccess,
  GameModalType,
  GameStatus,
  GameSystemModalType,
  GameTheme,
  NextThemeDirection
} from '../../../pages/game/game.types';

export interface Balance {
  value: number; // taps
  label: number; // points
}

export interface InitialState {
  isInitializing: boolean;
  isInitialized: boolean;
  isCanvasLoaded: boolean;
  contractAddress: string | null;
  gameId: number | null;
  themes: GameTheme[];
  isTransactionLoading: boolean;
  status: GameStatus;
  theme: GameTheme | null;
  levels: GameLevel[];
  themeAccess: GameAccess;
  balance: Balance;
  experienceLevel: number;
  experiencePoints: number;
  maxLevel: number;
  reachedNewLevel: boolean;
  roundTimerTimestamp: number | null;
  roundTimeoutId: NodeJS.Timeout | null;
  lockTimerTimestamp: number | null;
  lockIntervalId: NodeJS.Timeout | null;
  counter: {
    isActive: boolean;
    count: number | null;
    isFinished: boolean;
  };
  roundFinal: {
    isActive: boolean;
    roundPoints: number | null;
  };
  nextTheme: {
    theme: GameTheme | null;
    direction: NextThemeDirection | null;
    isSwitching: boolean;
  };
  allowThemeChange: boolean;
  pendingGames: PendingGame[];
  gameInfo: Game | PendingGame | null;
  recentlyFinishedLocker: boolean;
  advertisementOfferModal: AdvertisementOfferModalProps | null;
  advertisementModal: AdvertisementModalProps | null;
  gameModal: GameModalType | null;
  systemModal: { type: GameSystemModalType; message: string } | null;
  isGameDisabled: boolean;
}
