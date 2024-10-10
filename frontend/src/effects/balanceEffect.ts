import axiosInstance from './axiosInstance';
import { DataWrappedResponse } from './types/defaults';
import { Game } from './types/games';
import { EarnedPointsItem } from './types/points';
import { Task } from './types/tasks';

interface GetBalanceResponseDetails {
  game: Game | null;
  id: number;
  point: EarnedPointsItem | null;
  points: number;
  taps_count: number | null;
  text: string;
}

interface GetBalanceResponse {
  data: GetBalanceResponseDetails[];
  fileCnt: number;
  points: number;
  total: number;
}

export const getBalanceEffect = (params: { page?: number }) => {
  let url = `${import.meta.env.VITE_API_PATH}/gd/user/points`;
  return axiosInstance.get<GetBalanceResponse>(url, {
    params: { page: params.page }
  });
};

export const getAllTasks = async () => {
  const url = `${import.meta.env.VITE_API_PATH}/gd/points`;
  const { data } = await axiosInstance.get<DataWrappedResponse<Task[]>>(url);
  return data?.data;
};
