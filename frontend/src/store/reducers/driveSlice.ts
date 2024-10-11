import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  autoCompleteSearchEffect,
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect,
  getPaidShareFilesEffect,
  updateFileFavoriteEffect
} from '../../effects/filesEffects';
import { uploadFileEffect } from '../../effects/uploadFileEffect';
import { getResponseError } from '../../utils/string';
import { getFileTypesCountEffect } from '../../effects/storageEffects';
import { getAllPartners } from '../../effects/EarnEffect';
import { fromByteToGb, transformSize } from '../../utils/storage';
import { getToken } from '../../effects/set-token';
import { getUserEffect } from '../../effects/userEffects';
import { FileDetails, FileTypesCount } from '../../effects/types/files';
import { RootState } from '.';

interface FilesQueryData {
  search: string | null;
  category: 'all' | 'fav' | 'delete' | 'payShare' | null;
  page: number;
}

interface ExtendedFileTypesCount extends FileTypesCount {
  games: number;
}

interface StorageInfo {
  points: number;
  total: string;
  used: string;
  percent: {
    label: string;
    value: number;
  };
}

type ViewType = 'grid' | 'list';

const driveSlice = createSlice({
  name: 'drive',
  initialState: {
    filesQueryData: {
      search: null,
      category: null,
      page: 1
    } as FilesQueryData,
    viewType: 'grid' as ViewType,
    files: [] as FileDetails[],
    totalFilesCount: 0 as number,
    totalPages: 0 as number,
    itemsPerPage: 0 as number,
    areFilesLoading: false as boolean,
    areFilesLazyLoading: false as boolean,
    uploadFile: {
      isUploading: false as boolean,
      progress: null as number | null,
      isUploaded: false as boolean
    },
    fileTypesCount: {} as ExtendedFileTypesCount,
    fileTypesCountIsFetching: false as boolean,
    fileIsFavoriteUpdating: [] as string[],
    fileMenuModal: null as FileDetails | null,
    storageInfo: null as StorageInfo | null,
    mediaSlider: {
      isOpen: false as boolean,
      previousFile: null as FileDetails | null,
      currentFile: null as FileDetails | null,
      nextFile: null as FileDetails | null
    },
    fileInfoModal: null as FileDetails | null,
    ppvFile: null as FileDetails | null
  },
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
        (state.files[fileIndex] as any)[property] = value;
      }

      if (
        state.mediaSlider.currentFile &&
        state.mediaSlider.currentFile.id === id
      ) {
        (state.mediaSlider.currentFile as any)[property] = value;
      }

      if (state.mediaSlider.nextFile && state.mediaSlider.nextFile.id === id) {
        (state.mediaSlider.nextFile as any)[property] = value;
      }

      if (
        state.mediaSlider.previousFile &&
        state.mediaSlider.previousFile.id === id
      ) {
        (state.mediaSlider.previousFile as any)[property] = value;
      }

      if (state.fileMenuModal && state.fileMenuModal.id === id) {
        (state.fileMenuModal as any)[property] = value;
      }

      if (state.fileInfoModal && state.fileInfoModal.id === id) {
        (state.fileInfoModal as any)[property] = value;
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

export const initDrive = createAsyncThunk(
  'drive/initDrive',
  async (_, { dispatch }) => {
    dispatch(fetchTypesCount({ useLoader: true }));
    dispatch(getUserStorageInfo());
  }
);

export const fetchTypesCount = createAsyncThunk(
  'drive/fetchTypesCount',
  async ({ useLoader }: { useLoader: boolean }, { dispatch }) => {
    if (useLoader) {
      dispatch(setFileTypesCountIsFetching(true));
    }

    const types = await getFileTypesCountEffect();
    const partnersRes = await getAllPartners();
    dispatch(
      setFileTypesCount({
        ...types,
        games: partnersRes.games ? partnersRes.games.length : 0
      })
    );
    dispatch(setFileTypesCountIsFetching(false));
  }
);

export const assignFilesQueryData = createAsyncThunk(
  'drive/assignFilesQueryData',
  async (
    {
      filesQueryData,
      callback
    }: {
      filesQueryData: Partial<FilesQueryData>;
      callback?: (params: FilesQueryData) => void;
    },
    { dispatch, getState }
  ) => {
    /**
     * Type UNDEFINED means that this property of filesQueryData WON'T BE CHECKED and WILL BE PROVIDED DIRECTLY FROM THE STORE.
     * If anything from filesQueryData was assigned,
     * it will be considered as a new value, will be set to global storage
     */
    const state = getState() as RootState;

    let search: FilesQueryData['search'];
    const stateSearch = state.drive.filesQueryData.search;

    let category: FilesQueryData['category'];
    const stateCategory = state.drive.filesQueryData.category;

    let page: FilesQueryData['page'] = 1;
    const statePage = state.drive.filesQueryData.page;

    /** Set query data */
    if (filesQueryData) {
      if (filesQueryData.search !== undefined) {
        let newValue = filesQueryData.search;
        search = newValue;
      } else {
        search = stateSearch;
      }

      if (filesQueryData.category !== undefined) {
        let newValue = filesQueryData.category;
        category = newValue;
      } else {
        category = stateCategory;
      }

      if (filesQueryData.page !== undefined) {
        let newValue = filesQueryData.page;
        page = newValue;
      } else {
        page = statePage;
      }

      dispatch(setFilesQueryData({ search, category, page }));
    } else {
      search = stateSearch;
      category = stateCategory;
      page = statePage;
    }

    callback?.({ search, category, page });
  }
);

export const uploadFile = createAsyncThunk(
  'drive/uploadFile',
  async (
    params: { files: FileList; onUploadCallback: () => void },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    dispatch(setUploadFileIsUploading(true));

    try {
      const afterFileUploadCallback = () => {
        dispatch(setUploadFileIsUploading(false));
        dispatch(setUploadFileProgress(0));
        dispatch(setUploadFileIsUploaded(true));
      };

      await uploadFileEffect({
        files: params.files,
        dispatch,
        afterFileUploadCallback,
        onUploadProgress: (progress) =>
          dispatch(setUploadFileProgress(progress)), // onUploadProgress is not supported yet
        onUploadError: afterFileUploadCallback
      });

      dispatch(fetchTypesCount({ useLoader: false }));

      dispatch(getUserStorageInfo()); // Refresh storage info

      if (state.drive.filesQueryData.category) {
        /** Refresh files if we are in the files list */
        dispatch(assignFilesQueryData({ filesQueryData: { page: 1 } }));
        dispatch(getDriveFiles({ mode: 'replace', page: 1 }));
      }
    } catch (error) {
      toast.error(getResponseError(error), {
        theme: 'colored',
        position: 'bottom-center',
        autoClose: 5000
      });
      dispatch(setUploadFileIsUploading(false));
      dispatch(setUploadFileProgress(0));
      dispatch(setUploadFileIsUploaded(false));
    } finally {
      params.onUploadCallback?.();
    }
  }
);

export const getDriveFiles = createAsyncThunk(
  'drive/getDriveFiles',
  async (
    { mode = 'replace', page }: { mode: 'replace' | 'lazy-add'; page: number },
    { dispatch, getState }
  ) => {
    /** Mode: 'replace' | 'lazy-add'.
     * replace runs areFilesLoading and REPLACES the whole files array
     * lazy-add runs areFilesLazyLoading and ADDS new items to files array
     */
    let files: FileDetails[] = [];
    let totalFilesCount = 0;
    let itemsPerPage = 15;
    let totalPages = 0;
    const state = getState() as RootState;
    const search = state.drive.filesQueryData.search;
    const category = state.drive.filesQueryData.category;
    const newPage =
      page !== undefined ? page : state.drive.filesQueryData.page || 1;

    if (mode === 'replace') {
      dispatch(areFilesLoading(true));
    } else {
      dispatch(areFilesLazyLoading(true));
    }

    /** By the current logic, if search was provided, it will IGNORE other query data. */
    if (search) {
      await autoCompleteSearchEffect(search).then((data) => {
        if (data && data.length && data.length > 0) {
          files = data.map((el) => {
            return { ...el.file };
          });
        }
      });
    }

    /** If search is null or empty */
    if (!search && category) {
      switch (category) {
        case 'all': {
          const res = await getFilesEffect(newPage);
          if (res.data) {
            files = res.data;
            totalFilesCount = res.count;
          }
          break;
        }
        case 'fav': {
          const res = await getFavoritesEffect();
          if (res.data) {
            files = res.data;
            totalFilesCount = res.count;
          }
          break;
        }
        case 'delete': {
          const res = await getDeletedFilesEffect(newPage);
          if (res.data) {
            files = res.data;
            totalFilesCount = res.count;
          }
          break;
        }
        case 'payShare': {
          const res = await getPaidShareFilesEffect(newPage);
          files = res.items.map((item) => {
            const { file, ...selectedFile } = item;
            return { ...file, share_file: selectedFile };
          });
          totalFilesCount = files.length;
          break;
        }
        default: {
          const res = await getFilesByTypeEffect(category, newPage);
          if (res.data) {
            files = res.data;
          }
          totalFilesCount = res.count;
          break;
        }
      }
    }
    totalPages = Math.ceil(totalFilesCount / itemsPerPage);

    if (mode === 'replace') {
      dispatch(setFiles(files));
      dispatch(areFilesLoading(false));
    } else {
      dispatch(addFiles(files));
      dispatch(areFilesLazyLoading(false));
    }

    dispatch(setTotalFilesCount(totalFilesCount));
    dispatch(setTotalPages(totalPages));
  }
);

export const toggleFileFavorite = createAsyncThunk(
  'drive/toggleFileFavorite',
  async ({ slug }: { slug: string }, { dispatch }) => {
    dispatch(setFileIsFavoriteUpdating({ slug, method: 'add' }));
    const res = await updateFileFavoriteEffect(slug);
    if (res) {
      dispatch(
        updateFileProperty({
          id: res.id,
          property: 'user_favorites',
          value: res?.user_favorites
        })
      );
    }
    dispatch(setFileIsFavoriteUpdating({ slug, method: 'remove' }));
  }
);

export const getUserStorageInfo = createAsyncThunk(
  'drive/getUserStorageInfo',
  async (_, { dispatch }) => {
    const token = await getToken();
    if (!token) return;
    const user = await getUserEffect(token);

    const { space_total, space_used, points } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );
    const storageInfo = {
      points,
      total: `${transformSize(String(space_total))}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent}%`, value: percent }
    };

    dispatch(setStorageInfo(storageInfo));
  }
);

export const clearDriveState = createAsyncThunk(
  'drive/clearDriveState',
  async (_, { dispatch }) => {
    dispatch(setFilesQueryData({ search: null, category: null, page: 1 }));
    dispatch(setFiles([]));
    dispatch(setFileMenuModal(null));
    dispatch(clearFileIsFavoriteUpdating());
    dispatch(setMediaSliderOpen(false));
    dispatch(setMediaSliderCurrentFile(null));
  }
);

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
