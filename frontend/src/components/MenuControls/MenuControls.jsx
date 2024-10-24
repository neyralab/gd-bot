import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';
import { useLongPress } from 'use-long-press';

import { useAssistantAudio } from '../../pages/assistant/AssistantAudio/AssistantAudio';
import UploadAction from '../../pages/drive/components/Actions/UploadAction/UploadAction';
import { ReactComponent as RectIcon } from '../../../public/assets/assistant/neon-rect.svg';
import { ReactComponent as TriangleIcon } from '../../../public/assets/assistant/neon-triangle.svg';
import { ReactComponent as CircleIcon } from '../../../public/assets/assistant/neon-circle.svg';
import { ReactComponent as StopRecordIcon } from '../../../public/assets/assistant/stop-record.svg';

import styles from './MenuControls.module.scss';

export default function MenuControls({ className }) {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isResponseGenerating,
    isSpeaking,
    stopAudio,
    audioPlayerRef
  } = useAssistantAudio();
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const location = useLocation();

  const isAssistantPage = useMemo(
    () => location.pathname === '/assistant',
    [location]
  );

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
  }

  const bind = useLongPress(runRecording, {
    onCancel: stopAllAudioActions,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true
  });

  const goToDrive = () => {
    navigate(location.pathname === '/drive' ? '/assistant' : '/drive');
  };

  const goToGame = () => {
    navigate(location.pathname === '/game-3d' ? '/assistant' : '/game-3d');
  };

  return (
    <div className={CN(styles.controls, className)}>
      <button
        className={CN(
          styles['navigate-button'],
          location.pathname === '/drive' && styles['active-button']
        )}
        onClick={goToDrive}>
        <RectIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>

      {!isRecording && !isSpeaking && (
        <button className={styles['main-button']} {...bind()}>
          <UploadAction />
        </button>
      )}

      {(isRecording || isSpeaking) && (
        <button className={styles['main-button']} onClick={stopAllAudioActions}>
          <StopRecordIcon width="70" height="70" viewBox="0 0 70 70" />
        </button>
      )}

      <button
        className={CN(
          styles['navigate-button'],
          location.pathname === '/game-3d' && styles['active-button']
        )}
        onClick={goToGame}>
        <TriangleIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>

      {isRecording && (
        <div className={styles['listening-tooltip']}>
          {t('assistant.listening')}
        </div>
      )}

      {isResponseGenerating && (
        <div className={styles['listening-tooltip']}>
          {t('assistant.generat')}
        </div>
      )}
    </div>
  );
}
