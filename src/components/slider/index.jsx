import React, { useMemo } from 'react';
import CN from 'classnames';

import styles from './styles.module.scss';

const Slider = ({ className, value, onChange, maxValue }) => {
  const procent = useMemo(() => ((value / maxValue) * 100).toFixed(1), [value, maxValue]);

  const handleChange = (event) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={CN(styles["slider-container"], className)}>
      <input
        type="range"
        min="0"
        max={maxValue}
        value={value}
        className={styles["slider"]}
        onChange={handleChange}
        style={{
          background: `linear-gradient(to right, #fff 0%, #fff ${procent}%, #333 ${procent}%, #333 100%)`,
        }}
      />
      <div
        className={styles["slider-value"]}
        style={{ left: `${procent}%`, transform: `translateX(-${procent}%)` }}
      >
        {value}MB
      </div>
    </div>
  );
};

export default Slider;
