import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { ReactComponent as FriendsIcon } from '../../../assets/friends.svg';
import { Timer } from './Timer';
import { vibrate } from '../../../utils/vibration';

import styles from './FortuneTimer.module.scss';

const INVITE_COUNT_TO_NEXT_SPIN = 3;

export default function FortuneTimer({ timestamp, onComplete, bonusSpins }) {
  const link = useSelector((state) => state.user.link);
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
        <TelegramShareButton
          url={link.copy}
          className={styles['invite-btn']}
          title={t('friends.inviteFriend')}
          onClick={vibrate}>
            <div className={styles['bonus-spin']}>
              <span className={styles['bonus-text']}>1 Spin</span>
              <div className={styles['bonus-status']} >
                <span>{`Invite ${INVITE_COUNT_TO_NEXT_SPIN} friends`}</span>
                <FriendsIcon />
              </div>
            </div>
        </TelegramShareButton>
    </div>
  );
}
