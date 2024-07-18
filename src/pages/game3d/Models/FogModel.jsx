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
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNextTheme, setLocalNextTheme] = useState(nextTheme);
  const [transitionComplete, setTransitionComplete] = useState(false);

  useEffect(() => {
    if (!nextTheme.theme) return;
    setLocalNextTheme(nextTheme);
    setColorTransitionStartTime(null); // Reset the color transition start time
    setTransitionComplete(false); // Reset the transition complete flag
  }, [nextTheme.theme]);

  useEffect(() => {
    if (theme.id !== localTheme.id) {
      setLocalTheme(theme);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!animationStartTime.current) {
      animationStartTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - animationStartTime.current;
    const duration = 4;

    // Calculate the new far value using a sine wave
    const amplitude = 50; // Half of the range (350 - 250) / 2
    const offset = 300; // Midpoint of the range (350 + 250) / 2
    fogRef.current.far =
      offset + amplitude * Math.sin((elapsed / duration) * Math.PI * 2);

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
        const startColor = new THREE.Color(localTheme.colors.fog);
        const endColor = new THREE.Color(localNextTheme.theme.colors.fog);
        const r = THREE.MathUtils.lerp(startColor.r, endColor.r, t);
        const g = THREE.MathUtils.lerp(startColor.g, endColor.g, t);
        const b = THREE.MathUtils.lerp(startColor.b, endColor.b, t);
        fogRef.current.color.setRGB(r, g, b);
        if (t >= 1) {
          setTransitionComplete(true); // Mark the transition as complete
        }
      }
    }
  });

  return <fog ref={fogRef} attach="fog" args={[theme.colors.fog, -2, 350]} />;
}
