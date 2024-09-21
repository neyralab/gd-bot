import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import {
  getPaidShareFilesEffect,
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect
} from '../../effects/filesEffects';
import { increaseUsedSpace, updatePoints } from './userSlice';

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    count: 0,
    page: 1,
    files: [],
    loading: false,
    searchAutocomplete: [],
    selectedFile: {},
    direction: 'asc',
    view: 'grid',
    currentFilter: null,
    typesCount: {},
    uploadingFile: {
      file: null,
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
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setCurrentFilter: (state, { payload }) => {
      state.currentFilter = payload;
    },
    updateFile: (state, { payload }) => {
      const updatedFiles = [...state.files].map((file) =>
        file.id === payload.id ? payload : file
      );
      state.files = [...updatedFiles];
      if (state.selectedFile.id === payload.id) {
        state.selectedFile = { ...state.selectedFile, ...payload };
      }
    },
    setFileTypesCount: (state, { payload }) => {
      state.typesCount = {...state.typesCount, ...payload};
    },
    updateTypesCount: (state) => {
      if (state?.typesCount) {
        state.typesCount.total += 1;
      }
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
  setLoading,
  deleteFile,
  changeuploadingProgress,
  changeTimeLeft,
  updateFile,
  setUploadingFile,
  setCurrentFilter,
  setFileTypesCount,
  updateTypesCount
} = filesSlice.actions;
export default filesSlice.reducer;

export const afterFileUploadAction =
  ({ data, points }) =>
  async (dispatch) => {
    const filePoints = points ?? 0;
    dispatch(addUploadedFile([data]));
    dispatch(updatePoints(filePoints));
    dispatch(increaseUsedSpace(data.size));
    dispatch(updateTypesCount());
  };

export const getFilesAction =
  (filesPage, type) => async (dispatch, getState) => {
    const currentFilter = type ?? getState()?.files?.currentFilter;
    dispatch(setLoading(true));

    try {
      let files, data;
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
        case 'payShare':
          data = await getPaidShareFilesEffect(filesPage);
          files = {
            data: data.items.map((item) => {
              const selectedFile = { ...item };
              delete selectedFile.file;
              return ({ ...item.file, share_file: selectedFile })
            }),
          }
          break;
        default:
          files = await getFilesByTypeEffect(currentFilter, filesPage);
          break;
      }
      dispatch(setFiles(files?.data));
      dispatch(setCount(files?.count));
      dispatch(setLoading(false));
    } catch (error) {
      toast.error('Sorry, something went wrong. Please try again later');
    }
  };

export const selectFiles = (state) => state.files.files;
export const selectFilesLoading = (state) => state.files.loading;
export const selectFilesCount = (state) => state.files.count;
export const selectFilesPage = (state) => state.files.page;
export const selectSearchAutocomplete = (state) =>
  state.files.searchAutocomplete;
export const selectDirection = (state) => state.files.direction;
export const selectFileView = (state) => state.files.view;
export const selecSelectedFile = (state) => state.files.selectedFile;
export const selectUploadingProgress = (state) => state.files.uploadingFile;
export const selectFileTypesCount = (state) => state.files.typesCount;
