import axiosInstance from './axiosInstance';

export const referralEffect = ()=>{
  const url = `${process.env.REACT_APP_API_PATH}/user/coupon`;
  return axiosInstance.get(url);
}
