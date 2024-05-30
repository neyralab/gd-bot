import { createSlice } from '@reduxjs/toolkit';

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    count: 0,
    page: 1,
    systemFiles: [],
    ghostdriveFiles: [],
    searchAutocomplete: [],
    direction: 'asc',
    view: 'grid'
  },
  reducers: {
    setSystemFiles: (state, { payload }) => {
      state.systemFiles = [...state.systemFiles, ...payload];
    },
    setGhostdriveFiles: (state, { payload }) => {
      state.ghostdriveFiles = [...state.ghostdriveFiles, ...payload];
    },
    setCount: (state, { payload }) => {
      state.count = payload;
    },
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    setSearchAutocomplete: (state, { payload }) => {
      state.searchAutocomplete = [...payload];
    },
    addUploadedFile: (state, { payload }) => {
      state.systemFiles = [...payload, ...state.systemFiles];
      state.ghostdriveFiles = [...payload, ...state.ghostdriveFiles];
    },
    changeDirection: (state, { payload }) => {
      state.ghostdriveFiles = [];
      state.direction = payload;
    },
    changeFileView: (state, { payload }) => {
      state.view = payload;
    },
    addFiles: (state, { payload }) => {
      state.files = [...state.files, ...payload];
    }
  }
});

export const {
  setSystemFiles,
  setGhostdriveFiles,
  addUploadedFile,
  changeDirection,
  changeFileView,
  setSearchAutocomplete,
  setCount,
  setPage,
  addFiles
} = filesSlice.actions;
export default filesSlice.reducer;

export const selectSystemFiles = (state) => state.files.systemFiles;
export const selectGhostdriveFiles = (state) => state.files.ghostdriveFiles;
export const selectFilesCount = (state) => state.files.count;
export const selectFilesPage = (state) => state.files.page;
export const selectSearchAutocomplete = (state) =>
  state.files.searchAutocomplete;
export const selectDirection = (state) => state.files.direction;
export const selectFileView = (state) => state.files.view;
