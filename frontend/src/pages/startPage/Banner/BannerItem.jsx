import React, { useMemo } from "react";
import CN from "classnames";
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoIcon } from '../../../assets/ghost.svg';
import { transformSize } from '../../../utils/transformSize';
import { available_tariffs } from '../../boost';

import styles from "./styles.module.css";

const BannerItem = ({ 
  title, 
  text, 
  revers, 
  initialBaner, 
  bg, 
  onClick, 
  storageSize,  
}) => {
  const { t } = useTranslation('system');

  return (
    <div className={styles.bannerItem} onClick={onClick}>
      <img className={styles.image} src={bg} alt={title} />
      {initialBaner ? (
        <div className={styles.bannerHeader}>
          <div className={styles.logo}>
            <LogoIcon />
          </div>
          <span className={styles.price}>{transformSize(storageSize)}</span>
        </div>
      ) : (
        <div className={CN(styles.info, revers && styles.revers)}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.text}>{text}</p>
        </div>
      )}
    </div>
  );
};

export { BannerItem };
