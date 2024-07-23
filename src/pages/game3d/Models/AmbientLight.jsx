import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  selectTheme,
  selectNextTheme
} from '../../../store/reducers/gameSlice';

export default function AmbientLight() {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const lightRef = useRef();
  const [transitionStartTime, setTransitionStartTime] = useState(null);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNextTheme, setLocalNextTheme] = useState(nextTheme);
  const [transitionComplete, setTransitionComplete] = useState(false);

  useEffect(() => {
    if (!nextTheme.theme) return;
    setLocalNextTheme(nextTheme);
    setTransitionStartTime(null); // Reset the transition start time
  }, [nextTheme.theme]);

  useEffect(() => {
    if (theme.id !== localTheme.id) {
      setLocalTheme(theme);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!transitionStartTime) {
      setTransitionStartTime(state.clock.getElapsedTime());
    }

    if (transitionStartTime && localNextTheme.theme && !transitionComplete) {
      const elapsed = state.clock.getElapsedTime() - transitionStartTime;
      const delay = 1; // seconds of delay
      const duration = 2.4; // Duration of the color transition in seconds

      if (elapsed > delay) {
        const t = Math.min((elapsed - delay) / duration, 1);

        // Intensity transition
        const startIntensity = localTheme.directionalLightIntensity;
        const endIntensity = localNextTheme.theme.directionalLightIntensity;
        const intensity = THREE.MathUtils.lerp(startIntensity, endIntensity, t);
        lightRef.current.intensity = intensity;

        if (t >= 1) {
          setTransitionComplete(true); // Mark the transition as complete
        }
      }
    }
  });

  return (
    <ambientLight
      ref={lightRef}
      intensity={localTheme.ambientLightIntensity}
      color={0xffffff}
    />
  );
}
