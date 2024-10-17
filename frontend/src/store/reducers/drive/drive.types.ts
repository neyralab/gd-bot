import { FileDetails, FileTypesCount } from '../../../effects/types/files';

export interface FilesQueryData {
  search: string | null;
  category: 'all' | 'fav' | 'delete' | 'payShare' | null;
  page: number;
}

export interface ExtendedFileTypesCount extends FileTypesCount {
  games: number;
}

export interface StorageInfo {
  points: number;
  total: string;
  used: string;
  percent: {
    label: string;
    value: number;
  };
}

export type ViewType = 'grid' | 'list';

export interface MediaSlider {
  isOpen: boolean;
  previousFile: FileDetails | null;
  currentFile: FileDetails | null;
  nextFile: FileDetails | null;
}

export interface UploadFile {
  isUploading: boolean;
  progress: number | null;
  isUploaded: boolean;
}

export interface InitialState {
  filesQueryData: FilesQueryData;
  viewType: ViewType;
  files: FileDetails[];
  totalFilesCount: number;
  totalPages: number;
  itemsPerPage: number;
  areFilesLoading: boolean;
  areFilesLazyLoading: boolean;
  uploadFile: UploadFile;
  fileTypesCount: ExtendedFileTypesCount | {};
  fileTypesCountIsFetching: boolean;
  fileIsFavoriteUpdating: string[];
  fileMenuModal: FileDetails | null;
  storageInfo: StorageInfo | null;
  mediaSlider: MediaSlider;
  fileInfoModal: FileDetails | null;
  ppvFile: FileDetails | null;
}
