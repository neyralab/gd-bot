import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import {
  RepeatWrapping,
  MirroredRepeatWrapping,
  BackSide,
  FrontSide
} from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSelector } from 'react-redux';
import {
  selectNextTheme,
  selectTheme
} from '../../../store/reducers/gameSlice';

const BackgroundModel = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);

  const [isFadingOut, setIsFadingOut] = useState(false); // For animaiton purposes: theme changes
  const themeChangeOpacityRef = useRef(0); // Ref to track glare opacity
  const themeChangeStartTimeRef = useRef(null);

  const starsRef = useRef(null);
  const starsColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/stars-without-alpha.png'
  );

  const glareRef = useRef(null);
  const [currentGlareImage, setCurrentGlareImage] = useState(
    `/assets/game-page/${theme.glareImg}`
  );
  const glareColorMap = useLoader(TextureLoader, currentGlareImage);
  const glareAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/glare-alpha.png'
  );

  const planetRef = useRef(null);
  const planetColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/planet-color-1.png'
  );
  const planetAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/planet-alpha-1.png'
  );

  const asteroidRef = useRef(null);
  const asteroidColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/asteroid-color.png'
  );
  const asteroidAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/asteroid-alpha.png'
  );

  const speedRef = useRef(0);
  const maxSpeed = 0.02;

  useEffect(() => {
    starsColorMap.wrapS = RepeatWrapping;
    starsColorMap.wrapT = MirroredRepeatWrapping;
    starsColorMap.repeat.set(6, 6);
    starsColorMap.rotation = Math.PI / 2;
    starsColorMap.center.set(0.5, 0.5);
    starsColorMap.needsUpdate = true;
  }, [starsColorMap]);

  useEffect(() => {
    if (isFadingOut) return;

    // Initialize glare opacity to 0
    if (glareRef.current) {
      glareRef.current.children.forEach((mesh) => {
        mesh.material.opacity = 0;
      });
    }

    // Reset glare animation start time and opacity
    themeChangeStartTimeRef.current = null;
    themeChangeOpacityRef.current = 0;
  }, [glareColorMap, isFadingOut]);

  useEffect(() => {
    setTimeout(() => {
      if (nextTheme.theme && glareRef.current) {
        setIsFadingOut(true);
        themeChangeStartTimeRef.current = null;
      }
    }, 500);
  }, [nextTheme.theme]);

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  useFrame((state, delta) => {
    const deltaCoef = delta * 100;
    speedRef.current *= Math.pow(0.99, deltaCoef); // Gradually slow down the rotation

    if (starsRef.current) {
      starsRef.current.rotation.x -= speedRef.current * deltaCoef * 0.5;
      starsColorMap.offset.x -= 0.0003 * deltaCoef;
    }

    if (glareRef.current) {
      /** Glare position change */
      glareRef.current.position.y -= speedRef.current * 1.5 * deltaCoef;
      if (glareRef.current.position.y <= -10) {
        glareRef.current.position.y = 16;
      }

      /** Glare appear/disappear */
      if (!themeChangeStartTimeRef.current) {
        themeChangeStartTimeRef.current = state.clock.getElapsedTime();
      }
      const elapsed =
        state.clock.getElapsedTime() - themeChangeStartTimeRef.current;
      const delay = 0; // seconds of delay
      const duration = 0.5; // Duration of the opacity transition in seconds

      if (elapsed > delay) {
        const t = (elapsed - delay) / duration;
        if (isFadingOut) {
          themeChangeOpacityRef.current = Math.max(1 - t, 0); // Fade out
          if (themeChangeOpacityRef.current === 0) {
            setCurrentGlareImage(
              `/assets/game-page/${nextTheme.theme ? nextTheme.theme.glareImg : theme.glareImg}`
            );
            setIsFadingOut(false);
          }
        } else {
          themeChangeOpacityRef.current = Math.min(t, 1); // Fade in
        }
        glareRef.current.children.forEach((mesh) => {
          mesh.material.opacity = themeChangeOpacityRef.current;
        });
      }
    }

    if (planetRef.current) {
      planetRef.current.position.y -= speedRef.current * 1.7 * deltaCoef;
      if (planetRef.current.position.y <= -28) {
        planetRef.current.position.y = 5;
      }

      planetRef.current.rotation.z -= 0.001 * deltaCoef;
    }

    if (asteroidRef.current) {
      asteroidRef.current.position.x += speedRef.current * 0.6 * deltaCoef;
      asteroidRef.current.position.y -= speedRef.current * 5 * deltaCoef;
      if (asteroidRef.current.position.x >= 5) {
        asteroidRef.current.position.x = -3.3;
        asteroidRef.current.position.y = 22;
      }

      asteroidRef.current.rotation.z += 0.002 * deltaCoef;
    }
  });

  const runPushAnimation = () => {
    speedRef.current = Math.min(speedRef.current + 0.003, maxSpeed);
  };

  return (
    <>
      {/* Stars */}
      <group ref={starsRef}>
        <mesh rotation={[Math.PI / 1.9, 0, Math.PI / 2]}>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial map={starsColorMap} side={BackSide} />
        </mesh>
      </group>

      {/* Glare */}
      {/* <group ref={glareRef} position={[0, 3, 0]}>
        <mesh position={[1, -0.1, -2]} rotation={[0, 0, Math.PI * 2]}>
          <planeGeometry args={[7.5, 7.5]} />
          <meshBasicMaterial
            map={glareColorMap}
            alphaMap={glareAlphaMap}
            transparent={true}
            side={FrontSide}
          />
        </mesh>
        <mesh position={[-3, -10, -2.1]} rotation={[0, 0, Math.PI * 3]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial
            map={glareColorMap}
            alphaMap={glareAlphaMap}
            transparent={true}
            side={FrontSide}
          />
        </mesh>
      </group> */}

      {/* Planet */}
      <group ref={planetRef} position={[1.1, 10, -1.9]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={planetColorMap}
            alphaMap={planetAlphaMap}
            transparent={true}
            side={FrontSide}
          />
        </mesh>
      </group>

      {/* Asteroid */}
      <group
        ref={asteroidRef}
        position={[-3.3, 22, -1.8]}
        rotation={[0, 0, 0.7]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={asteroidColorMap}
            alphaMap={asteroidAlphaMap}
            transparent={true}
            side={FrontSide}
          />
        </mesh>
      </group>
    </>
  );
});

export default BackgroundModel;
