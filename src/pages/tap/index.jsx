import React, { useRef } from 'react';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import ProgressBar from './ProgressBar/ProgressBar';
import Background from './Background/Background';
import { ReactComponent as TokenIcon } from '../../assets/logo-token.svg';
import styles from './styles.module.css';

export function TapPage() {
  const backgroundRef = useRef();
  const mainButtonRef = useRef();

  const balance = 100;
  const multiplier = 5;
  const points = 4000;

  const clickHandler = () => {
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
  };

  return (
    <div className={styles.container}>
      <Background ref={backgroundRef} />
      <Header label="GhostDrive" />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>{balance}</div>
            <strong>Balance</strong>
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <MainButton ref={mainButtonRef} />
          </div>

          <div className={styles['experience-container']}>
            <div className={styles['progress-container']}>
              <div className={styles['progress-bar']}>
                <ProgressBar percent={100} />
              </div>
              <span className={styles.points}>{points}</span>
              <div className={styles.logo}>
                <TokenIcon />
              </div>
            </div>

            <div className={styles['multiplier']}>x{multiplier}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
