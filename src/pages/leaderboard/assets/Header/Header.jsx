import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useButtonVibration from '../../../../hooks/useButtonVibration';

import classNames from 'classnames';
import styles from './Header.module.css';

export default function Header() {
  const { t } = useTranslation('game');
  const handleVibrationClick = useButtonVibration();

  return (
    <header className={styles.pageHeader}>
      <div className={styles.navigation}>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/league'}
          onClick={handleVibrationClick()}>
          {t('leadboard.league')}
        </NavLink>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/friends'}
          onClick={handleVibrationClick()}>
          {t('leadboard.friends')}
        </NavLink>
      </div>
    </header>
  );
}
