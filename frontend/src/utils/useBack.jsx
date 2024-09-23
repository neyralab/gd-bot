import { useEffect, useRef } from 'react';

export const useOnLocationChange = (listener) => {
  const prev = useRef(null);

  useEffect(() => {
    const l = (data) => {
      if (prev.current !== data.destination.url) {
        prev.current = data.destination.url;
        listener(prev.current);
      }
    };

    window.navigation.addEventListener('navigate', l);
    return () => {
      window.navigation.removeEventListener('navigate', l);
    };
  }, [listener]);
};
