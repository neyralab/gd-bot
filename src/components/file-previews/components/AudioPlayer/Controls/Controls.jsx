import React from 'react';
import classNames from 'classnames';
import { ReactComponent as ForwardIcon } from '../../../../../assets/forward.svg';
import { ReactComponent as RewindIcon } from '../../../../../assets/rewind.svg';
import { ReactComponent as PlayIcon } from '../../../../../assets/play-player.svg';
import { ReactComponent as PauseIcon } from '../../../../../assets/pause.svg';
import Loader2 from '../../../../Loader2/Loader2';
import styles from './Controls.module.scss';

export default function Controls({
  isPlaying,
  isLoading,
  radius,
  filePreviewImage,
  handlePlayPause,
  handleRewind,
  handleForward
}) {
  return (
    <div
      className={styles.container}
      style={{
        width: `${radius * 2 - 40}px`,
        height: `${radius * 2 - 40}px`
      }}>
      <div
        className={styles.background}
        style={{
          backgroundImage: filePreviewImage
            ? `url(${filePreviewImage})`
            : 'url(/assets/audio-preview-2.png)',
          backgroundSize: filePreviewImage ? '100%' : '75%'
        }}></div>

      <div className={styles.controls}>
        <button
          className={styles['circle-audio-button']}
          onClick={handleRewind}>
          <RewindIcon />
        </button>

        {isLoading && (
          <button
            className={classNames(
              styles['circle-audio-button'],
              styles['circle-audio-loader-button']
            )}
            onClick={handlePlayPause}>
            <Loader2 />
          </button>
        )}

        {!isLoading && (
          <button
            className={classNames(
              styles['circle-audio-button'],
              styles['circle-audio-play-button']
            )}
            onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}

        <button
          className={styles['circle-audio-button']}
          onClick={handleForward}>
          <ForwardIcon />
        </button>
      </div>
    </div>
  );
}
