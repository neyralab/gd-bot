import React, { useCallback } from "react";

import styles from './styles.module.css';

const GamesItem = ({ title, imgUrl, translatedText, joinLink }) => {
  const goToGame = useCallback(() => {
    window.open(joinLink, '_blank')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img className={styles.icon} src={imgUrl} alt="" />
        <p className={styles.text}>{translatedText || title}</p>
      </div>
      <button onClick={goToGame} className={styles.btn}>
        Play
      </button>
    </div>
  )
}

export default GamesItem