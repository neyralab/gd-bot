import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import NavigatItem from './NavigatItem';
import { WalletConnect } from '../../../components/walletConnect';
import { ReactComponent as WalletIcon } from '../assets/wallet.svg';
import { ReactComponent as BoostIcon } from '../assets/boost.svg';
import { ReactComponent as AirdropIcon } from '../../../assets/atr.svg';
import { ReactComponent as ConvertIcon } from '../assets/convertor.svg';
import { ReactComponent as LanguageIcon } from '../assets/language.svg';
import { ReactComponent as EarnIcon } from '../../../assets/earn.svg';
import { ReactComponent as GiftIcon } from '../assets/gift.svg';

import {
  isEnabledConverter,
  isEnabledMultilanguage
} from '../../../utils/featureFlags';
import { isDevEnv } from '../../../utils/isDevEnv';
import { available_tariffs } from '../../boost';
import { LANGUAGE_LIST } from '../../language';
import { capitalize } from '../../../utils/string';
import styles from './Navigator.module.scss';

const MIN_SHARE_SIZE = 262144000;

export default function Navigator({
  onOpenShareModal,
  storageSize,
  storage,
  human,
  tasks,
}) {
  const { t, i18n } = useTranslation('system');
  const navigate = useNavigate();
  const isDev = isDevEnv();

  const HIDDEN_OPTION = useMemo(() => {
    const array = [];
    !isEnabledConverter && array.push(6);
    !isEnabledMultilanguage && array.push(7);
    return array;
  }, []);

  const isGiftShareModalAllowed = useMemo(() => {
    if (storageSize > available_tariffs["1GB"]) {
      const availableSize = storageSize - available_tariffs["1GB"];
      return availableSize > MIN_SHARE_SIZE
    } else {
      return false;
    }
  }, [storageSize]); 

  const handelGiftShare = () => {
    if (isGiftShareModalAllowed) {
      onOpenShareModal()
    }
  }

  const NAVIGATION = useMemo(() => {
    const list = [
      {
        id: 1,
        name: t('dashboard.wallet'),
        icon: <WalletIcon />,
        html: <WalletConnect />,
        onClick: () => {},
      },
      {
        id: 2,
        name: t('dashboard.earn'),
        icon: <EarnIcon width={24} height={24} viewBox="0 0 30 30" />,
        html: <span className={styles.actionBtn}>{t('task.task')}</span>,
        onClick: () => navigate('/earn')
      },
      {
        id: 3,
        name: t('dashboard.airdrop'),
        icon: <AirdropIcon />,
        html: <span className={styles.actionBtn}>{t('dashboard.stats')}</span>,
        onClick: () => navigate('/point-tracker')
      },
      {
        id: 4,
        name: t('dashboard.sendGift'),
        icon: <GiftIcon />,
        html: <span className={styles.actionBtn}>{t('dashboard.gift')}</span>,
        onClick: onOpenShareModal,
      },
      {
        id: 5,
        name: t('dashboard.premium'),
        icon: <BoostIcon />,
        html: (
          <span className={styles.actionBtn}>{`X${storage.multiplier}`}</span>
        ),
        onClick: () => navigate('/boost')
      },
      {
        id: 6,
        name: t('dashboard.conver'),
        icon: <ConvertIcon />,
        html: <span className={styles.actionBtn}>{t('dashboard.go')}</span>,
        onClick: () => navigate('/balance')
      },
      {
        id: 7,
        name: t('dashboard.language'),
        icon: <LanguageIcon />,
        html: (
          <span className={styles.actionBtn}>
            {capitalize(
              LANGUAGE_LIST.find((item) => i18n.language === item.abbreviation)
                .shortName
            )}
          </span>
        ),
        onClick: () => navigate('/language')
      },
    ];

    return list.filter((item) => !HIDDEN_OPTION.includes(item.id));
  }, [
    storage,
    tasks,
    human,
    navigate,
    isDev,
    i18n
  ]);

  return (
    <ul className={styles['navigator']}>
      {NAVIGATION.map(({ id, name, icon, html, onClick }) => (
        <NavigatItem
          key={id}
          name={name}
          icon={icon}
          html={html}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}
