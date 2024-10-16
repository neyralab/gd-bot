import React, { createContext, useRef, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  assignFilesQueryData,
  setMediaSliderOpen,
  setMediaSliderCurrentFile
} from '../reducers/driveSlice';

import { useTelegramBackButton } from '../../utils/useTelegramBackButton';
import { isMobilePlatform } from '../../utils/client';

interface NavigationHistoryContextType {
  history: string[];
  isInitialRoute: boolean;
}

export const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

interface NavigationHistoryProviderProps {
  children: ReactNode;
}

export const NavigationHistoryProvider: React.FC<NavigationHistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [isInitialRoute, setIsInitialRoute] = useState(true);
  const mediaSliderIsOpen = useSelector((state: any) => state.drive.mediaSlider.isOpen);
  const queryData = useSelector((state: any) => state.drive.filesQueryData);
  const removedElement = useRef<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    setHistory((prevHistory) => {
      if (!removedElement.current) {
        return [...prevHistory, currentPath];
      }
      removedElement.current = false;
      return prevHistory;
    });
  }, [location.pathname]);


  useEffect(() => {
    if (isInitialRoute && history.length > 1) {
      setIsInitialRoute(false);
    }
  }, [isInitialRoute, history]);

  useEffect(() => {
    const handlePopState = () => {
      setHistory((prevHistory) => {
        if (prevHistory.length > 1) {
          removedElement.current = true;
          return prevHistory.slice(0, -1);
        }
        return prevHistory;
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBackAction = () => {
    if (isMobilePlatform) {
      if (mediaSliderIsOpen) {
        dispatch(setMediaSliderOpen(false));
        dispatch(setMediaSliderCurrentFile(null));
      } else if (location.pathname === '/drive' &&
      (!!queryData.search || queryData.category !== null)
      ) {
        dispatch(assignFilesQueryData({ filesQueryData: { search: null, category: null }}));
      } else {
        navigate(-1)
      }
    }
  };

  useTelegramBackButton(
    handleBackAction,
    location.pathname !== '/assistant' && location.pathname !== '/' && isMobilePlatform
  );

  return (
    <NavigationHistoryContext.Provider value={{ history, isInitialRoute }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};
