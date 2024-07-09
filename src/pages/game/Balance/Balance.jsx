import React from 'react';
import { useSelector } from 'react-redux';
import { selectBalance } from '../../../store/reducers/gameSlice';
import styles from './Balance.module.css';

export default function Balance() {
  const balance = useSelector(selectBalance);
  
  return (
    <div className={styles.balance}>
      {balance?.label?.toLocaleString('en-US')}
    </div>
  );
}
