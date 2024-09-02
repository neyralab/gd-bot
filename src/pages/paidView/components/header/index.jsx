import React from "react";
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

export const Header = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className={styles.header}>
      <button
        className={styles.backButton}
        onClick={goBack}
      >
        Back
      </button>
      <p className={styles.title}>Pay per view</p>
    </div>
  )
}