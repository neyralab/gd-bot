import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const MoveCamera = () => {
  const { camera } = useThree();

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

  useEffect(() => {
    setCameraInitialPosition();
    window.addEventListener('resize', setCameraInitialPosition);
    return () => {
      window.removeEventListener('resize', setCameraInitialPosition);
    };
  }, [camera]);

  return null;
};
export default MoveCamera;
