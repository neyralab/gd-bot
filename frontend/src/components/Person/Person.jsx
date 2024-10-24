import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { formatLargeNumberExtended } from '../../utils/number';

import styles from './Person.module.css';

export default function Person({ isDone, title, points, onClick, className, icon }) {
  const { t } = useTranslation('game');
  return (
    <div
      data-animation="person-animation-1"
      className={classNames(styles.container, isDone && styles.done, className)}
      onClick={onClick}>
      <div className={styles.name}>
        { icon || <img src='/assets/telegram.png' alt='Telegram' /> }
        <strong>{title}</strong>
      </div>

      <div className={styles.points}>
        <span>+{formatLargeNumberExtended(points)}</span>
        <img
          src="/assets/token.png"
          alt={`+ ${points} ${t('leadboard.points')}`}
        />
      </div>
    </div>
  );
}
