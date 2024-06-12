import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  clearFiles,
  selecSelectedFile,
  selectFiles,
  selectFilesCount,
  selectFilesPage,
  setCount,
  setFiles,
  setPage,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { uploadFileEffect } from '../../effects/uploadFileEffect';
import { getFilesEffect } from '../../effects/filesEffects';
import { handleFileMenu } from '../../store/reducers/modalSlice';

import { FileItem } from '../../components/fileItem';
import GhostLoader from '../../components/ghostLoader';
import InfiniteScrollComponent from '../../components/infiniteScrollComponent';

import { ReactComponent as ArrowIcon } from '../../assets/arrow_right.svg';
import { ReactComponent as CircleCloudIcon } from '../../assets/cloud_circle.svg';
import { ReactComponent as CirclePictureIcon } from '../../assets/picture_circle.svg';
import { ReactComponent as FileIcon } from '../../assets/file_draft.svg';

import style from './style.module.css';

const MAX_FILE_SIZE = 268435456;

export const FilesSystemPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mediaRef = useRef(null);
  const fileRef = useRef(null);
  const files = useSelector(selectFiles);
  const filesCount = useSelector(selectFilesCount);
  const filesPage = useSelector(selectFilesPage);
  const [areFilesLoading, setAreFilesLoading] = useState(false);
  const checkedFile = useSelector(selecSelectedFile);

  const onBackButtonClick = () => navigate(-1);

  const clearInputsAfterUpload = () => {
    const dataTransfer = new DataTransfer();
    mediaRef.current.files = dataTransfer.files;
    fileRef.current.files = dataTransfer.files;
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
    setAreFilesLoading(true);
    await uploadFileEffect({ files, dispatch });
    setAreFilesLoading(false);
    clearInputsAfterUpload();
  };

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

  return (
    <div className={style.container}>
      <header className={style.filesHeader}>
        <button
          className={style.header__cancelBtnBlue}
          onClick={onBackButtonClick}>
          Back
        </button>
        <h2 className={`${style.header__title} ${style.centeredTitle}`}>
          Files System
        </h2>
      </header>
      <section className={style.wrapper}>
        <ul className={style.options}>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CirclePictureIcon /> From Gallery{' '}
              <ArrowIcon className={style.arrowIcon} />
            </button>
            <input
              ref={mediaRef}
              type="file"
              accept="image/*,video/*"
              className={style.hiddenInput}
              onChange={handleFileUpload}
            />
          </li>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CircleCloudIcon /> From Files{' '}
              <ArrowIcon className={style.arrowIcon} />
            </button>
            <input
              ref={fileRef}
              type="file"
              className={style.hiddenInput}
              onChange={handleFileUpload}
            />
          </li>
        </ul>
        <p className={style.wrapper__list__title}>Recently sent files</p>
        {areFilesLoading ? (
          <div className={style.loaderWrapper}>
            <GhostLoader texts={['Uploading']} />
          </div>
        ) : files.length ? (
          <ul className={`${style.options} ${style.filesList}`}>
            <InfiniteScrollComponent
              totalItems={filesCount}
              files={files}
              fetchMoreFiles={fetchMoreFiles}>
              {files.map((file) => (
                <FileItem
                  file={file}
                  key={file.id}
                  checkedFile={checkedFile}
                  callback={onFileSelect}
                  fileView={'list'}
                />
              ))}
            </InfiniteScrollComponent>
          </ul>
        ) : (
          <div className={style.emptyFilesPage}>
            <FileIcon />
            <h2 className={style.emptyFilesPage_title}>Files not found</h2>
            <p className={style.emptyFilesPage_desc}>
              This page is empty. You have no uploaded files.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
