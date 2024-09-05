import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  autoCompleteSearchEffect,
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect,
  getPaidShareFilesEffect,
  updateFileFavoriteEffect_v2
} from '../../effects/filesEffects';
import { uploadFileEffect } from '../../effects/uploadFileEffect_v2';
import { getResponseError } from '../../utils/string';
import { getFileTypesCountEffect } from '../../effects/storageEffects';
import { getAllPartners } from '../../effects/EarnEffect';
import { fromByteToGb, transformSize } from '../../utils/storage';
import { getToken } from '../../effects/set-token';
import { getUserEffect } from '../../effects/userEffects';

const driveSlice = createSlice({
  name: 'drive',
  initialState: {
    filesQueryData: {
      search: null, // null | string
      category: null, // null | 'all' | 'fav' | 'delete' | 'payShare'
      page: 1 // number
    },
    viewType: 'grid', // 'grid' | 'list'
    files: [],
    totalFilesCount: 0, // number
    totalPages: 0,
    itemsPerPage: 0,
    areFilesLoading: false,
    areFilesLazyLoading: false,
    uploadFile: {
      isUploading: false,
      progress: null, // number | null
      isUploaded: false
    },
    fileTypesCount: {},
    fileTypesCountIsFetching: false,
    fileIsFavoriteUpdating: [], // slugs
    fileMenuFile: null,
    storageInfo: null
  },
  reducers: {
    setFilesQueryData: (state, { payload }) => {
      state.filesQueryData = payload;
    },
    setViewType: (state, { payload }) => {
      state.viewType = payload;
    },
    setTotalFilesCount: (state, { payload }) => {
      state.totalFilesCount = payload;
    },
    setTotalPages: (state, { payload }) => {
      state.totalPages = payload;
    },
    setItemsPerPage: (state, { payload }) => {
      state.itemsPerPage = payload;
    },
    setFiles: (state, { payload }) => {
      state.files = payload;
    },
    updateFileProperty: (state, { payload }) => {
      const { id, property, value } = payload;
      const fileIndex = state.files.findIndex((file) => file.id === id);
      if (fileIndex !== -1) {
        state.files[fileIndex][property] = value;
      }
    },

    addFiles: (state, { payload }) => {
      state.files = [...state.files, ...payload];
    },
    areFilesLoading: (state, { payload }) => {
      state.areFilesLoading = payload;
    },
    areFilesLazyLoading: (state, { payload }) => {
      state.areFilesLazyLoading = payload;
    },
    setUploadFileIsUploading: (state, { payload }) => {
      state.uploadFile.isUploading = payload;
    },
    setUploadFileProgress: (state, { payload }) => {
      state.uploadFile.progress = payload;
    },
    setUploadFileIsUploaded: (state, { payload }) => {
      state.uploadFile.isUploaded = payload;
    },
    setFileTypesCountIsFetching: (state, { payload }) => {
      state.fileTypesCountIsFetching = payload;
    },
    setFileTypesCount: (state, { payload }) => {
      state.fileTypesCount = payload;
    },
    setFileIsFavoriteUpdating: (state, { payload }) => {
      if (payload.method === 'add') {
        state.fileIsFavoriteUpdating.push(payload.slug);
      } else if (payload.method === 'remove') {
        state.fileIsFavoriteUpdating = state.fileIsFavoriteUpdating.filter(
          (slug) => slug !== payload.slug
        );
      }
    },
    setFileMenuFile: (state, { payload }) => {
      state.fileMenuFile = payload;
    },
    setStorageInfo: (state, { payload }) => {
      state.storageInfo = payload;
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
  async ({ useLoader }, { dispatch }) => {
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
  async ({ filesQueryData, callback }, { dispatch, getState }) => {
    /**
     * Type UNDEFINED means that this property of filesQueryData WON'T BE CHECKED and WILL BE PROVIDED DIRECTLY FROM THE STORE.
     * If anything from filesQueryData was assigned,
     * it will be considered as a new value, will be set to global storage
     */
    const state = getState();

    let search;
    const stateSearch = state.drive.filesQueryData.search;
    let searchIsEqual;

    let category;
    const stateCategory = state.drive.filesQueryData.category;
    let categoryIsEqual;

    let page = 1;
    const statePage = state.drive.filesQueryData.page;
    let pageIsEqual;

    /** Set query data */
    if (filesQueryData) {
      if (filesQueryData.search !== undefined) {
        let newValue = filesQueryData.search;
        search = newValue;
        searchIsEqual = newValue === stateSearch;
      } else {
        search = stateSearch;
      }

      if (filesQueryData.category !== undefined) {
        let newValue = filesQueryData.category;
        category = newValue;
        categoryIsEqual = newValue === stateCategory;
      } else {
        category = stateCategory;
      }

      if (filesQueryData.page !== undefined) {
        let newValue = filesQueryData.page;
        page = newValue;
        pageIsEqual = newValue === statePage;
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
  async ({ files, onUploadCallback }, { dispatch, getState }) => {
    const state = getState();
    dispatch(setUploadFileIsUploading(true));

    try {
      const afterFileUploadCallback = () => {
        dispatch(setUploadFileIsUploading(false));
        dispatch(setUploadFileProgress(0));
        dispatch(setUploadFileIsUploaded(true));
      };

      await uploadFileEffect({
        files,
        afterFileUploadCallback,
        onUploadProgress: (progress) =>
          dispatch(setUploadFileProgress(progress)) // onUploadProgress is not supported yet
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
      onUploadCallback?.();
    }
  }
);

export const getDriveFiles = createAsyncThunk(
  'drive/getDriveFiles',
  async ({ mode = 'replace', page }, { dispatch, getState }) => {
    /** Mode: 'replace' | 'lazy-add'.
     * replace runs areFilesLoading and REPLACES the whole files array
     * lazy-add runs areFilesLazyLoading and ADDS new items to files array
     */
    let files = [];
    let totalFilesCount = 0;
    let itemsPerPage = 15;
    let totalPages = 0;
    const state = getState();
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
        if (data?.length > 0) {
          files = data.map((el) => ({ ...el, isSearch: true }));
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
            const selectedFile = { ...item };
            delete selectedFile.file;
            return { ...item.file, share_file: selectedFile };
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
  async ({ slug }, { dispatch }) => {
    dispatch(setFileIsFavoriteUpdating({ slug, method: 'add' }));
    const res = await updateFileFavoriteEffect_v2(slug);
    dispatch(
      updateFileProperty({
        id: res.id,
        property: 'user_favorites',
        value: res?.user_favorites
      })
    );
    dispatch(setFileIsFavoriteUpdating({ slug, method: 'remove' }));
  }
);

export const getUserStorageInfo = createAsyncThunk(
  'drive/getUserStorageInfo',
  async (_, { dispatch }) => {
    const token = await getToken();
    const user = await getUserEffect(token);

    const { space_total, space_used, points } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );
    const storageInfo = {
      points,
      total: `${transformSize(String(space_total))}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };

    dispatch(setStorageInfo(storageInfo));
  }
);

export const clearDriveState = createAsyncThunk(
  'drive/clearDriveState',
  async (_, { dispatch }) => {
    dispatch(setFilesQueryData({ search: null, category: null, page: 1 }));
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
  areFilesLoading,
  areFilesLazyLoading,
  setUploadFileIsUploading,
  setUploadFileProgress,
  setUploadFileIsUploaded,
  setFileTypesCount,
  setFileTypesCountIsFetching,
  setFileIsFavoriteUpdating,
  setFileMenuFile,
  setStorageInfo
} = driveSlice.actions;
export default driveSlice.reducer;
