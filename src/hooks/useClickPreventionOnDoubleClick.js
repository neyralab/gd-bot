import { useRef } from 'react';
import { sleep } from '../utils/sleep';

export const useCancellablePromises = () => {
  const pendingPromises = useRef([]);

  const appendPendingPromise = (promise) =>
    (pendingPromises.current = [...pendingPromises.current, promise]);

  const removePendingPromise = (promise) =>
    (pendingPromises.current = pendingPromises.current.filter(
      (p) => p !== promise
    ));

  const clearPendingPromises = () =>
    pendingPromises.current.map((p) => p.cancel());

  return {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises
  };
};

export const cancellablePromise = (promise) => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
      (error) => reject({ isCanceled, error })
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => (isCanceled = true)
  };
};

const useClickPreventionOnDoubleClick = (onClick, onDoubleClick) => {
  const api = useCancellablePromises();

  const handleClick = (e) => {
    e.persist();
    api.clearPendingPromises();
    const waitForClick = cancellablePromise(sleep(300));
    api.appendPendingPromise(waitForClick);

    return waitForClick.promise
      .then(() => {
        api.removePendingPromise(waitForClick);
        onClick(e);
      })
      .catch((errorInfo) => {
        api.removePendingPromise(waitForClick);
        if (!errorInfo.isCanceled) {
          throw errorInfo.error;
        }
      });
  };

  const handleDoubleClick = (e) => {
    e.persist();
    api.clearPendingPromises();
    onDoubleClick(e);
  };

  return [handleClick, handleDoubleClick];
};

export default useClickPreventionOnDoubleClick;
