import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { DataWrappedResponse, DefaultResponse } from './types/defaults';
import { FileTypesCount } from './types/files';
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
  return axiosInstance
    .get<StorageListResponse>(`${API_PATH}/storage/ton`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const getFileTypesCountEffect = async () => {
  return axiosInstance
    .get<DataWrappedResponse<FileTypesCount>>(
      `${API_PATH}/workspace/count/types`
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const storageConvertEffect = async (data: { points: number }) => {
  return axiosInstance
    .post<DefaultResponse>(`${API_PATH}/utilize/points`, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
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
  return axiosInstance
    .get<GetStorageNotificationsResponse>(`${API_PATH}/storage/pending`)
    .then((response) => {
      const data = response.data?.items || [];
      const res = data.reduce<Accumulator>(
        (accumulator, currentValue) => {
          if (
            currentValue.text.includes('accept') ||
            currentValue.text.includes('rejected')
          ) {
            return currentValue.viewed
              ? {
                  ...accumulator,
                  sender: {
                    ...accumulator.sender,
                    readed: [...accumulator.sender.readed, currentValue]
                  }
                }
              : {
                  ...accumulator,
                  sender: {
                    ...accumulator.sender,
                    unread: [...accumulator.sender.unread, currentValue]
                  }
                };
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
    })
    .catch((e) => {
      throw e;
    });
};

export const acceptStorageGiftEffect = async (token: string) => {
  return axiosInstance
    .post<DefaultResponse>(`${API_PATH}/share/storage/accept`, { token })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const rejectStorageGiftEffect = async (token: string) => {
  return axiosInstance
    .post<DefaultResponse>(`${API_PATH}/share/storage/reject`, { token })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const readNotificationEffect = async (id: number) => {
  return axiosInstance
    .post<DefaultResponse>(`${API_PATH}/notification/read/${id}`)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      throw e;
    });
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
