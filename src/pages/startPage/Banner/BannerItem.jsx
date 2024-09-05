import React from "react";
import CN from "classnames";

import styles from "./styles.module.css";

const BannerItem = ({ title, text, revers, bg }) => {

  return (
    <div className={styles.bannerItem}>
      <img className={styles.image} src={bg} alt={title} />
      <div className={CN(styles.info,revers && styles.revers)}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  )
}

export { BannerItem }