import React from 'react';
import Assistant from './Assistant/Assistant';
import Background from './Background/Background';
import CirclularPanel from './CirclularPanel/CirclularPanel';
import MenuControls from '../../components/MenuControls/MenuControls';
import Navigation from './Navigation/Navigation';

import styles from './AssistantPage.module.scss';

export default function AssistantPage() {
  return (
    <>
      <div className={styles.container}>
        <Background />

        <div className={styles['assistant-wrapper']}>
          <CirclularPanel />
          <Assistant />
        </div>
      </div>

      <MenuControls />
      <Navigation />
    </>
  );
}
