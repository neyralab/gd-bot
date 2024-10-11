import axios from 'axios';
import * as Sentry from '@sentry/react';

import {
  API_AUTHORIZATION,
  API_COUPON,
  API_NEYRA_CONNECT,
  API_PATH,
  BOT_NAME
} from '../utils/api-urls';
import { setToken } from './set-token';
import axiosInstance from './axiosInstance';

export const applyCouponEffect = async (token, coupon) => {
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

export const authorizeUser = async (reqBody, ref) => {
  const res = await axios
    .post(API_AUTHORIZATION, reqBody)
    .then(async (response) => {
      await setToken(response.data.token);
      if (ref) {
        applyCouponEffect(response.data.token, ref);
      }
      return response.data;
    })
    .catch((error) => {
      const status = error?.response?.status;
      if (status && (status === 404 || status === 412)) {
        const link = `https://t.me/${BOT_NAME}?start=${ref}`;
        window?.Telegram?.WebApp?.showAlert(
          `Please start the bot before using the web app`,
          () => {
            window?.Telegram?.WebApp?.openTelegramLink(link);
            window?.Telegram?.WebApp?.close();
          }
        );
      }
      Sentry.captureMessage(
        `Error ${error?.response?.status} in authorizeUser: ${error?.response?.data?.message}`
      );
      return error.message;
    });

  return res;
};
export const connectUserV8 = () => async (_, getState) => {
  const initData = await getState().user.initData;
  const body = {
    provider: 'telegram',
    initData
  };
  const res = await axios
    .put(API_NEYRA_CONNECT, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(({ data }) => data?.data?.access_token)
    .catch(() => null);
  return res;
};

export const getMercureJwt = async () => {
  try {
    const response = await axios.get(`${API_PATH}/demo/mercure-jwt`);
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching the JWT:', error);
    throw error;
  }
};
