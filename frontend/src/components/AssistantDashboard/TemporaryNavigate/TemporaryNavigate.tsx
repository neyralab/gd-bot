import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import { NavigationHistoryContext } from '../../../store/context/NavigationHistoryProvider';
import { ReactComponent as ControlIcon } from '../../../../public/assets/assistant/control.svg';

import styles from './TemporaryNavigate.module.scss';

export default function TemporaryControls() {
  const navigate = useNavigate();
  const { history } = useContext(NavigationHistoryContext);
  const { audio, loadAudio, playAudio, loading, stopAudio } = useAssistantAudio();


  useEffect(() => {
    loadAudio('/assets/dummy/male-voice-2.mp3');
    return () => {
      stopAudio();
    }
  }, [])

  useEffect(() => {
    if (!loading && audio && history?.[0] === '/' && history.length === 2) {
      const button = document.createElement('button');
      button.addEventListener('click', function() {
        playAudio();     
      });
      button.click();
    }
  }, [loading, audio, history]);

  const goToProfile = () => {
    navigate('/start');
  }

  return (
    <div className={styles.controls}>
      <button onClick={goToProfile}>
        <ControlIcon width='100%' height='100%' viewBox="0 0 70 80" />
      </button>
    </div>
  );
}
