import axios from 'axios';
import { deleteFile } from '../../store/reducers/filesSlice';
import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

export const getDeleteOTT = (body) => {
  const url = `${API_PATH}/delete/generate/token`;
  return axiosInstance.post(url, body);
};

export const deleteFileEffect = async (slug, dispatch) => {
  const url = `${API_PATH}/files/multiply/delete`;

  return await axiosInstance
    .delete(url, {
      data: [slug]
    })
    .then(() => {
      dispatch(deleteFile(slug));
      return 'success';
    })
    .catch(() => 'error');
};

export const permanentlyDeleteFileEffect = async (slug, dispatch) => {
  const {
    data: {
      user_tokens: { token: oneTimeToken },
      gateway
    }
  } = await getDeleteOTT([slug]);

  const url = `${gateway?.url}/trash/delete`;

  return await axios
    .create({
      headers: {
        'one-time-token': oneTimeToken
      }
    })
    .delete(url, { data: [slug] })
    .then(() => {
      dispatch(deleteFile(slug));
      return 'success';
    })
    .catch(() => 'error');
};
