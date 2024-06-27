import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearFiles,
  selectFilesCount,
  setCount,
  setPage,
  setSelectedFile
} from '../../../../store/reducers/filesSlice';
import { handleFileMenu } from '../../../../store/reducers/modalSlice';

import { FileItem } from '../../../../components/fileItem';
import InfiniteScrollComponent from '../../../../components/infiniteScrollComponent';
import { ReactComponent as FileIcon } from '../../../../assets/file_draft.svg';

import style from '../../style.module.scss';

export const FileList = ({ files, checkedFile }) => {
  const dispatch = useDispatch();
  const filesCount = useSelector(selectFilesCount);

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

  return files.length ? (
    <InfiniteScrollComponent
      totalItems={filesCount}
      files={files}
      // fetchMoreFiles={fetchMoreFiles}
      fetchMoreFiles={() => {}}>
      <ul className={style.filesList}>
        {files.map((file) => (
          <FileItem
            file={file}
            key={file?.id}
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
  );
};
