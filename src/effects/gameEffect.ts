import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import BigNumber from 'bignumber.js';
import { toNano } from '@ton/core';

export const getGamePlans = async () => {
  const url = `${API_PATH}/tg/game/plans`;
  const { data } = await axiosInstance.get<{ data: GamePlan[] }>(url);
  return data?.data?.map((el) => ({
    ...el,
    tierIdBN: new BigNumber(el.id),
    tierId: BigInt(el.id),
    ton_price: toNano(el.ton_price)
  }));
};

export const startGame = async (purchase_id: number | null) => {
  const url = `${API_PATH}/game/start`;
  const { data } = await axiosInstance.post<StartGameRes>(url, { purchase_id });
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
  const url = `${API_PATH}/net/list`;
  const { data } = await axiosInstance.get<{ data: GameContract[] }>(url);
  console.log({ getGameContractAddress: data });
  return data.data.find((net) => net.name.toLowerCase().includes('telegram'))
    ?.click_counter;
};

export const getGameInfo = async () => {
  const url = `${API_PATH}/tap/user/points`;
  const { data } = await axiosInstance.get<{
    game_ends_at: string | Date;
    points: number;
    lock_time: number | null;
  }>(url);
  const lockTime = new Date(+data.game_ends_at * 1000);
  const next = new Date(
    lockTime.getTime() + (data?.lock_time || 1) * 1000 * 60
  );
  console.log({ getGameInfo: data });
  return { game_ends_at: next.getTime(), points: data.points };
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

type StartGameRes = {
  data: {
    id: number;
    tier: {
      id: number;
      per_tap: number;
      multiplier: number;
      ton_price: number;
      game_time: number;
      charge_minutes: number;
      storage_bonus: number;
      session_tap_limit: number;
    };
    created_at: number;
    game_ends_at: number;
    purchase_id: number;
  };
};
