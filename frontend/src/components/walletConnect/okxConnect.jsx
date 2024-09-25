import React, { useState  } from "react";
import QRCode from 'qrcode';

import { ReactComponent as QRIcons } from '../../assets/qr.svg';
import { ReactComponent as RefreshIcon } from '../../assets/refresh.svg';
import Loader2 from '../../components/Loader2/Loader2';

import styles from './styles.module.css';

const OkxConnect = ({ retry, okxConnectLink }) => {
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(okxConnectLink);
      setQrCodeUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles['okx-connector']}>
      {(loading && !showQR) && <div className={styles['okx-connector__loader']}>
        <Loader2 />
        <p className={styles['okx-connector__loader-text']}>Continue in OKX Wallet...</p>
      </div>}
      {showQR && <p className={styles['okx-connector__qr-text']}>
        Scan the QR code below with your phone’s or OKX Wallet’s camera
      </p>}
      {!showQR && <div className={styles['okx-connector__footer']}>
        <button onClick={retry} className={styles['okx-connector__footer-btn']}>
          <RefreshIcon />
          <span>Retry</span>
        </button>
        <button onClick={generateQRCode} className={styles['okx-connector__footer-btn']}>
          <QRIcons />
          <span>Show QR Code</span>
        </button>
        </div>}
      {showQR && (<div className={styles['okx-connector__qr']}>
        <img src={qrCodeUrl} alt="QR Code" />
      </div>)}
    </div>
  )
}

export { OkxConnect };