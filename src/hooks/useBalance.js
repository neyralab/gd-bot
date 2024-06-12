import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalanceEffect } from '../effects/balanceEffect';
import { setUser } from '../store/reducers/userSlice';

export const useBalance = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.data);
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
        user && dispatch(setUser({ ...user, points: data?.points || 0 }));
      } catch (e) {
        console.log({ e });
      }
    })();
  }, [dispatch, user]);

  return balance;
};
