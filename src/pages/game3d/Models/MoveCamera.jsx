import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { selectStatus } from '../../../store/reducers/gameSlice';

const MoveCamera = () => {
  const { camera } = useThree();
  const status = useSelector(selectStatus);

  useEffect(() => {
    setCameraInitialPosition();
    window.addEventListener('resize', setCameraInitialPosition);

    return () => {
      window.removeEventListener('resize', setCameraInitialPosition);
    };
  }, [camera]);

  useEffect(() => {
    if (status === 'finished') {
      runFinishAnimation();
    }
  }, [status]);

  const setCameraInitialPosition = () => {
    if (window.innerWidth > window.innerHeight) {
      if (window.innerWidth <= 800 && window.innerHeight <= 600) {
        // Mobile horizontal
        camera.position.z = 3.6;
        camera.position.y = 0.65;
      } else {
        camera.position.z = 6;
        camera.position.y = 0.6;
      }
    } else {
      // Mobile vertical
      camera.position.z = 6;
      camera.position.y = 0.6;
    }
    camera.fov = 30;
    camera.updateProjectionMatrix();
  };

  const runFinishAnimation = () => {
    const tl = gsap.timeline();
    const initialPosition = camera.position.z;

    tl.to(camera.position, {
      z: initialPosition + 2,
      delay: 0.2,
      duration: 0.5,
      ease: 'back.inOut(2)'
    })
      .to(camera.position, {
        z: initialPosition - 4,
        duration: 0.2,
        delay: 0.5,
        ease: 'power3.in'
      })
      .to(camera.position, {
        z: initialPosition,
        duration: 1.5,
        delay: 0.1,
        ease: 'power4.out'
      });
  };

  return null;
};
export default MoveCamera;
