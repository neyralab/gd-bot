import axiosInstance from './axiosInstance';
import { UserReferral } from './types/users';

interface ReferralResponse {
  data: UserReferral[];
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
