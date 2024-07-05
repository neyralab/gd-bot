import React, {
  Suspense,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Html, useProgress } from '@react-three/drei';
import ShipModel from './ShipModel';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const GameCanvas = forwardRef((_, ref) => {
  const shipRef = useRef(null);

  const runPushAnimation = () => {
    if (shipRef && shipRef.current) {
      shipRef.current.runPushAnimation();
    }
  };

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  return (
    <Canvas shadows>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1.5} color={0xffffff} />

        <directionalLight
          position={[1, 1, 1]}
          intensity={7}
          color={'#A3C5E7'}
        />

        <ShipModel ref={shipRef} />

        {/* Remove in case of lags, 
        but increase intensity of ambientLight to 2 and directionalLight to 10 */}
        <EffectComposer>
          <Bloom intensity={0.05} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

export default GameCanvas;
