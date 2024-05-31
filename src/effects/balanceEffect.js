import axiosInstance from './axiosInstance';

export const getBalanceEffect = () => {
  const url = `${process.env.REACT_APP_API_PATH}/gd/user/points`;
  return axiosInstance.get(url);
}
