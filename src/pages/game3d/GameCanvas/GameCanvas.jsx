import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ShipModel from '../ShipModel/ShipModel';
import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export default function GameCanvas() {
  return (
    <Canvas shadows>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={2} color={0xffffff} />
        <directionalLight
          position={[1, 1, 1]}
          intensity={10}
          color={'#8AB8E7'}
          castShadow
        />

        <ShipModel />
      </Suspense>
    </Canvas>
  );
}
