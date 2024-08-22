import React, { useMemo, useRef, useEffect } from 'react';
import CN from 'classnames';
import styles from './styles.module.scss';

const Slider = ({ className, value, onChange, maxValue }) => {
  const procent = useMemo(() => ((value / maxValue) * 100).toFixed(1), [value, maxValue]);
  const sliderRef = useRef(null);

  const handleChange = (event) => {
    onChange(Number(event.target.value));
  };

  const handleTouchMove = (event) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const relativeX = touch.clientX - rect.left;
      const newValue = Math.min(Math.max(0, (relativeX / rect.width) * maxValue), maxValue);
      onChange(Math.round(newValue));
    }
  };

  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleTouchMove]);

  return (
    <div className={CN(styles["slider-container"], className)}>
      <input
        type="range"
        min="0"
        max={maxValue}
        value={value}
        className={styles["slider"]}
        onChange={handleChange}
        ref={sliderRef}
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
