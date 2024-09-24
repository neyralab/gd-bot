import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Slide.module.scss';
import FilePreviewController from '../FilePreviewController/FilePreviewController';
import Loader2 from '../../../../../components/Loader2/Loader2';

const Slide = React.memo(({ file, id, onExpand, disableSwipeEvents }) => {
  const areFilesLazyLoading = useSelector(
    (state) => state.drive.areFilesLazyLoading
  );

  if (id === 'top-null') {
    return <div className={styles.slide}></div>;
  }

  if (id === 'bottom-null' && !areFilesLazyLoading) {
    return <div className={styles.slide}></div>;
  }

  if (id === 'bottom-null' && areFilesLazyLoading) {
    return (
      <div className={styles.slide}>
        <div className={styles['slide-content']}>
          <div className={styles.loader}>
            <Loader2 />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.slide}>
      <div className={styles['slide-content']}>
        <FilePreviewController
          file={file}
          onExpand={onExpand}
          disableSwipeEvents={disableSwipeEvents}
        />
      </div>
    </div>
  );
});

export default Slide;
