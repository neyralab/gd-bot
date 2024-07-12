import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import useButtonVibration from '../../../../hooks/useButtonVibration';

import classNames from 'classnames';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const onBackButtonClick = () => navigate(-1);
  const handleVibrationClick = useButtonVibration();

  return (
    <header className={styles.pageHeader}>
      <div className={styles.navigation}>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/league'}
          onClick={handleVibrationClick()}>
          League
        </NavLink>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/friends'}
          onClick={handleVibrationClick()}>
          Friends
        </NavLink>
      </div>
    </header>
  );
}
