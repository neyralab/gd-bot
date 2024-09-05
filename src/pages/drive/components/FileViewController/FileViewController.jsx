import React from 'react';
import { PayShareFile } from '../../../../components/fileItem/payShare';
import { FileItem } from '../../../../components/fileItem';
import styles from './FileViewController.module.scss';

export default function FileViewController({ file, index }) {
  const checkedFile = true;
  const onFileSelect = () => {};

  return (
    <div
      data-animation="drive-file-animation-1"
      data-index={index}
      className={styles['file-controller']}>
      {file.share_file && (
        <PayShareFile
          file={file}
          key={file?.id}
          checkedFile={checkedFile}
          callback={onFileSelect}
        />
      )}

      {!file.share_file && (
        <FileItem
          file={file}
          key={file?.id}
          checkedFile={checkedFile}
          callback={onFileSelect}
        />
      )}
    </div>
  );
}
