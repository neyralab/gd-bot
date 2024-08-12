import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { formatPartnerResponce } from '../pages/earn/Partners/utils';

export const checkAllEarnTasks = async () => {
  const url = `${API_PATH}/user/earn`;

  try {
    const { data } = await axiosInstance.get(url);
    return data.data;
  } catch (e) {
    return false;
  }
};

export const checkTgJoin = async () => {
  const url = `${API_PATH}/join/tg/channel`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return false;
  }
};

export const checkTgChatJoin = async () => {
  const url = `${API_PATH}/join/tg/chat/channel`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const checkYoutubeJoin = async () => {
  const url = `${API_PATH}/join/youtube`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const checkXJoin = async () => {
  const url = `${API_PATH}/join/twitter`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const checkInstagramJoin = async () => {
  const url = `${API_PATH}/join/instagram`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const checkGithubJoin = async () => {
  const url = `${API_PATH}/join/github`;

  try {
    const { data } = await axiosInstance.get(url);
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const getAllPartners = async () => {
  const url = `${API_PATH}/aff/missions/active-goals`;

  try {
    const { data } = await axiosInstance.get(url);
    return formatPartnerResponce(data);
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const checkTaskIsDone = async (id) => {
  const url = `${API_PATH}/aff/missions/verify/${id}`;

  try {
    const { data } = await axiosInstance.post(url);
    return data
  } catch (e) {
    return e?.response?.data?.errors;
  }
};

export const trackSocial = async (id) => {
  const url = `${API_PATH}/track/social`;

  try {
    const { data } = await axiosInstance.post(url, { type: id });
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
}