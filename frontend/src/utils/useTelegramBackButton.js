import { useEffect } from 'react';

const useTelegramBackButton = (onBackAction, shouldShow = true) => {
  useEffect(() => {
    if (shouldShow) {
      Telegram.WebApp.BackButton.show();
    } else {
      Telegram.WebApp.BackButton.hide();
    }
    
    Telegram.WebApp.BackButton.onClick(onBackAction);

    return () => {
      Telegram.WebApp.BackButton.offClick(onBackAction);
    };
  }, [onBackAction, shouldShow]);
};

export { useTelegramBackButton };
