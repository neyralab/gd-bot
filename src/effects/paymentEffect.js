import { loadStripe } from '@stripe/stripe-js/pure';
import axiosInstance from './axiosInstance';
import { API_PATH, API_TON_WALLET, API_NEYRA } from '../utils/api-urls';
import axios from 'axios';
import { connectUserV8 } from './authorizeUser';

const TG_STARS_BOT_TOKEN = '7391743462:AAF4XZF8mLkLWrKA8ZUVuDbFqC12kfK6FnI';
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
    const chatReq = await axios.get('https://api.telegram.org/bot7391743462:AAF4XZF8mLkLWrKA8ZUVuDbFqC12kfK6FnI/getUpdates');
    if (!chatReq.data.ok && chatReq.data?.result !== 0) {
      throw new Error(chatReq?.data?.message || '')
    }
    const chat_id =  chatReq.data?.result[0].message.chat.id;

    axiosInstance.post(`${API_NEYRA}/billing/send_invoice`, {
      invoice_payload: {
        chat_id,
        ...invoice,
      }
    }) 
  } catch (error) {
    console.log(error);
  }
}