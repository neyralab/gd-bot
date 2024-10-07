import { useCallback } from 'react';

import { AdController } from '../App';

export function useAdsgram({ onReward, onError }) {

  return useCallback(async () => {
    if (AdController) {
      AdController
        .show()
        .then(() => {
          // user watch ad till the end
          onReward();
        })
        .catch((result) => {
          // user get error during playing ad or skip ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }
  }, [onError, onReward]);
}