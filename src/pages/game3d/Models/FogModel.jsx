import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  selectNextTheme,
  selectTheme
} from '../../../store/reducers/gameSlice';

export default function FogModel() {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const fogRef = useRef();
  const animationStartTime = useRef(null);
  const [colorTransitionStartTime, setColorTransitionStartTime] =
    useState(null);

  useEffect(() => {
    if (!nextTheme.theme) return;

    setColorTransitionStartTime(null); // Reset the color transition start time
  }, [nextTheme.theme]);

  useFrame((state) => {
    if (!animationStartTime.current) {
      animationStartTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - animationStartTime.current;
    const duration = 5; // 5 seconds for a full cycle

    // Calculate the new far value using a sine wave
    const amplitude = 50; // Half of the range (350 - 250) / 2
    const offset = 300; // Midpoint of the range (350 + 250) / 2
    fogRef.current.far =
      offset + amplitude * Math.sin((elapsed / duration) * Math.PI * 2);

    // Color transition logic with delay
    if (!colorTransitionStartTime) {
      setColorTransitionStartTime(state.clock.getElapsedTime());
    }

    if (colorTransitionStartTime && nextTheme.theme) {
      const colorElapsed =
        state.clock.getElapsedTime() - colorTransitionStartTime;
      const delay = 1; //  seconds of delay
      const colorDuration = 1.8; // Duration of the color transition in seconds

      if (colorElapsed > delay) {
        const t = (colorElapsed - delay) / colorDuration;
        if (t < 1) {
          const startColor = new THREE.Color(theme.colors.fog);
          const endColor = new THREE.Color(nextTheme.theme.colors.fog);
          const r = startColor.r + t * (endColor.r - startColor.r);
          const g = startColor.g + t * (endColor.g - startColor.g);
          const b = startColor.b + t * (endColor.b - startColor.b);
          fogRef.current.color.setRGB(r, g, b);
        } else {
          fogRef.current.color.set(nextTheme.theme.colors.fog);
        }
      }
    }
  });

  return <fog ref={fogRef} attach="fog" args={[theme.colors.fog, -2, 350]} />;
}
