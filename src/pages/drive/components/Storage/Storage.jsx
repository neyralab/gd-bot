import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import { ReactComponent as ImpulseLoader } from '../../../../assets/loader-impulse.svg';
import styles from './Storage.module.scss';

export default function Storage() {
  const { t } = useTranslation('drive');
  const storageInfo = useSelector((state) => state.drive.storageInfo);

  return (
    <div data-animation="storage-animation-1" className={styles.container}>
      <div className={styles.content}>
        <div className={styles['text-container']}>
          <p className={styles.text}>
            {storageInfo && (
              <CountUp
                className={styles.count}
                delay={0}
                duration={1.4}
                end={storageInfo ? storageInfo.points : 0}
              />
            )}{' '}
            {t('dashbord.points')}
          </p>
          <div className={styles.text}>
            {storageInfo && (
              <>
                {storageInfo.percent?.label} {t('dashbord.of')}{' '}
                {storageInfo.total}
              </>
            )}

            {!storageInfo && (
              <div className={styles['loader-container']}>
                <ImpulseLoader />
              </div>
            )}
          </div>
        </div>

        <div className={styles['usage-container']}>
          <div
            className={styles.usage}
            style={{ width: storageInfo?.percent?.label || 0 }}
          />
        </div>
      </div>
    </div>
  );
}
