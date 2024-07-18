import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { getToken } from '../../effects/set-token';
import { storageConvertEffect } from '../../effects/storageEffects';

import { setUser } from '../../store/reducers/userSlice';
import { getUserEffect } from '../../effects/userEffects';
import useButtonVibration from '../../hooks/useButtonVibration';
import { fomatNumber, getNumbers } from '../../utils/string';

import { Header } from '../../components/header';
import { Button } from '../../components/button';
import { InfoBox } from '../../components/info';
import { Range } from '../../components/range';

import styles from './styles.module.css';

const detail = [
  {
    title: '1. Upload Files',
    text: 'Simply upload your files to Ghostdrive.'
  },
  {
    title: '2. Tapping Game',
    text: 'For every tap you earn points.'
  },
  {
    title: '3. Lifetime Storage',
    text: 'Mine up to 50 GB of Lifetime Storage.'
  }
];

export const MAX_POINT_COUNT = 52428800;

export const Balance = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const handleVibrationClick = useButtonVibration();
  const user = useSelector((state) => state?.user?.data);

  const showErrorMessage = () => {
    toast.error('Something went wrong', {
      theme: 'colored',
      position: 'bottom-center'
    });
  } 

  const onFullConvert = async () => {
    try {
      if (!(user?.points || 0)) { return; }
      const cointCount = getNumbers(user?.points || 0);
      setLoading(true);
      const res = await storageConvertEffect({ points: cointCount });
      if (res.message === "success") {
        const token = await getToken();
        const updatedUser = await getUserEffect(token);
        setPointCount(0);
        dispatch(setUser(updatedUser));
        setLoading(false);
      }
    } catch (error) {
      showErrorMessage();
      setLoading(false);
    }
  }

  const currentConvert = async () => {
    try {
      if (!pointCount) { return; }
      const cointCount = getNumbers(pointCount);
      setLoading(true);
      const res = await storageConvertEffect({ points: cointCount });
      if (res.message === "success") {
        const token = await getToken();
        const updatedUser = await getUserEffect(token);
        dispatch(setUser(updatedUser));
        setLoading(false);
      }
    } catch (error) {
      showErrorMessage();
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Header label="Storage" />
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
          label={`Convert ${fomatNumber(user?.points || 0)} points`}
          className={styles.blue_btn}
          onClick={onFullConvert}
        />
      )}
      <div className={styles.info}>
        <span className={styles['info-exchange']}>1 point equal to 1 kilobyte</span>
        <h2 className={styles['info-title']}>How to Mine Ghost Drive Space?</h2>
        {detail.map((item, index) => (
          <div key={`detail-${index}`}>
            <p className={styles['option-title']}>{item.title}</p>
            <p className={styles['option-text']}>{item.text}</p>
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <Button
          label="Convert"
          disabled={loading}
          onClick={handleVibrationClick(currentConvert)}
          className={styles.white_btn}
        />
      </footer>
    </div>
  );
};
