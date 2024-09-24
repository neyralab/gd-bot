import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getToken } from '../../effects/set-token';
import { storageConvertEffect } from '../../effects/storageEffects';
import { setUser } from '../../store/reducers/userSlice';
import { getUserEffect } from '../../effects/userEffects';
import { getNumbers } from '../../utils/string';
import { vibrate } from '../../utils/vibration';
import { runInitAnimation } from './animations';
import { Header } from '../../components/header';
import { Button } from '../../components/button';
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
  const user = useSelector((state) => state?.user?.data);

  useEffect(() => {
    runInitAnimation();
  }, []);

  const showErrorMessage = () => {
    toast.error(t('message.error'), {
      theme: 'colored',
      position: 'bottom-center'
    });
  };

  const showSuccessMessage = () => {
    toast.success(t('message.conversionSuccess'), {
      theme: 'colored',
      position: 'bottom-center'
    });
  };

  const currentConvert = async () => {
    try {
      vibrate();
      if (!pointCount) {
        return;
      }
      const cointCount = getNumbers(pointCount);
      setLoading(true);
      const res = await storageConvertEffect({ points: cointCount });
      if (res.message === 'success') {
        const token = await getToken();
        const updatedUser = await getUserEffect(token);
        showSuccessMessage();
        setPointCount(0);
        dispatch(setUser(updatedUser));
        setLoading(false);
      }
    } catch (error) {
      showErrorMessage();
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header label={t('convert.storage')} />
      <div data-animation="balance-animation-2">
        <InfoBox points={user?.points} />
      </div>

      <div data-animation="balance-animation-1">
        <Range
          pointCount={pointCount}
          setPointCount={setPointCount}
          pointBalance={user?.points}
        />
      </div>

      <div data-animation="balance-animation-1">
        <Button
          label={t('convert.convert')}
          disabled={loading}
          onClick={currentConvert}
          className={styles.white_btn}
        />
      </div>

      <div className={styles.info}>
        <span
          data-animation="balance-animation-1"
          className={styles['info-exchange']}>
          {t('convert.equal')}
        </span>

        <h2
          data-animation="balance-animation-1"
          className={styles['info-title']}>
          {t('convert.mineSpace')}
        </h2>
        
        {detail(t).map((item, index) => (
          <div key={`detail-${index}`} data-animation="balance-animation-1">
            <p className={styles['option-title']}>{item.title}</p>
            <p className={styles['option-text']}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
