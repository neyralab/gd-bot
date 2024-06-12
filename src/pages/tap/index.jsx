import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import ProgressBar from './ProgressBar/ProgressBar';
import Background from './Background/Background';
import styles from './styles.module.css';

export function TapPage() {
  const backgroundRef = useRef();
  const mainButtonRef = useRef();

  const [theme, setTheme] = useState('default'); // 'default' or 'gold'; Fetch from store later
  const [clickedPoints, setClickedPoints] = useState(0); // 'default' or 'gold'; Fetch from store later

  const multiplier = 5;
  const points = 4000;

  const clickHandler = () => {
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    setClickedPoints((prevState) => prevState + 2);
  };

  /* TODO: REMOVE LATER */
  const testButtonClickHandler = () => {
    setTheme((value) => {
      if (value === 'default') {
        return 'gold';
      } else {
        return 'default';
      }
    });
  };

  return (
    <div
      className={classNames(
        styles.container,
        theme === 'gold' ? styles.gold : styles.default
      )}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>{clickedPoints}</div>
            <strong>Balance</strong>
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <MainButton ref={mainButtonRef} theme={theme} />
          </div>

          <div className={styles['experience-container']}>
            <div className={styles['progress-container']}>
              <div className={styles['progress-bar']}>
                <ProgressBar percent={100} theme={theme} />
              </div>
              <span className={styles.points}>{points}</span>
              <div className={styles.logo}></div>
            </div>

            <div className={styles['multiplier']}>x{multiplier}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
