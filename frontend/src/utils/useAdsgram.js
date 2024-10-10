import { useCallback } from 'react';
import { AdController } from '../App';
import { ADSGRAM_BLOCK_ID } from './api-urls';
import { isDevEnv } from './isDevEnv';

export function initialize() {
  if (!isDevEnv())
    return window?.Adsgram?.init({ blockId: ADSGRAM_BLOCK_ID });

  return ''
}

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
      await AdController?.show();
      onReward();
    } catch (error) {
      onError?.(error);
    }
  }, [onError, onReward]);
}
