import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState
} from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const StarsBackgroundModel = forwardRef((_, ref) => {
  const { scene } = useGLTF('/assets/game-page/stars.glb');
  const [backgroundModel, setBackgroundModel] = useState();

  const groupRef = useRef(null);
  const speedRef = useRef(0);
  const maxSpeed = 0.02;

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          // To not receive any light, just a texture
          map: child.material.map,
          side: THREE.FrontSide // Ensure the texture is visible from inside
        });
        setBackgroundModel(child);
      }
    });
  }, [scene]);

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= speedRef.current;
      speedRef.current *= 0.99; // Gradually slow down the rotation
    }

    // Update texture offset
    if (backgroundModel) {
      backgroundModel.material.map.offset.x -= 0.0003;
    }
  });

  const runPushAnimation = () => {
    speedRef.current = Math.min(speedRef.current + 0.003, maxSpeed);
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={[10, 10, 10]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
});

export default StarsBackgroundModel;
