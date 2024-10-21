import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { vibrate } from '../../../utils/vibration';
import { transformSize } from '../../../utils/storage';
import { formatLargeNumberExtended } from '../../../utils/number';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import { NavigationHistoryContext } from '../../../store/context/NavigationHistoryProvider';
import { fetchTypesCount } from '../../../store/reducers/driveSlice';
import { getPaidShareFilesEffect } from '../../../effects/filesEffects';
import { ReactComponent as TopIcon } from '../../../assets/top.svg';
import { ReactComponent as CreditCardIcon } from '../../../assets/credit-card.svg';

import styles from './TemporaryNavigate.module.scss';

export default function TemporaryControls() {
  const { history } = useContext(NavigationHistoryContext);
  const { audio, loadAudio, playAudio, loading, stopAudio } = useAssistantAudio();
  const fileTypes = useSelector((store) => store.drive.fileTypesCount)
  const user = useSelector((state) => state.user.data);
  const [ ernedCount, setErnedCount ] = useState(0);
  const { t } = useTranslation('system');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(fileTypes).length) {
      dispatch(fetchTypesCount({ useLoader: false }));
    }
    getPaidShareFilesEffect(1)
      .then((data) => {
        setErnedCount(data.earned);
      })
  }, [])

  // useEffect(() => {
  //   loadAudio('/assets/dummy/male-voice-2.mp3');
  //   return () => {
  //     stopAudio();
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!loading && audio && history?.[0] === '/' && history.length === 2) {
  //     const button = document.createElement('button');
  //     button.addEventListener('click', function() {
  //       playAudio();     
  //     });
  //     button.click();
  //   }
  // }, [loading, audio, history]);

  return (
    <header>
      <span />
      {user && !!Object.keys(fileTypes).length && (
        <div className={styles.info}>
          <p>{t('assistent.files')}:<span>{fileTypes?.total || 0}</span></p>
          <p>{t('assistent.fullSpace')}: <span>{transformSize(user.space_actual)}</span></p>
          <p>{t('assistent.rank')}: <span>{user.rank}</span></p>
          <p>{t('assistent.point')}: <span>{formatLargeNumberExtended(user.points)}</span></p>
          <p>{t('assistent.stars')}: {ernedCount}</p>
        </div>
      )}
      <Link
        to="/start"
        className={styles['profile-button']}
        onClick={() => {vibrate('soft')}}>
        <CreditCardIcon />
      </Link>
    </header>
  );
}
