import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

export const restoreFileEffect = async (slug: string) => {
  const url = `${API_PATH}/trash/multiply/restore`;
  return await axiosInstance
    .put(url, [slug])
    .then(() => {
      return 'success';
    })
    .catch(() => 'error');
};
