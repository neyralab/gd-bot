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

export const getFileTypesCountEffect = async () => {
  return axiosInstance
    .get(`${API_PATH}/workspace/count/types`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      throw e;
    });
};


export const storageConvertEffect = async (data) => {
  return axiosInstance
    .post(`${API_PATH}/utilize/points`, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const storageSendEffect = async (data) => {
  return axiosInstance
    .post(`${API_PATH}/storage/send`, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {throw e});
};

export const getStorageNotificationsEffect = async () => {
  return axiosInstance
    .get(`${API_PATH}/storage/pending`)
    .then((response) => {
      const data = response.data?.items || [];
      const res = data.reduce((accumulator, currentValue) => {
        if (currentValue.text.includes('accept') || currentValue.text.includes('rejected')) {
          return currentValue.viewed ?
            { ...accumulator, sender: { ...accumulator.sender, readed: [...accumulator.sender.readed, currentValue] } } :
            { ...accumulator, sender: { ...accumulator.sender, unread: [...accumulator.sender.unread, currentValue] } }
        } else {
          return { ...accumulator, recipient: [ ...accumulator.recipient, currentValue] }
        }
      }, { sender: { unread: [], readed: [] }, recipient: [] });
      return res;
    })
    .catch((e) => {throw e});
};

export const acceptStorageGiftEffect = async (id) => {
  return axiosInstance
    .post(`${API_PATH}/storage/${id}/accept `)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {throw e});
};

export const rejectStorageGiftEffect = async (id) => {
  return axiosInstance
    .post(`${API_PATH}/storage/${id}/reject `)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {throw e});
};

export const readNotificationEffect = async (id) => {
  return axiosInstance
    .post(`${API_PATH}/notification/read/${id}`)
    .then((response) => {
      return response;
    })
    .catch((e) => {throw e});
};