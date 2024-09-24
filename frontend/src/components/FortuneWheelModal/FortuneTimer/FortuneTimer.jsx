import React, { useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ReactComponent as FriendsIcon } from '../../../assets/friends.svg';
import { Timer } from './Timer';

import styles from './FortuneTimer.module.scss';

const INVITE_COUNT_TO_NEXT_SPIN = 3;

export default function FortuneTimer({ timestamp, onComplete, bonusSpins }) {
  const { t } = useTranslation('game');
  const invitesPerNextSpin = useMemo(() => {
    if (bonusSpins.count) {
      return bonusSpins.count%INVITE_COUNT_TO_NEXT_SPIN;
    }

    return INVITE_COUNT_TO_NEXT_SPIN;
  }, [bonusSpins]);
  const hasInviteToNextSpin = useMemo(() => (
    invitesPerNextSpin !== INVITE_COUNT_TO_NEXT_SPIN && invitesPerNextSpin !== 0
  ), [invitesPerNextSpin]);
  const showNextBonusTimer = useMemo(() => {
    if (hasInviteToNextSpin) {
      const givenDate = moment(bonusSpins.first_usage, 'YYYY-MM-DD HH:mm:ss');
      const currentDate = moment();
      const diffInHours = currentDate.diff(givenDate, 'hours');

      return diffInHours < 24
    } else {
      return false
    }
  }, [hasInviteToNextSpin, bonusSpins]);

  return (
    <div className={styles.container}>
      <div className={styles.description}>{
        !hasInviteToNextSpin ?
        t('earn.wheelNextSpin') :
        <div>
          {t('earn.wheelBonusSpin')}
          {<span className={styles['red-text']}>{invitesPerNextSpin}</span>}
          {`/${INVITE_COUNT_TO_NEXT_SPIN}`}
        </div>
      }</div>
      <Timer
        timestamp={showNextBonusTimer ?
          moment(bonusSpins.first_usage, 'YYYY-MM-DD HH:mm:ss').add(24, 'hours').valueOf()
          : timestamp}
        onComplete={onComplete}
      />
      <div className={styles['bonus-spin']}>
        <span className={styles['bonus-text']}>1 Spin</span>
        <div className={styles['bonus-status']} >
          <span>{`Invite ${invitesPerNextSpin} friends`}</span>
          <FriendsIcon />
        </div>
      </div>
    </div>
  );
}
