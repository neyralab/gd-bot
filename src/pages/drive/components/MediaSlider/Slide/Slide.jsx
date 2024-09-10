import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Slide.module.scss';
import FilePreviewController from '../FilePreviewController/FilePreviewController';

const Slide = React.memo(({ file, id }) => {
  const areFilesLazyLoading = useSelector(
    (state) => state.drive.areFilesLazyLoading
  );

  if (id === 'top-null') {
    return <div className={styles.slide}></div>;
  }

  if (id === 'bottom-null' && areFilesLazyLoading) {
    return (
      <div className={styles.slide}>
        <div className={styles.loader}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (id === 'bottom-null' && !areFilesLazyLoading) {
    return <div className={styles.slide}></div>;
  }

  return (
    <div className={styles.slide}>
      <FilePreviewController file={file} />
    </div>
  );
});

export default Slide;
