import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { NavigationHistoryProvider } from './store/context/NavigationHistoryProvider';
import i18n from './translation/i18n';
import StoreProvider from './store/StoreProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackComponent } from './pages/FallbackComponent';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
const onError = (e) => {
  console.log({ err: 'here', e });
  window?.Telegram?.WebApp?.showPopup({
    title: 'Oops!',
    message: 'Sorry please try again later.',
    buttons: [{ type: 'ok' }]
  });
};

root.render(
  <StoreProvider>
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      <Suspense fallback={FallbackComponent} onError={onError}>
        <BrowserRouter>
          <NavigationHistoryProvider>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </NavigationHistoryProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </StoreProvider>
);
