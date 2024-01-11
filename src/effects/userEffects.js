import axiosInstance from "./axiosInstance";

export const getUserEffect = async (token) => {
  return await axiosInstance
    .create({
      headers: {
        "X-Token": `Bearer ${token}`,
      },
    })
    .get(`${process.env.REACT_APP_API_PATH}/me`)
    .then((response) => response.data)
    .catch((err) => err);
};
