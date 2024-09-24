import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  clearFiles,
  getFilesAction,
  selectFileView,
  selectFilesCount,
  selectFilesPage,
  setCount,
  setPage,
  setSelectedFile
} from '../../../../store/reducers/filesSlice';
import { handleFileMenu } from '../../../../store/reducers/modalSlice';

import GhostLoader from '../../../../components/ghostLoader';
import { FileItem } from '../../../../components/fileItem';
import { PayShareFile } from '../../../../components/fileItem/payShare';

import { ReactComponent as FileIcon } from '../../../../assets/file_draft.svg';

import CN from 'classnames';
import style from '../../style.module.scss';

const FileList = ({ files, checkedFile, loading }) => {
  const { t } = useTranslation('drive');
  const dispatch = useDispatch();
  const filesCount = useSelector(selectFilesCount);
  const currentPage = useSelector(selectFilesPage);
  const view = useSelector(selectFileView);
  const hasMore = useMemo(
    () => filesCount - files.length > 0,
    [filesCount, files.length]
  );

  useEffect(() => {
    return () => {
      dispatch(clearFiles());
      dispatch(setCount(0));
      dispatch(setPage(1));
    };
  }, []);

  const onFileSelect = (file) => {
    if (file.id === checkedFile.id) {
      dispatch(setSelectedFile({}));
      dispatch(handleFileMenu(false));
    } else {
      dispatch(handleFileMenu(true));
      dispatch(setSelectedFile(file));
    }
  };

  const fetchMoreFiles = () => {
    const nextPage = currentPage + 1;
    dispatch(setPage(nextPage));
    dispatch(getFilesAction(nextPage));
  };

  if (loading) {
    return (
      <div className={style.loader}>
        <GhostLoader />
      </div>
    )
  }

  return files.length ? (
    <div className={style.scrollWrapper} id="scrollableDiv">
      <InfiniteScroll
        className={CN(style.filesList, view === 'grid' && style.filesListGrid)}
        dataLength={files.length}
        next={fetchMoreFiles}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv">
        {files.map((file) => {
          if (file.share_file)
            return (
              <PayShareFile
                file={file}
                key={file?.id}
                checkedFile={checkedFile}
                callback={onFileSelect}
              />
            )
          return (
          <FileItem
            file={file}
            key={file?.id}
            checkedFile={checkedFile}
            callback={onFileSelect}
          />
        )})}
      </InfiniteScroll>
    </div>
  ) : (
    <div className={style.emptyFilesPage}>
      <FileIcon />
      <h2 className={style.emptyFilesPage_title}>{t('dashbord.notFound')}</h2>
      <p className={style.emptyFilesPage_desc}>{t('dashbord.isEmpty')}</p>
    </div>
  );
};

export default React.memo(FileList);
