import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getQueryParamValue } from '../../../utils/string';
import { transformSize } from '../../../utils/storage';
import { ReactComponent as UsertShieldIcon } from '../../../assets/user-shield.svg';
import { ReactComponent as CreditCardIcon } from '../../../assets/credit-card.svg';

import styles from './UserCard.module.scss';

const UserCard = ({ ...rest }) => {
  const { t } = useTranslation('system');
  const { initData, data: user } = useSelector((state) => state.user);
  const username = useMemo(() => getQueryParamValue(initData, 'user', 'username'), [initData]);

  return (
    <div className={styles.container} data-animation="start-page-animation-2">
      <div className={styles['user-info']}>
        <UsertShieldIcon />
        <div className={styles.info}>
          <p className={styles.name}>{username}</p>
          <p className={styles.size}>
            {t('convert.space')}: {transformSize(user?.space_actual)}
          </p>
        </div>
      </div>
      <button className={styles['profile']}>
        <CreditCardIcon />
      </button>
    </div>
  )
}

export default UserCard;