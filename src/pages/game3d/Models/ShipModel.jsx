import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import gsap from 'gsap';
import ShipWaveModel from './ShipWaveModel';

const ShipModel = forwardRef((_, ref) => {
  const fbx = useLoader(FBXLoader, '/assets/game-page/ship.fbx');
  const mixer = useRef(null);
  const [clock] = useState(() => new THREE.Clock());
  const shipGroupRef = useRef(null);
  const waveGroupRef = useRef(new THREE.Group());
  const [waves, setWaves] = useState([]);
  const flyTimeout = useRef(null);
  const floatingContext = useRef(null);
  const flyingContext = useRef(null);

  const scale = 0.00115;

  useEffect(() => {
    runInitialAnimation();
  }, [fbx]);

  const runPushAnimation = () => {
    runWaveAnimation();
    runShipPushAnimation();

    if (flyTimeout.current) {
      clearTimeout(flyTimeout.current);
    } else {
      stopFloatingAnimation();
      runFlyAnimation();
    }

    flyTimeout.current = setTimeout(() => {
      stopFlyAnimation();
      flyTimeout.current = null;

      runFloatingAnimation();
    }, 3000);
  };

  const runInitialAnimation = () => {
    if (fbx.animations.length) {
      mixer.current = new THREE.AnimationMixer(fbx);
      const action = mixer.current.clipAction(fbx.animations[0]);
      action.stop();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.time = action.getClip().duration;
      action.setEffectiveTimeScale(-4);
      action.play();
    }

    if (shipGroupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!flyTimeout || !flyTimeout.current) {
            runFloatingAnimation();
          }
        }
      });
      tl.to(shipGroupRef.current.position, {
        y: -0.36,
        duration: 1.5,
        ease: 'power1.out'
      }).to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 1,
        ease: 'power1.inOut'
      });
    }

    setTimeout(() => {
      runWaveAnimation();
    }, 1400);
  };

  const runFloatingAnimation = () => {
    floatingContext.current = gsap.context(() => {
      /** Cleanup */
      gsap.to(shipGroupRef.current.position, {
        z: 0,
        duration: 0.2
      });

      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 1.9
      });

      /** New */
      gsap.to(shipGroupRef.current.position, {
        keyframes: [
          { z: -0.2, duration: 2, ease: 'sine.inOut' },
          { z: 0.2, duration: 2, ease: 'sine.inOut' }
        ],
        yoyo: true,
        repeat: -1,
        delay: 0.21
      });

      gsap.to(shipGroupRef.current.rotation, {
        keyframes: [
          { y: -Math.PI / 1.9, duration: 2, ease: 'sine.inOut' },
          { y: -Math.PI / 2.1, duration: 2, ease: 'sine.inOut' }
        ],
        yoyo: true,
        delay: 2,
        repeat: -1,
        repeatDelay: 0
      });
    });
  };

  const stopFloatingAnimation = () => {
    if (floatingContext.current) {
      floatingContext.current.kill();
      floatingContext.current = null;
    }
  };

  const runFlyAnimation = () => {
    /** Cleanup */
    flyingContext.current = gsap.context(() => {
      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 0.2
      });

      gsap.to(shipGroupRef.current.rotation, {
        keyframes: [
          { y: -Math.PI / 2 - Math.PI, duration: 5, ease: 'power1.inOut' },
          { y: -Math.PI / 2 + Math.PI, duration: 2, ease: 'power1.inOut' }
        ],
        repeat: -1,
        repeatDelay: 4,
        delay: 2,
        yoyo: true
      });
    });
  };

  const stopFlyAnimation = () => {
    if (flyingContext.current) {
      flyingContext.current.kill();
      flyingContext.current = null;
    }
  };

  const runShipPushAnimation = () => {
    gsap.to(shipGroupRef.current.position, {
      keyframes: [
        { z: -0.3, duration: 0.1, ease: 'power1.out' },
        { z: 0, duration: 0.1, ease: 'power1.inOut' }
      ]
    });
  };

  const runWaveAnimation = () => {
    const waveId = Date.now();
    setWaves((prevWaves) => [...prevWaves, waveId]);
  };

  const removeWave = (id) => {
    setWaves((prevWaves) => prevWaves.filter((el) => el !== id));
  };

  useFrame(() => {
    if (mixer.current) {
      mixer.current.update(clock.getDelta());
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
        <primitive object={fbx} />
      </group>

      <group ref={waveGroupRef}>
        {waves.map((el) => (
          <ShipWaveModel key={el} onComplete={() => removeWave(el)} />
        ))}
      </group>
    </>
  );
});

export default ShipModel;
