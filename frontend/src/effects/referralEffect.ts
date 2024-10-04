import axiosInstance from './axiosInstance';

interface ReferralResponse {
  data: {
    code: string;
    credit_amount: number | null;
    current_usage: number;
    id: number;
    max_usage: number | null;
    only_on_signup: boolean;
  }[];
}

interface ReferrerResponse {
  data: string;
}

export const referralEffect = () => {
  const url = `${import.meta.env.VITE_API_PATH}/user/coupon`;
  return axiosInstance.get<ReferralResponse>(url);
};

export const refererEffect = async () => {
  try {
    const url = `${import.meta.env.VITE_API_PATH}/referral/address`;
    const { data } = await axiosInstance.get<ReferrerResponse>(url);
    return data.data;
  } catch (e) {
    console.log({ refererEffectErr: e });
    return null;
  }
};
