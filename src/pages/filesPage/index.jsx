import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import {
  changeDirection,
  changeFileView,
  clearFiles,
  selecSelectedFile,
  selectDirection,
  selectFileView,
  selectFiles,
  selectFilesCount,
  selectFilesPage,
  selectSearchAutocomplete,
  setCount,
  setFiles,
  setPage,
  setSearchAutocomplete,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import {
  autoCompleteSearchEffect,
  downloadFileEffect,
  getFileInfoEffect,
  getFilesEffect,
  updateEntrySorting
} from '../../effects/filesEffects';
import { handleFileMenu } from '../../store/reducers/modalSlice';
import { useClickOutside } from '../../utils/useClickOutside';

import { FileItem } from '../../components/fileItem';
import InfiniteScrollComponent from '../../components/infiniteScrollComponent';

import { ReactComponent as SearchIcon } from '../../assets/search_input.svg';
import { ReactComponent as GridIcon } from '../../assets/grid_view.svg';
import { ReactComponent as ListIcon } from '../../assets/list_view.svg';
import { ReactComponent as ArrowIcon } from '../../assets/arrow_up.svg';
import { ReactComponent as FileIcon } from '../../assets/file_draft.svg';

import style from './style.module.css';

export const FilesPage = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  const filesCount = useSelector(selectFilesCount);
  const filesPage = useSelector(selectFilesPage);
  const searchFiles = useSelector(selectSearchAutocomplete);
  const dir = useSelector(selectDirection);
  const view = useSelector(selectFileView);
  const checkedFile = useSelector(selecSelectedFile);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    getFilesEffect(filesPage, dir).then(({ data, count }) => {
      dispatch(setFiles(data));
      dispatch(setCount(count));
    });
    return () => {
      dispatch(setPage(1));
      dispatch(clearFiles());
    };
  }, [dir]);

  const fetchMoreFiles = (page) => {
    getFilesEffect(page, dir).then(({ data }) => {
      dispatch(setFiles(data));
    });
  };

  const handleClickOutside = () => {
    setIsPopupOpen(false);
    const file = checkedFile?.is_search ? {} : checkedFile;
    dispatch(setSelectedFile(file));
  };

  useClickOutside(searchRef, handleClickOutside);

  const onBackButtonClick = () => navigate(-1);

  const onFileSelect = (file) => {
    if (file.id === checkedFile.id) {
      dispatch(setSelectedFile({}));
      dispatch(handleFileMenu(false));
    } else {
      dispatch(handleFileMenu(true));
      dispatch(setSelectedFile(file));
    }
  };

  const handleFileDownload = async () => {
    setLoading(true);
    await downloadFileEffect(checkedFile);
    dispatch(setSelectedFile({}));
    setLoading(false);
  };

  const onDirectionChange = async () => {
    if (dir === 'asc') {
      await updateEntrySorting('desc');
      dispatch(changeDirection('desc'));
    } else {
      await updateEntrySorting('asc');
      dispatch(changeDirection('asc'));
    }
  };

  const onFileViewChange = () => {
    if (view === 'grid') {
      dispatch(changeFileView('list'));
    } else {
      dispatch(changeFileView('grid'));
    }
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    dispatch(setSearchAutocomplete([]));
    await autoCompleteSearchEffect(query).then((data) => {
      if (data?.length > 0) {
        setIsPopupOpen(true);
        dispatch(setSearchAutocomplete(data));
      } else {
        dispatch(setSearchAutocomplete([]));
      }
    });
  };

  // Get all file info from search file
  const handleSearchFileClick = async (file) => {
    await getFileInfoEffect(file.slug).then((data) =>
      onFileSelect({ ...data, id: file.id, is_search: true })
    );
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        <button className={style.header__backBtn} onClick={onBackButtonClick}>
          Back
        </button>
        <h2 className={style.header__title}>Files</h2>
      </header>
      <div className={style.inputWrapper} ref={searchRef}>
        <SearchIcon className={style.inputWrapper__icon} />
        <input
          ref={inputRef}
          placeholder="Search"
          className={style.inputWrapper__input}
          onChange={handleInputChange}
        />
        {isPopupOpen && (
          <ul className={style.autocompleteWrapper}>
            {searchFiles.map((file) => (
              <FileItem
                file={file}
                checkedFile={checkedFile}
                callback={onFileSelect}
                key={file.id}
                fileView={'list'}
                isSearch={true}
              />
            ))}
          </ul>
        )}
      </div>
      <div className={style.actionButtons}>
        <button
          className={cn(
            style.actionButtons__sort,
            dir === 'desc' && style.descending__dir
          )}
          onClick={onDirectionChange}>
          Created
          <ArrowIcon />
        </button>
        <button
          className={style.actionButtons__view}
          onClick={onFileViewChange}>
          {view === 'grid' ? <ListIcon /> : <GridIcon />}
        </button>
      </div>
      {files.length > 0 ? (
        <>
          <InfiniteScrollComponent
            totalItems={filesCount}
            files={files}
            fetchMoreFiles={fetchMoreFiles}>
            <ul className={style.filesList}>
              {files.map((file) => (
                <FileItem
                  file={file}
                  checkedFile={checkedFile}
                  callback={onFileSelect}
                  key={file.id}
                />
              ))}
            </ul>
          </InfiniteScrollComponent>
        </>
      ) : (
        <>
          <div className={style.emptyFilesPage}>
            <FileIcon />
            <h2 className={style.emptyFilesPage_title}>Files not found</h2>
            <p className={style.emptyFilesPage_desc}>
              This page is empty, upload your first files.
            </p>
          </div>
          <button
            className={style.uploadBtn}
            onClick={() => navigate('/drive')}>
            Upload
          </button>
        </>
      )}
    </div>
  );
};
