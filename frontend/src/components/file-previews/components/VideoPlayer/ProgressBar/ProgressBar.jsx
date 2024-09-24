import React, { useRef } from 'react';
import styles from './ProgressBar.module.scss';

const ProgressBar = ({
  played,
  handleSeek,
  handleSeekMouseDown,
  handleSeekChange,
  handleSeekMouseUp
}) => {
  const progressRef = useRef(null);

  return (
    <div
      ref={progressRef}
      className={styles.progressWrapper}
      onClick={handleSeek}>
      <input
        className={styles.bar}
        type="range"
        min={0}
        max={1}
        step="any"
        value={played}
        onMouseDown={handleSeekMouseDown}
        onChange={handleSeekChange}
        onMouseUp={handleSeekMouseUp}
      />
    </div>
  );
};

export default ProgressBar;
