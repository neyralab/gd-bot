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
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNextTheme, setLocalNextTheme] = useState(nextTheme);
  const [transitionComplete, setTransitionComplete] = useState(false);

  useEffect(() => {
    if (!nextTheme.theme) return;
    setLocalNextTheme(nextTheme);
    setColorTransitionStartTime(null); // Reset the color transition start time
  }, [nextTheme.theme]);

  useEffect(() => {
    if (theme.id !== localTheme.id) {
      setLocalTheme(theme);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!colorTransitionStartTime) {
      setColorTransitionStartTime(state.clock.getElapsedTime());
    }

    if (
      colorTransitionStartTime &&
      localNextTheme.theme &&
      !transitionComplete
    ) {
      const colorElapsed =
        state.clock.getElapsedTime() - colorTransitionStartTime;
      const delay = 1; // seconds of delay
      const colorDuration = 5; // Duration of the color transition in seconds

      if (colorElapsed > delay) {
        const t = Math.min((colorElapsed - delay) / colorDuration, 1);
        const startColor = new THREE.Color(localTheme.colors.directionalLight);
        const endColor = new THREE.Color(
          localNextTheme.theme.colors.directionalLight
        );
        const r = THREE.MathUtils.lerp(startColor.r, endColor.r, t);
        const g = THREE.MathUtils.lerp(startColor.g, endColor.g, t);
        const b = THREE.MathUtils.lerp(startColor.b, endColor.b, t);
        lightRef.current.color.setRGB(r, g, b);
        if (t >= 1) {
          setTransitionComplete(true); // Mark the transition as complete
        }
      }
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[1, 1, 1]}
      intensity={2}
      color={theme.colors.directionalLight}
    />
  );
};

export default DirectionalLight;
