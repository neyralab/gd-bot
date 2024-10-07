import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as PlusIcon } from '../../../../../assets/plus.svg';
import UploadLoader from './UploadLoader';
import { uploadFile } from '../../../../../store/reducers/driveSlice';
import { vibrate } from '../../../../../utils/vibration';
import styles from './UploadAction.module.scss';

export default function UploadAction() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const isUploading = useSelector(
    (state) => state.drive.uploadFile.isUploading
  );

  const handleFileUpload = async (event) => {
    const files = event.target.files;

    const onUploadCallback = () => {
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    };
    debugger
    dispatch(uploadFile({ files, onUploadCallback }));
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles['loader-container'],
          isUploading && styles.uploading
        )}>
        <UploadLoader />
      </div>

      <input
        disabled={isUploading}
        name="file"
        id="file"
        type="file"
        ref={fileRef}
        className={styles['hidden-input']}
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file"
        onClick={() => {vibrate('soft')}}
        className={classNames(styles.button, isUploading && styles.uploading)}>
        <PlusIcon />
      </label>
    </div>
  );
}
