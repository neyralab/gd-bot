import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from 'react';
import 'regenerator-runtime/runtime'; // important for speech recognition to be imported before react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { sendMessageToAi } from '../../../effects/ai/neyraChatEffect';
import { unrealSpeechStream } from '../../../effects/ai/unrealSpeechEffect';

const AssistantAudioContext = createContext();
export const useAssistantAudio = () => useContext(AssistantAudioContext);

export const AssistantAudioProvider = ({ children }) => {
  const audioPlayerRef = useRef();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const [status, setStatus] = useState('stopped'); // 'playing', 'paused', 'stopped'
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);

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

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  }, []);

  const loadAudio = (src) => {
    // Set the audio source to the new URL
    audioPlayerRef.current = new Audio();
    audioPlayerRef.current.src = src;

    // Create the source node and connect it to the analyser and destination
    const track = audioContextRef.current.createMediaElementSource(
      audioPlayerRef.current
    );

    // Disconnect any previous track if it exists
    if (analyserRef.current) {
      track.disconnect();
    }

    // Connect the new track to the analyser and destination
    track.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

    // Play the audio
    playAudio();
  };

  const getNeyraResponse = async () => {
    try {
      setIsResponseGenerating(true);
      const res = await sendMessageToAi(transcript);
      const message = res.data.data.response;
      const audioUrl = await unrealSpeechStream(message);
      loadAudio(audioUrl); // Load the new audio URL
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('assistant.messageError'));
    } finally {
      setIsResponseGenerating(false);
    }
  };

  const playAudio = async () => {
    try {
      await audioContextRef.current.resume(); // Ensure the audio context is running
      await audioPlayerRef.current.play();

      // Add an event listener to update status when audio ends
      audioPlayerRef.current.addEventListener('ended', () => {
        setStatus('stopped');
      });

      setStatus('playing');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      await audioPlayerRef.current.pause();
      setStatus('paused');
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      await audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0; // Reset playback position
      setStatus('stopped');
    } catch (error) {
      cconsole.error('Error stopping audio:', error);
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
      toast.error(t('assistant.browserSupport'));
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
