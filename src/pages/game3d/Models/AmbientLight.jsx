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
    setTransitionStartTime(null);
    setTransitionComplete(false);
  }, [nextTheme.theme]);

  useEffect(() => {
    if (transitionComplete) {
      setLocalTheme(theme);
      setTransitionComplete(false);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!transitionStartTime) {
      setTransitionStartTime(state.clock.getElapsedTime());
    }

    if (transitionStartTime && localNextTheme.theme && !transitionComplete) {
      const elapsed = state.clock.getElapsedTime() - transitionStartTime;
      const delay = 1; // seconds of delay
      const duration = 0.5; // Duration of the color transition in seconds

      if (elapsed > delay) {
        const t = Math.min((elapsed - delay) / duration, 1);

        // Intensity transition
        const startIntensity = localTheme.ambientLightIntensity;
        const endIntensity = localNextTheme.theme.ambientLightIntensity;
        const intensity = THREE.MathUtils.lerp(startIntensity, endIntensity, t);
        lightRef.current.intensity = intensity;

        if (t >= 1 && !transitionComplete) {
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
