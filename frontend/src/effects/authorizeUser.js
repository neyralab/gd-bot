import axios from 'axios';
import * as Sentry from '@sentry/react';

import {
  API_AUTHORIZATION,
  API_COUPON,
  API_NEYRA_CONNECT,
  API_PATH,
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

export  const getMercureJwt = async () => {
  try {
    const response = await fetch(`${API_PATH}/demo/mercure-jwt`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('An error occurred while fetching the JWT:', error);
    throw error;
  }
}