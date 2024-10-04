import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { Friend } from './types/users';

interface FriendsResponse {
  points: number;
  data: Friend[];
}

export const getFriends = async (): Promise<FriendsResponse> => {
  try {
    const response = await axiosInstance.get<FriendsResponse>(
      `${API_PATH}/user/referrals`
    );
    return response.data;
  } catch (error: any) {
    Sentry.captureMessage(
      `Error ${error?.response?.status} in getFriends: ${error?.response?.data?.message}`
    );
    throw error;
  }
};
