import React, { useEffect, createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { OKXTonConnect, OkxConnectError, OKX_CONNECT_ERROR_CODES } from 'okxconnect';
import { API_WEB_APP_URL, BOT_NAME } from '../../utils/api-urls';
import { isWebPlatform, isDesktopPlatform } from '../../utils/client';
import { tg } from '../../App';

interface WalletContextType {
  wallet: OKXTonConnect | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  useOKXAddress: () => Promise<string>;
  disconnectWallet: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<OKXTonConnect | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = false // useMemo(() => !(isWebPlatform(tg) || isDesktopPlatform(tg)), []);

  useEffect(() => {
    try {
      const walletInstance = new OKXTonConnect({
        metaData: {
          name: 'Ghost Bot',
          icon: `${API_WEB_APP_URL}/gd_logo.png`,
        },
      });
      setWallet(walletInstance);
    } catch (err) {
      console.warn(err);
      setError('Initialization error');
    }
  }, []);

  const connectWallet = async () => {
    try {
      const body = isMobile ? { redirect: `https://t.me/${BOT_NAME}`, openUniversalLink: true } :
        { universalLink: '' , openUniversalLink: false };
      const link =  await wallet?.connect?.(body);
      if (!isMobile) {
        window.open(link, '_blank')
      }
    } catch (error: any) {
      if (error instanceof OkxConnectError) {
        if (error.code === OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR) {
          setError('User rejected the connection');
        } else if (error.code === OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR) {
          setError('Already connected');
        } else {
          setError('Unknown connection error');
        }
      } else {
        setError('Unknown error happened');
      }
    }
  };

  const useOKXAddress = (): string => {
    try {
      if (wallet?.connected) {
        return wallet?.['_wallet'].account.address
      } else {
        return  ''; 
      }
    } catch (error) {
      console.warn(error);
      return 'Error while restoring connection';
    }
  };

  const recconectWallet = () => {
    try {
       wallet?.restoreConnection();
    } catch (error) {
      debugger
      console.warn(error)
    }
  } 

  const disconnectWallet = () => {
    if (wallet) {
      wallet.disconnect();
      setWallet(null);
      setIsConnected(false);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, isConnected, connectWallet, disconnectWallet, error, useOKXAddress, recconectWallet }}>
      {error && <div className="error-message">{error}</div>}
      {children}
    </WalletContext.Provider>
  );
};