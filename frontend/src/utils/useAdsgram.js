import { useCallback } from 'react';
import { AdController } from '../App';

export function useAdsgram({ onReward, onError }) {
  return useCallback(async () => {
    if (!AdController) {
      return onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }

    try {
      await AdController.show();
      onReward();
    } catch (error) {
      onError?.(error);
    }
  }, [onError, onReward]);
}
