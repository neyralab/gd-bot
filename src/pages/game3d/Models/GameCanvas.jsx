import React, {
  Suspense,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Html, useProgress, OrbitControls } from '@react-three/drei';
import ShipModel from './ShipModel';
import StarsBackgroundModel from './StarsBackgoundModel';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html>
      <div
        style={{
          textAlign: 'Center',
          width: '200px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        {Math.round(progress)}% loaded
      </div>
    </Html>
  );
}

const GameCanvas = forwardRef((_, ref) => {
  const shipRef = useRef(null);
  const backgroundRef = useRef(null);

  const runPushAnimation = () => {
    if (shipRef && shipRef.current) {
      shipRef.current.runPushAnimation();
    }
    if (backgroundRef && backgroundRef.current) {
      backgroundRef.current.runPushAnimation();
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

        <StarsBackgroundModel ref={backgroundRef} />
        <ShipModel ref={shipRef} />

        {/* <OrbitControls /> */}

        {/* Remove in case of lags, 
        but increase intensity of ambientLight to 2 (from 1.5) and directionalLight to 9 (from 7)
        and also ShipWaveModel on-model opacity to 1 (from 0.1) and remove all attrs of emission emissive={'#4495E7'} emissiveIntensity={5} */}
        <EffectComposer>
          <Bloom intensity={0.05} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

export default GameCanvas;
