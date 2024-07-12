import { loadStripe } from '@stripe/stripe-js/pure';
import axiosInstance from './axiosInstance';
import { tg } from '../App'
import { API_PATH, API_TON_WALLET, API_NEYRA } from '../utils/api-urls';
import axios from 'axios';
import { getToken, setToken } from './set-token';
import { connectUserV8 } from './authorizeUser';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createStripeSorageSub = async (priceId, quantity = 1) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_PATH}/workspace/storage/create/subscription`,
      [{ price: priceId, quantity }]
    );

    return { ...data, priceId };
  } catch (error) {
    console.error(error);
  }
};

export const checkPayment = async (payId) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_PATH}/workspace/storage/check/payment`,
      { payment: payId }
    );

    return data.success;
  } catch (error) {
    console.error(error);
  }
};

export const updateWsStorage = async (price, subscription) => {
  try {
    const url = `${API_PATH}/workspace/update/storage`;
    const body = { price, stripe_sub_id: subscription };
    const data = await axiosInstance.post(url, body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTonWallet = async (dispatch, comment) => {
  const token = await dispatch(connectUserV8());
  const body = {
    symbol: 'ton',
    comment
  };
  const data = await axios
    .create({
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .post(API_TON_WALLET, body)
    .then(({ data }) => data?.data)
    .catch(() => null);

  return data;
};

export const sendStarInvoice = async (invoice) => {
  try {
    const token = await getToken();
    const chat_id = 461882488 // tg?.initDataUnsafe?.user?.user;
    debugger
    const link = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .post(`${API_NEYRA}/gateway/billing/create_invoice_link`, {
        invoice_payload: {
          chat_id,
          ...invoice,
        }
      },
    )

    // const link = 'https://t.me/$WsROlEGhgEg8BgAAdjtclpSWDK8'

    return link
  } catch (error) {
    console.log(error);
  }
}