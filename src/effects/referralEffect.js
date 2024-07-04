import axiosInstance from './axiosInstance';

export const referralEffect = () => {
  const url = `${process.env.REACT_APP_API_PATH}/user/coupon`;
  return axiosInstance.get(url);
};

export const refererEffect = async () => {
  try {
    const url = `${process.env.REACT_APP_API_PATH}/referral/address`;
    const { data } = await axiosInstance.get(url);
    return data.data;
  } catch (e) {
    console.log({ refererEffectErr: e });
    return null;
  }
};
