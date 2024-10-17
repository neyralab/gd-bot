import { InitialState } from './drive.types';

export const initialState: InitialState = {
  filesQueryData: {
    search: null,
    category: null,
    page: 1
  },
  viewType: 'grid',
  files: [],
  totalFilesCount: 0,
  totalPages: 0,
  itemsPerPage: 0,
  areFilesLoading: false,
  areFilesLazyLoading: false,
  uploadFile: {
    isUploading: false,
    progress: null,
    isUploaded: false
  },
  fileTypesCount: {},
  fileTypesCountIsFetching: false,
  fileIsFavoriteUpdating: [],
  fileMenuModal: null,
  storageInfo: null,
  mediaSlider: {
    isOpen: false,
    previousFile: null,
    currentFile: null,
    nextFile: null
  },
  fileInfoModal: null,
  ppvFile: null,
  payShareEarn: null,
};
