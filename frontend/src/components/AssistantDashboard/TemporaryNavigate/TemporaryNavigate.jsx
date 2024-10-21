import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { vibrate } from '../../../utils/vibration';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import { NavigationHistoryContext } from '../../../store/context/NavigationHistoryProvider';
import { fetchTypesCount } from '../../../store/reducers/drive/drive.thunks';
import { ReactComponent as TopIcon } from '../../../assets/top.svg';
import { ReactComponent as CreditCardIcon } from '../../../assets/credit-card.svg';

import styles from './TemporaryNavigate.module.scss';

export default function TemporaryControls() {
  const { history } = useContext(NavigationHistoryContext);
  const { audio, loadAudio, playAudio, loading, stopAudio } = useAssistantAudio();
  const fileTypes = useSelector((store) => store.drive.fileTypesCount)
  const user = useSelector((state) => state.user.data);
  const { t } = useTranslation('system');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(fileTypes).length) {
      dispatch(fetchTypesCount({ useLoader: false }));
    }
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
      <Link
        to="/leadboard/league"
        className={styles['top-button']}
        onClick={() => {vibrate('soft')}}>
        <TopIcon />
      </Link>
      {user && !!Object.keys(fileTypes).length && (
        <div className={styles.info}>
          <p>{t('assistent.space')}:<span>{parseInt((user.space_used/user.space_actual) * 100)} %</span></p>
          <p>{t('assistent.files')}:<span>{fileTypes?.total || 0}</span></p>
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
