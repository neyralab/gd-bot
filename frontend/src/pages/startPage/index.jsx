import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import {
  selectAllWorkspaces,
  selectCurrentWorkspace
} from '../../store/reducers/workspaceSlice';
import { readNotificationEffect } from '../../effects/storageEffects';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { fromByteToGb } from '../../utils/storage';
import { transformSize } from '../../utils/transformSize';
import { useAppDispatch } from '../../store/hooks';
import { getNotifications } from '../../store/reducers/userSlice';

import GhostLoader from '../../components/ghostLoader';
import FortuneWheel from './FortuneWheel';
import { Banner } from './Banner';
import { ReactComponent as TapIcon } from './assets/tap.svg';
import { DisconnectWalletModal } from '../../components/disconnectWalletModal';
import ShareStorage from './ShareStorage';
import PointCounter from './PointCounter/PointCounter';
import SystemModal from '../../components/SystemModal/SystemModal';
import NavigatItem from './Navigator/NavigatItem';
import Navigator from './Navigator/Navigator';
import { runInitAnimation } from './animations';
import { tg } from '../../App';

import style from './style.module.css';
import navigatorStyle from './Navigator/Navigator.module.scss';

export const StartPage = ({ tariffs }) => {
  const { t } = useTranslation('system');
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const notifications = useSelector((state) => state.user.notifications);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state?.user?.data);
  const allWorkspaces = useSelector(selectAllWorkspaces);

  const [showShareModal, setShowShareModal] = useState(false);
  const [disconnectWalletModal, setDisconnectWalletModal] = useState(false);

  const systemModalRef = useRef(null);
  const wrapperRef = useRef(null);

  const giftToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('storageGift');
  }, [location]);

  useEffect(() => {
    if (!notifications) {
      dispatch(getNotifications());
    }

    if (
      notifications &&
      !!notifications?.sender?.unread?.length &&
      wrapperRef.current
    ) {
      const notification = notifications?.sender?.unread[0];
      if (notification.text.includes('rejected')) {
        handleRejectNotification(notification);
      } else {
        handleAcceptNotification(notification);
      }
    }
  }, [notifications]);

  useEffect(() => {
    if (!allWorkspaces && !currentWorkspace) return;
    runInitAnimation();
  }, [allWorkspaces, currentWorkspace]);

  const storage = useMemo(() => {
    const size = DEFAULT_TARIFFS_NAMES[user?.space_actual] || '1GB';
    return {
      size,
      multiplier:
        tariffs?.find((el) => el.storage === user?.space_actual)
          ?.multiplicator || 1
    };
  }, [user?.space_actual, tariffs]);

  const human = useMemo(() => {
    if (!user) return;
    const { space_total, space_used } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );

    return {
      total: `${transformSize(String(space_total))}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent}%`, value: percent }
    };
  }, [user]);

  const openInNewTab = (url, isNativeLink = true) => {
    if (isNativeLink) {
      tg?.openLink(url, { try_instant_view: true });
    } else {
      window.open(url, '_blank', 'noreferrer');
    }
  };

  const onOpenShareModal = () => {
    setShowShareModal(true);
  };

  const onCloseShareModal = () => {
    setShowShareModal(false);
    const path = window.location.pathname;
    navigate(path, { replace: true });
  };

  const readNotification = async (id) => {
    try {
      await readNotificationEffect(id);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleAcceptNotification = async (item) => {
    try {
      const splitedText = item?.text?.split(' ');
      const name = splitedText[0];
      const size = splitedText[4];
      await readNotification(item.id);
      setNotifications((notif) => ({
        ...notif,
        sender: {
          ...notif.sender,
          unread: notif.sender.unread.filter(
            (itemFilter) => item.id !== itemFilter.id
          )
        }
      }));
      systemModalRef.current.open({
        title: t('share.offerAccept'),
        text: t('share.offerAcceptDesc')
          .replace('{size}', size)
          .replace('{name}', name)
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleRejectNotification = async (item) => {
    try {
      const splitedText = item?.text?.split(' ');
      const name = splitedText[0];
      const size = splitedText[4];
      systemModalRef.current.open({
        title: t('share.offerDeclined'),
        text: t('share.offerDeclinedDesc')
          .replace('{size}', size)
          .replace('{name}', name),
        actions: [
          {
            type: 'primary',
            text: t('share.tryAgain'),
            onClick: async () => {
              try {
                systemModalRef.current.close();
                onOpenShareModal();
              } catch (error) {
                systemModalRef.current.close();
              }
            }
          },
          {
            type: 'primary',
            text: t('share.ok'),
            onClick: () => {
              try {
                readNotification(item.id);
                systemModalRef.current.close();
              } catch (error) {
                systemModalRef.current.close();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleCloseNotification = () => {
    if (!!notifications?.sender?.unread?.length) {
      const notification = notifications?.sender?.unread[0];
      readNotification(notification.id);
    }
  };

  if (!allWorkspaces && !currentWorkspace) {
    return (
      <div className={style.home_container}>
        <GhostLoader startup />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`${style.container}`}>
      <Banner
        storageSize={user.space_total}
        onOpenShareModal={onOpenShareModal}
        data-animation="start-page-animation-2"
      />

      <PointCounter
        points={user?.points}
        className={style[`point-counter`]}
        rank={user?.rank}
      />

      <Navigator
        storage={storage}
        human={human}
        openDisconnectModal={setDisconnectWalletModal}
      />

      <ul className={CN(navigatorStyle['navigator'])}>
        <NavigatItem
          name={t('dashboard.mining')}
          icon={<TapIcon />}
          html={
            <span
              className={CN(navigatorStyle.actionBtn, navigatorStyle.playBtn)}>
              {t('dashboard.play')}
            </span>
          }
          onClick={() => navigate('/game-3d')}
        />
      </ul>

      {/* {isDev && <Nodes wallet={user?.wallet} />} */}
      <FortuneWheel />

      <footer className={style.footer}>
        <p className={style['footer-text']}>
          <span
            onClick={() => {
              openInNewTab(
                'https://telegra.ph/Terms-of-Service-GhostDrive-09-29'
              );
            }}>
            Terms of use
          </span>
          <span
            onClick={() => {
              openInNewTab(
                'https://telegra.ph/Ghostdrive-Giveaway-Program-09-29'
              );
            }}>
            {' | Help | '}
          </span>
          <span
            onClick={() => {
              openInNewTab('https://t.me/ghostdrive_web3_chat', false);
            }}>
            Support.
          </span>
        </p>

        <Link className={style['hidden-button']} to="/assistant"></Link>
      </footer>

      {disconnectWalletModal && (
        <DisconnectWalletModal
          isOpen={disconnectWalletModal}
          onClose={() => setDisconnectWalletModal(false)}
        />
      )}

      {(showShareModal || giftToken) && (
        <ShareStorage
          giftToken={giftToken}
          isOpen={showShareModal || giftToken}
          onClose={onCloseShareModal}
          systemModalRef={systemModalRef}
        />
      )}

      <SystemModal handleClose={handleCloseNotification} ref={systemModalRef} />
    </div>
  );
};
