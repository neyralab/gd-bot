import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

interface GetFileCidsParams {
  slug: string;
}

interface GetFileCidsResponse {
  cids: string[];
  level: string;
  slug: string;
  upload_chunk_size: number | null;
}

export const getFileCids = async ({ slug }: GetFileCidsParams) => {
  const response = await axiosInstance.get<GetFileCidsResponse>(
    `${API_PATH}/files/file/cid/${slug}/interim`
  );
  return response.data;
};
