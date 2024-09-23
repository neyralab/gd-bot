// import { deleteFile } from '../../store/reducers/filesSlice';
import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

export const restoreFileEffect = async (slug, dispatch) => {
  const url = `${API_PATH}/trash/multiply/restore`;
  return await axiosInstance
    .put(url, [slug])
    .then(() => {
      // dispatch(deleteFile(slug));
      return 'success';
    })
    .catch(() => 'error');
};
