import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  selectNextTheme,
  selectTheme
} from '../../../store/reducers/gameSlice';
import ShipWaveModel from './ShipWaveModel';

const ShipModel = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const shipFbx = useLoader(FBXLoader, '/assets/game-page/ship.fbx');
  const shipRef = useRef(null);
  const mixer = useRef(null);
  const [clock] = useState(() => new THREE.Clock());
  const shipGroupRef = useRef(null);
  const waveGroupRef = useRef(new THREE.Group());
  const [waves, setWaves] = useState([]);
  const flyTimeout = useRef(null);
  const floatingContext = useRef(null);
  const flyingContext = useRef(null);
  const initialContext = useRef(null);
  const pushContext = useRef(null);
  const accentDetails2MaterialRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scale = 0.0016;

  useEffect(() => {
    if (isInitialized) return;
    runInitialAnimation();
    setThemeMaterials(theme);
    setIsInitialized(true);
  }, [shipFbx, theme]);

  useEffect(() => {
    if (!isInitialized || !nextTheme.theme) return;
    if (nextTheme.theme) {
      runThemeChange();
    }
  }, [nextTheme]);

  const setThemeMaterials = (theme) => {
    if (!shipRef.current || !theme) return;

    shipRef.current.traverse((child) => {
      if (child.isMesh) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          switch (material.name) {
            case 'BaseMaterial':
              material.color.set(theme.colors.shipBase);
              break;
            case 'SecondaryColor':
              material.color.set(theme.colors.wing);
              break;
            case 'SecondaryColor2':
              material.color.set(theme.colors.wingAccent);
              break;
            case 'BaseEmission':
              material.color.set(theme.colors.emission);
              material.emissive = new THREE.Color(theme.colors.emission);
              material.needsUpdate = true;
              break;
            case 'AccentDetails2':
              material.color.set(theme.colors.accentEmission);
              material.emissive = new THREE.Color(theme.colors.accentEmission);
              material.emissiveIntensity = 8;
              material.needsUpdate = true;
              accentDetails2MaterialRef.current = material;
              break;
          }
        });
      }
    });
  };

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

      runFloatingAnimation({ cleanupPower: 4 });
    }, 3000);
  };

  const runInitialAnimation = () => {
    if (shipFbx.animations.length) {
      mixer.current = new THREE.AnimationMixer(shipFbx);
      const action = mixer.current.clipAction(shipFbx.animations[0]);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.time = 1;
      action.setEffectiveTimeScale(1);
      mixer.current.update(0);
      action.play();

      setTimeout(() => {
        action.setEffectiveTimeScale(-1);
        action.play();
      }, 1000);

      stopInitialAnimation();
      stopFloatingAnimation();

      initialContext.current = gsap.context(() => {
        if (shipGroupRef.current) {
          const tl = gsap.timeline({
            onComplete: () => {
              if (!flyTimeout || !flyTimeout.current) {
                runFloatingAnimation({ cleanupPower: 1 });
              }
            }
          });
          tl.to(shipGroupRef.current.position, {
            y: 0,
            duration: 1.4,
            ease: 'power3.out'
          }).to(shipGroupRef.current.rotation, {
            y: -Math.PI / 2,
            duration: 1.5,
            ease: 'power4.inOut'
          });
        }
      });
    }

    setTimeout(() => {
      runWaveAnimation();
    }, 1400);
  };

  const stopInitialAnimation = () => {
    if (initialContext.current) {
      initialContext.current.kill();
      initialContext.current = null;
    }
  };

  const runThemeChange = () => {
    if (!mixer.current) return;

    const action = mixer.current.clipAction(shipFbx.animations[0]);
    if (!action) return;

    stopFloatingAnimation();

    action.reset();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.time = 0;
    action.setEffectiveTimeScale(3.5);
    action.play();

    /** New */
    gsap.to(shipGroupRef.current.position, {
      y: 30,
      duration: 1,
      ease: 'back.in(1)',
      delay: 0.2,
      onComplete: () => {
        shipGroupRef.current.rotation.y = -Math.PI * 2.5;
        shipGroupRef.current.position.y = -20;
        shipGroupRef.current.position.z = 0;
        runInitialAnimation();
        setThemeMaterials(nextTheme.theme || theme);
      }
    });
  };

  const runFloatingAnimation = ({ cleanupPower = 1 }) => {
    if (!shipGroupRef.current) return;
    floatingContext.current = gsap.context(() => {
      /** Cleanup */
      gsap.to(shipGroupRef.current.position, {
        z: 0,
        duration: 1,
        ease: `power${cleanupPower}.inOut`
      });

      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 2,
        ease: `power${cleanupPower}.inOut`
      });

      /** New */
      gsap.to(shipGroupRef.current.position, {
        keyframes: [
          { z: -0.2, duration: 2, ease: 'sine.inOut' },
          { z: 0.2, duration: 2, ease: 'sine.inOut' }
        ],
        yoyo: true,
        repeat: -1,
        delay: 1.01
      });

      gsap.to(shipGroupRef.current.rotation, {
        keyframes: [
          { y: -Math.PI / 1.9, duration: 2, ease: 'sine.inOut' },
          { y: -Math.PI / 2.1, duration: 2, ease: 'sine.inOut' }
        ],
        yoyo: true,
        delay: 2.01,
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
    stopInitialAnimation();

    flyingContext.current = gsap.context(() => {
      /** Cleanup */
      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 0.2
      });
      gsap.to(shipGroupRef.current.position, {
        y: 0,
        duration: 0.5,
        ease: 'power4.out'
      });

      gsap.to(shipGroupRef.current.rotation, {
        keyframes: [
          { y: -Math.PI / 2 - Math.PI, duration: 5, ease: 'power1.inOut' },
          { y: -Math.PI / 2 + Math.PI, duration: 2.5, ease: 'power4.inOut' }
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
    stopPushAnimation();

    pushContext.current = gsap.context(() => {
      gsap.to(shipGroupRef.current.position, {
        keyframes: [
          { z: -0.3, duration: 0.1, ease: 'power1.out' },
          { z: 0, duration: 0.1, ease: 'power1.inOut' }
        ]
      });
    });
  };

  const stopPushAnimation = () => {
    if (pushContext.current) {
      pushContext.current.kill();
      pushContext.current = null;
    }
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
        <primitive object={shipFbx} ref={shipRef} />
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
