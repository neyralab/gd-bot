import React, { useContext, useEffect, useState } from 'react';
import CN from 'classnames';
import CountUp from 'react-countup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserEffect } from '../../../effects/userEffects';
import { setUser } from '../../../store/reducers/userSlice';
import { getToken } from '../../../effects/set-token';
import { NavigationHistoryContext } from '../../../store/context/NavigationHistoryProvider';

import styles from './PointCounter.module.css';

export default function PointCounter({ points, className, onClick, rank }) {
  const { isInitialRoute } = useContext(NavigationHistoryContext);
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        if (!isInitialRoute) {
          const token = await getToken();
          const updatedUser = await getUserEffect(token);
          dispatch(setUser(updatedUser));
        } 
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, [isInitialRoute])

  const goToAirdrop = () => {
    navigate('/point-tracker')
  }

  const gotToLeague = () => {
    navigate('/leadboard/league')
  }

  return (
    <div
      data-animation="start-page-animation-1"
      className={CN(styles['point-counter'], className)}
      onClick={onClick}
    >
      <span onClick={goToAirdrop}>
        <CountUp className={styles['counter']} delay={1} end={points} />
      </span>
      { rank && (
          <span onClick={gotToLeague} className={styles['name']}>
          {`${t('dashboard.rank')}: ${rank}`}
        </span>
      )}
    </div>
  );
}
