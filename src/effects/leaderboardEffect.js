import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';

export const getLeaderboardEffect = async () => {
  const url = `${API_PATH}/users/rankings`;
  const res = await axiosInstance
    .get(url)
    .then(({ data }) => data)
    .catch(() => null);

  return res;
};
