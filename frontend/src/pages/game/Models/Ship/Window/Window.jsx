import { useEffect, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSelector } from 'react-redux';
import {
  selectNextTheme,
  selectStatus,
  selectTheme
} from '../../../../../store/reducers/game/game.selectors';
import { setThemeMaterials } from './materials';
import { fadeIn, fadeOut } from './animations';

export default function Window() {
  const { scene } = useThree();
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const advertisementOffer = useSelector(
    (state) => state.game.advertisementOfferModal
  );
  const status = useSelector(selectStatus);
  const windowRef = useRef(null);
  const addedRef = useRef(false); // Ref to track if the model has been added

  const windowModel = useLoader(
    GLTFLoader,
    '/assets/game-page/ship-window.glb'
  );

  useEffect(() => {
    setThemeMaterials(theme, windowRef);
  }, [windowModel, theme]);

  useEffect(() => {
    if (windowModel && scene && !addedRef.current) {
      scene.traverse((child) => {
        if (child.isBone && child.name === 'corp2') {
          windowModel.scene.scale.set(100, 100, 100);
          windowModel.scene.position.set(-120, -390, 0);
          child.add(windowModel.scene);
          addedRef.current = true;
        }
      });
    }
  }, [windowModel, scene]);

  useEffect(() => {
    if (windowModel) {
      if (
        advertisementOffer &&
        theme.id === 'hawk' &&
        status !== 'playing' &&
        !nextTheme.isSwitching
      ) {
        fadeIn(windowModel);
      } else {
        fadeOut(windowModel);
      }
    }
  }, [
    advertisementOffer,
    theme.id,
    status,
    nextTheme.isSwitching,
    windowModel
  ]);

  return null;
}
