import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';

export const storageListEffect = async (token) => {
  return axiosInstance
    .create({
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .get(`${API_PATH}/storage/ton`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      throw e;
    });
};
