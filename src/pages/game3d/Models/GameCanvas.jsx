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
import BackgroundModel from './BackgoundModel';
import MoveCamera from './MoveCamera';
import FogModel from './FogModel';
import DirectionalLight from './DirectionalLight';

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
    <Canvas antialias="true" dpr={[1, 2]}>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1.2} color={0xffffff} />
        <DirectionalLight />
        
        <FogModel />

        <BackgroundModel ref={backgroundRef} />
        <ShipModel ref={shipRef} />

        <MoveCamera />

        {/* Uncommenting this will brake the camera. So don't be afraid if the ship changes its location */}
        {/* <OrbitControls /> */}

        {/* Remove in case of lags, 
        but increase intensity of ambientLight t and directionalLight
        and also ShipWaveModel on-model opacity to 1  and remove all attrs of emission  */}
        <EffectComposer>
          <Bloom intensity={0.5} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

export default GameCanvas;
