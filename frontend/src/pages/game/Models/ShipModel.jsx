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
import { Group, Clock, Color, AnimationMixer, LoopOnce } from 'three';
import gsap from 'gsap';
import {
  selectNextTheme,
  selectStatus,
  selectTheme
} from '../../../store/reducers/gameSlice';
import ShipWaveModel from './ShipWaveModel';
import ShipTrailModel from './ShipTrailModel';
import ShipWindowModel from './ShipWindowModel';

const ShipModel = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const status = useSelector(selectStatus);
  const advertisementOffer = useSelector(
    (state) => state.game.advertisementOfferModal
  );
  const shipModel = useLoader(GLTFLoader, '/assets/game-page/ship.glb');

  const mixer = useRef(null);
  const shipRef = useRef(null);
  const shipGroupRef = useRef(null);
  const waveGroupRef = useRef(new Group());
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

  const [clock] = useState(() => new Clock());
  const [waves, setWaves] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const scale = 0.16;

  useEffect(() => {
    if (isInitialized) return;
    runInitialAnimation();
    setThemeMaterials(theme);
    setIsInitialized(true);
  }, [shipModel, theme]);

  useEffect(() => {
    if (!isInitialized || !nextTheme.theme) return;
    if (nextTheme.theme) {
      runThemeChange();
    }
  }, [nextTheme]);

  useEffect(() => {
    if (status === 'finished') {
      runFinishAnimation();
    }
  }, [status]);

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
              material.metalness = theme.shipMetalness;
              material.roughness = theme.shipRoughness;
              break;
            case 'SecondaryColor':
              material.color.set(theme.colors.wing);
              material.metalness = theme.shipMetalness;
              material.roughness = theme.shipRoughness;
              break;
            case 'SecondaryColor2':
              material.color.set(theme.colors.wingAccent);
              material.metalness = theme.shipMetalness;
              material.roughness = theme.shipRoughness;
              break;
            case 'BaseEmission2':
              material.color.set(theme.colors.emission);
              material.emissive = new Color(theme.colors.emission);
              material.needsUpdate = true;
              break;
            case 'AccentDetailsEmission':
              material.color.set(theme.colors.accentEmission);
              material.emissive = new Color(theme.colors.accentEmission);
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
    if (shipTrailModelRef.current) {
      shipTrailModelRef.current.runPushAnimation();
    }

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

      initialContext.current = gsap.context(() => {
        if (shipGroupRef.current) {
          const tl = gsap.timeline({
            onComplete: () => {
              runFloatingAnimation({ cleanupPower: 1 });
            }
          });
          tl.to(shipGroupRef.current.position, {
            y: 0,
            duration: 1.4,
            ease: 'back.out(0.7)'
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
    stopAllAnimations();
    /** Do not run flyIn/flyOut animation if theme change conencted with reaching new level */
    if (nextTheme.direction === 'updateCurrent') {
      setThemeMaterials(nextTheme.theme || theme);
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

    themeChangeContext.current = gsap.context(() => {
      gsap.to(shipGroupRef.current.rotation, {
        x: 0,
        duration: 1,
        ease: `power1.inOut`
      });

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
    });
  };

  const stopThemeChangeAnimation = () => {
    if (themeChangeContext.current) {
      themeChangeContext.current.kill();
      themeChangeContext.current = null;
    }
  };

  const runFloatingAnimation = ({ cleanupPower = 1 }) => {
    stopAllAnimations();

    if (!shipGroupRef.current) return;
    floatingContext.current = gsap.context(() => {
      /** Cleanup */
      gsap.to(shipGroupRef.current.position, {
        z: 0,
        y: 0,
        x: 0,
        duration: 1,
        ease: `power${cleanupPower}.inOut`
      });

      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        x: 0,
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
    stopAllAnimations();

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
    if (flyTimeout.current) {
      clearTimeout(flyTimeout.current);
    }
    if (flyingContext.current) {
      flyingContext.current.kill();
      flyingContext.current = null;
    }
  };

  const runShipPushAnimation = () => {
    // Do not use stopAllAnimations, because we need fly animation to be continued
    stopInitialAnimation();
    stopPushAnimation();
    stopFloatingAnimation();
    stopFinishAnimation();
    stopThemeChangeAnimation();

    pushContext.current = gsap.context(() => {
      gsap.to(shipGroupRef.current.position, {
        keyframes: [
          { z: -0.3, duration: 0.1, ease: 'power1.out' },
          { z: 0, duration: 0.1, ease: 'power1.inOut' }
        ]
      });
      gsap.to(shipGroupRef.current.rotation, {
        x: -0.3,
        duration: 0.5,
        ease: 'power4.out'
      });
    });
  };

  const stopPushAnimation = () => {
    if (pushContext.current) {
      pushContext.current.kill();
      pushContext.current = null;
    }
  };

  const runFinishAnimation = () => {
    stopAllAnimations();

    finishContext.current = gsap.context(() => {
      /** Cleanup */
      gsap.to(shipGroupRef.current.position, {
        z: 0,
        duration: 0.1,
        ease: 'power1.out'
      });

      gsap.to(shipGroupRef.current.rotation, {
        y: -Math.PI / 2,
        x: 0,
        duration: 0.1,
        ease: 'power1.out'
      });
    });

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

  const stopFinishAnimation = () => {
    if (finishTimeout.current) {
      clearTimeout(finishTimeout.current);
    }
    if (finishContext.current) {
      finishContext.current.kill();
      finishContext.current = null;
    }
  };

  const runWaveAnimation = () => {
    const waveId = Date.now();
    setWaves((prevWaves) => [...prevWaves, waveId]);
  };

  const removeWave = (id) => {
    setWaves((prevWaves) => prevWaves.filter((el) => el !== id));
  };

  const stopAllAnimations = () => {
    stopInitialAnimation();
    stopPushAnimation();
    stopFlyAnimation();
    stopFloatingAnimation();
    stopFinishAnimation();
    stopThemeChangeAnimation();
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

        {advertisementOffer && theme.id === 'hawk' && status !== 'playing' && (
          <ShipWindowModel />
        )}

        {status === 'playing' && <ShipTrailModel ref={shipTrailModelRef} />}
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