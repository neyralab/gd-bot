import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  selectTheme,
  selectNextTheme
} from '../../../store/reducers/gameSlice';

const DirectionalLight = () => {
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
      const colorDuration = 2.4; 
      const intensityDuration = .5;

      if (elapsed > delay) {
        const colorT = Math.min((elapsed - delay) / colorDuration, 1); 
        const intensityT = Math.min((elapsed - delay) / intensityDuration, 1); 
        const startColor = new THREE.Color(localTheme.colors.directionalLight);
        const endColor = new THREE.Color(
          localNextTheme.theme.colors.directionalLight
        );
        const r = THREE.MathUtils.lerp(startColor.r, endColor.r, colorT);
        const g = THREE.MathUtils.lerp(startColor.g, endColor.g, colorT);
        const b = THREE.MathUtils.lerp(startColor.b, endColor.b, colorT);
        lightRef.current.color.setRGB(r, g, b);

        // Intensity transition
        const startIntensity = localTheme.directionalLightIntensity;
        const endIntensity = localNextTheme.theme.directionalLightIntensity;
        const intensity = THREE.MathUtils.lerp(startIntensity, endIntensity, intensityT);
        lightRef.current.intensity = intensity;

        if (colorT >= 1 && !transitionComplete) { // take the longest duration here
          setTransitionComplete(true);
        }
      }
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[1, 1, 1]}
      intensity={localTheme.directionalLightIntensity}
      color={localTheme.colors.directionalLight}
    />
  );
};

export default DirectionalLight;
