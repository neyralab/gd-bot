import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTimer } from 'react-timer-hook';

import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import ProgressBar from './ProgressBar/ProgressBar';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import themes from './themes';
import styles from './styles.module.css';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import { ReactComponent as BatteryFull } from '../../assets/battery-full.svg';
import { ReactComponent as BatteryEmpty } from '../../assets/battery-empty.svg';

export function TapPage() {
  const backgroundRef = useRef();
  const pointsAreaRef = useRef();
  const mainButtonRef = useRef();

  const [theme, setTheme] = useState(themes[0]);
  const [status, setStatus] = useState('init'); // 'waiting', 'playing', 'finished';
  const [clickedPoints, setClickedPoints] = useState(0);

  const lockTimer = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => console.warn('onExpire called'),
    autoStart: false
  });

  const clickTimer = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      console.warn('onExpire called');
      const lockTime = new Date();
      lockTime.setSeconds(lockTime.getSeconds() + 10800); // 1 minutes timer
      lockTimer.restart(lockTime);
    },
    autoStart: false
  });

  useEffect(() => {
    if (!lockTimer.isRunning && !clickTimer.isRunning) {
      setStatus('waiting');
    } else if (clickTimer.isRunning && !lockTimer.isRunning) {
      setStatus('playing');
    } else if (lockTimer.isRunning && !clickTimer.isRunning) {
      setStatus('finished');
    }
  }, [lockTimer.isRunning, clickTimer.isRunning]);

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (lockTimer.isRunning) {
      return;
    }

    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    pointsAreaRef.current.runAnimation();

    setClickedPoints((prevState) => prevState + theme.multiplier);
    if (!clickTimer.isRunning) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60); // 1 minutes timer
      clickTimer.restart(time);
    }
  };

  const completedHandler = (nextTheme) => {
    setTheme(nextTheme);
    lockTimer.pause();
  };

  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>
              {clickedPoints.toLocaleString('en-US')}
            </div>

            {status !== 'waiting' && (
              <div className={styles['timer-container']}>
                <p className={styles.clickTimer}>
                  {status === 'finished' &&
                    `${lockTimer.hours}:${lockTimer.minutes < 10 ? '0' + lockTimer.minutes : lockTimer.minutes}:${lockTimer.seconds < 10 ? '0' + lockTimer.seconds : lockTimer.seconds}`}
                  {status === 'playing' &&
                    `${clickTimer.minutes}:${clickTimer.seconds < 10 ? '0' + clickTimer.seconds : clickTimer.seconds}`}
                </p>
              </div>
            )}
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <div className={styles['points-grow-area-container']}>
              <PointsGrowArea ref={pointsAreaRef} theme={theme} />
            </div>

            <div className={styles.battery}>
              {status === 'finished' && <BatteryEmpty />}
              {status !== 'finished' && <BatteryFull />}
            </div>

            <MainButton ref={mainButtonRef} theme={theme} />

            <div className={styles.description}>
              <strong>{theme.name}</strong>
              <span>X{theme.multiplier}</span>
            </div>
          </div>

          <div className={styles['actions-container']}>
            {status !== 'finished' && (
              <span className={styles['actions-description']}>Tap to play</span>
            )}
            {status === 'finished' && (
              <div className={styles['actions-flex']}>
                <BuyButton theme={theme} onCompleted={completedHandler} />
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
