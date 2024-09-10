import React from 'react';
import styles from './DefaultFileActions.module.scss';
import FavoriteAction from './actions/FavoriteAction';
import InfoAction from './actions/InfoAction';
import TelegramShareAction from './actions/TelegramShareAction';

export default function DefaultFileActions({ file }) {
  return (
    <div className={styles.container}>
      <FavoriteAction file={file} />
      <InfoAction file={file} />
      <TelegramShareAction file={file} />
    </div>
  );
}
