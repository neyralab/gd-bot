import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DebounceInput } from 'react-debounce-input';

import {
  changeFileView,
  changeTimeLeft,
  changeuploadingProgress,
  clearSearchAutocomplete,
  getFilesAction,
  selecSelectedFile,
  selectFileTypesCount,
  selectFileView,
  selectFiles,
  selectSearchAutocomplete,
  setFileTypesCount,
  setSearchAutocomplete,
  setUploadingFile
} from '../../store/reducers/filesSlice';
import { getFileTypesCountEffect } from '../../effects/storageEffects';
import { uploadFileEffect } from '../../effects/uploadFileEffect';
import { autoCompleteSearchEffect } from '../../effects/filesEffects';
import { transformSize } from '../../utils/transformSize';
import { fromByteToGb } from '../../utils/storage';
import useButtonVibration from '../../hooks/useButtonVibration';

import { FileFilterPanel } from '../../components/fileFilterPanel';
import FileList from './components/FileList';
import GhostLoader from '../../components/ghostLoader';
import { Header } from '../../components/header';

import { ReactComponent as GridIcon } from '../../assets/grid_view.svg';
import { ReactComponent as ListIcon } from '../../assets/list_view.svg';
import { ReactComponent as PlusIcon } from './assets/plus.svg';
import { ReactComponent as GhostIcon } from './assets/ghost_logo.svg';
import { ReactComponent as SearchIcon } from './assets/search.svg';
import { ReactComponent as BackIcon } from './assets/close.svg';

import style from './style.module.scss';

const MAX_FILE_SIZE = 268435456;

export const FilesSystemPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { t } = useTranslation('drive');
  const files = useSelector(selectFiles);
  const searchFiles = useSelector(selectSearchAutocomplete);
  const view = useSelector(selectFileView);
  const [areFilesLoading, setAreFilesLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const handleVibrationClick = useButtonVibration();
  const checkedFile = useSelector(selecSelectedFile);
  const types = useSelector(selectFileTypesCount);
  const user = useSelector((state) => state?.user?.data);

  const urlParams = new URLSearchParams(window.location.search);
  const currentFileFilter = urlParams.get('type');

  useEffect(() => {
    if (currentFileFilter) {
      dispatch(getFilesAction(1, currentFileFilter));
    }
  }, [currentFileFilter]);

  useEffect(() => {
    getFileTypesCountEffect()
      .then((data) => dispatch(setFileTypesCount(data)))
      .catch(() => toast.error('Failed to load counts'));
  }, []);

  const clearInputsAfterUpload = () => {
    const dataTransfer = new DataTransfer();
    if (fileRef.current) {
      fileRef.current.files = dataTransfer.files;
    }
  };

  const clearUploadState = () => {
    dispatch(changeuploadingProgress({ progress: 0 }));
    dispatch(changeTimeLeft({ timeLeft: 0 }));
    dispatch(setUploadingFile(null));
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

  const onFileViewChange = () => {
    if (view === 'grid') {
      dispatch(changeFileView('list'));
    } else {
      dispatch(changeFileView('grid'));
    }
  };

  const human = useMemo(() => {
    if (!user) return;
    const { space_total, space_used } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );
    return {
      total: `${transformSize(String(space_total), 0)}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  const onBackButtonClick = () => {
    navigate(-1);
    dispatch(clearSearchAutocomplete());
    setSearchValue('');
  };

  if (!types || !human || !user) {
    return (
      <div className={style.loaderContainer}>
        <GhostLoader />
      </div>
    );
  }

  return (
    <div className={style.container}>
      {currentFileFilter && <Header headerClassName={style.header} />}
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
          {currentFileFilter ? (
            <div className={style.search__logo}>
              <GhostIcon />
            </div>
          ) : (
            <div
              className={style.search__logo}
              onClick={handleVibrationClick(onBackButtonClick)}>
              <BackIcon />
            </div>
          )}
        </div>
        {user && human && (
          <div className={style.storage_block}>
            <div className={style.storage_text_container}>
              <p className={style.storage_text}>{`${user?.points} Points`}</p>
              <p className={style.storage_text}>
                {human?.percent?.label} of {human?.total}
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

        {currentFileFilter || searchValue ? (
          <>
            <div className={style.listHeader}>
              <p className={style.listHeader__title}>GHOSTDRIVE</p>
              <button
                className={style.listHeader__viewBtn}
                onClick={handleVibrationClick(onFileViewChange)}>
                {view === 'grid' ? <ListIcon /> : <GridIcon />}
              </button>
            </div>
            <FileList files={fileList} checkedFile={checkedFile} />
          </>
        ) : (
          <FileFilterPanel />
        )}

        {areFilesLoading && (
          <div className={style.loaderWrapper}>
            <GhostLoader />
          </div>
        )}
      </section>
      {!areFilesLoading && (
        <div className={style.buttonsWrapper}>
          <div className={style.uploadButton} onClick={handleVibrationClick()}>
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
        </div>
      )}
    </div>
  );
};
