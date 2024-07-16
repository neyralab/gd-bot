import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { selectTheme } from '../../../store/reducers/gameSlice';

const ShipTrailModel = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const groupRef = useRef(null);
  const outerConeRef = useRef(null);
  const innerConeRef = useRef(null);

  const alphaMap1 = useLoader(
    TextureLoader,
    '/assets/game-page/ship-trail-gradient-alpha-1.png'
  );
  const alphaMap2 = useLoader(
    TextureLoader,
    '/assets/game-page/ship-trail-gradient-alpha-2.png'
  );

  const speedRef = useRef(0);
  const maxSpeed = 1; // Adjusted to ensure the maximum scale reaches 1

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  useFrame((state, delta) => {
    const deltaCoef = delta * 100;
    speedRef.current = Math.max(
      speedRef.current * Math.pow(0.995, deltaCoef),
      0
    ); // Gradually slow down the speed

    const time = state.clock.getElapsedTime();
    const scaleOuter = (0.5 + 0.05 * Math.sin(time * 100)) * speedRef.current;
    const scaleInner = (0.4 + 0.02 * Math.sin(time * 100)) * speedRef.current;
    let emissionIntensityOuter = 20 + 5 * Math.sin(time * 30);
    let emissionIntensityInner = 8 + 5 * Math.sin(time * 50);
    let opacityOuter = 0.1;
    let opacityInner = 0.8;

    if (speedRef.current < 0.7) {
      const factor = (speedRef.current / 0.5) * 0.5;
      emissionIntensityInner *= factor;
      opacityInner *= factor;
    }

    if (speedRef.current < 0.5) {
      const factor = (speedRef.current / 0.5) * 0.01;
      emissionIntensityInner *= factor;
      opacityInner *= factor;
    }

    if (outerConeRef.current) {
      outerConeRef.current.scale.set(1, scaleOuter, 1);
      outerConeRef.current.position.y = 480 * (scaleOuter - 1);
      outerConeRef.current.material.emissiveIntensity = emissionIntensityOuter;
      outerConeRef.current.material.opacity = opacityOuter;
    }
    if (innerConeRef.current) {
      if (speedRef.current < 0.4) {
        innerConeRef.current.scale.set(1, scaleInner, 1);
      } else {
        innerConeRef.current.scale.set(1, scaleInner, 1);
      }

      innerConeRef.current.position.y =
        500 * (1 + scaleOuter) * (scaleInner - 1) + 150;
      innerConeRef.current.material.emissiveIntensity = emissionIntensityInner;
      innerConeRef.current.material.opacity = opacityInner;
    }
  });

  const runPushAnimation = () => {
    speedRef.current = Math.min(speedRef.current + 0.1, maxSpeed);
  };

  return (
    <group ref={groupRef} position={[0, -350, 0]} rotation={[0, 0, -Math.PI]}>
      {/* Outer Cone */}
      <mesh ref={outerConeRef} position={[0, 0, 0]}>
        <coneGeometry args={[55, 1000, 12]} openEnded={true} />
        <meshStandardMaterial
          color={theme.colors.shipTrailEmission}
          emissive={theme.colors.shipTrailEmission}
          transparent
          opacity={0.1}
          emissiveIntensity={20}
          alphaMap={alphaMap1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Cone */}
      <mesh ref={innerConeRef} position={[0, 0, 0]}>
        <coneGeometry args={[22, 600, 12]} openEnded={true} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          transparent
          opacity={0.8}
          emissiveIntensity={2}
          alphaMap={alphaMap2}
          depthTest={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
});

export default ShipTrailModel;
