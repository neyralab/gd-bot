import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addFiles,
  areFilesLazyLoading,
  areFilesLoading,
  clearFileIsFavoriteUpdating,
  setFileIsFavoriteUpdating,
  setFileMenuModal,
  setFiles,
  setFilesQueryData,
  setFileTypesCount,
  setFileTypesCountIsFetching,
  setMediaSliderCurrentFile,
  setMediaSliderOpen,
  setStorageInfo,
  setTotalFilesCount,
  setTotalPages,
  setUploadFileIsUploaded,
  setUploadFileIsUploading,
  setUploadFileProgress,
  updateFileProperty
} from './drive.slice';
import { getFileTypesCountEffect } from '../../../effects/storageEffects';
import { getAllPartners } from '../../../effects/EarnEffect';
import { FilesQueryData } from './drive.types';
import { RootState } from '..';
import { uploadFileEffect } from '../../../effects/uploadFileEffect';
import { getResponseError } from '../../../utils/string';
import { FileDetails } from '../../../effects/types/files';
import {
  autoCompleteSearchEffect,
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect,
  getPaidShareFilesEffect,
  updateFileFavoriteEffect
} from '../../../effects/filesEffects';
import { getToken } from '../../../effects/set-token';
import { getUserEffect } from '../../../effects/userEffects';
import { fromByteToGb, transformSize } from '../../../utils/storage';

export const initDrive = createAsyncThunk(
  'drive/initDrive',
  async (_, { dispatch }) => {
    dispatch(fetchTypesCount({ useLoader: true }));
    dispatch(getUserStorageInfo());
  }
);

interface FetchTypesCountParams {
  useLoader: boolean;
}

export const fetchTypesCount = createAsyncThunk(
  'drive/fetchTypesCount',
  async ({ useLoader }: FetchTypesCountParams, { dispatch }) => {
    if (useLoader) {
      dispatch(setFileTypesCountIsFetching(true));
    }

    const types = await getFileTypesCountEffect();
    const partnersRes = await getAllPartners();
    if (partnersRes) {
      dispatch(
        setFileTypesCount({
          ...types,
          games: partnersRes.games ? partnersRes.games.length : 0
        })
      );
    }
    dispatch(setFileTypesCountIsFetching(false));
  }
);

interface AssignFilesQueryParams {
  filesQueryData: Partial<FilesQueryData>;
  callback?: (params: FilesQueryData) => void;
}

export const assignFilesQueryData = createAsyncThunk(
  'drive/assignFilesQueryData',
  async (
    { filesQueryData, callback }: AssignFilesQueryParams,
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
