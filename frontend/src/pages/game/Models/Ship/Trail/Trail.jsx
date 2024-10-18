import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSelector } from 'react-redux';
import {
  BackSide,
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial
} from 'three';
import { selectTheme } from '../../../../../store/reducers/game/game.selectors';
import { setTrailMaterials } from './materials';
import { frameConeAnimation } from './animations';

const Trail = forwardRef((_, ref) => {
  const theme = useSelector(selectTheme);
  const { scene } = useThree();
  const groupRef = useRef(null);
  const outerConeRef = useRef(null);
  const innerConeRef = useRef(null);
  const addedRef = useRef(false); // Ref to track if the model has been added

  const alphaMap1 = useLoader(
    TextureLoader,
    '/assets/game-page/ship-trail-gradient-alpha-1.png'
  );
  const alphaMap2 = useLoader(
    TextureLoader,
    '/assets/game-page/ship-trail-gradient-alpha-2.png'
  );

  const speedRef = useRef(0);
  const maxSpeed = 1; // Adjusted to ensure the maximum scale reaches 1

  useImperativeHandle(ref, () => ({
    runPushAnimation: runPushAnimation
  }));

  useEffect(() => {
    setTrailMaterials(theme, outerConeRef, innerConeRef);
  }, [theme]);

  useEffect(() => {
    createTrail();
  }, [scene, theme, alphaMap1, alphaMap2]);

  const createTrail = () => {
    if (scene && !addedRef.current) {
      // Create the outer cone mesh
      const outerConeGeometry = new ConeGeometry(0.55, 10, 12, 1, true);
      const outerConeMaterial = new MeshStandardMaterial({
        color: theme.colors.shipTrailEmission,
        emissive: theme.colors.shipTrailEmission,
        transparent: true,
        opacity: 0,
        emissiveIntensity: 0,
        alphaMap: alphaMap1,
        side: BackSide
      });
      outerConeMaterial.transparent = true;
      const outerCone = new Mesh(outerConeGeometry, outerConeMaterial);
      outerCone.scale.set(0, 0, 0);
      outerConeRef.current = outerCone;

      // Create the inner cone mesh
      const innerConeGeometry = new ConeGeometry(0.22, 6, 12, 1, true);
      const innerConeMaterial = new MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FFFFFF',
        transparent: true,
        opacity: 0,
        emissiveIntensity: 0,
        alphaMap: alphaMap2,
        depthTest: false,
        side: BackSide
      });
      innerConeMaterial.transparent = true;
      const innerCone = new Mesh(innerConeGeometry, innerConeMaterial);
      innerCone.scale.set(0, 0, 0);
      innerConeRef.current = innerCone;

      // Create a group for cones
      const group = new Group();
      group.scale.set(100, 100, 100);
      group.position.set(0, -360, 0);
      group.rotation.set(0, 0, -Math.PI);

      groupRef.current = group;
      group.add(outerCone);
      group.add(innerCone);

      // Add the meshes to the root bone
      scene.traverse((child) => {
        if (child.isBone && child.name === 'root') {
          child.add(group);
          addedRef.current = true;
        }
      });
    }
  };

  useFrame((state, delta) => {
    const deltaCoef = delta * 100;
    speedRef.current = Math.max(
      speedRef.current * Math.pow(0.995, deltaCoef),
      0
    ); // Gradually slow down the speed

    const time = state.clock.getElapsedTime();
    frameConeAnimation(time, speedRef, outerConeRef, innerConeRef);
  });

  const runPushAnimation = () => {
    speedRef.current = Math.min(speedRef.current + 0.1, maxSpeed);
  };

  return null;
});

export default Trail;
