import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'regenerator-runtime/runtime'; // this thing is important for speech recognition to be imported before react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';
import CN from 'classnames';
import { useLongPress } from 'use-long-press';

import { sendMessageToAi } from '../../../effects/ai/neyraChatEffect';
import { unrealSpeechStream } from '../../../effects/ai/unrealSpeechEffect';

import { ReactComponent as RectIcon } from '../../../../public/assets/assistant/neon-rect.svg';
import { ReactComponent as TriangleIcon } from '../../../../public/assets/assistant/neon-triangle.svg';
import { ReactComponent as CircleIcon } from '../../../../public/assets/assistant/neon-circle.svg';
import { ReactComponent as StopRecordIcon } from '../../../../public/assets/assistant/stop-record.svg';

import styles from './TemporaryControls.module.scss';

export default function TemporaryControls({ className }) {
  const [isRecodring, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ clearTranscriptOnListen: true });

  useEffect(() => {
    setIsRecording(listening);
  }, [listening]);

  const getNeyraResponse = async (text) => {
    try {
      const res = await sendMessageToAi(transcript);
      const message = res.data.data.response;
      const audioUrl = await unrealSpeechStream(message);

      if (audioRef.current && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        'An error occurred while processing message. Please try again'
      );
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      getNeyraResponse();
    }
  }, [transcript, listening]);

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Your browser does not support speech recognition');
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ language: 'en-EN', continuous: true });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  const handleRegularClick = () => {
    if (listening) {
      stopRecording();
    } else {
      console.log('Short press detected - handling upload');
    }
  };

  const bind = useLongPress(startRecording, {
    onCancel: handleRegularClick,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true
  });

  const goToDrive = () => {
    navigate('/drive');
  };

  const goToGame = () => {
    navigate('/game-3d');
  };

  return (
    <div className={CN(styles.controls, className)}>
      <button className={styles['navigate-button']} onClick={goToDrive}>
        <RectIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>
      <button className={styles['main-button']} {...bind()}>
        {isRecodring ? (
          <StopRecordIcon width="100%" height="100%" viewBox="0 0 70 70" />
        ) : (
          <CircleIcon width="100%" height="100%" viewBox="0 0 70 70" />
        )}
      </button>
      <button className={styles['navigate-button']} onClick={goToGame}>
        <TriangleIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>
      <audio ref={audioRef} className={styles['hidden']} />
      {isRecodring && (
        <div className={styles['listening-tooltip']}>I'm listening you...</div>
      )}
    </div>
  );
}
