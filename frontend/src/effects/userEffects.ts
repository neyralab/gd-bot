import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';
import { Me, UserPublicAddress } from './types/users';

export const getUserEffect = async (token: string) => {
  try {
    const response = await axiosInstance.get<Me>(
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

export const saveUserWallet = async (
  walletData: unknown
): Promise<UserPublicAddress[]> => {
  const { data } = await axiosInstance.post<UserPublicAddress[]>(
    `${API_PATH}/users/add/address`,
    walletData
  );
  return data;
};
