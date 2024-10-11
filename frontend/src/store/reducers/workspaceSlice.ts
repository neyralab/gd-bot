import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    currentWorkspace: null as number | null,
    allWorkspaces: null as number[] | null,
    workspacePlan: null as number | boolean | null,
    totalWsCount: 1 as number
  },
  reducers: {
    setCurrentWorkspace: (state, { payload }: PayloadAction<number | null>) => {
      state.currentWorkspace = payload;
    },
    setAllWorkspaces: (state, { payload }: PayloadAction<number[] | null>) => {
      state.allWorkspaces = payload;
      state.totalWsCount = payload ? payload.length : 1;
    },
    setWorkspacePlan: (
      state,
      { payload }: PayloadAction<number | boolean | null>
    ) => {
      state.workspacePlan = payload;
    }
  }
});

export const { setCurrentWorkspace, setAllWorkspaces, setWorkspacePlan } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;

export const selectCurrentWorkspace = (state: RootState) =>
  state.workspace.currentWorkspace;
export const selectWorkspacePlan = (state: RootState) =>
  state.workspace.workspacePlan;
export const selectTotalWsCount = (state: RootState) =>
  state.workspace.totalWsCount;
export const selectAllWorkspaces = (state: RootState) =>
  state.workspace.allWorkspaces;
