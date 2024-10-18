import React from 'react';
import { AssistantAudioProvider } from './AssistantAudio/AssistantAudio';
import Assistant from './Assistant/Assistant';
import Background from './Background/Background';
import CirclularPanel from './CirclularPanel/CirclularPanel';
import TemporaryControls from './TemporaryControls/TemporaryControls';
import TemporaryNavigate from './TemporaryNavigate/TemporaryNavigate';

import styles from './AssistantDashboard.module.scss';

export default function AssistantDashboard() {
  return (
    <AssistantAudioProvider>
      <div className={styles.container}>
        <Background />

        <div className={styles['assistant-wrapper']}>
          <CirclularPanel />
          <Assistant />
        </div>
      </div>

      <TemporaryControls />
      <TemporaryNavigate />
    </AssistantAudioProvider>
  );
}
