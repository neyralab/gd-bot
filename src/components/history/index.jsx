import { useTranslation } from 'react-i18next';
import { NoHistory } from './empty';
import { getHistoryTranslate } from '../../translation/utils';
import gameJson from '../../translation/locales/en/game.json';

import { ReactComponent as Cloud } from '../../assets/clock.svg';
import styles from './styles.module.css';

export const History = ({ history, loading }) => {
  const { t } = useTranslation('game');

  return (
    <div className={styles.container}>
      <p className={styles.history}>{t('airdrop.history')}</p>
      <ul className={styles.list}>
        {(!history?.length || loading) ? (
          <NoHistory loading={loading} />
        ) : (
          history.map((el, index) => (
            <li key={index} className={styles.item}>
              <Cloud width={32} height={32} />
              <div className={styles.text_container}>
                <p className={styles.value}>{el.points}</p>
                <p className={styles.text}>
                  {getHistoryTranslate(gameJson, el?.text || el?.point?.text, t) || el?.text}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
