export const vibrate = (mode) =>
  window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred(mode || 'soft');
