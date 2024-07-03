import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import classNames from 'classnames';
import styles from './Counter.module.css';

const Counter = forwardRef(({ onFinish }, ref) => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [bounce, setBounce] = useState(false);
  const intervalRef = useRef();

  useImperativeHandle(ref, () => ({
    start: start
  }));

  useEffect(() => {
    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  useEffect(() => {
    if (bounce) {
      const timer = setTimeout(() => {
        setBounce(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [bounce]);

  useEffect(() => {
    if (showFinal) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showFinal]);

  const start = (seconds) => {
    setShowFinal(false);
    setIsActive(true);
    setCount(seconds);
    setBounce(true);

    let innerCount = seconds;

    intervalRef.current = setInterval(() => {
      let prevCount = innerCount;
      let newCount = prevCount - 1;
      newCount = newCount < 1 ? 0 : newCount;

      setBounce(true);
      if (prevCount <= 1) {
        clearInterval(intervalRef.current);
        setShowFinal(true);
        onFinish?.();
      }
      setCount(newCount);
      innerCount = newCount;
    }, 1000);
  };

  if (!isActive) return;

  return (
    <>
      {!showFinal && (
        <div
          className={classNames(
            styles.counter,
            bounce && styles.counterBounce
          )}>
          {count}
        </div>
      )}
      {showFinal && <div className={styles.final}>GO</div>}
    </>
  );
});

export default Counter;
