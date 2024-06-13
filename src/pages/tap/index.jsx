import React, { useRef, useState } from 'react';
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

export function TapPage() {
  const backgroundRef = useRef();
  const pointsAreaRef = useRef();
  const mainButtonRef = useRef();

  const [theme, setTheme] = useState(themes[0]);
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

  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>{clickedPoints}</div>
            <strong>{theme && theme.name + ' X' + theme.multiplier}</strong>
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <div className={styles['points-grow-area-container']}>
              <PointsGrowArea ref={pointsAreaRef} theme={theme} />
            </div>

            {lockTimer.isRunning && <p className={styles.charging}>Charging</p>}

            <MainButton ref={mainButtonRef} theme={theme} />

            {lockTimer.isRunning ||
              (clickTimer.isRunning && (
                <div className={styles['timer-container']}>
                  <p className={styles.clickTimer}>
                    {lockTimer.isRunning &&
                      `${lockTimer.hours}:${lockTimer.minutes < 10 ? '0' + lockTimer.minutes : lockTimer.minutes}:${lockTimer.seconds < 10 ? '0' + lockTimer.seconds : lockTimer.seconds}`}
                    {clickTimer.isRunning &&
                      `${clickTimer.minutes}:${clickTimer.seconds < 10 ? '0' + clickTimer.seconds : clickTimer.seconds}`}
                  </p>
                </div>
              ))}
          </div>

          <div className={styles['experience-container']}>
            {!lockTimer.isRunning && (
              <>
                <span className={styles.description}>
                  GAME MODE, DATA MINING {theme.data}
                </span>
                <ProgressBar
                  percent={(clickTimer.seconds / 60) * 100 || 100}
                  theme={theme}
                />
              </>
            )}
            {lockTimer.isRunning && (
              <>
                <span className={styles.description}>Upgrade and play now</span>
                <BuyButton theme={theme} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
