import { loadStripe } from '@stripe/stripe-js/pure';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { tg } from '../App';
import { API_PATH, API_TON_WALLET, API_NEYRA } from '../utils/api-urls';
import { NumberEncoder } from '../utils/numberEncoder';
import { createInvoice } from '../utils/createStarInvoice';
import { handlePayment } from '../store/reducers/paymentSlice';
import { connectUserV8 } from './authorizeUser';
import { Effect } from './types';
import { InvoiceType } from '../utils/createStarInvoice';

let stripePromise: Promise<any | null>;

export const getStripe = (): Promise<any | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY as string
    );
  }
  return stripePromise;
};

interface StripeSubscriptionResponse {
  subscriptionId: string;
  priceId: string;
}

export const createStripeSorageSub = async (
  priceId: string,
  quantity: number = 1
): Promise<StripeSubscriptionResponse | undefined> => {
  try {
    const { data } = await axiosInstance.post<{ subscriptionId: string }>(
      `${API_PATH}/workspace/storage/create/subscription`,
      [{ price: priceId, quantity }]
    );
    return { ...data, priceId };
  } catch (error) {
    console.error(error);
  }
};

export const checkPayment = async (
  payId: string
): Promise<boolean | undefined> => {
  try {
    const { data } = await axiosInstance.post<{ success: boolean }>(
      `${API_PATH}/workspace/storage/check/payment`,
      { payment: payId }
    );
    return data.success;
  } catch (error) {
    console.error(error);
  }
};

export const updateWsStorage = async (
  price: number,
  subscription: string
): Promise<any> => {
  try {
    const url = `${API_PATH}/workspace/update/storage`;
    const body = { price, stripe_sub_id: subscription };
    const { data } = await axiosInstance.post(url, body);
    return data;
  } catch (error) {
    console.error(error);
  }
};
interface TonWalletResponse {
  address: string;
  memo: string;
}

export const getTonWallet = async (
  dispatch: any,
  comment: string
): Promise<TonWalletResponse | null> => {
  const token = await dispatch(connectUserV8());
  const body = { symbol: 'ton', comment };

  try {
    const { data } = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .post<Effect<TonWalletResponse>>(API_TON_WALLET, body);

    return data?.data;
  } catch {
    return null;
  }
};

interface MakeInvoiceProps {
  input: number[] | string[];
  dispatch: any;
  callback: () => void;
  type: InvoiceType;
  theme: { multiplier: number; stars: number };
}

export const makeInvoice = async ({
  input,
  dispatch,
  callback,
  type,
  theme
}: MakeInvoiceProps): Promise<void> => {
  try {
    const schema = [1, 1, 8, 8, 8];
    const encoder = new NumberEncoder();
    const byteArray = encoder.encodeNumbers(input, schema);
    const base64String = encoder.encodeToBase64(byteArray);

    const invoiceInput = createInvoice({
      type: type,
      additionalData: {
        mult: theme?.multiplier,
        price: theme.stars,
        payload: base64String
      }
    });

    const invoiceLink = await sendStarInvoice(dispatch, invoiceInput);
    if (invoiceLink) {
      tg.openInvoice(invoiceLink, callback);
    }
  } catch (error) {
    console.log(error);
    toast.error('Something was wrong.', {
      theme: 'colored',
      position: 'top-center'
    });
  }
};

interface Invoice {
  description: string;
  payload: string;
  prices: {
    amount: number;
    label: string;
  }[];
  title: string;
}

interface InvoiceResponse {
  invoice_link: string;
}

export const sendStarInvoice = async (
  dispatch: Function,
  invoice: Invoice
): Promise<string> => {
  try {
    const token = await dispatch(connectUserV8());
    const chat_id = tg?.initDataUnsafe?.user?.user;

    const { data } = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .post<InvoiceResponse>(
        `${API_NEYRA}/gateway/billing/create_invoice_link`,
        {
          invoice_payload: {
            chat_id,
            ...invoice
          }
        }
      );

    return data?.invoice_link || ''; // Return the invoice link if available
  } catch (error) {
    console.error(error);
    return '';
  }
};

interface PaymentType {
  Description: string;
  Env: string;
  Key: string;
  Title: string;
  Type: number;
}

interface PaymentTypesResponse {
  data: PaymentType[];
  message: string;
  status: string;
}

export const setPaymentTypesEffect = async (
  dispatch: Function
): Promise<void> => {
  try {
    const token = await dispatch(connectUserV8());
    const { data } = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .get<PaymentTypesResponse>(`${API_NEYRA}/gateway/billing/retrieve_types`);
    dispatch(handlePayment(data?.data || []));
  } catch (error) {
    console.log(error);
  }
};
