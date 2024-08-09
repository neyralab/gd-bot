import axiosInstance from "./axiosInstance";
import { API_PATH } from "../utils/api-urls";

/**
 *@param {Array<{filesize?: string, filename?: string}>} filesData
 *@return {Promise<{data:{jwt_ott:string[],user_token:{token:string}[],gateway:{url:string}}}>}
 *  **/
export const getOneTimeToken = (filesData) => {
  const url = `${API_PATH}/user/generate/token`;
  return axiosInstance.post(url, filesData);
};
