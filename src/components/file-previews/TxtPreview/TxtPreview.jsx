import React from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import TxtSnapshotReader from '../components/TxtSnapshotReader/TxtSnapshotReader';
import styles from './TxtPreview.module.scss';

const TxtPreview = ({
  mode = 'default',
  fileContent,
  file,
  onFavoriteClick,
  onInfoClick
}) => {
  return (
    <div className={styles.container}>
      <TxtSnapshotReader fileContent={fileContent} />

      {mode === 'default' && (
        <>
          <DefaultFileTitle file={file} />
          <DefaultFileActions
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        </>
      )}
    </div>
  );
};

export default TxtPreview;
