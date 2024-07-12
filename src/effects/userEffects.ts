import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';
import { Effect } from './types';

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
  wallet: string[];
  current_level: {
    level: number;
    multiplier: number;
  };
};

type Wallet = {
  id: number;
  public_address: string;
  created_at: string;
  active: boolean;
  is_unstoppable: boolean;
  is_coinbase: boolean;
};

export const saveUserWallet = async (
  walletData: unknown
): Promise<Wallet[]> => {
  const { data } = await axiosInstance.post<Effect<Wallet[]>>(
    `${API_PATH}/tg/wallet`,
    walletData
  );
  return data.data;
};
