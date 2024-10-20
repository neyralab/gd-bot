import { CancelToken } from 'axios';
import { CarReader } from '@ipld/car';
import { saveBlob, downloadFile, downloadFileFromSP } from 'gdgateway-client';
import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { FILE_ACTIONS } from '../config/contracts';
import { sendFileViewStatistic } from './file/statisticEfect';
import { getFileCids } from './file/getFileCid';
import { File, FileDetails, FileToken, PPVFile } from './types/files';
import { DataWrappedResponse, DefaultResponse } from './types/defaults';

type GetDownloadOTTParams = {
  slug: string;
}[];

export const getDownloadOTT = (body: GetDownloadOTTParams) => {
  const url = `${API_PATH}/download/generate/token`;
  return axiosInstance.post<FileToken>(url, body, {
    headers: {
      'X-Action': FILE_ACTIONS.downloaded
    }
  });
};

export const getFilePreviewEffect = async (
  fileId: string,
  cancelToken: CancelToken | undefined = undefined,
  type: string | undefined = undefined
) => {
  try {
    const {
      data: {
        jwt_ott,
        user_tokens: { token: oneTimeToken },
        gateway
      }
    } = await getDownloadOTT([{ slug: fileId }]);

    let url;
    if (type && type.includes('doc')) {
      url = `${gateway.url}/doc/preview/${fileId}`;
    } else {
      url = `${gateway.url}/preview/${fileId}`;
    }

    const response = await axiosInstance.get(url, {
      responseType: 'blob',
      cancelToken,
      headers: {
        'One-Time-Token': oneTimeToken,
        'X-Download-OTT-JWT': jwt_ott
      }
    });

    if (!type || !type.includes('doc')) {
      const text = await response.data.text();
      if (text.startsWith('data:image')) {
        return text;
      }
    }
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(response.data);
  } catch (err) {
    console.log({ downloadErr: err });
    return null;
  }
};

export const downloadFileEffect = async (
  file: FileDetails,
  afterCb: Function
) => {
  const {
    data: {
      jwt_ott,
      user_tokens: { token: oneTimeToken },
      gateway,
      upload_chunk_size
    }
  } = await getDownloadOTT([{ slug: file.slug }]);
  const controller = new AbortController();

  const blob = await downloadFile({
    file,
    oneTimeToken,
    endpoint: gateway.url,
    isEncrypted: false,
    signal: controller.signal,
    uploadChunkSize: upload_chunk_size[file.slug] || gateway.upload_chunk_size,
    jwtOneTimeToken: jwt_ott,
    carReader: CarReader
  });
  if (blob && !blob?.failed) {
    const realBlob = new Blob([blob]);
    saveBlob({
      blob: realBlob,
      name: file?.name
    });
    afterCb && afterCb(file);
    return;
  }
};

