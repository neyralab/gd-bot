import React, { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../../../store/reducers/gameSlice';

export default function Window() {
  const theme = useSelector(selectTheme);
  const windowRef = useRef(null);

  const windowModel = useLoader(
    GLTFLoader,
    '/assets/game-page/ship-window.glb'
  );

  useEffect(() => {
    setThemeMaterials(theme);
  }, [windowModel, theme]);

  const setThemeMaterials = (theme) => {
    if (!windowRef.current || !theme) return;

    windowRef.current.traverse((child) => {
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

            case 'BaseEmission2':
              material.color.set(theme.colors.emission);
              material.emissive = new Color(theme.colors.emission);
              material.needsUpdate = true;
              break;
          }
        });
      }
    });
  };

  return (
    <primitive
      object={windowModel.scene}
      ref={windowRef}
      position={[0.2, 0, 0]}
    />
  );
}
