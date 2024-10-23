import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from 'react';
import 'regenerator-runtime/runtime'; // this thing is important for speech recognition to be imported before react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';
import { useTranslation } from 'react-i18next';

import { sendMessageToAi } from '../../../effects/ai/neyraChatEffect';
import { unrealSpeechStream } from '../../../effects/ai/unrealSpeechEffect';

const AssistantAudioContext = createContext();

export const useAssistantAudio = () => useContext(AssistantAudioContext);

export const AssistantAudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [status, setStatus] = useState('stopped'); // 'playing', 'paused', 'stopped'
  const [loading, setLoading] = useState(false); // 'loading' status
  const [isRecording, setIsRecording] = useState(false);
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
    transcribing: true
  });
  const { t } = useTranslation('system');

  const loadAudio = (src, onLoad) => {
    if (audio) {
      audio.pause();
      audio.src = ''; // Destroy the previous audio
      setAudio(null);
      audioContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setLoading(true);
    const newAudio = new Audio(src);
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 512;

    const source = audioContextRef.current.createMediaElementSource(newAudio);
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

    newAudio.addEventListener('canplaythrough', () => {
      setAudio(newAudio);
      setStatus('stopped');
      setLoading(false);
      onLoad?.(newAudio);
    });

    newAudio.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
      setLoading(false);
    });
  };

  const playAudio = (newAudio) => {
    if (newAudio) {
      newAudio.play();
      setStatus('playing');
    }
  };

  const pauseAudio = () => {
    if (audio) {
      audio.pause();
      setStatus('paused');
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setStatus('stopped');
    }
  };

  useEffect(() => {
    if (audio) {
      const handleEnded = () => {
        setStatus('stopped');
      };
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audio]);

  const getNeyraResponse = async (text) => {
    try {
      setIsResponseGenerating(true);
      const res = await sendMessageToAi(transcript);
      const message = res.data.data.response;
      const audioUrl = await unrealSpeechStream(message);
      loadAudio(audioUrl, playAudio);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('assistent.messageError'));
    } finally {
      setIsResponseGenerating(false);
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      setIsRecording(false);
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
    SpeechRecognition.startListening({ language: 'en-EN', continuous: false });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  return (
    <AssistantAudioContext.Provider
      value={{
        audio,
        status,
        loading,
        loadAudio,
        playAudio,
        pauseAudio,
        stopAudio,
        analyserRef,
        startRecording,
        stopRecording,
        isRecording,
        isResponseGenerating,
        listening
      }}>
      {children}
    </AssistantAudioContext.Provider>
  );
};
