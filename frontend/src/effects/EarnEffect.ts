import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { formatPartnerResponce } from '../pages/earn/Partners/utils';
import { Task } from './types/tasks';
import { Partner } from './types/partners';
import {
  DataWrappedResponse,
  DefaultError,
  DefaultResponse
} from './types/defaults';

interface CheckTask2Response {
  success: string;
}

export const checkAllEarnTasks = async () => {
  const url = `${API_PATH}/user/earn`;

  try {
    const { data } = await axiosInstance.get<DataWrappedResponse<Task[]>>(url);
    return data.data;
  } catch (e) {
    return false;
  }
};

export const checkTgJoin = async () => {
  const url = `${API_PATH}/join/tg/channel`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    return false;
  }
};

export const checkTgChatJoin = async () => {
  const url = `${API_PATH}/join/tg/chat/channel`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const checkYoutubeJoin = async () => {
  const url = `${API_PATH}/join/youtube`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const checkXJoin = async () => {
  const url = `${API_PATH}/join/twitter`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const checkInstagramJoin = async () => {
  const url = `${API_PATH}/join/instagram`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const checkGithubJoin = async () => {
  const url = `${API_PATH}/join/github`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const getAllPartners = async () => {
  const url = `${API_PATH}/aff/missions/active-goals`;

  try {
    const { data } = await axiosInstance.get<Partner[]>(url);
    return formatPartnerResponce(data);
  } catch (e) {
    const error = e as DefaultError<string>;
    throw error?.response?.data?.errors;
  }
};

export const checkTaskIsDone = async (id: number) => {
  const url = `${API_PATH}/aff/missions/verify/${id}`;

  try {
    const { data } = await axiosInstance.post<CheckTask2Response>(url);
    return data;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const checkWatchVideo = async () => {
  const url = `${API_PATH}/watch/video`;

  try {
    const { data } = await axiosInstance.get<DefaultResponse>(url);
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};

export const trackSocial = async (id: number) => {
  const url = `${API_PATH}/track/social`;

  try {
    const { data } = await axiosInstance.post<DefaultResponse>(url, {
      type: id
    });
    return data?.message;
  } catch (e) {
    const error = e as DefaultError<string>;
    return error?.response?.data?.errors;
  }
};
