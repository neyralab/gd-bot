import { useEffect } from 'react';

const useTelegramBackButton = (onBackAction, shouldShow = true) => {
  useEffect(() => {
    // Show or hide the back button based on `shouldShow` flag
    if (shouldShow) {
      Telegram.WebApp.BackButton.show();
    } else {
      Telegram.WebApp.BackButton.hide();
    }

    // Handle the back button click event
    const handleBackButtonClick = () => {
      if (onBackAction) {
        onBackAction();
      }
    };

    Telegram.WebApp.BackButton.onClick(handleBackButtonClick);

    // Cleanup on unmount
    return () => {
      Telegram.WebApp.BackButton.offClick(handleBackButtonClick); // Remove the listener
    };
  }, [onBackAction, shouldShow]); // Dependency array ensures it runs when dependencies change
};

export { useTelegramBackButton };
