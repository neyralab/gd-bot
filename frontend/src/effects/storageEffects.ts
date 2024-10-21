import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { DataWrappedResponse, DefaultResponse } from './types/defaults';
import { FileTypesCount } from './types/files';
import { Notification } from './types/notifications';

interface StorageList {
  duration: number;
  id: number;
  multiplicator: number;
  stars: number;
  storage: number;
  ton_price: number;
}

export const storageListEffect = async () => {
  try {
    const response = await axiosInstance.get<DataWrappedResponse<StorageList>>(
      `${API_PATH}/storage/ton`
    );
    return response.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getFileTypesCountEffect = async () => {
  try {
    const response = await axiosInstance.get<
      DataWrappedResponse<FileTypesCount>
    >(`${API_PATH}/workspace/count/types`);
    return response.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const storageConvertEffect = async (data: { points: number }) => {
  try {
    const response = await axiosInstance.post<DefaultResponse>(
      `${API_PATH}/utilize/points`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface GetStorageNotificationsResponse {
  items: Notification[];
}

export const getStorageNotificationsEffect = async () => {
  try {
    const response = await axiosInstance.get<GetStorageNotificationsResponse>(
      `${API_PATH}/storage/pending`
    );
    const data = response.data?.items || [];

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const acceptStorageGiftEffect = async (token: string) => {
  try {
    const response = await axiosInstance.post<DefaultResponse>(
      `${API_PATH}/share/storage/accept`,
      { token }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const rejectStorageGiftEffect = async (token: string) => {
  try {
    const response = await axiosInstance.post<DefaultResponse>(
      `${API_PATH}/share/storage/reject`,
      { token }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const readNotificationEffect = async (id: number) => {
  try {
    const response = await axiosInstance.post<DefaultResponse>(
      `${API_PATH}/notification/read/${id}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface CreateGiftTokenResponse {
  data: {
    token: string;
  };
}

export const createGiftTokenEffect = async (storage: number) => {
  try {
    const data = await axiosInstance.post<CreateGiftTokenResponse>(
      `${API_PATH}/share/storage/create`,
      {
        storage
      }
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

interface CheckGiftTokenResponse {
  data: {
    user: {
      id: number;
      username: string;
    };
    bytes: number;
  };
}

export const checkGiftTokenEffect = async (token: string) => {
  try {
    const data = await axiosInstance.post<CheckGiftTokenResponse>(
      `${API_PATH}/share/storage/token`,
      {
        token
      }
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};
