import React from "react";

import { ReactComponent as FullscreenIcon } from '../../../../assets/fullscreen.svg';

import styles from './styles.module.css';

export const FullscreenBtn = ({ onFullscreen }) => (
  <button
    className={styles.fullscreenBtn}
    onClick={onFullscreen}
  >
    <FullscreenIcon />
  </button>
)