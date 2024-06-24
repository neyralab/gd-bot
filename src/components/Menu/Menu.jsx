import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { TelegramShareButton } from 'react-share';
import { useSelector } from 'react-redux';
import styles from './Menu.module.css';

import { ReactComponent as UpgradeIcon } from '../../assets/database.svg';
import { ReactComponent as FriendsIcon } from '../../assets/groups.svg';
import { ReactComponent as EarnIcon } from '../../assets/toll.svg';
import { ReactComponent as AirdropIcon } from '../../assets/atr.svg';

export default function Menu() {
  const link = useSelector((state) => state.user.link);

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
        to={'/upgrade'}>
        <div className={styles.icon}>
          <UpgradeIcon />
        </div>
        <span className={styles.text}>Upgrade</span>
      </NavLink>

      <TelegramShareButton
        className={styles.item}
        url={link.copy}
        title={'Share this link with friends'}>
        <div className={styles.icon}>
          <FriendsIcon />
        </div>
        <span className={styles.text}>Friends</span>
      </TelegramShareButton>

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
