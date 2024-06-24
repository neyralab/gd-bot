import { useCallback, useEffect, useState } from 'react';

export const useQueryId = () => {
  const [queryId, setQueryId] = useState(1);

  const getNew = useCallback(() => {
    const randomNumberInRange = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return randomNumberInRange(1, 1000);
  }, []);

  useEffect(() => {
    setQueryId(getNew());
  }, []);

  return { queryId, getNew };
};
