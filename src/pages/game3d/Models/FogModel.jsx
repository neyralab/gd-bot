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
    if (!delayPassed || !showFog) return;

    if (!animationStartTime.current) {
      animationStartTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - animationStartTime.current;
    const duration = 10; //  seconds

    if (elapsed < duration) {
      fogRef.current.far = 20 + (990 * elapsed) / duration;
    } else {
      fogRef.current.far = 1000;
      setShowFog(false);
    }
  });

  if (!showFog) return;

  return <fog ref={fogRef} attach="fog" args={['#000000', -2, 20]} />;
}
