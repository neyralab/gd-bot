import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { uploadFile } from '../../store/reducers/drive/drive.thunks';
import { vibrate } from '../../utils/vibration';
import UploadLoader from './UploadLoader';
import { ReactComponent as PlusIcon } from '../../assets/plus.svg';
import styles from './UploadAction.module.scss';

const UploadAction = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const isUploading = useSelector(
    (state) => state.drive.uploadFile.isUploading
  );

  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      if (fileRef.current) {
        vibrate('soft');
        fileRef.current.click();
      }
    }
  }));

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const onUploadCallback = () => {
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    };
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
        onClick={() => {
          vibrate('soft');
        }}
        className={classNames(styles.button, isUploading && styles.uploading)}>
        <PlusIcon />
      </label>
    </div>
  );
});

export default UploadAction;
