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

  const scale = 0.00115;

  useEffect(() => {
    runInitialAnimation();
  }, [fbx]);

  const runPushAnimation = () => {
    runWaveAnimation();
    // to be completed with ship transforms
  };

  const runWaveAnimation = () => {
    const waveId = Date.now();
    setWaves((prevWaves) => [...prevWaves, waveId]);
  };

  const removeWave = (id) => {
    setWaves((prevWaves) => prevWaves.filter((el) => el !== id));
  };

  const runInitialAnimation = () => {
    if (fbx.animations.length) {
      mixer.current = new THREE.AnimationMixer(fbx);
      const action = mixer.current.clipAction(fbx.animations[0]);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.time = action.getClip().duration;
      action.setEffectiveTimeScale(-4);
      action.play();
    }

    if (shipGroupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          runFloatingAnimation();
        }
      });
      tl.to(shipGroupRef.current.position, {
        y: -0.36,
        duration: 1.5,
        ease: 'power1.out'
      }).to(shipGroupRef.current.rotation, {
        y: -Math.PI * 2.5,
        duration: 1,
        ease: 'power1.inOut'
      });
    }

    setTimeout(() => {
      runWaveAnimation();
    }, 1400);
  };

  const runFloatingAnimation = () => {
    gsap.to(shipGroupRef.current.position, {
      z: -0.2,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to(shipGroupRef.current.rotation, {
      x: -0.2,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to(shipGroupRef.current.rotation, {
      y: -Math.PI * 2.48,
      duration: 1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      repeatDelay: 2
    });
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
        rotation={[0, -Math.PI / 2, 0]}>
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
