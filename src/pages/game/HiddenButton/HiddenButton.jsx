import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handlePaymentSelectModal } from '../../../store/reducers/modalSlice';
import { selectTheme } from '../../../store/reducers/gameSlice';

import styles from './Status.module.css';

export default function HiddenBtn() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const onNavigate = (event) => {
    event.stopPropagation();
    dispatch(handlePaymentSelectModal(true));
  }

  if (!!theme.cost)
    return (
      <div
        className={styles.container}
        onClick={onNavigate}
      />
    );

  return null;
}
