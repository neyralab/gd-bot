import React from 'react';
import classNames from 'classnames';
import { ReactComponent as ForwardIcon } from '../../../../../assets/forward.svg';
import { ReactComponent as RewindIcon } from '../../../../../assets/rewind.svg';
import { ReactComponent as PLayIcon } from '../../../../../assets/play-player.svg';
import { ReactComponent as PauseIcon } from '../../../../../assets/pause.svg';
import styles from './Controls.module.scss';

export default function Controls({
  isPlaying,
  radius,
  handlePlayPause,
  handleRewind,
  handleForward
}) {
  return (
    <div
      className={styles['controls']}
      style={{
        width: `${radius * 2 - 40}px`,
        height: `${radius * 2 - 40}px`
      }}>
      <button className={styles['circle-audio-button']} onClick={handleRewind}>
        <RewindIcon />
      </button>

      <button
        className={classNames(
          styles['circle-audio-button'],
          styles['circle-audio-play-button']
        )}
        onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PLayIcon />}
      </button>

      <button className={styles['circle-audio-button']} onClick={handleForward}>
        <ForwardIcon />
      </button>
    </div>
  );
}
