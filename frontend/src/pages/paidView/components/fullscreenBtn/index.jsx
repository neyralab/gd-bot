import React from "react";
import CN from 'classnames';

import { ReactComponent as FullscreenIcon } from '../../../../assets/fullscreen.svg';

import styles from './styles.module.css';

export const FullscreenBtn = ({ className, onFullscreen }) => (
  <button
    className={CN(styles.fullscreenBtn, className)}
    onClick={onFullscreen}
  >
    <FullscreenIcon />
  </button>
)