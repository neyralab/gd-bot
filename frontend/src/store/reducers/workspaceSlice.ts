import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface InitialState {
  currentWorkspace: number | null;
  allWorkspaces: number[] | null;
  workspacePlan: number | boolean | null;
  totalWsCount: number;
}

const initialState: InitialState = {
  currentWorkspace: null,
  allWorkspaces: null,
  workspacePlan: null,
  totalWsCount: 1
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: initialState,
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
