import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

export const getUserEffect = async (token: string) => {
  return await axiosInstance
    .get(`${API_PATH}/tg/me`, {
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .then((response: { data: GetMe }) => response.data)
    .catch((error: AxiosError<{ message: string }>) => {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in getUserEffect: ${error?.response?.data?.message}`
      );
      throw error;
    });
};

type GetMe = {
  referral_code: string;
  points: number;
  id: number;
  space_total: number;
  ws_id: number;
  workspace_plan: boolean | any;
  wallet: string;
  current_level: {
    level: number;
    multiplier: number;
  };
};

export const saveUserWallet = async (walletData: unknown) => {
  const data = await axiosInstance.post(`${API_PATH}/tg/wallet`, walletData);
  return data.data;
  // 8/api/tg/wallet' \
};
