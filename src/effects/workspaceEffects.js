import axiosInstance from "./axiosInstance";
import setToken from "./set-token";

export const setIsWorkspaceSelected = (bool) => {
  sessionStorage.setItem("ws_selected", bool);
};

export const getIsWorkspaceSelected = () => {
  return JSON.parse(sessionStorage.getItem("ws_selected"));
};

export const getWorkspacesEffect = async () => {
  return await axiosInstance
    .get(`${process.env.REACT_APP_API_PATH}/user/workspaces`)
    .then((response) => response.data.data)
    .catch((err) => err);
};

export const switchWorkspace = async (workspace_id) => {
  return await axiosInstance
    .get(
      `${process.env.REACT_APP_API_PATH}/workspace/switch?workspace_id=${workspace_id}`
    )
    .then((response) => {
      setToken(response.data.token);
      return response.data;
    })
    .catch((response) => {
      throw response;
    });
};
