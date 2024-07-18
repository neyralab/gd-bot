import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { useBalance } from '../../hooks/useBalance';
import useButtonVibration from '../../hooks/useButtonVibration';

import { Header } from '../../components/header';
import { Button } from '../../components/button';
import { FilesInfo } from '../../components/filesInfo';
import { InfoBox } from '../../components/info';
import { Range } from '../../components/range';

import styles from './styles.module.css';

const detail = (t) => [
  {
    title: t('convert.uploadFiles'),
    text: t('convert.simplyUpload')
  },
  {
    title: t('convert.tappingGame'),
    text: t('convert.earnPoints')
  },
  {
    title: t('convert.lifetime'),
    text: t('convert.mineLifetime')
  }
];

export const MAX_POINT_COUNT = 52428800;

export const Balance = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const [loading, setLoading] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const handleVibrationClick = useButtonVibration();

  const normalizedSize = useMemo(() => {
    console.log({ workspacePlan: workspacePlan });
    return DEFAULT_TARIFFS_NAMES[workspacePlan?.storage];
  }, [workspacePlan?.storage]);

  const onUploadFile = useCallback(() => {
    navigate('/file-upload');
  }, []);

  const onUpgradeFile = useCallback(() => {
    navigate('/upgrade');
  }, []);

  return (
    <div className={styles.container}>
      <Header label={t('convert.storage')} />
      <InfoBox
        points={user?.points}
      />
      <Range
        pointCount={pointCount}
        setPointCount={setPointCount}
        pointBalance={user?.points}
      />
      {!!user?.points && (
        <Button
          disabled={loading}
          label={t('convert.convertPoints').replace('{count}', fomatNumber(user?.points || 0))}
          className={styles.blue_btn}
          onClick={onFullConvert}
        />
      )}
      <div className={styles.info}>
        <span className={styles['info-exchange']}>{t('convert.equal')}</span>
        <h2 className={styles['info-title']}>{t('convert.mineSpace')}</h2>
        {detail(t).map((item, index) => (
          <div key={`detail-${index}`}>
            <p className={styles['option-title']}>{item.title}</p>
            <p className={styles['option-text']}>{item.text}</p>
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <Button
          label={t('convert.convert')}
          disabled={loading}
          onClick={handleVibrationClick(currentConvert)}
          className={styles.white_btn}
        />
      </footer>
    </div>
  );
};
