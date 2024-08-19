import axiosInstance from './axiosInstance';

export const getBalanceEffect = (params) => {
  let url = `${import.meta.env.VITE_API_PATH}/gd/user/points`;
  if (params && params.page) {
    url += `?page=${params.page}`;
  }
  return axiosInstance.get(url);
};

export const getAllTasks = async () => {
  const url = `${import.meta.env.VITE_API_PATH}/gd/points`;
  const { data } = await axiosInstance.get(url);
  return data?.data;
};
