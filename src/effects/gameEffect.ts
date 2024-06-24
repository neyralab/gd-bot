import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import BigNumber from 'bignumber.js';

export const getGamePlans = async () => {
  const url = `${API_PATH}/tg/game/plans`;
  const { data } = await axiosInstance.get<{ data: GamePlan[] }>(url);
  return data?.data?.map((el) => ({
    ...el,
    tierIdBN: new BigNumber(el.id),
    tierId: BigInt(el.id)
    // ton_price: BigInt(el.ton_price)
  }));
};

export const getGameContractAddress = async () => {
  const url = `${API_PATH}/net/list`;
  const { data } = await axiosInstance.get<{ data: GameContract[] }>(url);
  console.log({ data });

  return data.data.find((net) => net.name.toLowerCase().includes('telegram'))
    ?.click_counter;
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
