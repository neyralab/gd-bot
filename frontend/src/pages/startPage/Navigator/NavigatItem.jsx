import React from 'react';

import styles from './Navigator.module.scss';

const NavigatItem = ({ icon, name, html, onClick }) => {
  return (
    <li
      data-animation="start-page-animation-1"
      className={styles['navigat-item']}
      onClick={onClick}>
      <div className={styles['navigat-left']}>
        <span className={styles['navigat-icon']}>{icon}</span>
        <p className={styles['navigat-name']}>{name}</p>
      </div>
      {html}
    </li>
  );
};

export default NavigatItem;
