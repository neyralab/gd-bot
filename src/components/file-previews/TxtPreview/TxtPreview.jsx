import React from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import TxtSnapshotReader from '../components/TxtSnapshotReader/TxtSnapshotReader';
import styles from './TxtPreview.module.scss';

const TxtPreview = ({ fileContent, file }) => {
  return (
    <div className={styles.container}>
      <TxtSnapshotReader fileContent={fileContent} />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default TxtPreview;
