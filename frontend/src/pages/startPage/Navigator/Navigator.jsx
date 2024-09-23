import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import NavigatItem from './NavigatItem';
import { WalletConnect } from '../../../components/walletConnect';
import { ReactComponent as WalletIcon } from '../assets/wallet.svg';
import { ReactComponent as DriveIcon } from '../assets/drive.svg';
import { ReactComponent as BoostIcon } from '../assets/boost.svg';
import { ReactComponent as ConvertIcon } from '../assets/convertor.svg';
import { ReactComponent as LanguageIcon } from '../assets/language.svg';
import {
  isEnabledConverter,
  isEnabledMultilanguage
} from '../../../utils/featureFlags';
import { isDevEnv } from '../../../utils/isDevEnv';
import { LANGUAGE_LIST } from '../../language';
import { capitalize } from '../../../utils/string';
import styles from './Navigator.module.scss';

export default function Navigator({
  storage,
  human,
  tasks,
}) {
  const { t, i18n } = useTranslation('system');
  const navigate = useNavigate();
  const isDev = isDevEnv();

  const HIDDEN_OPTION = useMemo(() => {
    const array = [];
    !isEnabledConverter && array.push(4);
    !isEnabledMultilanguage && array.push(5);
    return array;
  }, []);

  const NAVIGATION = useMemo(() => {
    const list = [
      {
        id: 1,
        name: 'G: Drive',
        icon: <DriveIcon />,
        html: (
          <span className={CN(styles.actionBtn, styles.addBt)}>
            {human.percent.label}
          </span>
        ),
        onClick: () => navigate('/drive')
      },
      {
        id: 2,
        name: t('dashboard.wallet'),
        icon: <WalletIcon />,
        html: <WalletConnect />,
        onClick: () => {},
      },
      {
        id: 3,
        name: t('dashboard.boost'),
        icon: <BoostIcon />,
        html: (
          <span className={styles.actionBtn}>{`X${storage.multiplier}`}</span>
        ),
        onClick: () => navigate('/boost')
      },
      {
        id: 4,
        name: t('dashboard.conver'),
        icon: <ConvertIcon />,
        html: <span className={styles.actionBtn}>{t('dashboard.go')}</span>,
        onClick: () => navigate('/balance')
      },
      {
        id: 5,
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
      }
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
