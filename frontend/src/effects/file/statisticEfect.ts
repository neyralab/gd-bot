import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';
import { FileStatistics } from '../types/files';

export const sendFileViewStatistic = async (slug: string) => {
  try {
    const response = await axiosInstance.post<{ data: FileStatistics }>(
      `${API_PATH}/statistic/${slug}/1`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
