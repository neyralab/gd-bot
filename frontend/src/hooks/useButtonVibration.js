import { useCallback } from 'react';

const useButtonVibration = () => {
  const handleVibrationClick = useCallback((callback) => {
    return (e) => {
      window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
      if (callback) {
        callback(e);
      }
    };
  }, []);

  return handleVibrationClick;
};

export default useButtonVibration;
