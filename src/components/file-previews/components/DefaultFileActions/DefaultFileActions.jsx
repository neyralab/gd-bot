import React from 'react';
import FavoriteAction from './actions/FavoriteAction';
import InfoAction from './actions/InfoAction';
import TelegramShareAction from './actions/TelegramShareAction';
import styles from './DefaultFileActions.module.scss';

export default function DefaultFileActions({
  file,
  onFavoriteClick,
  onInfoClick
}) {
  return (
    <div className={styles.container}>
      <FavoriteAction file={file} onFavoriteClick={onFavoriteClick} />
      <InfoAction file={file} onInfoClick={onInfoClick} />
      <TelegramShareAction file={file} />
    </div>
  );
}
