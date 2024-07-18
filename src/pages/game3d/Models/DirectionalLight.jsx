import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import {
  selectTheme,
  selectNextTheme
} from '../../../store/reducers/gameSlice';

import * as THREE from 'three';

const DirectionalLight = () => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const lightRef = useRef();
  const [colorTransitionStartTime, setColorTransitionStartTime] =
    useState(null);

  useEffect(() => {
    if (!nextTheme.theme) return;
    setColorTransitionStartTime(null); // Reset the color transition start time
  }, [nextTheme.theme]);

  useFrame((state) => {
    if (!colorTransitionStartTime) {
      setColorTransitionStartTime(state.clock.getElapsedTime());
    }

    if (colorTransitionStartTime && nextTheme.theme) {
      const colorElapsed =
        state.clock.getElapsedTime() - colorTransitionStartTime;
      const delay = 1; // seconds of delay
      const colorDuration = 1.8; // Duration of the color transition in seconds

      if (colorElapsed > delay) {
        const t = (colorElapsed - delay) / colorDuration;
        if (t < 1) {
          const startColor = new THREE.Color(theme.colors.directionalLight);
          const endColor = new THREE.Color(
            nextTheme.theme.colors.directionalLight
          );
          const r = startColor.r + t * (endColor.r - startColor.r);
          const g = startColor.g + t * (endColor.g - startColor.g);
          const b = startColor.b + t * (endColor.b - startColor.b);
          lightRef.current.color.setRGB(r, g, b);
        } else {
          lightRef.current.color.set(nextTheme.theme.colors.directionalLight);
        }
      }
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[1, 1, 1]}
      intensity={2.5}
      color={theme.colors.directionalLight}
    />
  );
};

export default DirectionalLight;
