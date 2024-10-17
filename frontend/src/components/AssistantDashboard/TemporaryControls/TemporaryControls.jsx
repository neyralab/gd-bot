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

import { sendMessageToAi } from '../../../effects/ai/neyraChatEffect';
import { unrealSpeechStream } from '../../../effects/ai/unrealSpeechEffect';

import UploadAction from '../../../pages/drive/components/Actions/UploadAction/UploadAction';
import { ReactComponent as RectIcon } from '../../../../public/assets/assistant/neon-rect.svg';
import { ReactComponent as TriangleIcon } from '../../../../public/assets/assistant/neon-triangle.svg';
import { ReactComponent as CircleIcon } from '../../../../public/assets/assistant/neon-circle.svg';
import { ReactComponent as StopRecordIcon } from '../../../../public/assets/assistant/stop-record.svg';

import styles from './TemporaryControls.module.scss';

export default function TemporaryControls({ className }) {
  const [isRecodring, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ clearTranscriptOnListen: true });
  const isAssistantPage = useMemo(() => location.pathname === '/assistant', [location]);

  const getNeyraResponse = async (text) => {
    try {
      setIsResponseGenerating(true);
      const res = await sendMessageToAi(transcript);
      const message = res.data.data.response;
      const audioUrl = await unrealSpeechStream(message);

      if (audioRef.current && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('assistent.messageError'));
    } finally {
      setIsResponseGenerating(false);
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      getNeyraResponse();
    }
  }, [transcript, listening]);

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(t('assistent.browserSupport'));
      return;
    }
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ language: 'en-EN', continuous: true });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setTimeout(() => {
      setIsRecording(false);
    }, 500);
  };

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
  }

  const goToGame = () => {
    navigate(location.pathname === '/game-3d' ? '/assistant' : '/game-3d');
  }

  const clickProps = useMemo(() => isAssistantPage ?
    { onClick: listening ? stopRecording : startRecording } :
    { ...bind() }
  , [listening, isAssistantPage]);

  return (
    <div className={CN(styles.controls, className)}>
      <button
        className={CN(
          styles['navigate-button'],
          location.pathname === '/drive' && styles['active-button']
        )}
        onClick={goToDrive}
      >
        <RectIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>
      <button className={styles['main-button']} { ...clickProps }>
        {isRecodring ? (
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
        onClick={goToGame}
      >
        <TriangleIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>
      <audio ref={audioRef} className={styles['hidden']} />
      {isRecodring && (
        <div className={styles['listening-tooltip']}>{t('assistent.listening')}</div>
      )}
      {isResponseGenerating && (
        <div className={styles['listening-tooltip']}>
         {t('assistent.generat')}
        </div>
      )}
    </div>
  );
}
