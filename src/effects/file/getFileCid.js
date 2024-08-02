import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

export const getFileCids = async ({ slug }) => {
  const response = await axiosInstance.get(
    `${API_PATH}/files/file/cid/${slug}/interim`
  );
  return response.data;
};
