import React, { createContext, useContext, useState, useCallback } from 'react';

const MAX_CACHED_FILES = 7;

const MediaSliderCacheContext = createContext();

export const MediaSliderCacheProvider = ({ children }) => {
  const [cache, setCache] = useState([]);

  const getCache = useCallback(
    (id) => {
      const cachedItem = cache.find((item) => item.id === id);
      return cachedItem ? cachedItem : null;
    },
    [cache]
  );

  const setCacheItem = useCallback((id, content, preview) => {
    setCache((prevCache) => {
      const newCache = [...prevCache, { id, content, preview }];
      if (newCache.length > MAX_CACHED_FILES) {
        newCache.shift();
      }
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache([]);
  }, []);

  return (
    <MediaSliderCacheContext.Provider
      value={{ cache, getCache, setCacheItem, clearCache }}>
      {children}
    </MediaSliderCacheContext.Provider>
  );
};

export const useMediaSliderCache = () => {
  return useContext(MediaSliderCacheContext);
};
