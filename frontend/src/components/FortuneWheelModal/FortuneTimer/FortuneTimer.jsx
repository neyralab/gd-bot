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

export default function FortuneTimer({ timestamp, onComplete, invites }) {
  const link = useSelector((state) => state.user.link);
  const { t } = useTranslation('game');

  const spinsForNextGame = invites.length%INVITE_COUNT_TO_NEXT_SPIN;
  const invitePerNextSpin = useMemo(() => {
    if (spinsForNextGame && spinsForNextGame !== INVITE_COUNT_TO_NEXT_SPIN) {
      const invite = invites[invites.length - spinsForNextGame]
      return { ...invite, used_at: `${invite.used_at}+00:00` };
    }
    return null;
  }, [spinsForNextGame, invites]);

  const timestampForNextBonusSpin = useMemo(() => {
    if (invitePerNextSpin) {
      const initialData = moment(invitePerNextSpin.used_at).format();
      const targetData = moment(initialData).add(1, 'days');
      const currentDate = moment();

      if (targetData.valueOf() > currentDate.valueOf()) {
        return targetData.valueOf();
      } else {
        return null;
      }
    }
    return null;
  }, [invitePerNextSpin?.used_at]);

  return (
    <div className={styles.container}>
      <div className={styles.description}>{
        (!invitePerNextSpin || !timestampForNextBonusSpin) ?
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
      <TelegramShareButton
        url={link.copy}
        className={styles['invite-btn']}
        title={t('friends.inviteFriend')}
        onClick={() => {vibrate('soft')}}>
          <div className={styles['bonus-spin']}>
            <span className={styles['bonus-text']}>{`1 ${t('earn.spinWheel')}`}</span>
            <div className={styles['bonus-status']} >
              <span>{t('earn.spinInvite')}</span>
              <FriendsIcon />
            </div>
          </div>
      </TelegramShareButton>
    </div>
  );
}
