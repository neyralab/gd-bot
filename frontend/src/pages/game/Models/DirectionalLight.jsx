import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import { Color, MathUtils } from 'three';
import {
  selectTheme,
  selectNextTheme
} from '../../../store/reducers/gameSlice';

const DirectionalLight = () => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const light1Ref = useRef();
  const light2Ref = useRef();
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
      const intensityDuration = 0.5;

      if (elapsed > delay) {
        const colorT = Math.min((elapsed - delay) / colorDuration, 1);
        const intensityT = Math.min((elapsed - delay) / intensityDuration, 1);

        // Color transition for both lights
        const startColor = new Color(localTheme.colors.directionalLight);
        const endColor = new Color(
          localNextTheme.theme.colors.directionalLight
        );
        const r = MathUtils.lerp(startColor.r, endColor.r, colorT);
        const g = MathUtils.lerp(startColor.g, endColor.g, colorT);
        const b = MathUtils.lerp(startColor.b, endColor.b, colorT);
        light1Ref.current.color.setRGB(r, g, b);
        light2Ref.current.color.setRGB(r, g, b);

        // Intensity transition for light 1
        const startIntensity1 = localTheme.directionalLight1Intensity;
        const endIntensity1 = localNextTheme.theme.directionalLight1Intensity;
        const intensity1 = MathUtils.lerp(
          startIntensity1,
          endIntensity1,
          intensityT
        );
        light1Ref.current.intensity = intensity1;

        // Intensity transition for light 2
        const startIntensity2 = localTheme.directionalLight2Intensity;
        const endIntensity2 = localNextTheme.theme.directionalLight2Intensity;
        const intensity2 = MathUtils.lerp(
          startIntensity2,
          endIntensity2,
          intensityT
        );
        light2Ref.current.intensity = intensity2;

        if (colorT >= 1 && intensityT >= 1 && !transitionComplete) {
          setTransitionComplete(true);
        }
      }
    }
  });

  return (
    <>
      <directionalLight
        ref={light1Ref}
        position={[100, 0.5, -5]}
        intensity={localTheme.directionalLight1Intensity}
        color={localTheme.colors.directionalLight}
      />
      <directionalLight
        ref={light2Ref}
        position={[-100, -50, 5]}
        intensity={localTheme.directionalLight2Intensity}
        color={localTheme.colors.directionalLight}
      />
    </>
  );
};

export default DirectionalLight;
