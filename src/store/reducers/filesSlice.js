import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    searchAutocomplete: [],
    direction: "asc",
    view: "grid",
  },
  reducers: {
    setFiles: (state, { payload }) => {
      state.files = [...payload];
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
  },
});

export const {
  setFiles,
  addUploadedFile,
  changeDirection,
  changeFileView,
  setSearchAutocomplete,
} = filesSlice.actions;
export default filesSlice.reducer;

export const selectFiles = (state) => state.files.files;
export const selectSearchAutocomplete = (state) =>
  state.files.searchAutocomplete;
export const selectDirection = (state) => state.files.direction;
export const selectFileView = (state) => state.files.view;
