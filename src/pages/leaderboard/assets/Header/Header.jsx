import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';


import classNames from 'classnames';
import styles from './Header.module.css';
import { useSelector } from 'react-redux';

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation('game');
  const user = useSelector((state) => state?.user?.data);

  return (
    <header className={styles.pageHeader}>
      <span className={styles.rank}>
        { (location.pathname === '/leadboard/league' && user?.rank) && (`Rank ${user?.rank}`) }
      </span>
      <div className={styles.navigation}>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/league'}
        >
          {t('leadboard.league')}
        </NavLink>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/friends'}
        >
          {t('leadboard.friends')}
        </NavLink>
      </div>
    </header>
  );
}
