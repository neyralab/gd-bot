import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from 'react';

const AssistantAudioContext = createContext();

export const useAssistantAudio = () => useContext(AssistantAudioContext);

export const AssistantAudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [status, setStatus] = useState('stopped'); // 'playing', 'paused', 'stopped'
  const [loading, setLoading] = useState(false); // 'loading' status
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

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
      onLoad?.();
    });

    newAudio.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
      setLoading(false);
    });
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
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
        analyserRef
      }}>
      {children}
    </AssistantAudioContext.Provider>
  );
};
