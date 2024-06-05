import axiosInstance from './axiosInstance';

export const getBalanceEffect = () => {
  const url = `${process.env.REACT_APP_API_PATH}/gd/user/points`;
  return axiosInstance.get(url);
};

export const getAllTasks = async () => {
  const url = `${process.env.REACT_APP_API_PATH}/gd/points`;
  const { data } = await axiosInstance.get(url);
  return data?.data;
};
