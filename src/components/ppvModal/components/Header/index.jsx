import React from "react";

import styles from './styles.module.css';

const Header = ({ onClose }) => {

  return (
    <header className={styles.header} >
      <button
        className={styles.button}
        onClick={onClose}
      >
        Back
      </button>
      <h1 className={styles.title}>Pay per view</h1>
      <button />
    </header>
  )
}

export default Header;