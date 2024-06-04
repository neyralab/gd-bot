import { useEffect, useState } from 'react';
import { getBalanceEffect } from '../effects/balanceEffect';

export const useBalance = () => {
  const [balance, setBalance] = useState({
    points: 0,
    fileCnt: 0
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBalanceEffect();
        setBalance((prevState) => ({
          ...prevState,
          points: data.points,
          fileCnt: data.fileCnt
        }));
      } catch (e) {
        console.log({ e });
      }
    })();
  }, []);

  return balance;
};
