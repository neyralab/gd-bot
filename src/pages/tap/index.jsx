import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBalance,
  selectSoundIsActive,
  selectStatus,
  selectTheme,
  setBalance,
  startRound,
  setStatus,
  selectLockTimerTimestamp,
  setLockTimerTimestamp,
  setLockTimeoutId
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import Timer from './Timer/Timer';
import styles from './styles.module.css';

export function TapPage() {
  const clickSoundRef = useRef(new Audio('/assets/tap-page/2blick.wav'));

  const backgroundRef = useRef();
  const pointsAreaRef = useRef();
  const mainButtonRef = useRef();

  const dispatch = useDispatch();
  const soundIsActive = useSelector(selectSoundIsActive);
  const theme = useSelector(selectTheme);
  const status = useSelector(selectStatus);
  const balance = useSelector(selectBalance);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);

  useEffect(() => {
    return () => {
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    };
  }, []);

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'waiting') {
      dispatch(startRound());
    }

    if (status === 'finished') {
      return;
    }

    // Run animations
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    pointsAreaRef.current.runAnimation();

    // Run sounds
    if (clickSoundRef.current && !clickSoundRef.current.ended) {
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    }

    if (soundIsActive) {
      setTimeout(() => {
        const playPromise = clickSoundRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('Autoplay was prevented:', e);
          });
        }
      }, 0);
    }

    // Update state and timers
    dispatch(setBalance(balance + theme.multiplier));
  };

  const buyCompletedHandler = () => {
    dispatch(setStatus('waiting'));
    if (theme.id === 'hawk') {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }
  };

  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>
              {balance.toLocaleString('en-US')}
            </div>
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <div className={styles['points-grow-area-container']}>
              <PointsGrowArea ref={pointsAreaRef} theme={theme} />
            </div>

            <MainButton ref={mainButtonRef} theme={theme} />

            <div className={styles['timer-container']}>
              <Timer />

              {(status === 'finished' || status === 'waiting') &&
                lockTimerTimestamp &&
                theme.id === 'hawk' && (
                  <span className={styles['timer-description']}>
                    Next free play
                  </span>
                )}
            </div>

            <div className={styles.description}>
              <strong>{theme.name}</strong>
              <span>X{theme.multiplier}</span>
            </div>
          </div>

          <div className={styles['actions-container']}>
            {status === 'finished' && (
              <div className={styles['actions-flex']}>
                <BuyButton theme={theme} onCompleted={buyCompletedHandler} />
                <span className={styles['actions-description']}>
                  recharge & play
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
