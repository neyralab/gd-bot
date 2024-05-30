import axiosInstance from "./axiosInstance";
import { API_PATH } from "../utils/api-urls";

export const getOneTimeToken = ({ filesize = "", filename = "" }) => {
  const url = `${API_PATH}/user/generate/token`;
  return axiosInstance.post(url, { filesize, filename });
};
