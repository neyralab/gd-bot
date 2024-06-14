import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTimer } from 'react-timer-hook';
import { Link } from 'react-router-dom';

import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import themes from './themes';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import { ReactComponent as BatteryFull } from '../../assets/battery-full.svg';
import { ReactComponent as BatteryEmpty } from '../../assets/battery-empty.svg';
import { ReactComponent as LeaderBoard } from '../../assets/social_leaderboard.svg';
import { ReactComponent as VolumeOff } from '../../assets/volume_off.svg';
import { ReactComponent as VolumeOn } from '../../assets/volume_up.svg';
import styles from './styles.module.css';

export function TapPage() {
  const [soundIsActive, setSoundIsActive] = useState(
    localStorage.getItem('gameSound')
      ? localStorage.getItem('gameSound') === 'true'
      : true
  );
  const backgroundMusicRef = useRef(new Audio('/assets/tap-page/ghost.mp3'));
  const clickSoundRef = useRef(new Audio('/assets/tap-page/2blick.wav'));

  const backgroundRef = useRef();
  const pointsAreaRef = useRef();
  const mainButtonRef = useRef();

  const [theme, setTheme] = useState(themes[0]);
  const [status, setStatus] = useState('waiting'); // 'waiting', 'playing', 'finished';
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
      lockTime.setSeconds(lockTime.getSeconds() + 10800);
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

  useEffect(() => {
    backgroundMusicRef.current.loop = true;

    if (soundIsActive) {
      const playPromise = backgroundMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn('Autoplay was prevented:', e);
          setSoundIsActive(false);
        });
      }
    }

    return () => {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('gameSound', soundIsActive);
  }, [soundIsActive]);

  const togglePlay = () => {
    setSoundIsActive(!soundIsActive);
    if (soundIsActive) {
      backgroundMusicRef.current.pause();
    } else {
      backgroundMusicRef.current.play();
    }
  };

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (lockTimer.isRunning) {
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
      clickSoundRef.current.play();
    }

    // Update state and timers
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
              <span className={styles['actions-description-1']}>
                Tap to play
              </span>
            )}
            {status === 'finished' && (
              <div className={styles['actions-flex']}>
                <BuyButton theme={theme} onCompleted={completedHandler} />
                <span className={styles['actions-description-2']}>
                  recharge & play
                </span>
              </div>
            )}
          </div>

          <div className={styles['extra-actions-container']}>
            {status === 'finished' && (
              <Link to={'/leadboard'} className={styles['extra-action']}>
                <LeaderBoard />
                <span>Winners</span>
              </Link>
            )}

            <button
              type="button"
              className={styles['extra-action']}
              onClick={togglePlay}>
              {soundIsActive ? <VolumeOn /> : <VolumeOff />}
              <span>{soundIsActive ? 'Sound Off' : 'Sound On'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
