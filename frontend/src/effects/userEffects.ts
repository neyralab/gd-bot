import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';
import { Me, UserPublicAddress } from './types/users';

export const getUserEffect = async (token: string) => {
  return await axiosInstance
    .get(`${API_PATH}/tg/me`, {
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .then((response: { data: Me }) => response.data)
    .catch((error: AxiosError<{ message: string }>) => {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in getUserEffect: ${error?.response?.data?.message}`
      );
      throw error;
    });
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
