import React, { useCallback } from "react";
import { useTranslation } from 'react-i18next';

import { API_PATH_ROOT } from '../../../utils/api-urls';
import gameJson from '../../../translation/locales/en/game.json';
import { getPartnerName, getPartnerTranslate } from '../../earn/Partners/utils';
import { ReactComponent as GameIcon } from '../../startPage/assets/tap.svg';
import styles from './styles.module.css';

const GamesItem = ({ title, joinLink, logo }) => {
  const { t } = useTranslation('game');
  const partnerName = getPartnerName(title);
  const translatedText = t(getPartnerTranslate(title, t, gameJson)).replace('{name}', partnerName);

  const goToGame = useCallback(() => {
    window.open(joinLink, '_blank')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img
          className={styles.icon}
          src={logo ? `${API_PATH_ROOT}${logo}` : GameIcon}
          alt=""
        />
        <p className={styles.text}>{translatedText || title}</p>
      </div>
      <button onClick={goToGame} className={styles.btn}>
        Play
      </button>
    </div>
  )
}

export default GamesItem