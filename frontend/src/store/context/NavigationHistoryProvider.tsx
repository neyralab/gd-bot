import React, { createContext, useRef, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const removedElement = useRef<boolean>(false);
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
    if (location.pathname === '/start' && tg.BackButton.isVisible) {
      tg.BackButton.hide();
    } else if (location.pathname !== '/start' && !tg.BackButton.isVisible) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {navigate(-1)})
    }
  }, [location.pathname])

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

  return (
    <NavigationHistoryContext.Provider value={{ history, isInitialRoute }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};
