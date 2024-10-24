import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import styles from './Hints.module.scss';

export default function Hints() {
  const { isRecording, isResponseGenerating } = useAssistantAudio();
  const { t } = useTranslation('system');

  return (
    <>
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
    </>
  );
}
