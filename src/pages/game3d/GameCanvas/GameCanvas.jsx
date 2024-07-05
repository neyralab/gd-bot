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
        {/* Do not uncomment shadow props until the model will be retopologiesed properly */}
        <directionalLight
          position={[1, 1, 1]}
          intensity={12}
          color={'#8AB8E7'}
          // castShadow
          // shadow-mapSize-width={512}
          // shadow-mapSize-height={512}
          // shadow-camera-near={0.5}
          // shadow-camera-far={500}
          // shadow-camera-left={-50}
          // shadow-camera-right={50}
          // shadow-camera-top={50}
          // shadow-camera-bottom={-50}
        />

        <ShipModel />
      </Suspense>
    </Canvas>
  );
}
