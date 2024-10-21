import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import { selectLevel } from '../../../store/reducers/game/game.selectors';
import { setRoundFinal } from '../../../store/reducers/game/game.slice';
import styles from './EndGameAddedPoints.module.css';

const TIME_OUT = 8000;

const EndGameAddedPoints = () => {
  const { t } = useTranslation('game');
  const dispatch = useDispatch();

  const isActive = useSelector((state) => state.game.roundFinal.isActive);
  const counter = useSelector((state) => state.game.roundFinal.roundPoints);
  const lvl = useSelector(selectLevel);
  const user = useSelector((state) => state.user.data);

  const [show, setShow] = useState(false);
  const [showRank, setShowRank] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      const rankTimeout = setTimeout(() => {
        setShowRank(true);
      }, TIME_OUT - 3000);

      const timeout = setTimeout(() => {
        setShow(false);
        setShowRank(false);
        dispatch(setRoundFinal({ roundPoints: null, isActive: false }));
      }, TIME_OUT);

      return () => {
        clearTimeout(timeout);
        clearTimeout(rankTimeout);
      };
    } else {
      setShow(false);
    }
  }, [isActive]);

  if (!show) return;

  return (
    <div className={styles.container}>
      {showRank && user.rank ? (
        <span
          className={
            styles[`points-text-rank`]
          }>{`${t('leadboard.rank')}:${user.rank}`}</span>
      ) : (
        <>
          <CountUp className={styles.count} delay={1} end={counter} />
          <span className={styles[`points-text`]}>{t('leadboard.points')}</span>
        </>
      )}
    </div>
  );
};

export default EndGameAddedPoints;
