import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

export const getUserEffect = async (token: string) => {
  try {
    const response = await axiosInstance.get<{ data: GetMe }>(
      `${API_PATH}/tg/me`,
      {
        headers: {
          'X-Token': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError<{ message: string }>;
    Sentry.captureMessage(
      `Error ${error?.response?.status} in getUserEffect: ${error?.response?.data?.message}`
    );
    console.error(error);
    throw error;
  }
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
  const { data } = await axiosInstance.post<Wallet[]>(
    `${API_PATH}/users/add/address`,
    walletData
  );
  return data;
};
