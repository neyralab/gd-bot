import axiosInstance from './axiosInstance';

export const getOneTimeToken = ({ filesize = '', filename = '' }) => {
  const url = `${process.env.REACT_APP_API_PATH}/user/generate/token`;
  return axiosInstance.post(url, { filesize, filename });
};
