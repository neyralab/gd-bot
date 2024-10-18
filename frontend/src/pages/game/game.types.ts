export interface GameTheme extends GameSubTheme {
  id: GameId;
  name: string;
  multiplier: number;
  cost: number;
  data: string;
  game_time: number;
  tierId?: number;
}

export interface GameSubTheme {
  level?: number;
  colors?: GameThemeColors;
  ambientLightIntensity?: number;
  directionalLight1Intensity?: number;
  directionalLight2Intensity?: number;
  shipMetalness?: number;
  shipRoughness?: number;
  glareImg?: string;
}

export interface GameThemeColors {
  buttonText: string;
  experienceBar: {
    active: {
      background1: string;
      background2: string;
      boxShadow: string;
    };
    empty: {
      background1: [number, number, number];
      background2: [number, number, number];
      boxShadow: string;
    };
  };

  shipBase: string;
  wing: string;
  wingAccent: string;
  emission: string;
  fog: string;
  wave: string;
  directionalLight: string;
  accentEmission: string;
  shipTrailEmission: string;
}

export interface AdvertisementOfferModalProps {
  points: number;
  videoUrl: string;
  videoId: number;
}

export interface AdvertisementModalProps {
  points: number;
  videoUrl: string;
  videoId: number;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';

export type GameId = 'hawk' | 'ghost' | 'gold' | 'premium';

export type GameAccess = Record<GameId, boolean>;

export type GameModalType = 'TIME_FOR_TRANSACTION' | null;

export type GameSystemModalType =
  | 'REACHED_MAX_TAPS'
  | 'START_GAME_ERROR'
  | 'BEFORE_GAME_ERROR'
  | 'END_GAME_ERROR'
  | null;

export type NextThemeDirection = 'updateCurrent' | 'next' | null;
