import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { vibrate } from '../../../utils/vibration';
import { transformSize } from '../../../utils/storage';
import { formatLargeNumberExtended } from '../../../utils/number';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import { NavigationHistoryContext } from '../../../store/context/NavigationHistoryProvider';
import { fetchTypesCount } from '../../../store/reducers/drive/drive.thunks';
import { getPaidShareFilesEffect } from '../../../effects/filesEffects';
import { ReactComponent as TopIcon } from '../../../assets/top.svg';
import { ReactComponent as CreditCardIcon } from '../../../assets/credit-card.svg';

import styles from './Navigation.module.scss';


export default function Navigation() {
  const { history } = useContext(NavigationHistoryContext);
  const { audio, loadAudio, playAudio, loading, stopAudio } =
    useAssistantAudio();
  const fileTypes = useAppSelector((store) => store.drive.fileTypesCount);
  const user = useAppSelector((state) => state.user.data);
  const [ernedCount, setErnedCount] = useState(0);
  const { t } = useTranslation('system');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!Object.keys(fileTypes).length) {
      dispatch(fetchTypesCount({ useLoader: false }));
    }
    getPaidShareFilesEffect(1).then((data) => {
      setErnedCount(data.earned);
    });
  }, []);

  return (
    <header>
      <span />
      {user && !!Object.keys(fileTypes).length && (
        <div className={styles.info}>
          <p>
            {t('assistant.files')}:<span>{fileTypes?.total || 0}</span>
          </p>
          <p>
            {t('assistant.fullSpace')}:{' '}
            <span>{transformSize(user.space_actual)}</span>
          </p>
          <p>
            {t('assistant.rank')}: <span>{user.rank}</span>
          </p>
          <p>
            {t('assistant.point')}:{' '}
            <span>{formatLargeNumberExtended(user.points)}</span>
          </p>
          <p>
            {t('assistant.stars')}: {ernedCount}
          </p>
        </div>
      )}
      <Link
        to="/start"
        className={styles['profile-button']}
        onClick={() => {
          vibrate('soft');
        }}>
        <CreditCardIcon />
      </Link>
    </header>
  );
}
