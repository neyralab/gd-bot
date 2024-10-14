import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';
import { FileDetails, FileToken } from '../types/files';

export const getDeleteOTT = (body: string[]) => {
  const url = `${API_PATH}/delete/generate/token`;
  return axiosInstance.post<FileToken>(url, body);
};

export const deleteFileEffect = async (slug: string) => {
  const url = `${API_PATH}/files/multiply/delete`;
  try {
    await axiosInstance.delete(url, {
      data: [slug]
    });
    return 'success';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

export const permanentlyDeleteFileEffect = async (file: FileDetails) => {
  try {
    const {
      data: {
        jwt_ott,
        user_tokens: { token: oneTimeToken },
        gateway
      }
    } = await getDeleteOTT([file.slug]);

    const url = `${gateway?.url}/trash/delete`;
    await axiosInstance.delete(url, {
      data: [file.slug],
      headers: {
        'one-time-token': oneTimeToken,
        'X-Delete-OTT-JWT': jwt_ott
      }
    });

    return 'success';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};
