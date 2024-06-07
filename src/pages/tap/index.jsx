import React from 'react';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import ProgressBar from './ProgressBar/ProgressBar';
import { ReactComponent as TokenIcon } from '../../assets/logo-token.svg';
import styles from './styles.module.css';

export function TapPage() {
  const balance = 100;
  const multiplier = 5;
  const points = 4000;

  return (
    <div className={styles.container}>
      <Header label="GhostDrive" />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>{balance}</div>
            <strong>Balance</strong>
          </div>

          <div className={styles['main-button-container']}>
            <MainButton />
          </div>

          <div className={styles['experience-container']}>
            <div className={styles['progress-container']}>
              <div className={styles['progress-bar']}>
                <ProgressBar />
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
