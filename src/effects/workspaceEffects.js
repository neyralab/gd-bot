import axiosInstance from "./axiosInstance";

export const getWorkspacesEffect = async () => {
  return await axiosInstance
    .get(`${process.env.REACT_APP_API_PATH}/user/workspaces`)
    .then((response) => response.data.data)
    .catch((err) => err);
};
