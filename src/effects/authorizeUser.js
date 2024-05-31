import axios from 'axios';
import * as Sentry from '@sentry/react';

import { API_AUTHORIZATION, API_COUPON } from '../utils/api-urls';
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
export const connectUserV8 = async (data) => {
  console.log(data);
  const url =
    'https://ab63-180-254-224-67.ngrok-free.app/api/auth/identity/connect_userv8';
  const body = {
    provider: 'telegram',
    initData: data
  };
  const res = await axios.put(url, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log('res', res);
};
