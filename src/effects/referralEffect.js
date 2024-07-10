import axiosInstance from './axiosInstance';

export const referralEffect = () => {
  const url = `${import.meta.env.VITE_API_PATH}/user/coupon`;
  return axiosInstance.get(url);
};

export const refererEffect = async () => {
  try {
    const url = `${import.meta.env.VITE_API_PATH}/referral/address`;
    const { data } = await axiosInstance.get(url);
    return data.data;
  } catch (e) {
    console.log({ refererEffectErr: e });
    return null;
  }
};
