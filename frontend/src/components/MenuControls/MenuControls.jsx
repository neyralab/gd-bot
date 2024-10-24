import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';
import { useLongPress } from 'use-long-press';

import { useAssistantAudio } from '../../pages/assistant/AssistantAudio/AssistantAudio';
import MainButton from './MainButton/MainButton';
import { ReactComponent as RectIcon } from '../../assets/neon-rect.svg';
import { ReactComponent as TriangleIcon } from '../../assets/neon-triangle.svg';

import styles from './MenuControls.module.scss';

export default function MenuControls({ className }) {
  const { isRecording, isResponseGenerating } = useAssistantAudio();
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const location = useLocation();

  const isAssistantPage = useMemo(
    () => location.pathname === '/assistant',
    [location]
  );

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

      <MainButton />

      <button
        className={CN(
          styles['navigate-button'],
          location.pathname === '/game-3d' && styles['active-button']
        )}
        onClick={goToGame}>
        <TriangleIcon width="100%" height="100%" viewBox="0 0 34 34" />
      </button>
    </div>
  );
}
