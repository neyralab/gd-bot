import { useState, useEffect } from 'react';
import { isPhone } from './client';

export const useKeyboardStatus = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (!isPhone()) {
      return;
    }
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      setIsKeyboardOpen(initialHeight > currentHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardOpen;
}

