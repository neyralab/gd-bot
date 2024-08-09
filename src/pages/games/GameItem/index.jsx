import React, { useCallback } from "react";

import { API_PATH_ROOT } from '../../../utils/api-urls';
import { ReactComponent as GameIcon } from '../../startPage/assets/tap.svg';
import styles from './styles.module.css';

const GamesItem = ({ title, translatedText, joinLink, logo }) => {
  const goToGame = useCallback(() => {
    window.open(joinLink, '_blank')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img
          className={styles.icon}
          src={logo ? `${API_PATH_ROOT}${logo}` : GameIcon}
          alt=""
        />
        <p className={styles.text}>{translatedText || title}</p>
      </div>
      <button onClick={goToGame} className={styles.btn}>
        Play
      </button>
    </div>
  )
}

export default GamesItem