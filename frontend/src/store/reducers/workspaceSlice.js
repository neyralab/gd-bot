import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    currentWorkspace: null,
    allWorkspaces: null,
    workspacePlan: null,
    totalWsCount: 1
  },
  reducers: {
    setCurrentWorkspace: (state, { payload }) => {
      state.currentWorkspace = payload;
    },
    setAllWorkspaces: (state, { payload }) => {
      state.allWorkspaces = payload;
      state.totalWsCount = payload ? payload.length : 1;
    },
    setWorkspacePlan: (state, { payload }) => {
      state.workspacePlan = payload;
    }
  }
});

export const { setCurrentWorkspace, setAllWorkspaces, setWorkspacePlan } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;

export const selectCurrentWorkspace = (state) =>
  state.workspace.currentWorkspace;
export const selectWorkspacePlan = (state) => state.workspace.workspacePlan;
export const selectTotalWsCount = (state) => state.workspace.totalWsCount;
export const selectAllWorkspaces = (state) => state.workspace.allWorkspaces;
