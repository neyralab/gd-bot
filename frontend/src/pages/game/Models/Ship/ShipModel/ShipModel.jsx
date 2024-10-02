import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSelector } from 'react-redux';
import { Clock, AnimationMixer, LoopOnce } from 'three';
import {
  selectNextTheme,
  selectStatus,
  selectTheme
} from '../../../../../store/reducers/gameSlice';
import Waves from '../Waves/Waves';
import Trail from '../Trail/Trail';
import Window from '../Window/Window';
import { setThemeMaterials } from './materials';
import {
  initialAnimationContext,
  pushAnimationContext,
  stopAnimation,
  themeChangeAnimationContext,
  floatingAnimationContext,
  finishAnimationContext,
  flyAnimationContext
} from './animations';

const ShipModel = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const status = useSelector(selectStatus);
  const shipModel = useLoader(GLTFLoader, '/assets/game-page/ship.glb');

  const mixer = useRef(null);
  const shipRef = useRef(null);
  const shipGroupRef = useRef(null);
  const shipTrailModelRef = useRef();
  const flyTimeout = useRef(null);
  const floatingContext = useRef(null);
  const flyingContext = useRef(null);
  const initialContext = useRef(null);
  const pushContext = useRef(null);
  const finishContext = useRef(null);
  const finishTimeout = useRef(null);
  const themeChangeContext = useRef(null);
  const accentDetails2MaterialRef = useRef(null);
  const wavesRef = useRef(null);

  const [clock] = useState(() => new Clock());
  const [isInitialized, setIsInitialized] = useState(false);

  const scale = 0.16;

  useEffect(() => {
    if (isInitialized) return;
    setThemeMaterials(
      nextTheme.theme || theme,
      shipRef,
      accentDetails2MaterialRef
    );
    runInitialAnimation();
    setIsInitialized(true);
  }, [shipModel, theme, nextTheme.theme]);

  useEffect(() => {
    if (nextTheme.theme) {
      runThemeChange();
    }
  }, [nextTheme]);

  useEffect(() => {
    if (status === 'finished') {
      runFinishAnimation();
    }
  }, [status]);

  const runPushAnimation = () => {
    runShipPushAnimation();

    if (shipTrailModelRef.current) {
      shipTrailModelRef.current.runPushAnimation();
    }

    if (wavesRef.current) {
      wavesRef.current.runWaveAnimation();
    }

    if (flyTimeout.current) {
      clearTimeout(flyTimeout.current);
    } else {
      stopAnimation(floatingContext);
      runFlyAnimation();
    }

    flyTimeout.current = setTimeout(() => {
      stopAnimation(flyingContext, flyTimeout);
      runFloatingAnimation({ cleanupPower: 4 });
    }, 3000);
  };

  const runInitialAnimation = () => {
    stopAllAnimations();

    if (shipModel.animations.length) {
      mixer.current = new AnimationMixer(shipModel.scene); // action.reset() does not help to reset animation completely
      const action = mixer.current.clipAction(shipModel.animations[0]);
      action.setLoop(LoopOnce);
      action.clampWhenFinished = true;
      action.setEffectiveTimeScale(-1.5);
      action.time = action.getClip().duration;

      setTimeout(() => {
        action.play();
      }, 500);

      initialAnimationContext(initialContext, shipGroupRef, () => {
        runFloatingAnimation({ cleanupPower: 1 });
      });
    }

    setTimeout(() => {
      if (wavesRef.current) {
        wavesRef.current.runWaveAnimation();
      }
    }, 1400);
  };

  const runThemeChange = () => {
    stopAllAnimations();
    /** Do not run flyIn/flyOut animation if theme change conencted with reaching new level */
    if (nextTheme.direction === 'updateCurrent') {
      setThemeMaterials(
        nextTheme.theme || theme,
        shipRef,
        accentDetails2MaterialRef
      );
      return;
    }

    mixer.current = new AnimationMixer(shipModel.scene); // action.reset() does not help to reset animation completely
    const action = mixer.current.clipAction(shipModel.animations[0]);
    if (!action) return;

    action.setLoop(LoopOnce);
    action.clampWhenFinished = true;
    action.time = 0;
    action.setEffectiveTimeScale(3.5);
    action.play();

    themeChangeAnimationContext(themeChangeContext, shipGroupRef, () => {
      runInitialAnimation();
      setThemeMaterials(
        nextTheme.theme || theme,
        shipRef,
        accentDetails2MaterialRef
      );
    });
  };

  const runFloatingAnimation = ({ cleanupPower = 1 }) => {
    stopAllAnimations();
    floatingAnimationContext(floatingContext, shipGroupRef, cleanupPower);
  };

  const runFlyAnimation = () => {
    stopAllAnimations();
    flyAnimationContext(flyingContext, shipGroupRef);
  };

  const runShipPushAnimation = () => {
    // Do not use stopAllAnimations, because we need fly animation to be continued
    stopAnimation(initialContext);
    stopAnimation(pushContext);
    stopAnimation(floatingContext);
    stopAnimation(finishContext, finishTimeout);
    stopAnimation(themeChangeContext);

    pushAnimationContext(pushContext, shipGroupRef);
  };

  const runFinishAnimation = () => {
    stopAllAnimations();
    finishAnimationContext(finishContext, shipGroupRef);

    mixer.current = new AnimationMixer(shipModel.scene); // action.reset() does not help to reset animation completely
    const action = mixer.current.clipAction(shipModel.animations[1]);
    action.setLoop(LoopOnce);
    action.clampWhenFinished = true;
    action.setEffectiveTimeScale(3);
    action.play();

    finishTimeout.current = setTimeout(
      () => runFloatingAnimation({ cleanupPower: 1 }),
      2600
    );
  };

  const stopAllAnimations = () => {
    stopAnimation(initialContext);
    stopAnimation(pushContext);
    stopAnimation(flyingContext, flyTimeout);
    stopAnimation(floatingContext);
    stopAnimation(finishContext, finishTimeout);
    stopAnimation(themeChangeContext);
  };

  useFrame(() => {
    if (mixer.current) {
      mixer.current.update(clock.getDelta());
    }

    if (accentDetails2MaterialRef.current) {
      const time = clock.getElapsedTime();
      accentDetails2MaterialRef.current.emissiveIntensity =
        4 * (1 + Math.sin(time * 6)); // Flicker between 0 and 8
    }
  });

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  return (
    <>
      <group
        scale={[scale, scale, scale]}
        ref={shipGroupRef}
        position={[0, -20, 0]}
        rotation={[0, -Math.PI * 2.5, 0]}>
        <primitive object={shipModel.scene} ref={shipRef} />
      </group>

      <Waves ref={wavesRef} />

      <Trail ref={shipTrailModelRef} />

      <Window />
    </>
  );
});

export default ShipModel;
