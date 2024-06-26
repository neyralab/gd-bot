import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DebounceInput } from 'react-debounce-input';

import {
  changeFileView,
  changeTimeLeft,
  changeuploadingProgress,
  clearFiles,
  selecSelectedFile,
  selectFileView,
  selectFiles,
  selectFilesCount,
  selectFilesPage,
  selectSearchAutocomplete,
  selectUploadingProgress,
  setCount,
  setFiles,
  setPage,
  setSearchAutocomplete,
  setSelectedFile,
  setUploadingFile
} from '../../store/reducers/filesSlice';
import { uploadFileEffect } from '../../effects/uploadFileEffect';
import {
  autoCompleteSearchEffect,
  getFilesEffect
} from '../../effects/filesEffects';
import { handleFileMenu } from '../../store/reducers/modalSlice';
import { transformSize } from '../../utils/transformSize';
import { fromByteToGb } from '../../utils/storage';

import { FileItem } from '../../components/fileItem';
import GhostLoader from '../../components/ghostLoader';
import InfiniteScrollComponent from '../../components/infiniteScrollComponent';
import { Header } from '../../components/header';

import { ReactComponent as GridIcon } from '../../assets/grid_view.svg';
import { ReactComponent as ListIcon } from '../../assets/list_view.svg';
import { ReactComponent as FileIcon } from '../../assets/file_draft.svg';
import { ReactComponent as PlusIcon } from './assets/plus.svg';
import { ReactComponent as GhostIcon } from './assets/ghost_logo.svg';
import { ReactComponent as SearchIcon } from './assets/search.svg';

import style from './style.module.scss';

const MAX_FILE_SIZE = 268435456;

