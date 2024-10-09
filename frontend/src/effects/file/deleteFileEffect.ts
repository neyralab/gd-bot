import axios from 'axios';
import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';
import { FileDetails, FileToken } from '../types/files';

export const getDeleteOTT = (body: string[]) => {
  const url = `${API_PATH}/delete/generate/token`;
  return axiosInstance.post<FileToken>(url, body);
};

export const deleteFileEffect = async (slug: string) => {
  const url = `${API_PATH}/files/multiply/delete`;

  return await axiosInstance
    .delete(url, {
      data: [slug]
    })
    .then(() => {
      return 'success';
    })
    .catch(() => 'error');
};

export const permanentlyDeleteFileEffect = async (file: FileDetails) => {
  const {
    data: {
      jwt_ott,
      user_tokens: { token: oneTimeToken },
      gateway
    }
  } = await getDeleteOTT([file.slug]);

  const url = `${gateway?.url}/trash/delete`;

  return await axios
    .create({
      headers: {
        'one-time-token': oneTimeToken,
        'X-Delete-OTT-JWT': jwt_ott
      }
    })
    .delete(url, { data: [file.slug] })
    .then(() => {
      return 'success';
    })
    .catch(() => 'error');
};
