import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { isMobilePlatform } from '../../../../utils/client';

import { BackButton } from '../../../../components/backButton';

import classNames from 'classnames';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation('game');
  const user = useSelector((state) => state?.user?.data);

  return (
    <header className={styles.pageHeader}>
      {!isMobilePlatform && <BackButton />}
      <span className={styles.rank}>
        {location.pathname === '/leadboard/league' &&
          user?.rank &&
          `Rank ${user?.rank}`}
      </span>
      <div className={styles.navigation}>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/league'}>
          {t('leadboard.league')}
        </NavLink>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/friends'}>
          {t('leadboard.friends')}
        </NavLink>
      </div>
    </header>
  );
}