export const FilesSystemPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const files = useSelector(selectFiles);
  const searchFiles = useSelector(selectSearchAutocomplete);
  const filesCount = useSelector(selectFilesCount);
  const filesPage = useSelector(selectFilesPage);
  const view = useSelector(selectFileView);
  const [areFilesLoading, setAreFilesLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const checkedFile = useSelector(selecSelectedFile);
  const user = useSelector((state) => state?.user?.data);
  const { progress, file: uploadingFile } = useSelector(
    selectUploadingProgress
  );

  const onBackButtonClick = () => navigate(-1);

  const clearInputsAfterUpload = () => {
    const dataTransfer = new DataTransfer();
    if (fileRef.current) {
      fileRef.current.files = dataTransfer.files;
    }
  };

  const clearUploadState = () => {
    dispatch(changeuploadingProgress({ progress: 0 }));
    dispatch(changeTimeLeft({ timeLeft: 0 }));
    dispatch(setUploadingFile({}));
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files[0].size > MAX_FILE_SIZE) {
      clearInputsAfterUpload();
      toast.info(
        'Max file size to upload is reached. You can not upload files larger than 256MB',
        {
          theme: 'colored',
          position: 'bottom-center',
          autoClose: 5000
        }
      );
      return;
    }
    try {
      setAreFilesLoading(true);
      dispatch(setUploadingFile(files[0]));
      await uploadFileEffect({ files, dispatch });
    } catch (error) {
      toast.error(
        'Something went wrong during upload. Please try again later!',
        {
          theme: 'colored',
          position: 'bottom-center',
          autoClose: 5000
        }
      );
    } finally {
      setAreFilesLoading(false);
      clearInputsAfterUpload();
      clearUploadState();
    }
  };

  const uploadingProgress = useMemo(() => {
    const percentage = (progress / uploadingFile?.size) * 100;
    return `${Math.round(percentage)}/100 %`;
  }, [progress, uploadingFile?.size]);

  const handleInputChange = async (e) => {
    const query = e.target.value.trim();
    setSearchValue(query);
    dispatch(setSearchAutocomplete([]));
    if (query.length > 0) {
      await autoCompleteSearchEffect(query).then((data) => {
        if (data?.length > 0) {
          const searchFiles = data.map((el) => ({ ...el, isSearch: true }));
          dispatch(setSearchAutocomplete(searchFiles));
        } else {
          dispatch(setSearchAutocomplete([]));
        }
      });
    }
  };

  const fileList = useMemo(() => {
    if (searchValue.length < 1) {
      return files;
    } else {
      return searchFiles;
    }
  }, [searchFiles, searchValue, files]);

  useEffect(() => {
    getFilesEffect(filesPage).then(({ data, count }) => {
      dispatch(setFiles(data));
      dispatch(setCount(count));
    });
    return () => {
      dispatch(setPage(1));
      dispatch(clearFiles());
    };
  }, []);

  const fetchMoreFiles = (page) => {
    getFilesEffect(page).then(({ data }) => {
      dispatch(setFiles(data));
    });
  };

  const onFileSelect = (file) => {
    if (file.id === checkedFile.id) {
      dispatch(setSelectedFile({}));
      dispatch(handleFileMenu(false));
    } else {
      dispatch(handleFileMenu(true));
      dispatch(setSelectedFile(file));
    }
  };

  const onFileViewChange = () => {
    if (view === 'grid') {
      dispatch(changeFileView('list'));
    } else {
      dispatch(changeFileView('grid'));
    }
  };

  const human = useMemo(() => {
    if (!user) return;
    const { space_total, storage } = user;
    const percent = Math.round(
      (Number(storage) / space_total + Number.EPSILON) * 100
    );
    return {
      total: `${transformSize(String(space_total), 0)}`,
      used: `${fromByteToGb(storage)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  return (
    <div className={style.container}>
      <Header label={'Upload'} />

      <header className={style.filesHeader}></header>
      <section className={style.wrapper}>
        <div className={style.search}>
          <DebounceInput
            minLength={1}
            debounceTimeout={500}
            name="search"
            id="search"
            maxLength="40"
            placeholder="Search"
            className={style.search__input}
            autoComplete="off"
            onChange={handleInputChange}
          />
          <label htmlFor="search" className={style.search__icon}>
            <SearchIcon />
          </label>
          <div className={style.search__logo}>
            <GhostIcon />
          </div>
        </div>
        {user && human && (
          <div className={style.storage_block}>
            <div className={style.storage_text_container}>
              <p className={style.storage_text}>{`${user?.points} Points`}</p>
              <p className={style.storage_text}>
                {human?.used} of {human?.total}
              </p>
            </div>
            <div className={style.storage_usage_container}>
              <div
                className={style.storage_usage}
                style={{ width: human?.percent?.label }}
              />
            </div>
          </div>
        )}
        <div className={style.listHeader}>
          <p className={style.listHeader__title}>GHOSTDRIVE</p>
          <button
            className={style.listHeader__viewBtn}
            onClick={onFileViewChange}>
            {view === 'grid' ? <ListIcon /> : <GridIcon />}
          </button>
        </div>
        {areFilesLoading ? (
          <div className={style.loaderWrapper}>
            <GhostLoader texts={[`Uploading: ${uploadingProgress}`]} />
          </div>
        ) : fileList.length ? (
          <InfiniteScrollComponent
            totalItems={filesCount}
            files={fileList}
            fetchMoreFiles={fetchMoreFiles}>
            <ul className={style.filesList}>
              {fileList.map((file) => (
                <FileItem
                  file={file}
                  key={file.id}
                  checkedFile={checkedFile}
                  callback={onFileSelect}
                />
              ))}
            </ul>
          </InfiniteScrollComponent>
        ) : (
          <div className={style.emptyFilesPage}>
            <FileIcon />
            <h2 className={style.emptyFilesPage_title}>Files not found</h2>
            <p className={style.emptyFilesPage_desc}>This page is empty</p>
          </div>
        )}
      </section>
      {!areFilesLoading && (
        <div className={style.uploadButton}>
          <input
            name="file"
            id="file"
            type="file"
            ref={fileRef}
            className={style.hiddenInput}
            onChange={handleFileUpload}
          />
          <label htmlFor="file" className={style.uploadButton__icon}>
            <PlusIcon />
          </label>
        </div>
      )}
    </div>
  );
};
