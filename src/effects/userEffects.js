import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';

export const getUserEffect = async (token) => {
  return await axiosInstance
    .create({
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .get(`${API_PATH}/me`)
    .then((response) => response.data)
    .catch((error) => {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in getUserEffect: ${error?.response?.data?.message}`
      );
      throw error;
    });
};

export const saveUserWallet = async (walletData) => {
  const data = await axiosInstance.post(`${API_PATH}/tg/wallet`, walletData);
  return data.data;
  // 8/api/tg/wallet' \
};
