import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

const BackgroundModel = forwardRef((_, ref) => {
  const { scene: stars } = useGLTF('/assets/game-page/stars.glb');

  const glareColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/glare-color-1.png'
  );
  const glareAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/glare-alpha.png'
  );
  const planetColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/planet-color-1.png'
  );
  const planetAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/planet-alpha-1.png'
  );
  const asteroidColorMap = useLoader(
    TextureLoader,
    '/assets/game-page/asteroid-color.png'
  );
  const asteroidAlphaMap = useLoader(
    TextureLoader,
    '/assets/game-page/asteroid-alpha.png'
  );

  const starsRef = useRef(null);
  const glareRef = useRef(null);
  const planetRef = useRef(null);
  const asteroidRef = useRef(null);

  const speedRef = useRef(0);
  const maxSpeed = 0.02;

  useEffect(() => {
    stars.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          // To not receive any light, just a texture
          map: child.material.map,
          side: THREE.FrontSide // Ensure the texture is visible from inside
        });
      }
    });
  }, [stars]);

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  useFrame((_, delta) => {
    const deltaCoef = delta * 100;
    if (starsRef.current) {
      starsRef.current.rotation.x -= speedRef.current * deltaCoef;
      speedRef.current *= Math.pow(0.99, deltaCoef); // Gradually slow down the rotation
    }

    if (stars) {
      stars.traverse((child) => {
        if (child.isMesh) {
          child.material.map.offset.x -= 0.0003 * deltaCoef;
        }
      });
    }

    if (glareRef.current) {
      glareRef.current.position.y -= speedRef.current * 1.5 * deltaCoef;
      if (glareRef.current.position.y <= -10) {
        glareRef.current.position.y = 16;
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
        <primitive
          object={stars}
          scale={[10, 10, 10]}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>

      {/* Glare */}
      <group ref={glareRef} position={[0, 3, 0]}>
        <mesh position={[1, -.1, -2]} rotation={[0, 0, Math.PI * 2]}>
          <planeGeometry args={[7.5, 7.5]} />
          <meshBasicMaterial
            map={glareColorMap}
            alphaMap={glareAlphaMap}
            transparent={true}
            side={THREE.FrontSide}
          />
        </mesh>
        <mesh position={[-3, -10, -2.1]} rotation={[0, 0, Math.PI * 3]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial
            map={glareColorMap}
            alphaMap={glareAlphaMap}
            transparent={true}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>

      {/* Planet */}
      <group ref={planetRef} position={[1.1, 10, -1.9]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={planetColorMap}
            alphaMap={planetAlphaMap}
            transparent={true}
            side={THREE.FrontSide}
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
            side={THREE.FrontSide}
          />
        </mesh>
      </group>
    </>
  );
});

export default BackgroundModel;
