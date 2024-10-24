import React from 'react';
import UploadAction from '../../../../components/UploadAction/UploadAction';
import styles from './Actions.module.scss';

export default function Actions() {
  return (
    <div data-animation="drive-action-animation-1" className={styles.container}>
      <UploadAction />
    </div>
  );
}
