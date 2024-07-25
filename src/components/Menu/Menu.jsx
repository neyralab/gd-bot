import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import useButtonVibration from '../../hooks/useButtonVibration';

import { ReactComponent as LeadboardIcon } from '../../assets/leadboard2.svg';
import { ReactComponent as FriendsIcon } from '../../assets/groups.svg';
import { ReactComponent as EarnIcon } from '../../assets/toll.svg';
import { ReactComponent as AirdropIcon } from '../../assets/atr.svg';

import classNames from 'classnames';
import styles from './Menu.module.css';

export default function Menu() {
  const location = useLocation();
  const { t } = useTranslation('game');
  const handleVibrationClick = useButtonVibration();

  return (
    <div className={styles.container}>
      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/game-3d'}
        onClick={handleVibrationClick()}>
        <div className={classNames(styles.icon, styles['img-icon'])}></div>
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
        onClick={handleVibrationClick()}>
        <div className={styles.icon}>
          <LeadboardIcon />
        </div>
        <span className={styles.text}>{t('process.players')}</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/friends'}
        onClick={handleVibrationClick()}>
        <div className={styles.icon}>
          <FriendsIcon />
        </div>
        {/* Ой даже не спрашивайте почему вместо Friends тут Frens. Просто примите. */}
        <span className={styles.text}>{t('process.frens')}</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/earn'}
        onClick={handleVibrationClick()}>
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
        onClick={handleVibrationClick()}>
        <div className={styles.icon}>
          <AirdropIcon />
        </div>
        <span className={styles.text}>{t('process.airdrop')}</span>
      </NavLink>
    </div>
  );
}
