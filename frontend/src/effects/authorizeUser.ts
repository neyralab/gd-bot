import axios from 'axios';
import * as Sentry from '@sentry/react';
import { ThunkAction } from '@reduxjs/toolkit';

import {
  API_AUTHORIZATION,
  API_COUPON,
  API_NEYRA_CONNECT
} from '../utils/api-urls';
import { setToken } from './set-token';
import axiosInstance from './axiosInstance';
import { Effect } from './types';

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

export const applyCouponEffect = async (token: string, coupon?: string) => {
  axiosInstance
    .post(
      API_COUPON,
      { coupon },
      {
        headers: {
          'X-Token': `Bearer ${token}`
        }
      }
    )
    .catch((err) => console.error(err));
};

export const authorizeUser = async (reqBody: UserData, ref?: string) => {
  const res = await axios
    .post<AuthorizeduserResponse>(API_AUTHORIZATION, reqBody)
    .then(async (response) => {
      await setToken(response.data.token);
      if (ref) {
        applyCouponEffect(response.data.token, ref);
      }
      return response.data;
    })
    .catch((error) => {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in authorizeUser: ${error?.response?.data?.message}`
      );
      return error.message;
    });

  return res;
};

export const connectUserV8 =
  (): ThunkAction<Promise<string | null>, any, unknown, any> =>
  async (_, getState) => {
    const initData = await getState().user.initData;
    const body = {
      provider: 'telegram',
      initData
    };
    const res = await axios
      .put<Effect<UserTokens>>(API_NEYRA_CONNECT, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(({ data }) => data?.data?.access_token)
      .catch(() => null);
    return res;
  };
