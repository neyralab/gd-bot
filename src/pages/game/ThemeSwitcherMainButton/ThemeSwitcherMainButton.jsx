import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { useSelector } from 'react-redux';
import {
  selectNextTheme,
  selectTheme
} from '../../../store/reducers/gameSlice';
import MainButton from '../MainButton/MainButton';
import styles from './ThemeSwitcherMainButton.module.css';

const ThemeSwitcherMainButton = forwardRef((_, ref) => {
  const currentThemeRef = useRef(null);
  const nextThemeRef = useRef(null);
  const mainButtonRef = useRef(null);

  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);

  useImperativeHandle(ref, () => ({
    runAnimation: mainButtonRef.current.runAnimation
  }));

  useEffect(() => {
    if (!nextTheme.theme) return;
    
    const nextThemeStyle =
      nextTheme.direction === 'next'
        ? styles['next-theme-appear-right']
        : styles['next-theme-appear-left'];

    currentThemeRef.current.classList.add(styles['current-theme-dissapear']);
    nextThemeRef.current.classList.add(nextThemeStyle);

    setTimeout(() => {
      currentThemeRef.current.classList.remove(
        styles['current-theme-dissapear']
      );
      nextThemeRef.current.classList.remove(nextThemeStyle);
    }, 500);
  }, [nextTheme.theme]);

  return (
    <>
      <div ref={currentThemeRef} className={styles['current-theme']}>
        <MainButton ref={mainButtonRef} theme={theme} />
      </div>

      <div ref={nextThemeRef} className={styles['next-theme']}>
        {nextTheme.theme && <MainButton theme={nextTheme.theme} />}
      </div>
    </>
  );
});

export default ThemeSwitcherMainButton;
