import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
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
  <Provider store={store}>
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      <Suspense fallback={FallbackComponent} onError={onError}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </Provider>
);
