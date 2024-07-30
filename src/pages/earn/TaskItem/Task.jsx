import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './Task.module.css';

export default function Task({ isDone, title, points, imgUrl, onClick, translatePath }) {
  const formattedPoints = Number(points).toLocaleString();
  const { t } = useTranslation('game');

  return (
    <div
      className={classNames(styles.container, isDone && styles.done)}
      onClick={onClick}
    >
      <div className={styles.info}>
        <img className={styles.img} src={imgUrl} alt={title} />
        <div className={styles.text}>
          <span className={styles.name}>{t(translatePath).replace('{name}', title.split(' ')[1])}</span>
          <span className={styles.count}>+{formattedPoints}</span>
        </div>
      </div>
      { !isDone && (
        <button
          className={styles.actionBtn}
          onClick={() => {}}
        >
          Start
        </button>
      )}
    </div>
  );
}
