import axiosInstance from './axiosInstance';
import { API_PATH } from '../utils/api-urls';
import { AxiosResponse } from 'axios';

interface FileData {
  filesize?: string | number;
  filename?: string;
  isPublic: boolean;
}

interface TokenGateway {
  id: number;
  interim_chunk_size: number;
  same_ip_upload: boolean;
  type: string;
  upload_chunk_size: number;
  url: string;
}

interface UserToken {
  token: string;
}

interface TokenResponse {
  jwt_ott: string[];
  user_token: UserToken[];
  gateway: TokenGateway;
}

export const getOneTimeToken = (
  filesData: FileData[]
): Promise<AxiosResponse<TokenResponse>> => {
  const url = `${API_PATH}/user/generate/token`;
  return axiosInstance.post<TokenResponse>(url, filesData);
};