export const autoCompleteSearchEffect = async (term: string = '') => {
  try {
    const url = `${API_PATH}/search/autocomplete?term=${term}`;
    const { data } = await axiosInstance.get<File[]>(url);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateShareEffect = async (
  fileId: string,
  shareId: number = 1,
  canComment: boolean = false,
  canEdit: boolean = false,
  expiredAt: number = 0
) => {
  try {
    const url = `${API_PATH}/files/${fileId}/share/${shareId}`;
    const response = await axiosInstance.post(url, {
      canComment: canEdit || canComment,
      canEdit,
      expiredAt
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateFileFavoriteEffect = async (slug: string) => {
  const url = `${API_PATH}/files/favorite/toggle/${slug}`;
  try {
    const { data } =
      await axiosInstance.post<DataWrappedResponse<FileDetails>>(url);
    const file = data?.data;
    return file;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface GetFilesResponse {
  data: FileDetails[];
  count: number;
  members?: unknown[];
  orderBy: unknown;
  orderDirection: unknown;
}

export const getFilesEffect = async (
  page: number = 1,
  order: 'asc' | 'desc' = 'desc'
) => {
  try {
    const url = `${API_PATH}/files`;
    const { data } = await axiosInstance.get<GetFilesResponse>(url, {
      params: { order_by: 'createdAt', order, page }
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface GetPPVFilesResponse {
  items: PPVFile[];
  total: number;
  earned: number;
}

export const getPaidShareFilesEffect = async (page = 1) => {
  try {
    const data = await axiosInstance.get<GetPPVFilesResponse>(
      `${API_PATH}/share/file/list`,
      { params: { page } }
    );
    return data?.data;
  } catch (error) {
    console.error(error);
    throw Error(error as any);
  }
};

export const createPaidShareFileEffect = async (
  id: number,
  body: {
    priceView: number;
    currency: number;
    priceDownload: number;
    description: string;
    file: number;
  }
) => {
  try {
    const data = await axiosInstance.post(`${API_PATH}/share/file/${id}`, body);
    return data?.data;
  } catch (error) {
    console.error(error);
    throw Error(error as any);
  }
};

export const deletePaidShareEffect = async (id: number) => {
  try {
    const url = `${API_PATH}/share/file/${id}`;
    const result = await axiosInstance.delete<DefaultResponse>(url);
    if (result.data.message === 'success') {
      return result.data;
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const getPaidShareFileEffect = async (slug: string) => {
  try {
    const data = await axiosInstance.get(`${API_PATH}/share/file/${slug}`);
    return data?.data;
  } catch (error) {
    throw Error(error as any);
  }
};

export const getFilesByTypeEffect = async (type: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get<GetFilesResponse>(
      `${API_PATH}/files`,
      {
        params: {
          page,
          extension: type,
          order_by: 'createdAt',
          order: 'desc'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

export const getFavoritesEffect = async () => {
  try {
    const response = await axiosInstance.get<GetFilesResponse>(
      `${API_PATH}/files/file/favorites`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

export const getSharedFilesEffect = async (page = 1) => {
  try {
    const response = await axiosInstance.get<GetFilesResponse>(
      `${API_PATH}/files/shared/my`,
      {
        params: { page, order_by: 'createdAt', order: 'desc' }
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

export const getDeletedFilesEffect = async (page = 1) => {
  try {
    const response = await axiosInstance.get<GetFilesResponse>(
      `${API_PATH}/trash`,
      { params: { page } }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

export const getGeoPinFilesEffect = async (page = 1) => {
  try {
    const response = await axiosInstance.get<GetFilesResponse>(
      `${API_PATH}/files/geo/security`,
      {
        params: { page, order_by: 'createdAt', order: 'desc' }
      }
    );
    return response.data.data;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

export const createStreamEffect = async (slug: string) => {
  try {
    const {
      data: {
        user_tokens: { token: oneTimeToken },
        gateway
      }
    } = await getDownloadOTT([{ slug }]);
    const url = `${gateway.url}/stream/${slug}/${oneTimeToken}`;
    return url;
  } catch (error) {
    throw Error(error as any);
  }
};

interface GetFileStarStatisticsResponse {
  action: string;
  stars: string;
  count: number;
}

export const getFileStarStatistic = async (slug: string) => {
  try {
    const { data } = await axiosInstance.get<GetFileStarStatisticsResponse[][]>(
      `${API_PATH}/share/file/stat/${slug}`
    );

    if (data && data.length) {
      const res = data[0]?.reduce(
        (acc, cur) => ({
          view: cur.action === 'view' ? acc.view + cur.count : acc.view,
          stars: acc.stars + (cur.stars ? parseInt(cur.stars, 10) : 0)
        }),
        { view: 0, stars: 0 }
      );

      return res;
    }
    return { view: 0, stars: 0 };
  } catch (error) {
    throw Error(error as any);
  }
};

export const createFileReportEffect = async (
  slug: string,
  body: { comment: string; type: number }
) => {
  try {
    const data = await axiosInstance.post(
      `${API_PATH}/suspicious-report/${slug}`,
      body
    );
    return data.data;
  } catch (error) {
    throw Error(error as any);
  }
};

export const getFilecoinPreviewEffect = async (file: FileDetails) => {
  if (!file) {
    throw new Error('File is empty');
  }
  const fileBlob = await downloadFileFromSP({
    carReader: CarReader,
    url:
      file.storage_provider && file.storage_provider.url
        ? `${file.storage_provider.url}/${
            file.preview_large ?? file.preview_small
          }`
        : '',
    isEncrypted: false,
    uploadChunkSize: 0,
    key: '',
    iv: '',
    file,
    level: 'root'
  });

  if (!fileBlob) {
    throw new Error('Failed to download file');
  }

  const realBlob = new Blob([fileBlob]);
  const text = await realBlob?.text();
  if (text && text.startsWith('data:image')) {
    return text;
  } else {
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(realBlob);
  }
};

export const getFilecoinBlobEffect = async ({
  file,
  getPreview = false
}: {
  file: FileDetails;
  getPreview: boolean;
}) => {
  if (!file) {
    throw new Error('File is empty');
  }

  const promises: Promise<any>[] = [
    sendFileViewStatistic(file.slug),
    getFileCids({ slug: file.slug }),
    getDownloadOTT([{ slug: file.slug }])
  ];

  if (getPreview) {
    promises.push(getFilecoinPreviewEffect(file));
  }

  const [_, cidData, downloadOTTResponse, preview] =
    await Promise.allSettled(promises);

  let blob;

  if (
    cidData.status === 'fulfilled' &&
    downloadOTTResponse.status === 'fulfilled' &&
    cidData.value &&
    downloadOTTResponse.value
  ) {
    const {
      data: {
        jwt_ott,
        user_tokens: { token: oneTimeToken },
        gateway,
        upload_chunk_size
      }
    } = downloadOTTResponse.value;

    blob = await downloadFile({
      file,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: false,
      uploadChunkSize:
        upload_chunk_size[file.slug] || gateway.upload_chunk_size,
      cidData: cidData.value,
      jwtOneTimeToken: jwt_ott,
      carReader: CarReader,
      signal: undefined
    });
  }

  const realBlob = blob ? new Blob([blob]) : null;

  return { realBlob, preview };
};

export const getFilecoinStreamEffect = async ({
  file,
  getPreview = false
}: {
  file: FileDetails;
  getPreview: boolean;
}) => {
  const promises = [createStreamEffect(file.slug)];
  if (getPreview) {
    promises.push(getFilecoinPreviewEffect(file));
  }

  const [streamData, preview] = await Promise.allSettled(promises);

  return { streamData, preview };
};
