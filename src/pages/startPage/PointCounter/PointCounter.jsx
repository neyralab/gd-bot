import React from 'react';
import CN from 'classnames';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

import styles from './PointCounter.module.css';

export default function PointCounter({ points, className, onClick, rank }) {
  const navigate = useNavigate();

  const goToAirdrop = () => {
    navigate('/point-tracker')
  }

  const gotToLeague = () => {
    navigate('/leadboard/league')
  }

  return (
    <div
      className={CN(styles['point-counter'], styles['to-appear'], className)}
      onClick={onClick}
    >
      <span onClick={goToAirdrop}>
        <CountUp className={styles['counter']} delay={1} end={points} />
      </span>
      { rank && (
          <span onClick={gotToLeague} className={styles['name']}>
          {`Rank: ${rank}`}
        </span>
      )}
    </div>
  );
}
