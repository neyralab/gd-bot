import React from 'react';
import { useLongPress } from 'use-long-press';
import classNames from 'classnames';

import { useAssistantAudio } from '../../../pages/assistant/AssistantAudio/AssistantAudio';
import UploadAction from '../../../pages/drive/components/Actions/UploadAction/UploadAction';
import { ReactComponent as StopRecordIcon } from '../../../assets/stop-record.svg';
import LoadingSvg from './LoadingSvg';

import styles from './MainButton.module.scss';
import RecordButtonEqualizer from './RecordButtonEqualizer/RecordButtonEqualizer';

export default function MainButton() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isResponseGenerating,
    isSpeaking,
    stopAudio,
    audioPlayerRef
  } = useAssistantAudio();

  const stopAllAudioActions = () => {
    if (isRecording) {
      stopRecording();
    }
    if (isSpeaking) {
      stopAudio();
    }
  };

  const runRecording = () => {
    audioPlayerRef.current.load();
    startRecording();
  };

  const bind = useLongPress(runRecording, {
    onCancel: stopAllAudioActions,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true
  });

  return (
    <div
      className={classNames(
        styles['main-button-container'],
        isRecording && styles['is-recording'],
        isSpeaking && styles['is-speaking']
      )}>
      {isRecording || isSpeaking ? (
        <button className={styles['main-button']} onClick={stopAllAudioActions}>
          {isRecording && <RecordButtonEqualizer />}
          <StopRecordIcon />
        </button>
      ) : isResponseGenerating ? (
        <button className={styles['main-button']}>
          <LoadingSvg />
        </button>
      ) : (
        <button className={styles['main-button']} {...bind()}>
          <UploadAction />
        </button>
      )}
    </div>
  );
}
