import axiosInstance from './axiosInstance';
import { setToken } from './set-token';
import { API_PATH } from '../utils/api-urls';

export const setIsWorkspaceSelected = (bool) => {
  sessionStorage.setItem('ws_selected', bool);
};

export const getIsWorkspaceSelected = () => {
  return JSON.parse(sessionStorage.getItem('ws_selected'));
};

export const getWorkspacesEffect = async (token) => {
  return await axiosInstance
    .create({
      headers: {
        'X-Token': `Bearer ${token}`
      }
    })
    .get(`${API_PATH}/user/workspaces`)
    .then((response) => response.data.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const switchWorkspace = async (workspace_id) => {
  return await axiosInstance
    .get(`${API_PATH}/workspace/switch?workspace_id=${workspace_id}`)
    .then(async (response) => {
      await setToken(response.data.token);
      return response.data;
    })
    .catch((response) => {
      throw response;
    });
};
