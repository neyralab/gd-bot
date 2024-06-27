import React from 'react';
import classNames from 'classnames';
import styles from './Task.module.css';

export default function Task({ isDone, title, points, imgUrl, onClick }) {
  return (
    <div
      className={classNames(styles.container, isDone && styles.done)}
      onClick={onClick}>
      <img className={styles.img} src={imgUrl} alt={title} />
      <div className={styles.name}>
        <strong>{title}</strong>
      </div>
      <div className={styles.points}>
        <span>+{points}</span>
        <img src="/assets/token.png" alt={`+ ${points} points`} />
      </div>
    </div>
  );
}
