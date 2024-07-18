import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ConvertorIcon } from '../../pages/startPage/assets/convertor.svg';
import { TextInput } from './TextInput';
import { getNumbers } from '../../utils/string';
import { transformSize } from '../../utils/storage';
import styles from './styles.module.css';

export const Range = ({ pointCount, setPointCount, pointBalance }) => {
  const { t } = useTranslation('system');
  const byteCount = useMemo(() => {
    if (pointCount === 0 || pointCount === '')
      return '0KB'

    const numbers = Number(getNumbers(pointCount));
    return transformSize(numbers * 1024)

  }, [pointCount]);

  return (
    <div className={styles.container}>
      <TextInput
        pointCount={pointCount}
        setPointCount={setPointCount}
        pointBalance={pointBalance}
      />
      <span className={styles.center}>
        <ConvertorIcon />
      </span>
      <div className={styles.right}>
        <p className={styles.count}>{byteCount}</p>
        <span className={styles.text}>{t('convert.space')}</span>
      </div>
    </div>
  );
}