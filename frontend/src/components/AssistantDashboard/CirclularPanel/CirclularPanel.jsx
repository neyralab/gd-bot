import React from 'react';
import classNames from 'classnames';
import styles from './CirclularPanel.module.scss';

export default function CirclularPanel() {
  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.layer, styles.layer1)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-1.png)'
        }}></div>

      <div
        className={classNames(styles.layer, styles.layer2)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-2.png)'
        }}></div>

      <div
        className={classNames(styles.layer, styles.layer3)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-3.png)'
        }}></div>

      <div
        className={classNames(styles.layer, styles.layer4)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-4.png)'
        }}></div>
    </div>
  );
}
