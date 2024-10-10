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
  tier: GameTier;
  txid: string | null;
  uuid: number;
}
