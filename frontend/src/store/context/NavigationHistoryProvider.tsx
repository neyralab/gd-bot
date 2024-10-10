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
import { tg } from '../../App';

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
  const queryData = useSelector((state: any) => state.drive.filesQueryData);
  const mediaSliderIsOpen = useSelector((state: any) => state.drive.mediaSlider.isOpen);

  const removedElement = useRef<boolean>(false);
  const mobilePlatform = isMobilePlatform;
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
  };

  useTelegramBackButton(
    handleBackAction,
    location.pathname !== '/start' && location.pathname !== '/' 
  );

  return (
    <NavigationHistoryContext.Provider value={{ history, isInitialRoute }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};
