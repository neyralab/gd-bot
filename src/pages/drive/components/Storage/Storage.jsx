import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import { transformSize } from '../../../../utils/transformSize';
import { fromByteToGb } from '../../../../utils/storage';
import { ReactComponent as ImpulseLoader } from '../../../../assets/loader-impulse.svg';
import styles from './Storage.module.scss';

export default function Storage() {
  const { t } = useTranslation('drive');
  const user = useSelector((state) => state.user.data);

  const storageInfo = useMemo(() => {
    if (!user) return;
    const { space_total, space_used } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );
    return {
      total: `${transformSize(String(space_total))}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  return (
    <div data-animation="storage-animation-1" className={styles.container}>
      <div className={styles.content}>
        <div className={styles['text-container']}>
          <p className={styles.text}>
            {user && (
              <CountUp
                className={styles.count}
                delay={0}
                duration={1.4}
                end={user ? user.points : 0}
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
