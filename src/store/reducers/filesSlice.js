import { createSlice } from '@reduxjs/toolkit';
import {
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect
} from '../../effects/filesEffects';
import { toast } from 'react-toastify';

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    count: 0,
    page: 1,
    files: [],
    searchAutocomplete: [],
    selectedFile: {},
    direction: 'asc',
    view: 'grid',
    currentFilter: null,
    uploadingFile: {
      file: {},
      progress: 0,
      timeLeft: 0,
      id: null
    }
  },
  reducers: {
    setFiles: (state, { payload }) => {
      state.files = [...state.files, ...payload];
    },
    setSelectedFile: (state, { payload }) => {
      state.selectedFile = payload;
    },
    clearFiles: (state) => {
      state.files = [];
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
    clearSearchAutocomplete: (state) => {
      state.searchAutocomplete = [];
    },
    addUploadedFile: (state, { payload }) => {
      if (state.currentFilter) {
        state.files = [...payload, ...state.files];
      }
    },
    changeDirection: (state, { payload }) => {
      state.files = [];
      state.direction = payload;
    },
    changeFileView: (state, { payload }) => {
      state.view = payload;
    },
    deleteFile: (state, { payload }) => {
      const files = state.files.filter((file) => file.slug !== payload);
      state.files = files;
    },
    changeuploadingProgress: (state, { payload }) => {
      state.uploadingFile.progress = payload.progress;
    },
    changeTimeLeft: (state, { payload }) => {
      state.uploadingFile.timeLeft = payload.timeLeft;
    },
    setUploadingFile: (state, { payload }) => {
      state.uploadingFile.file = payload;
    },
    setCurrentFilter: (state, { payload }) => {
      state.currentFilter = payload;
    },
    updateFile: (state, { payload }) => {
      const updatedFiles = [...state.files].map((file) =>
        file.id === payload.id ? payload : file
      );
      state.files = [...updatedFiles];
    }
  }
});

export const {
  addUploadedFile,
  changeDirection,
  changeFileView,
  setSearchAutocomplete,
  clearSearchAutocomplete,
  setCount,
  setPage,
  clearFiles,
  setSelectedFile,
  setFiles,
  deleteFile,
  changeuploadingProgress,
  changeTimeLeft,
  updateFile,
  setUploadingFile,
  setCurrentFilter
} = filesSlice.actions;
export default filesSlice.reducer;

export const getFilesAction =
  (filesPage, type) => async (dispatch, getState) => {
    const currentFilter = type ?? getState()?.files?.currentFilter;

    try {
      let files;
      switch (currentFilter) {
        case 'all':
          files = await getFilesEffect(filesPage);
          break;
        case 'fav':
          files = await getFavoritesEffect();
          break;
        case 'delete':
          files = await getDeletedFilesEffect(filesPage);
          break;
        default:
          files = await getFilesByTypeEffect(currentFilter, filesPage);
          break;
      }
      dispatch(setFiles(files?.data));
      dispatch(setCount(files?.count));
    } catch (error) {
      toast.error('Sorry, something went wrong. Please try again later');
    }
  };

export const selectFiles = (state) => state.files.files;
export const selectFilesCount = (state) => state.files.count;
export const selectFilesPage = (state) => state.files.page;
export const selectSearchAutocomplete = (state) =>
  state.files.searchAutocomplete;
export const selectDirection = (state) => state.files.direction;
export const selectFileView = (state) => state.files.view;
export const selecSelectedFile = (state) => state.files.selectedFile;
export const selectUploadingProgress = (state) => state.files.uploadingFile;
