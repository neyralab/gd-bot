import axiosInstance from "./axiosInstance";

export const getUserEffect = async () => {
  return await axiosInstance
    .get(`${process.env.REACT_APP_API_PATH}/me`)
    .then((response) => response.data)
    .catch((err) => err);
};
