import React, { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './CardsSlider.module.css';

export default function CardsSlider({ items, timeout }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderCardsRef = useRef(null);
  const sliderControlsRef = useRef(null);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      goToNext(e, 'right');
      startSlideInterval();
    },
    onSwipedRight: (e) => {
      goToNext(e, 'left');
      startSlideInterval();
    }
  });
  const slideInterval = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      sliderCardsRef.current.children[0].classList.add(
        styles['slider-active-card__right-to-left']
      );
      sliderControlsRef.current.children[0].classList.add(
        styles['slider-dot_active']
      );
    }, 0);

    startSlideInterval();

    return () => {
      clearInterval(slideInterval.current);
    };
  }, []);

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [activeIndex]);

  const updateHeight = () => {
    const slider = sliderCardsRef.current;
    const activeCard = slider.children[activeIndex];
    const rect = activeCard.getBoundingClientRect();
    slider.style.height = `${rect.height}px`;
  };

  const startSlideInterval = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      goToNext(null, 'right');
    }, timeout || 1000);
  };

  const goToNext = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setActiveIndex((prevIndex) => {
      let newIndex;
      const totalItems = items.length;

      if (direction === 'left') {
        newIndex = prevIndex === 0 ? totalItems - 1 : prevIndex - 1;
      } else {
        newIndex = prevIndex === totalItems - 1 ? 0 : prevIndex + 1;
      }

      const sliderCards = sliderCardsRef.current;
      const sliderControls = sliderControlsRef.current;

      // Clear all current styles
      for (let i = 0; i < sliderCards.children.length; i++) {
        sliderCards.children[i].classList.remove(
          styles['slider-active-card__right-to-left']
        );
        sliderCards.children[i].classList.remove(
          styles['slider-card-exit__right-to-left']
        );
        sliderCards.children[i].classList.remove(
          styles['slider-active-card__left-to-right']
        );
        sliderCards.children[i].classList.remove(
          styles['slider-card-exit__left-to-right']
        );
      }

      for (let i = 0; i < sliderControls.children.length; i++) {
        sliderControls.children[i].classList.remove(
          styles['slider-dot_active']
        );
      }

      // Apply new styles based on direction
      setTimeout(() => {
        if (direction === 'right') {
          sliderCards.children[prevIndex].classList.add(
            styles['slider-card-exit__right-to-left']
          );
          sliderCards.children[newIndex].classList.add(
            styles['slider-active-card__right-to-left']
          );
        } else if (direction === 'left') {
          sliderCards.children[prevIndex].classList.add(
            styles['slider-card-exit__left-to-right']
          );
          sliderCards.children[newIndex].classList.add(
            styles['slider-active-card__left-to-right']
          );
        }

        sliderControls.children[newIndex].classList.add(
          styles['slider-dot_active']
        );
      }, 0);

      return newIndex;
    });
  };

  return (
    <div className={styles.slider} {...swipeHandlers}>
      <ul className={styles['slider-cards']} ref={sliderCardsRef}>
        {items.map((el) => {
          return el.html;
        })}
      </ul>

      <div className={styles['slider-controls']} ref={sliderControlsRef}>
        {items.map((el) => {
          return <span key={el.id} className={styles['slider-dot']}></span>;
        })}
      </div>
    </div>
  );
}
