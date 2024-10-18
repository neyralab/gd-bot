import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import BigNumber from 'bignumber.js';
import { Effect } from './types';
import { DataWrappedResponse } from './types/defaults';
import {
  Game,
  GameContract,
  GameLevel,
  GamePlan,
  PendingGame
} from './types/games';

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
  const { data } = await axiosInstance.post<Effect<Game>>(url, {
    purchase_id,
    tier_id
  });
  console.log({ beforeGame: data });
  return data.data;
};

export const startGame = async (game_id: number, txid: string | null) => {
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
