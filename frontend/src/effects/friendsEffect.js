import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';

export const getFriends = async () => {
  const token = localStorage.getItem('token');

  return await axiosInstance
    .create({
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .get(`${API_PATH}/user/referrals`)
    .then((response) => response.data)
    .catch((error) => {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in getFriends: ${error?.response?.data?.message}`
      );
      throw error;
    });
};
