import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as TonIcon } from '../../assets/TON.svg';
import { ReactComponent as StarIcon  } from '../../assets/star.svg';

import styles from './Menu.module.css';

const paymentMethod = [
  {
    action: 'star',
    icon: <StarIcon viewBox="-1 -1 23 23" />,
    path: 'stars'
  },
  {
    action: 'ton',
    icon: <TonIcon viewBox="-3 -4 30 30" />,
    path: 'ton_price'
  },
];

export default function Menu({ payload, onClick }) {
  const { t } = useTranslation('system');

  const handleClick = (action) => {
    onClick({ ...payload, action })
  }
  
  return (
    <div className={styles.menu}>
      <p className={styles.title}>{t('boost.paymentMethod')}</p>
      <ul className={styles['menu-list']}>
        {paymentMethod.map((item) => (
          <li
            key={item.action}
            className={styles['menu-item']}
            onClick={() => {handleClick(item.action)}}
          >
            <div className={styles['menu-item-left']}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.count}>{payload[item.path]}</span>
            </div>
            <span className={styles.multiplicator}>{`X${payload?.multiplicator || payload?.multiplier}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
