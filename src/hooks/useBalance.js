import { useEffect, useState } from 'react';
import { getBalanceEffect } from '../effects/balanceEffect';

export const useBalance = () => {
  const [balance, setBalance] = useState({
    points: 0,
    fileCnt: 0,
    history: []
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBalanceEffect();
        setBalance((prevState) => ({
          ...prevState,
          points: data.points,
          fileCnt: data.fileCnt,
          history: data.data
        }));
      } catch (e) {
        console.log({ e });
      }
    })();
  }, []);

  return balance;
};
