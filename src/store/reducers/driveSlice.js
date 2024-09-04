import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  autoCompleteSearchEffect,
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect,
  getPaidShareFilesEffect
} from '../../effects/filesEffects';
import { toast } from 'react-toastify';
import { uploadFileEffect } from '../../effects/uploadFileEffect_v2';
import { getResponseError } from '../../utils/string';
import { getFileTypesCountEffect } from '../../effects/storageEffects';
import { getAllPartners } from '../../effects/EarnEffect';

const driveSlice = createSlice({
  name: 'drive',
  initialState: {
    filesQueryData: {
      search: null, // null | string
      category: null, // null | 'all' | 'fav' | 'delete' | 'payShare'
      page: null // null | number
    },
    viewType: 'grid', // 'grid' | 'list'
    files: [],
    uploadFile: {
      isUploading: false,
      progress: null, // number | null
      isUploaded: false
    },
    fileTypesCount: {},
    fileTypesCountIsFetching: false
  },
  reducers: {
    setFilesQueryData: (state, { payload }) => {
      state.filesQueryData = payload;
    },
    setViewType: (state, { payload }) => {
      state.viewType = payload;
    },
    setFiles: (state, { payload }) => {
      state.files = payload;
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
    }
  }
});

export const initDrive = createAsyncThunk(
  'drive/initDrive',
  async (_, { dispatch }) => {
    dispatch(fetchTypesCount({ useLoader: true }));
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

    let page;
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
  async ({ files, onUploadCallback }, { dispatch }) => {
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

      // TODO: REFETCH FILES IF NEEDED
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

// export const runFilesQuery = createAsyncThunk(
//   'drive/runFilesQuery',
//   async (
//     {
//       filesQueryData,
//       refetchFiles = true,
//       checkEqual = true,
//       lazyLoad = false
//     },
//     { dispatch, getState }
//   ) => {
//     /** How does this work:
//      *
//      * ==========
//      * filesQueryData: {search: string | null | undefined, filter: string | null | undefined}
//      * ==========
//      * Type UNDEFINED means that this property of filesQueryData WON'T BE CHECKED and WILL BE PROVIDED DIRECTLY FROM THE STORE.
//      * If anything from filesQueryData was assigned,
//      * it will be considered as a new value, will be set to global storage
//      *
//      * ==========
//      * refetchFiles: boolean
//      * ==========
//      * You can fetch data after query data set or not. If you only ned to reset the search/sort/filters, use refetchFiles: false
//      * If refetchFiles is false, checkEqual will be ignored
//      *
//      * ==========
//      * checkEqual: boolean
//      * ==========
//      * If checkEqual: true, data won't be fetched again if all the provided filesQueryData properties are equal to the store ones
//      * If checkEqual: false, data will be fetched even if query is the same UNLESS refetchFiles is false
//      */
//     const state = getState();

//     let search;
//     const stateSearch = state.drive.filesQueryData.search;
//     let searchIsEqual;

//     let category;
//     const stateCategory = state.drive.filesQueryData.category;
//     let categoryIsEqual;

//     /** Set query data */
//     if (filesQueryData) {
//       if (filesQueryData.search !== undefined) {
//         let newValue = filesQueryData.search.trim();
//         search = newValue;
//         searchIsEqual = newValue === stateSearch;
//       } else {
//         search = stateSearch;
//       }

//       if (filesQueryData.category !== undefined) {
//         let newValue = filesQueryData.category;
//         category = newValue;
//         categoryIsEqual = newValue === stateCategory;
//       } else {
//         category = stateCategory;
//       }

//       dispatch(setFilesQueryData({ search, category }));
//     } else {
//       search = stateSearch;
//       category = stateCategory;
//     }

//     /** Set Files */
//     if (refetchFiles) {
//       let files = [];

//       /** By the current logic, if search was provided, it will IGNORE other query data. */
//       if (search) {
//         await autoCompleteSearchEffect(search).then((data) => {
//           if (data?.length > 0) {
//             files = data.map((el) => ({ ...el, isSearch: true }));
//           }
//         });
//       }

//       /** If search is null or empty */
//       if (!search) {
//         switch (filter) {
//           case 'all': {
//             const res = await getFilesEffect(filesPage);
//             if (res.data) {
//               files = res.data;
//             }
//             break;
//           }
//           case 'fav': {
//             const res = await getFavoritesEffect();
//             if (res.data) {
//               files = res.data;
//             }
//             break;
//           }
//           case 'delete': {
//             const res = await getDeletedFilesEffect(filesPage);
//             if (res.data) {
//               files = res.data;
//             }
//             break;
//           }
//           case 'payShare': {
//             const res = await getPaidShareFilesEffect(filesPage);
//             files = data.items.map((item) => {
//               const selectedFile = { ...item };
//               delete selectedFile.file;
//               return { ...item.file, share_file: selectedFile };
//             });
//             break;
//           }
//           //   default: {
//           //     const res = await getFilesByTypeEffect(currentFilter, filesPage);
//           //     if (res.data) {
//           //       files = res.data;
//           //     }
//           //     break;
//           //   }
//         }
//       }

//       dispatch(setFiles(files));
//     }
//   }
// );

export const {
  setFilesQueryData,
  setViewType,
  setFiles,
  setUploadFileIsUploading,
  setUploadFileProgress,
  setUploadFileIsUploaded,
  setFileTypesCount,
  setFileTypesCountIsFetching
} = driveSlice.actions;
export default driveSlice.reducer;
