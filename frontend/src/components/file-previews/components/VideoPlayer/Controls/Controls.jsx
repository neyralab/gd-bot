import React from 'react';
import { ReactComponent as ForwardIcon } from '../../../../../assets/forward_10.svg';
import { ReactComponent as RewindIcon } from '../../../../../assets/replay_10.svg';
import { ReactComponent as PauseIcon } from '../../../../../assets/pause.svg';
import { ReactComponent as PlayIcon } from '../../../../../assets/play-player.svg';
import styles from './Controls.module.scss';

const Controls = ({
  playing,
  handleRewind,
  handlePlayPause,
  handleFastForward
}) => {
  return (
    <div className={styles.controls}>
      <button onClick={handleRewind}>
        <RewindIcon />
      </button>

      <button onClick={handlePlayPause} className={styles.pauseBtn}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button onClick={handleFastForward}>
        <ForwardIcon />
      </button>
    </div>
  );
};
export default Controls;
