import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import BigNumber from 'bignumber.js';
import { Effect } from './types';
import { DataWrappedResponse } from './types/defaults';

export const getGamePlans = async () => {
  const url = `${API_PATH}/tg/game/plans`;
  const { data } =
    await axiosInstance.get<DataWrappedResponse<GamePlan[]>>(url);
  return data?.data?.map((el) => ({
    ...el,
    tierIdBN: new BigNumber(el.id),
    tierId: BigInt(el.id),
    ton_price: el.ton_price
  }));
};

export const gameLevels = async () => {
  const url = `${API_PATH}/tap/levels`;
  const { data } =
    await axiosInstance.get<DataWrappedResponse<GameLevel[]>>(url);
  console.log({ gameLevels: data });
  return data.data;
};

export const beforeGame = async (
  purchase_id: number | null,
  tier_id: number
) => {
  const url = `${API_PATH}/game/start`;
  const { data } = await axiosInstance.post<Effect<Game[]>>(url, {
    purchase_id,
    tier_id
  });
  console.log({ beforeGame: data });
  return data.data;
};

export const startGame = async (game_id: number, txid: string) => {
  const url = `${API_PATH}/game/process`;
  const { data } = await axiosInstance.post<Effect<Game[]>>(url, {
    txid,
    game_id
  });
  console.log({ startGame: data });
  return data.data;
};

export const endGame = async ({ id, taps }: { id: number; taps: number }) => {
  const url = `${API_PATH}/store/game/points`;
  const { data } = await axiosInstance.post<{
    message: string;
    data: number;
  }>(url, {
    game_id: id,
    taps_count: taps
  });
  console.log({ endGame: data });
  return data;
};

export const getGameContractAddress = async () => {
  const url = `${API_PATH}/net/ton`;
  const { data } =
    await axiosInstance.get<DataWrappedResponse<GameContract>>(url);
  console.log({ getGameContractAddress: data });
  return data.data?.click_counter; //.find((net) => net.name.toLowerCase().includes('telegram'))
};

export const getGameInfo = async () => {
  const url = `${API_PATH}/tap/user/points`;
  const { data } = await axiosInstance.get<{
    game_ends_at: string | Date;
    points: number;
    level: number;
    lock_time: number | null;
  }>(url);
  const lockTime = new Date(+data.game_ends_at * 1000);
  const next = new Date(
    lockTime.getTime() + (data?.lock_time || 1) * 1000 * 60
  );
  console.log({ getGameInfo: data });
  return { game_ends_at: next.getTime(), points: data.points };
};

export const getPendingGames = async ({
  tierId
}: {
  tierId: number;
}): Promise<(Omit<Game, 'tier'> & PendingGame)[]> => {
  const url = `${API_PATH}/pending/games/${tierId}`;
  const { data } =
    await axiosInstance.get<Effect<(Omit<Game, 'tier'> & PendingGame)[]>>(url);
  console.log({ getPendingGames: data });
  return data.data;
};

export const getActivePayedGame = async () => {
  const url = `${API_PATH}/active/game`;
  const { data } =
    await axiosInstance.get<Effect<({ purchase_id: string } & Game)[]>>(url);
  console.log({ getActivePayedGame: data });
  return data.data;
};

type GamePlan = {
  id: number;
  per_tap: number;
  multiplier: number;
  ton_price: number;
  game_time: number;
  charge_minutes: number;
  storage_bonus: number;
  session_tap_limit: number;
};

type GameContract = {
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
};

type Tier = {
  id: number;
  per_tap: number;
  multiplier: number;
  ton_price: number;
  game_time: number;
  charge_minutes: number;
  storage_bonus: number;
  session_tap_limit: number;
};

type Game = {
  id: number;
  tier: Tier;
  created_at: number;
  game_ends_at: number;
  status: number;
  uuid: number;
};

type PendingGame = {
  purchase_id: null | string;
  tier_id: number;
  user_id: number;
  txid: string | null;
  is_paid: boolean;
  points_earned: null | number;
  taps_earned: null | number;
};

type GameLevel = {
  id: number;
  tapping_from: number;
  tapping_to: number;
  recharge_mins: number;
  play_time: number;
  multiplier: number;
};
