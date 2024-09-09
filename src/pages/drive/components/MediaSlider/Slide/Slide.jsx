import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Slide.module.scss';

const Slide = React.memo(({ file, id }) => {
  const areFilesLazyLoading = useSelector(
    (state) => state.drive.areFilesLazyLoading
  );

  useEffect(() => {
    console.log('rerender', id);
  }, [file]);

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
      <p>{file?.name || 'none'}</p>
    </div>
  );
});

export default Slide;
