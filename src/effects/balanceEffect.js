import axiosInstance from './axiosInstance';

export const getBalanceEffect = () => {
  const url = `${import.meta.env.VITE_API_PATH}/gd/user/points`;
  return axiosInstance.get(url);
};

export const getAllTasks = async () => {
  const url = `${import.meta.env.VITE_API_PATH}/gd/points`;
  const { data } = await axiosInstance.get(url);
  return data?.data;
};
