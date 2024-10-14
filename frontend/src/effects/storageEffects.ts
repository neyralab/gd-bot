import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { DefaultResponse } from './types/defaults';
import { Notification } from './types/notifications';

interface StorageListResponse {
  data: {
    duration: number;
    id: number;
    multiplicator: number;
    stars: number;
    storage: number;
    ton_price: number;
  } | null;
}

export const storageListEffect = async () => {
  try {
    const response = await axiosInstance.get<StorageListResponse>(
      `${API_PATH}/storage/ton`
    );
    return response.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface FileTypesCountResponse {
  data: {
    audios: number;
    deleted: number;
    docs: number;
    folders: number;
    geo: number;
    images: number;
    links: number;
    memos: number;
    notes: number;
    ppv: number;
    recent: number;
    shared: number;
    starred: number;
    tokenized: number;
    total: number;
    videos: number;
  };
}

export const getFileTypesCountEffect = async () => {
  try {
    const response = await axiosInstance.get<FileTypesCountResponse>(
      `${API_PATH}/workspace/count/types`
    );
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

interface Accumulator {
  sender: {
    unread: Notification[];
    readed: Notification[];
  };
  recipient: Notification[];
}

export const getStorageNotificationsEffect = async () => {
  try {
    const response = await axiosInstance.get<GetStorageNotificationsResponse>(
      `${API_PATH}/storage/pending`
    );
    const data = response.data?.items || [];

    const res = data.reduce<Accumulator>(
      (accumulator, currentValue) => {
        if (
          currentValue.text.includes('accept') ||
          currentValue.text.includes('rejected')
        ) {
          if (currentValue.viewed) {
            return {
              ...accumulator,
              sender: {
                ...accumulator.sender,
                readed: [...accumulator.sender.readed, currentValue]
              }
            };
          } else {
            return {
              ...accumulator,
              sender: {
                ...accumulator.sender,
                unread: [...accumulator.sender.unread, currentValue]
              }
            };
          }
        } else {
          return {
            ...accumulator,
            recipient: [...accumulator.recipient, currentValue]
          };
        }
      },
      { sender: { unread: [], readed: [] }, recipient: [] }
    );

    return res;
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
