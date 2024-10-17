import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/react';
import { ThunkAction } from '@reduxjs/toolkit';

import {
  API_AUTHORIZATION,
  API_COUPON,
  API_NEYRA_CONNECT,
  API_PATH,
  BOT_NAME
} from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { Effect } from './types';
import { tg } from '../App';
import { setToken } from './set-token';

interface UserData {
  initData: string;
}

interface AuthorizeduserResponse {
  public_key: string | null;
  token: string;
}

interface UserTokens {
  access_token: string;
  access_token_ttl: number;
  refresh_token: string;
  refresh_token_ttl: number;
}

export const applyCouponEffect = async (coupon?: string) => {
  try {
    await axiosInstance.post(API_COUPON, { coupon });
  } catch (err) {
    console.error(err);
  }
};

export const authorizeUser = async (reqBody: UserData, ref?: string) => {
  try {
    const response = await axios.post<AuthorizeduserResponse>(
      API_AUTHORIZATION,
      reqBody
    );

    if (ref) {
      applyCouponEffect(ref);
    }
    await setToken(response.data.token);
    return response.data;
  } catch (e: any) {
    const error = e as AxiosError<{ message: string }>;
    const status = error?.response?.status;
    if (status && (status === 404 || status === 412)) {
      const link = `https://t.me/${BOT_NAME}?start=${ref}`;
      tg.showAlert(`Please start the bot before using the web app`, () => {
        tg.openTelegramLink(link);
        tg.close();
      });
    }
    Sentry.captureMessage(
      `Error ${error?.response?.status} in authorizeUser: ${error?.response?.data?.message}`
    );
    return error.message;
  }
};

export const connectUserV8 =
  (): ThunkAction<Promise<string | null>, any, unknown, any> =>
  async (_, getState) => {
    try {
      const initData = await getState().user.initData;
      const body = {
        provider: 'telegram',
        initData
      };

      const response = await axios.put<Effect<UserTokens>>(
        API_NEYRA_CONNECT,
        body,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { data } = response;
      return data?.data?.access_token || null;
    } catch {
      return null;
    }
  };

export const getMercureJwt = async () => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/demo/mercure-jwt`);
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching the JWT:', error);
    throw error;
  }
};
