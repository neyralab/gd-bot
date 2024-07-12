import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/reducers/gameSlice';

export default function FogModel() {
  const theme = useSelector(selectTheme);
  const fogRef = useRef();
  const animationStartTime = useRef(null);
  const [delayPassed, setDelayPassed] = useState(false);
  const [showFog, setShowFog] = useState(true);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setDelayPassed(true);
    }, 200);

    return () => clearTimeout(delayTimeout);
  }, []);

  useFrame((state) => {
    if (!delayPassed) return;

    if (!animationStartTime.current) {
      animationStartTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - animationStartTime.current;
    const duration = 5; // 5 seconds for a full cycle

    // Calculate the new far value using a sine wave
    const amplitude = 50; // Half of the range (350 - 250) / 2
    const offset = 300; // Midpoint of the range (350 + 250) / 2
    fogRef.current.far = offset + amplitude * Math.sin((elapsed / duration) * Math.PI * 2);
  });

  if (!showFog) return;

  return <fog ref={fogRef} attach="fog" args={[theme.colors.fog, -2, 350]} />;
}
