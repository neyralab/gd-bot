import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './Task.module.css';

export default function Task({
  isDone,
  title,
  points,
  imgUrl,
  onClick,
  translatePath,
  className
}) {
  const formattedPoints = Number.isInteger(points)
    ? Number(points).toLocaleString()
    : points;
  const { t } = useTranslation('game');

  return (
    <div
      data-animation="task-animation-1"
      className={classNames(styles.container, isDone && styles.done, className)}
      onClick={onClick}>
      <img className={styles.img} src={imgUrl} alt={title} />

      <div className={styles.name}>
        <strong>{t(translatePath) || title}</strong>
      </div>

      <div className={styles.points}>
        <span>+{formattedPoints}</span>
        <img
          src="/assets/token.png"
          alt={`+ ${points} ${t('leadboard.points')}`}
        />
      </div>
    </div>
  );
}
