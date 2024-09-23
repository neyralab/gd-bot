import { useCallback, useRef } from 'react';
import useClickPreventionOnDoubleClick from './useClickPreventionOnDoubleClick';

export const useClickHandler = (doubleClick, click, timeout = 400) => {
  // we're using useRef here for the useCallback to rememeber the timeout
  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
    click,
    doubleClick
  );
  const watingClick = useRef(null);
  const lastClick = useRef(0);
  const localEvent = useRef(null);

  // return a memoized version of the callback that only changes if one of the dependencies has changed
  return useCallback(
    (event) => {
      event.persist();
      localEvent.current = event;
      if (
        lastClick.current &&
        new Date().getTime() - lastClick.current < timeout &&
        watingClick.current
      ) {
        lastClick.current = 0;
        clearTimeout(watingClick.current);
        handleDoubleClick(localEvent.current);
        watingClick.current = null;
      } else {
        lastClick.current = new Date().getTime();
        watingClick.current = setTimeout(() => {
          watingClick.current = null;
          handleClick(localEvent.current);
        }, 251);
      }
    },
    [click, doubleClick]
  );
};
