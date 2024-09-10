import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as InfoIcon } from '../../../../../assets/info2.svg';
import { setFileInfoModal } from '../../../../../store/reducers/driveSlice';
import { vibrate } from '../../../../../utils/vibration';
import { animateButton } from '../animations';
import styles from '../DefaultFileActions.module.scss';

export default function InfoAction({ file }) {
  const dispatch = useDispatch();

  const clickHandler = (e) => {
    vibrate();
    animateButton(e.currentTarget);
    dispatch(setFileInfoModal(file));
  };

  return (
    <div onClick={clickHandler} className={styles.action}>
      <InfoIcon />
    </div>
  );
}
