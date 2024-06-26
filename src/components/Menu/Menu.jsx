import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.css';

import { ReactComponent as LeadboardIcon } from '../../assets/leadboard.svg';
import { ReactComponent as FriendsIcon } from '../../assets/groups.svg';
import { ReactComponent as EarnIcon } from '../../assets/toll.svg';
import { ReactComponent as AirdropIcon } from '../../assets/atr.svg';

export default function Menu() {
  return (
    <div className={styles.container}>
      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/game'}>
        <div className={classNames(styles.icon, styles['img-icon'])}></div>
        <span className={styles.text}>Fly</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/leadboard'}>
        <div className={styles.icon}>
          <LeadboardIcon />
        </div>
        <span className={styles.text}>Leadboard</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/friends'}>
        <div className={styles.icon}>
          <FriendsIcon />
        </div>
        {/* Ой даже не спрашивайте почему вместо Friends тут Frens. Просто примите. */}
        <span className={styles.text}>Frens</span> 
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/earn'}>
        <div className={styles.icon}>
          <EarnIcon />
        </div>
        <span className={styles.text}>Earn</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          classNames(styles.item, isActive && styles.active)
        }
        to={'/point-tracker'}>
        <div className={styles.icon}>
          <AirdropIcon />
        </div>
        <span className={styles.text}>Airdrop</span>
      </NavLink>
    </div>
  );
}
