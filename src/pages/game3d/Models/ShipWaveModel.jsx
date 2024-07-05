import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ShipWaveModel = ({ id, onComplete }) => {
  const circleRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      circleRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 1,
        onComplete: () => {
          onComplete?.(id);
        }
      }
    );
    gsap.to(circleRef.current.material, {
      opacity: 0,
      delay: 0.2,
      duration: 0.8
    });
    gsap.to(circleRef.current.material, {
        emissiveIntensity: 0,
        delay: 0.2,
        duration: 0.8
      });
  }, []);

  return (
    <mesh
      scale={0.05}
      ref={circleRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}>
      <torusGeometry args={[10, 0.1, 2, 50]} />
      <meshStandardMaterial
        color={'#4495E7'}
        emissive={'#4495E7'}
        emissiveIntensity={5}
        transparent
        opacity={0.1}
      />
    </mesh>
  );
};

export default ShipWaveModel;
