import React, { useEffect, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { Header } from '../../components/header';
import { ReactComponent as LogoIcon } from '../../assets/ghost-filled.svg';
import { ReactComponent as TonIcon } from '../../assets/TON.svg';
import styles from './styles.module.css';
import CardsSlider from '../../components/CardsSlider/CardsSlider';
import CountUp from 'react-countup';

const sliderItems = [
  {
    id: 1,
    html: (
      <li key="1" className={classNames(styles.card, styles['slider-card'])}>
        <h2>20% Revenue Share on TON Blockchain</h2>
        <p>
          Join TON Blockchain and earn a 20% revenue share. Participate now to
          maximize your earnings.
        </p>
      </li>
    )
  },

  {
    id: 2,
    html: (
      <li key="2" className={classNames(styles.card, styles['slider-card'])}>
        <h2>Some short text</h2>
        <p>Super short text</p>
      </li>
    )
  },

  {
    id: 3,
    html: (
      <li key="3" className={classNames(styles.card, styles['slider-card'])}>
        <h2>Some large text</h2>
        <p>
          Join TON Blockchain and earn a 20% revenue share. Participate now to
          maximize your earnings. Join TON Blockchain and earn a 20% revenue
          share. Participate now to maximize your earnings.
        </p>
      </li>
    )
  }
];

export default function NodesPage() {
  const nodesAmount = 20;
  const nodesAvailable = 990;
  const nodesCost = 55;

  useEffect(() => {
    let intervalId;

    const toAppearElements = document.querySelectorAll(
      `.${styles['to-appear']}`
    );
    let count = 0;

    intervalId = setInterval(() => {
      if (count < toAppearElements.length) {
        toAppearElements[count].classList.add(styles['to-appear_active']);
        count++;
      } else {
        clearInterval(intervalId);
      }
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <Header label={'Node'} />

      <div className={styles.content}>
        <div
          className={classNames(
            styles.card,
            styles.banner,
            styles['to-appear']
          )}>
          <video
            id="background-video"
            autoPlay
            loop
            muted
            poster="/assets/node-banner.jpg">
            <source src="/assets/node-banner.mp4" type="video/mp4" />
          </video>

          <div className={styles['banner-content']}>
            <div className={styles['banner-header']}>
              <div className={styles['banner-header_img']}>
                <LogoIcon />
              </div>
              <h1>Nodes</h1>
              <span><CountUp delay={0.5} end={nodesAmount}  /></span>
            </div>
          </div>
        </div>

        <div className={classNames(styles.card, styles['to-appear'])}>
          <div className={styles['buy-container']}>
            <div className={styles['buy-container__flex-left']}>
              <div className={styles['buy-container__description']}>
                Available: {nodesAvailable}
              </div>
              <div className={styles['buy-container__cost']}>
                {nodesCost} <TonIcon />
              </div>
            </div>
            <div className={styles['buy-container__flex-right']}>
              <button className={styles['buy-button']}>Buy</button>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            styles['slider-container'],
            styles['to-appear']
          )}>
          <CardsSlider items={sliderItems} timeout={5000} />
        </div>
      </div>
    </div>
  );
}
