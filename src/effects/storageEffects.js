import axiosInstance from "./axiosInstance";

export const storageListEffect = async (token) => {
  return axiosInstance
    .create({
      headers: {
        "X-Token": `Bearer ${token}`,
      },
    })
    .get(`${process.env.REACT_APP_API_PATH}/workspace/storage/list`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
};
