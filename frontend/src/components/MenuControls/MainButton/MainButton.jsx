import React, { useMemo } from 'react';
import { useLongPress } from 'use-long-press';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import { useAssistantAudio } from '../../../pages/assistant/AssistantAudio/AssistantAudio';
import UploadAction from '../../UploadAction/UploadAction';
import { ReactComponent as StopRecordIcon } from '../../../assets/stop-record.svg';
import LoadingSvg from './LoadingSvg';
import { vibrate } from '../../../utils/vibration';
import RecordButtonEqualizer from './RecordButtonEqualizer/RecordButtonEqualizer';

import styles from './MainButton.module.scss';

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
  const location = useLocation();

  const isAssistantPage = useMemo(
    () => location.pathname === '/assistant',
    [location]
  );

  const stopAllAudioActions = () => {
    vibrate();
    if (isRecording) {
      stopRecording();
    }
    if (isSpeaking) {
      stopAudio();
    }
  };

  const runRecording = () => {
    vibrate();
    audioPlayerRef.current.load();
    startRecording();
  };

  const bind = useLongPress(runRecording, {
    onCancel: stopAllAudioActions,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true
  });

  /** Unfortunately, these are the tasks requirements:
   * If AI assistant page:
   * simple tap - audio controls
   * long tap - upload file
   * If NOT AI assistant page:
   * simple tap - upload file
   * long tap - audio controls
   */
  const clickProps = useMemo(
    () =>
      isAssistantPage
        ? { onClick: isRecording ? stopRecording : startRecording }
        : { ...bind() },
    [isRecording, isAssistantPage]
  );

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
        <button className={styles['main-button']} {...clickProps}>
          <UploadAction />
        </button>
      )}
    </div>
  );
}
