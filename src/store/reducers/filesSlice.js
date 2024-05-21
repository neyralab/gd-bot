import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    count: 0,
    page: 1,
    files: [],
    searchAutocomplete: [],
    direction: "asc",
    view: "grid",
  },
  reducers: {
    setFiles: (state, { payload }) => {
      state.files = [...payload];
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
      state.files = [...payload, ...state.files];
    },
    changeDirection: (state, { payload }) => {
      state.direction = payload;
    },
    changeFileView: (state, { payload }) => {
      state.view = payload;
    },
    addFiles: (state, { payload }) => {
      state.files = [...state.files, ...payload];
    },
  },
});

export const {
  setFiles,
  addUploadedFile,
  changeDirection,
  changeFileView,
  setSearchAutocomplete,
  setCount,
  setPage,
  addFiles,
} = filesSlice.actions;
export default filesSlice.reducer;

export const selectFiles = (state) => state.files.files;
export const selectFilesCount = (state) => state.files.count;
export const selectFilesPage = (state) => state.files.page;
export const selectSearchAutocomplete = (state) =>
  state.files.searchAutocomplete;
export const selectDirection = (state) => state.files.direction;
export const selectFileView = (state) => state.files.view;
