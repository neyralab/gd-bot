import React from 'react';
import styles from './DefaultFileTitle.module.scss';

export default function DefaultFileTitle({ file }) {
  return (
    <div className={styles.info}>
      <h3>{file.name}</h3>
      {file?.user && (
        <span>{file?.user?.displayed_name || file?.user?.username}</span>
      )}
    </div>
  );
}
