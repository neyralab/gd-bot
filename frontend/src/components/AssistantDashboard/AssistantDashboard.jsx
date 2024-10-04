import React from 'react';
import Assistant from './Assistant/Assistant';
import Background from './Background/Background';
import CirclularPanel from './CirclularPanel/CirclularPanel';
import styles from './AssistantDashboard.module.scss';

export default function AssistantDashboard() {
  return (
    <div className={styles.container}>
      <Background />

      <div className={styles['assistant-wrapper']}>
        <CirclularPanel />
        <Assistant />
      </div>
    </div>
  );
}
