import React from 'react';
import classNames from 'classnames';
import styles from './Person.module.css';

export default function Person({ isDone, title, points, onClick }) {
  return (
    <div
      className={classNames(styles.container, isDone && styles.done)}
      onClick={onClick}>
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
