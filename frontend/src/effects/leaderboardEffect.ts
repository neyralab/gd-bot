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
  try {
    const url = `${API_PATH}/users/rankings`;
    const response = await axiosInstance.get<LeadboardResponse>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
