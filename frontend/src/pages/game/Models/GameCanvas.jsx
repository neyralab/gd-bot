import React, {
  Suspense,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Html, OrbitControls, useProgress } from '@react-three/drei';
import { setCanvasLoaded } from '../../../store/reducers/gameSlice';
import ShipModel from './Ship/ShipModel/ShipModel';
import BackgroundModel from './BackgoundModel';
import MoveCamera from './MoveCamera';
import FogModel from './FogModel';
import DirectionalLight from './DirectionalLight';
import AmbientLight from './AmbientLight';

const Loader = () => {
  const dispatch = useDispatch();
  const canvasIsLoaded = useSelector((state) => state.game.isCanvasLoaded);
  const { t } = useTranslation('system');
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && !canvasIsLoaded) {
      dispatch(setCanvasLoaded(true));
    }
  }, [progress, canvasIsLoaded]);

  return (
    <Html>
      <div
        style={{
          textAlign: 'center',
          width: '200px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        {Math.round(progress)}% {t('loading.loaded')}
      </div>
    </Html>
  );
};

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
        <AmbientLight />
        <DirectionalLight />

        {/* <FogModel /> */}

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