import axiosInstance from './axiosInstance';
import { API_PATH } from '../utils/api-urls';
import { AxiosResponse } from 'axios';

interface FileData {
  filesize?: string;
  filename?: string;
}

interface TokenResponse {
  jwt_ott: string[];
  user_token: { token: string }[];
  gateway: { url: string };
}

export const getOneTimeToken = (
  filesData: FileData[]
): Promise<AxiosResponse<TokenResponse>> => {
  const url = `${API_PATH}/user/generate/token`;
  return axiosInstance.post<TokenResponse>(url, filesData);
};
