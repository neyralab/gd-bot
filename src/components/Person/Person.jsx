import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './Person.module.css';

export default function Person({ isDone, title, points, onClick }) {
  const { t } = useTranslation('game');
  return (
    <div
      className={classNames(styles.container, isDone && styles.done)}
      onClick={onClick}>
      <div className={styles.name}>
        <strong>{title}</strong>
      </div>
      <div className={styles.points}>
        <span>+{points}</span>
        <img src="/assets/token.png" alt={`+ ${points} ${t('leadboard.points')}`} />
      </div>
    </div>
  );
}
