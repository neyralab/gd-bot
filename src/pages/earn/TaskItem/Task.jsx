import React, { useMemo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  getPartnerTranslate,
  PARTNER_TASK_TYPES,
  getPartnerName,
  isNeedVerify,
  PARTNER_KEY
} from '../Partners/utils';
import gameTranslateJSON from '../../../translation/locales/en/game.json';
import { API_PATH, API_PATH_ROOT } from '../../../utils/api-urls';
import { getToken } from '../../../effects/set-token';

import styles from './Task.module.css';

const TIME_DELAY = 120000;
const DEFAULT_TASK_IMAGE = '/assets/task.png';

export default function Task({
  type,
  logo,
  description,
  name,
  done,
  rewardParams,
  id,
  doVerify
}) {
  const { t } = useTranslation('game');
  const formattedPoints = useMemo(
    () => Number(rewardParams).toLocaleString(),
    [rewardParams]
  );
  const partnerName = useMemo(() => getPartnerName(name), [name]);
  const partnerTranslate = useMemo(
    () => getPartnerTranslate(description, t, gameTranslateJSON),
    [description, t]
  );
  const [needVerify, setNeedVerify] = useState(isNeedVerify(id), [id]);

  const goToLink = useCallback(async () => {
    try {
      const token = await getToken();
      const partnertList = JSON.parse(
        localStorage.getItem(PARTNER_KEY) || '[]'
      );
      localStorage.setItem(PARTNER_KEY, JSON.stringify([...partnertList, id]));
      setTimeout(() => {
        setNeedVerify(isNeedVerify(id));
      }, [TIME_DELAY]);
      window.location.href = `${API_PATH}/aff/missions/exit/${id}?bearer=${token}`;
    } catch (error) {
      console.warn(error);
    }
  }, [id]);

  const renderActionBtn = useCallback(() => {
    if (!done && needVerify) {
      return (
        <button
          className={classNames(styles.actionBtn, styles.actionVerify)}
          onClick={() => {
            doVerify(id);
          }}>
          {t('earn.claim')}
        </button>
      );
    } else if (!done) {
      return (
        <button className={styles.actionBtn} onClick={goToLink}>
          {t(PARTNER_TASK_TYPES.bot === type ? 'earn.start' : 'earn.follow')}
        </button>
      );
    } else return '';
  }, [needVerify, done, id]);

  const setUpDefaultLogo = (e) => {
    e.target.src = DEFAULT_TASK_IMAGE;
  };

  return (
    <div
      data-animation="task-animation-1"
      className={classNames(styles.container, done && styles.done)}>
      <div className={styles.info}>
        <img
          className={styles.img}
          src={logo ? `${API_PATH_ROOT}${logo}` : DEFAULT_TASK_IMAGE}
          alt={partnerName}
          onError={setUpDefaultLogo}
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
