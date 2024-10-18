import BigNumber from 'bignumber.js';

export interface GameTier {
  charge_minutes: number;
  game_time: number;
  id: number;
  is_active: boolean;
  multiplier: number;
  per_tap: number;
  session_tap_limit: number;
  stars: number | null;
  storage_bonus: number;
  ton_price: number;
}

export interface Game {
  created_at: number;
  game_ends_at: number;
  id: number;
  is_paid: boolean | null;
  points_earned: boolean | null;
  purchase_id: number | null;
  status: number;
  taps_earned: number | null;
  tier?: GameTier | number;
  txid: string | null;
  uuid: number;
  tierId?: number;
}

export interface GamePlan {
  id: number;
  per_tap: number;
  multiplier: number;
  ton_price: number;
  game_time: number;
  charge_minutes: number;
  storage_bonus: number;
  session_tap_limit: number;
  tierIdBN: BigNumber;
  tierId: bigint;
}

export interface GameContract {
  id: number;
  name: string;
  chain_id: number;
  symbol: string;
  rpc_url: string;
  private_rpc_url: null;
  file_tokenization_factory: null;
  note_tokenization_factory: null;
  workspace_access_factory: null;
  nft_subscription_v1: null;
  nft_astro: null;
  nft_blue: null;
  shop_simple: null;
  shop_signed: null;
  list_helper: null;
  nft_metadata_url_file: null;
  explorer_url: null;
  click_counter?: string;
  created_at: Date | string;
  is_active: boolean | number;
  multisig_factory: null;
}

export interface PendingGame {
  purchase_id: null | string;
  tier_id: number;
  user_id: number;
  txid: string | null;
  is_paid: boolean;
  points_earned: null | number;
  taps_earned: null | number;
  tierId?: number;
  uuid?: number;
  id: number;
}

export interface GameLevel {
  id: number;
  tapping_from: number;
  tapping_to: number;
  recharge_mins: number;
  play_time: number;
  multiplier: number;
}
