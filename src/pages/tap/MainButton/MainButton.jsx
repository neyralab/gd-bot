import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './MainButton.module.css';

const MainButton = forwardRef(({ theme }, ref) => {
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const frame1Ref = useRef(null);
  const frame2Ref = useRef(null);
  const frame3Ref = useRef(null);
  const frame4Ref = useRef(null);

  const runAnimation = () => {
    let items = [
      containerRef,
      iconRef,
      frame1Ref,
      frame2Ref,
      frame3Ref,
      frame4Ref
    ];

    // Clear any existing animations and start from the beginning
    items.forEach((itemRef, i) => {
      if (itemRef.current) {
        itemRef.current.classList.remove(styles['btn-animation-' + i]);

        // Using setTimeout to ensure the class is removed before adding it again
        setTimeout(() => {
          itemRef.current.classList.add(styles['btn-animation-' + i]);
        }, 1);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    runAnimation: runAnimation
  }));

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.container,
        theme && styles[theme.id]
      )}>
      <div
        className={classNames(styles.frame, styles.frame1)}
        ref={frame1Ref}></div>
      <div
        className={classNames(styles.frame, styles.frame2)}
        ref={frame2Ref}></div>
      <div
        className={classNames(styles.frame, styles.frame3)}
        ref={frame3Ref}></div>
      <div
        className={classNames(styles.frame, styles.frame4)}
        ref={frame4Ref}></div>

      <div className={styles['icon-container']}>
        <div className={styles.icon} ref={iconRef}></div>
      </div>
    </div>
  );
});

export default MainButton;
