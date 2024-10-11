import React, { useEffect } from 'react';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import styles from './TemporaryControls.module.scss';

export default function TemporaryControls() {
  const { audio, loadAudio, playAudio, pauseAudio, loading } =
    useAssistantAudio();

  const loadClickHandler = () => {
    if (!audio) {
      loadAudio('/assets/dummy/male-voice-2.mp3');
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    if (!loading && audio) {
      playAudio();
    }
  }, [loading]);

  return (
    <div className={styles.controls}>
      <button onClick={loadClickHandler}>Play</button>
      <button onClick={pauseAudio}>Stop</button>
    </div>
  );
}
