import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/reducers/gameSlice';

const ShipWaveModel = ({ id, onComplete }) => {
  const theme = useSelector(selectTheme);

  const circleRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      circleRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 0.17,
        y: 0.17,
        z: 0.17,
        duration: 1,
        onComplete: () => {
          onComplete?.(id);
        }
      }
    );
    gsap.to(circleRef.current.material, {
      opacity: 0,
      delay: 0.2,
      duration: 0.6
    });
    gsap.to(circleRef.current.material, {
      emissiveIntensity: 0,
      delay: 0.2,
      duration: 0.6
    });
  }, []);

  return (
    <mesh
      scale={0.05}
      ref={circleRef}
      position={[0, 0, -0.5]}
      rotation={[0, 0, 0]}>
      <torusGeometry args={[10, 0.1, 2, 50]} />
      <meshStandardMaterial
        color={theme.color2}
        emissive={theme.color2}
        emissiveIntensity={5}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
};

export default ShipWaveModel;
