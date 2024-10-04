import axiosInstance from './axiosInstance';
import { Task } from './types/tasks';

interface History {
  data: {
    game: {
      created_at: number;
      game_ends_at: number;
      id: number;
      is_paid: boolean | null;
      points_earned: boolean | null;
      purchase_id: number | null;
      status: number;
      taps_earned: number | null;
      tier: {
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
      };
      txid: string | null;
      uuid: number;
    } | null;
    id: number;
    point: {
      action: string;
      amount: number;
      id: number;
      text: string;
    } | null;
    points: number;
    taps_count: number | null;
    text: string;
  }[];
  fileCnt: number;
  points: number;
  total: number;
}

export const getBalanceEffect = (params: { page?: number }) => {
  // @ts-ignore
  let url = `${import.meta.env.VITE_API_PATH}/gd/user/points`;
  if (params && params.page) {
    url += `?page=${params.page}`;
  }
  return axiosInstance.get<History>(url);
};

export const getAllTasks = async () => {
  // @ts-ignore
  const url = `${import.meta.env.VITE_API_PATH}/gd/points`;
  const { data } = await axiosInstance.get<{ data: Task[] }>(url);
  return data?.data;
};
