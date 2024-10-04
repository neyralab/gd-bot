import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { LeadboardPerson } from './types/users';

interface LeadboardResponse {
  data: LeadboardPerson[];
  total_points: number;
  total_taps: number;
  total_users: number;
}

export const getLeaderboardEffect = async () => {
  const url = `${API_PATH}/users/rankings`;
  const res = await axiosInstance
    .get<LeadboardResponse>(url)
    .then(({ data }) => data)
    .catch(() => null);

  return res;
};
