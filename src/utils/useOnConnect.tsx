import { useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { saveUserWallet } from '../effects/userEffects';
import { setUser } from '../store/reducers/userSlice';

export function useOnConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const user = useSelector((state: any) => state.user.data);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log({ w: user?.wallet });
    if (!user?.wallet) {
      return;
    }

    tonConnectUI.modal.onStateChange(async (state) => {
      console.log('state change', state);
      if (
        state.status === 'closed' &&
        state.closeReason === 'wallet-selected'
      ) {
        const exist = user?.wallet?.find(
          (el: string) => el !== tonConnectUI.account?.address
        );
        console.log({ exist });
        if (!exist) {
          const res = await saveUserWallet({
            account: tonConnectUI?.account
          });
          const newWallets = res.map((el) => el.public_address);
          dispatch(setUser({ ...user, wallet: newWallets }));
        }
      }
    });
  }, [user?.wallet]);
}
