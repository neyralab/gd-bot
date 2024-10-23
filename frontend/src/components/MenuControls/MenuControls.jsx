import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'regenerator-runtime/runtime'; // this thing is important for speech recognition to be imported before react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';
import CN from 'classnames';
import { useLongPress } from 'use-long-press';

import { sendMessageToAi } from '../../effects/ai/neyraChatEffect';
import { unrealSpeechStream } from '../../effects/ai/unrealSpeechEffect';
import { useAssistantAudio } from '../AssistantDashboard/AssistantAudio/AssistantAudio';

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
    listening
  } = useAssistantAudio();
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const location = useLocation();

  const isAssistantPage = useMemo(
    () => location.pathname === '/assistant',
    [location]
  );

  const handleRegularClick = () => {
    if (listening) {
      stopRecording();
    }
  };

  const bind = useLongPress(startRecording, {
    onCancel: handleRegularClick,
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

      <button className={styles['main-button']} {...bind()}>
        {isRecording ? (
          <StopRecordIcon width="70" height="70" viewBox="0 0 70 70" />
        ) : (
          <UploadAction />
        )}
      </button>

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
