import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react';
import styles from './ProgressBar.module.scss';

export default function ProgressBar({
  radius,
  progress,
  duration,
  handleProgressChange,
  disableSwipeEvents
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const calculateNewTime = useCallback(
    (clientX, clientY) => {
      const boundingRect = containerRef.current.getBoundingClientRect();
      const x = clientX - boundingRect.left - boundingRect.width / 2;
      const y = clientY - boundingRect.top - boundingRect.height / 2;
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      const adjustedAngle = angle < 0 ? angle + 360 : angle;
      return (adjustedAngle / 360) * duration;
    },
    [duration]
  );

  const onProgressBarClick = (event) => {
    const newTime = calculateNewTime(event.clientX, event.clientY);
    handleProgressChange?.({ newTime });
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);

    const newTime = calculateNewTime(event.clientX, event.clientY);
    handleProgressChange?.({ newTime });
  };

  const handleMouseMove = useCallback(
    (event) => {
      if (isDragging) {
        const newTime = calculateNewTime(event.clientX, event.clientY);
        handleProgressChange?.({ newTime });
      }
    },
    [isDragging, calculateNewTime, handleProgressChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (event) => {
    setIsDragging(true);
    const touch = event.touches[0];

    const newTime = calculateNewTime(touch.clientX, touch.clientY);
    handleProgressChange?.({ newTime });
  };

  const handleTouchMove = useCallback(
    (event) => {
      if (isDragging) {
        const touch = event.touches[0];

        const newTime = calculateNewTime(touch.clientX, touch.clientY);
        handleProgressChange?.({ newTime });
      }
    },
    [isDragging, calculateNewTime, handleProgressChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    /** The global events are made on purpose
     * So the user can drag and drop not only on the circle, but outside the container
     */
    if (isDragging) {
      disableSwipeEvents?.(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      disableSwipeEvents?.(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      disableSwipeEvents?.(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={styles['progress-container']}
      style={{ height: `${radius * 2}px` }}
      onClick={onProgressBarClick}>
      <svg
        className={styles['circle-audio-svg']}
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#00F2FE', stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#00F2FE', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <circle
          className={styles['progress-background']}
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth="4"
        />

        <circle
          className={styles['progress']}
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={
            isNaN(circumference - (progress / 100) * circumference)
              ? '0'
              : circumference - (progress / 100) * circumference
          }
        />
      </svg>

      <div
        className={styles['indicator']}
        style={{
          transform: `rotate(${(progress / 100) * 360}deg) translate(0, -${radius}px)`
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}>
        <div className={styles['indicator-dot']}></div>
      </div>
    </div>
  );
}
