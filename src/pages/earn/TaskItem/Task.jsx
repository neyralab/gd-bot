import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  getPartnerTranslate,
  getPartnerName,
  getParnterIcon,
  isNeedVerify,
  PARTNER_KEY
} from '../Partners/utils';
import gameTranslateJSON from '../../../translation/locales/en/game.json';
import { API_PATH } from '../../../utils/api-urls';
import { getToken } from '../../../effects/set-token';

import styles from './Task.module.css';

export default function Task({ description, done, rewardParams, id, doVerify }) {
  const { t } = useTranslation('game');
  const formattedPoints = useMemo(() => Number(rewardParams).toLocaleString(), [rewardParams]);
  const partnerName = useMemo(() => getPartnerName(description), [description]);
  const partnerTranslate = useMemo(() => getPartnerTranslate(description, t, gameTranslateJSON), [description, t]);
  const needVerify = useMemo(() => isNeedVerify(id),[id]);

  const goToLink = useCallback(async () => {
    try {
      const token = await getToken();
      const partnertList = JSON.parse(localStorage.getItem(PARTNER_KEY) || '[]');
      localStorage.setItem(PARTNER_KEY, JSON.stringify([...partnertList, id]));
      description
      window.location.href = `${API_PATH}/aff/missions/exit/${id}?bearer=${token}`;
    } catch (error) {
      console.warn(error)      
    }
  }, [id])

  const renderActionBtn = useCallback(() => {
    if (!done && needVerify) {
      return (
        <button
          className={classNames(styles.actionBtn, styles.actionVerify)}
          onClick={() => {doVerify(id)}}
        >
          {t('earn.claim')}
        </button>
      )
    } else if (!done) {
      return (
        <button
          className={styles.actionBtn}
          onClick={goToLink}
        >
          {t('earn.start')}
        </button>
      )
    } else 
      return ''
  }, [needVerify, done, id])

  return (
    <div className={classNames(styles.container, done && styles.done)}>
      <div className={styles.info}>
        <img
          className={styles.img}
          src={getParnterIcon(description)}
          alt={partnerName}
        />
        <div className={styles.text}>
          <span className={styles.name}>{partnerTranslate}</span>
          <span className={styles.count}>+{formattedPoints}</span>
        </div>
      </div>
      {renderActionBtn()}
    </div>
  );
}
