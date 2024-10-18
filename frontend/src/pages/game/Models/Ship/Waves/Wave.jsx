import React, { useRef, useEffect } from 'react';
import { AdditiveBlending } from 'three';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../../../store/reducers/game/game.selectors';
import { waveAnimation } from './animations';

const Wave = ({ id, onComplete }) => {
  const theme = useSelector(selectTheme);

  const circleRef = useRef();

  useEffect(() => {
    waveAnimation(circleRef, id, onComplete);
  }, []);

  return (
    <mesh
      scale={0.05}
      ref={circleRef}
      position={[0, 0.5, -0.5]}
      rotation={[0, 0, 0]}>
      <torusGeometry args={[10, 0.1, 2, 50]} />
      <meshStandardMaterial
        color={theme.colors.wave}
        emissive={theme.colors.wave}
        emissiveIntensity={5}
        transparent
        opacity={0.15}
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
};

export default Wave;
