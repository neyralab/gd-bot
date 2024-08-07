import { useTranslation } from 'react-i18next';
import { ReactComponent as Clock } from '../../assets/clock.svg';
import styles from './styles.module.css';

export const NoHistory = ({ loading }) => {
  const { t : tSystem } = useTranslation('system');
  const { t } = useTranslation('game');
  
  return (
    <div className={styles.empty_container}>
      <Clock width={48} height={48} />
      <p className={styles.header}>
        {loading ? tSystem('loading.pleaseWait') : t('airdrop.noHistory')}
      </p>
      <p className={styles.text}>
        {loading ? tSystem('loading.systemLoading') : t('airdrop.shareReferral')}
      </p>
    </div>
  );
};
