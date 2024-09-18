import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import { vibrate } from '../../utils/vibration';

import { ReactComponent as FlyIcon } from '../../assets/menu/fly.svg';
import { ReactComponent as TopIcon } from '../../assets/menu/top.svg';
import { ReactComponent as FriendsIcon } from '../../assets/menu/friends.svg';
import { ReactComponent as EarnIcon } from '../../assets/menu/earn.svg';
import { ReactComponent as AirdropIcon } from '../../assets/menu/airdrop.svg';
import { ReactComponent as BackgroundIcon } from '../../assets/menu/background.svg';
import { ReactComponent as SeparateLineIcon } from '../../assets/menu/separateLine1.svg';
import { ReactComponent as SecondSeparateLineIcon } from '../../assets/menu/separateLine2.svg';

import classNames from 'classnames';
import styles from './Menu.module.css';

export default function Menu() {
  const location = useLocation();
  const { t } = useTranslation('game');

  return (
    <div className={styles.container}>
      <BackgroundIcon className={styles.bg} />
      <SeparateLineIcon className={styles['bg-line1']} />
      <SecondSeparateLineIcon className={styles['bg-line2']} />
      <SecondSeparateLineIcon className={styles['bg-line3']} />
      <SeparateLineIcon className={styles['bg-line4']} />
      <svg className={styles.gradient}>
        <defs>
          <linearGradient id="paint0_linear_9111_5063" x1="15.2157" y1="6.3092e-09" x2="15.4493" y2="41.9167" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00E0FF"/>
            <stop offset="1" stopColor="#0A4672"/>
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.content}>
        <NavLink
          className={({ isActive }) =>
            classNames(styles.item, isActive && styles.active)
          }
          to={'/game-3d'}
          onClick={vibrate}>
          <div className={classNames(styles.icon)}>
            <FlyIcon />
          </div>
          <span className={styles.text}>{t('navigate.fly')}</span>
        </NavLink>

        <NavLink
          className={() =>
            classNames(
              styles.item,
              location.pathname.startsWith('/leadboard/') && styles.active
            )
          }
          to={'/leadboard/league'}
          onClick={vibrate}>
          <div className={styles.icon}>
            <TopIcon />
          </div>
          <span className={styles.text}>
            {t('process.players')}
          </span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            classNames(styles.item, isActive && styles.active)
          }
          to={'/friends'}
          onClick={vibrate}>
          <div className={styles.icon}>
            <FriendsIcon />
          </div>
          <span className={styles.text}>
            {t('process.frens')}
          </span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            classNames(styles.item, isActive && styles.active)
          }
          to={'/earn'}
          onClick={vibrate}>
          <div className={styles.icon}>
            <EarnIcon />
          </div>
          <span className={styles.text}>{t('process.earn')}</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            classNames(styles.item, isActive && styles.active)
          }
          to={'/point-tracker'}
          onClick={vibrate}>
          <div className={styles.icon}>
            <AirdropIcon />
          </div>
          <span className={styles.text}>{t('process.airdrop')}</span>
        </NavLink>
      </div>
    </div>
  );
}
