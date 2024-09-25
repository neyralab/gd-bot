import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { ReactComponent as FriendsIcon } from '../../../assets/friends.svg';
import { Timer } from './Timer';
import { vibrate } from '../../../utils/vibration';
import { isDevEnv } from '../../../utils/isDevEnv';

import styles from './FortuneTimer.module.scss';

const INVITE_COUNT_TO_NEXT_SPIN = 3;

export default function FortuneTimer({ timestamp, onComplete, invites }) {
  const link = useSelector((state) => state.user.link);
  const { t } = useTranslation('game');
  const isDev = isDevEnv();

  const spinsForNextGame = invites.length%INVITE_COUNT_TO_NEXT_SPIN;
  const invitePerNextSpin = useMemo(() => {
    if (spinsForNextGame && spinsForNextGame !== INVITE_COUNT_TO_NEXT_SPIN) {
      return invites[invites.length - spinsForNextGame];
    }
    return null;
  }, [spinsForNextGame, invites]);

  const timestampForNextBonusSpin = useMemo(() => {
    if (invitePerNextSpin) {
      const targetDate = moment(invitePerNextSpin.used_at);
      const currentDate = moment();
  
      const differenceInHours = currentDate.diff(targetDate, 'hours');
        const nextSpinTimestamp = targetDate.add(1, 'day').valueOf();
  
      return Math.abs(nextSpinTimestamp + differenceInHours * (1000 * 60 * 60));
    }
    return null;
  }, [invitePerNextSpin]);

  return (
    <div className={styles.container}>
      <div className={styles.description}>{
        !invitePerNextSpin ?
        t('earn.wheelNextSpin') :
        <div>
          {t('earn.wheelBonusSpin')}
          {<span className={styles['red-text']}>{spinsForNextGame}</span>}
          {`/${INVITE_COUNT_TO_NEXT_SPIN}`}
        </div>
      }</div>
      <Timer
        timestamp={timestampForNextBonusSpin || timestamp}
        onComplete={onComplete}
      />
        {isDev && (
          <TelegramShareButton
            url={link.copy}
            className={styles['invite-btn']}
            title={t('friends.inviteFriend')}
            onClick={vibrate}>
              <div className={styles['bonus-spin']}>
                <span className={styles['bonus-text']}>1 Spin</span>
                <div className={styles['bonus-status']} >
                  <span>{`Invite 3 friends`}</span>
                  <FriendsIcon />
                </div>
              </div>
          </TelegramShareButton>
        )}
    </div>
  );
}
