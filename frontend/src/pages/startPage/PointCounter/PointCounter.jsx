import React, { useContext, useState } from 'react';
import CN from 'classnames';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './PointCounter.module.css';

export default function PointCounter({ points, className, onClick, rank }) {
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const navigate = useNavigate();

  const goToAirdrop = () => {
    navigate('/point-tracker');
  };

  const gotToLeague = () => {
    navigate('/leadboard/league');
  };

  return (
    <div
      data-animation="start-page-animation-1"
      className={CN(styles['point-counter'], className)}
      onClick={onClick}>
      <span onClick={goToAirdrop}>
        <CountUp className={styles['counter']} delay={1} end={points} />
      </span>

      {rank && (
        <span onClick={gotToLeague} className={styles['name']}>
          {`${t('dashboard.rank')}: ${rank}`}
        </span>
      )}
    </div>
  );
}
