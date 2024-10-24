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
  const sourceRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false); // user's speach recording
  const [isResponseGenerating, setIsResponseGenerating] = useState(false); // request is sent to get assistant response
  const [isSpeaking, setIsSpeaking] = useState(false); // assistant is speaking

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    clearTranscriptOnListen: true
  });
  const { t } = useTranslation('system');

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    audioPlayerRef.current = new Audio();
  }, []);

  const loadAudio = (src) => {
    // Set the audio source to the new URL
    audioPlayerRef.current.src = src;
    audioPlayerRef.current.load();

    // Create the source node and connect it to the analyser and destination if not already connected
    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioPlayerRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    // Play the audio
    playAudio();
  };

  const getNeyraResponse = async () => {
    try {
      setIsResponseGenerating(true);
      const res = await sendMessageToAi(transcript);
      const message = res.data.data.response;
      const audioUrl = await unrealSpeechStream(message);
      // alert(audioUrl);
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
        setIsSpeaking(false);
      });

      setIsSpeaking(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };

  const pauseAudio = async () => {
    try {
      await audioPlayerRef.current.pause();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error pausing audio:', error);
      setIsSpeaking(false);
    }
  };

  const stopAudio = async () => {
    try {
      await audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0; // Reset playback position
      setIsSpeaking(false);
    } catch (error) {
      cconsole.error('Error stopping audio:', error);
      setIsSpeaking(false);
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
        loadAudio,
        playAudio,
        pauseAudio,
        stopAudio,
        analyserRef,
        audioPlayerRef,
        startRecording,
        stopRecording,
        isRecording,
        isResponseGenerating,
        isSpeaking
      }}>
      {children}
    </AssistantAudioContext.Provider>
  );
};
