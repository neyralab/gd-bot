import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import styles from './Counter.module.css';

const Counter = () => {
  const isActive = useSelector((state) => state.game.counter.isActive);
  const isFinished = useSelector((state) => state.game.counter.isFinished);
  const count = useSelector((state) => state.game.counter.count);

  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);

    const timer = setTimeout(() => {
      setBounce(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [count]);

  if (!isActive) return;

  return (
    <>
      {!isFinished && (
        <div
          className={classNames(
            styles.counter,
            bounce && styles.counterBounce
          )}>
          {count}
        </div>
      )}
      {isFinished && <div className={styles.final}>GO</div>}
    </>
  );
};

export default Counter;
