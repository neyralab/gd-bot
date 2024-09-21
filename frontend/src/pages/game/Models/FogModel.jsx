import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Color, MathUtils } from 'three';
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
    if (transitionComplete) {
      setLocalTheme(theme);
      setTransitionComplete(false);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!animationStartTime.current) {
      animationStartTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - animationStartTime.current;
    const duration = 4;

    // Calculate the new far value using a sine wave
    const amplitude = 50; // Half of the range (x - 250) / 2
    const offset = 250; // Midpoint of the range (x + 250) / 2
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
      const colorDuration = 2.4; // Duration of the color transition in seconds

      if (colorElapsed > delay) {
        const t = Math.min((colorElapsed - delay) / colorDuration, 1);
        const startColor = new Color(localTheme.colors.fog);
        const endColor = new Color(localNextTheme.theme.colors.fog);
        const r = MathUtils.lerp(startColor.r, endColor.r, t);
        const g = MathUtils.lerp(startColor.g, endColor.g, t);
        const b = MathUtils.lerp(startColor.b, endColor.b, t);
        fogRef.current.color.setRGB(r, g, b);

        if (t >= 1 && !transitionComplete) {
          setTransitionComplete(true);
        }
      }
    }
  });

  return (
    <fog ref={fogRef} attach="fog" args={[localTheme.colors.fog, -2, 250]} />
  );
}
