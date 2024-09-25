import React, { forwardRef } from 'react';
import styles from './SliderItem.module.css';

const SliderItem = forwardRef(({ item }, ref) => {
  return (
    <li key={item.id} className={styles['slider-card']} ref={ref}>
      <div className={styles['slider-card__icon']}>
        {item.iconText && (
          <span className={styles['slider-card__icon-text']}>
            {item.iconText}
          </span>
        )}

        {item.iconImg && (
          <img
            className={styles['slider-card__icon-img']}
            src={item.iconImg}
            alt={item.title}
          />
        )}
      </div>

      <div className={styles['slider-card__description']}>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
      </div>
    </li>
  );
});

export default SliderItem;
