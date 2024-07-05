import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ShipModel() {
  const fbx = useLoader(FBXLoader, '/assets/game-page/ship.fbx');
  const mixer = useRef(null);
  const [clock] = useState(() => new THREE.Clock());
  const groupRef = useRef(null);

  const scale = 0.00115;

  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    runInitialAnimation();
  }, [fbx]);

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

    if (groupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          runFloatingAnimation();
        }
      });
      tl.to(groupRef.current.position, {
        y: -0.36,
        duration: 1.5,
        ease: 'power1.out'
      }).to(groupRef.current.rotation, {
        y: -Math.PI * 2.5,
        duration: 1,
        ease: 'power1.inOut'
      });
    }
  };

  const runFloatingAnimation = () => {
    gsap.to(groupRef.current.position, {
      z: -0.2,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to(groupRef.current.rotation, {
      x: -0.2,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to(groupRef.current.rotation, {
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

  if (!fbx) return null;

  return (
    <group
      scale={[scale, scale, scale]}
      ref={groupRef}
      position={[0, -20, 0]}
      rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={fbx} receiveShadow />
    </group>
  );
}
