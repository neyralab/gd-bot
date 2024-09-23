import React from 'react';
import { ReactComponent as InfoIcon } from '../../../../../assets/info2.svg';
import { vibrate } from '../../../../../utils/vibration';
import { animateButton } from '../animations';
import styles from '../DefaultFileActions.module.scss';

export default function InfoAction({ file, onInfoClick }) {
  const clickHandler = (e) => {
    vibrate();
    animateButton(e.currentTarget);
    onInfoClick?.(file);
  };

  return (
    <div onClick={clickHandler} className={styles.action}>
      <InfoIcon />
    </div>
  );
}
