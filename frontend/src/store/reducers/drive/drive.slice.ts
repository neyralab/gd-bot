import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './drive.state';
import { FileDetails } from '../../../effects/types/files';
import { ExtendedFileTypesCount, FilesQueryData, StorageInfo, ViewType } from './drive.types';

const driveSlice = createSlice({
  name: 'drive',
  initialState: initialState,
  reducers: {
    setFilesQueryData: (state, { payload }: PayloadAction<FilesQueryData>) => {
      state.filesQueryData = payload;
    },
    setViewType: (state, { payload }: PayloadAction<ViewType>) => {
      state.viewType = payload;
    },
    setTotalFilesCount: (state, { payload }: PayloadAction<number>) => {
      state.totalFilesCount = payload;
    },
    setTotalPages: (state, { payload }: PayloadAction<number>) => {
      state.totalPages = payload;
    },
    setItemsPerPage: (state, { payload }: PayloadAction<number>) => {
      state.itemsPerPage = payload;
    },
    setFiles: (state, { payload }: PayloadAction<FileDetails[]>) => {
      state.files = payload;
    },
    updateFileProperty: (
      state,
      {
        payload
      }: PayloadAction<{ id: number; property: keyof FileDetails; value: any }>
    ) => {
      const { id, property, value } = payload;
      const fileIndex = state.files.findIndex((file) => file.id === id);
      if (fileIndex !== -1) {
        (state.files[fileIndex][property] as typeof value) = value;
      }

      if (
        state.mediaSlider.currentFile &&
        state.mediaSlider.currentFile.id === id
      ) {
        (state.mediaSlider.currentFile[property] as typeof value) = value;
      }

      if (state.mediaSlider.nextFile && state.mediaSlider.nextFile.id === id) {
        (state.mediaSlider.nextFile[property] as typeof value) = value;
      }

      if (
        state.mediaSlider.previousFile &&
        state.mediaSlider.previousFile.id === id
      ) {
        (state.mediaSlider.previousFile[property] as typeof value) = value;
      }

      if (state.fileMenuModal && state.fileMenuModal.id === id) {
        (state.fileMenuModal[property] as typeof value) = value;
      }

      if (state.fileInfoModal && state.fileInfoModal.id === id) {
        (state.fileInfoModal[property] as typeof value) = value;
      }
    },

    addFiles: (state, { payload }: PayloadAction<FileDetails[]>) => {
      state.files = [...state.files, ...payload];
    },
    areFilesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.areFilesLoading = payload;
    },
    areFilesLazyLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.areFilesLazyLoading = payload;
    },
    setUploadFileIsUploading: (state, { payload }: PayloadAction<boolean>) => {
      state.uploadFile.isUploading = payload;
    },
    setUploadFileProgress: (
      state,
      { payload }: PayloadAction<number | null>
    ) => {
      state.uploadFile.progress = payload;
    },
    setUploadFileIsUploaded: (state, { payload }: PayloadAction<boolean>) => {
      state.uploadFile.isUploaded = payload;
    },
    setFileTypesCountIsFetching: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.fileTypesCountIsFetching = payload;
    },
    setFileTypesCount: (
      state,
      { payload }: PayloadAction<ExtendedFileTypesCount>
    ) => {
      state.fileTypesCount = payload;
    },
    setFileIsFavoriteUpdating: (
      state,
      { payload }: PayloadAction<{ method: 'add' | 'remove'; slug: string }>
    ) => {
      if (payload.method === 'add') {
        state.fileIsFavoriteUpdating.push(payload.slug);
      } else if (payload.method === 'remove') {
        state.fileIsFavoriteUpdating = state.fileIsFavoriteUpdating.filter(
          (slug) => slug !== payload.slug
        );
      }
    },
    clearFileIsFavoriteUpdating: (state) => {
      state.fileIsFavoriteUpdating = [];
    },
    setFileMenuModal: (
      state,
      { payload }: PayloadAction<FileDetails | null>
    ) => {
      state.fileMenuModal = payload;
    },
    setStorageInfo: (state, { payload }: PayloadAction<StorageInfo | null>) => {
      state.storageInfo = payload;
    },
    setMediaSliderOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.mediaSlider.isOpen = payload;
    },
    setMediaSliderCurrentFile: (
      state,
      { payload }: PayloadAction<FileDetails | null>
    ) => {
      let currentFile = payload;
      let currentFileIndex = -1;
      if (currentFile) {
        currentFileIndex = state.files.findIndex(
          (el) => el.id === currentFile!.id
        );
      }
      if (currentFileIndex >= 0) {
        currentFile = state.files[currentFileIndex];
      }

      let previousFile = null;
      if (currentFileIndex > 0) {
        previousFile = state.files[currentFileIndex - 1];
      }

      let nextFile = null;
      if (currentFileIndex < state.files.length - 1) {
        nextFile = state.files[currentFileIndex + 1];
      }

      state.mediaSlider.previousFile = previousFile;
      state.mediaSlider.currentFile = currentFile;
      state.mediaSlider.nextFile = nextFile;
    },
    setFileInfoModal: (
      state,
      { payload }: PayloadAction<FileDetails | null>
    ) => {
      state.fileInfoModal = payload;
    },
    setPPVFile: (state, { payload }: PayloadAction<FileDetails | null>) => {
      state.ppvFile = payload;
    }
  }
});

export const {
  setFilesQueryData,
  setViewType,
  setTotalFilesCount,
  setTotalPages,
  setItemsPerPage,
  setFiles,
  updateFileProperty,
  addFiles,
  setPPVFile,
  areFilesLoading,
  areFilesLazyLoading,
  setUploadFileIsUploading,
  setUploadFileProgress,
  setUploadFileIsUploaded,
  setFileTypesCount,
  setFileTypesCountIsFetching,
  setFileIsFavoriteUpdating,
  clearFileIsFavoriteUpdating,
  setFileMenuModal,
  setStorageInfo,
  setMediaSliderOpen,
  setMediaSliderCurrentFile,
  setFileInfoModal
} = driveSlice.actions;
export default driveSlice.reducer;
