import React from 'react';
import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const onBackButtonClick = () => navigate(-1);

  return (
    <header className={styles.pageHeader}>
      <button className={styles.backButton} onClick={onBackButtonClick}>
        Back
      </button>
      <div className={styles.navigation}>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/league'}>
          League
        </NavLink>
        <NavLink
          className={({ isActive }) => classNames(isActive && styles.active)}
          to={'/leadboard/friends'}>
          Friends
        </NavLink>
      </div>
    </header>
  );
}
