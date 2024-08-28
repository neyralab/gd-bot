import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import gsap from 'gsap';

import { getToken } from '../../effects/set-token';
import { storageConvertEffect } from '../../effects/storageEffects';

import { setUser } from '../../store/reducers/userSlice';
import { getUserEffect } from '../../effects/userEffects';
import useButtonVibration from '../../hooks/useButtonVibration';
import { getNumbers } from '../../utils/string';

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
  const handleVibrationClick = useButtonVibration();
  const user = useSelector((state) => state?.user?.data);

  useEffect(() => {
    /** Animation */
    gsap.fromTo(
      `.${styles.animation2}`,
      {
        opacity: 0,
        y: -100,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: .8,
        ease: 'back.out(0.2)'
      }
    );

    gsap.fromTo(
      `.${styles.animation1}`,
      {
        opacity: 0,
        x: window.innerWidth + 200,
        y: -window.innerHeight + 500,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.5,
        delay: 0.2,
        ease: 'back.out(0.2)'
      }
    );
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
      <div className={styles.animation2}>
        <InfoBox points={user?.points} />
      </div>

      <div className={styles.animation1}>
        <Range
          pointCount={pointCount}
          setPointCount={setPointCount}
          pointBalance={user?.points}
        />
      </div>

      <div className={styles.animation1}>
        <Button
          label={t('convert.convert')}
          disabled={loading}
          onClick={handleVibrationClick(currentConvert)}
          className={styles.white_btn}
        />
      </div>

      <div className={styles.info}>
        <span
          className={classNames(styles['info-exchange'], styles.animation1)}>
          {t('convert.equal')}
        </span>
        <h2 className={classNames(styles['info-title'], styles.animation1)}>
          {t('convert.mineSpace')}
        </h2>
        {detail(t).map((item, index) => (
          <div key={`detail-${index}`} className={styles.animation1}>
            <p className={styles['option-title']}>{item.title}</p>
            <p className={styles['option-text']}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
