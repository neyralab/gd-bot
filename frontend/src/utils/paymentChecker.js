const isStarsPaymentEnabled = JSON.parse(import.meta.env.VITE_PAYMENTS_GAME_STARS_ENABLED || false); 
const isTonPaymentEnabled = JSON.parse(import.meta.env.VITE_PAYMENTS_GAME_TON_ENABLED || false); 
const isAnyPaymentEnabled = isStarsPaymentEnabled || isTonPaymentEnabled;
const isAllPaymentEnabled = isStarsPaymentEnabled && isTonPaymentEnabled;

export { isStarsPaymentEnabled, isTonPaymentEnabled, isAnyPaymentEnabled, isAllPaymentEnabled };