import React, { useEffect, useState } from 'react';
import styles from './Congratulations.module.scss';

export default function Congratulations({ onClick }) {
  const [gifSrc, setGifSrc] = useState('/assets/confetti-1-time.gif');

  useEffect(() => {
    // Append a unique query parameter to force reload the GIF
    setGifSrc(`/assets/confetti-1-time.gif?${new Date().getTime()}`);
  }, []);

  return (
    <div onClick={onClick} className={styles.congratulations}>
      <img src={gifSrc} alt="Congratulations" />
    </div>
  );
}
