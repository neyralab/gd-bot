import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import {
  selectAllWorkspaces,
  selectCurrentWorkspace
} from '../../store/reducers/workspaceSlice';
import { getAllTasks } from '../../effects/balanceEffect';
import {
  getStorageNotificationsEffect,
  readNotificationEffect
} from '../../effects/storageEffects';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { fromByteToGb } from '../../utils/storage';
import { transformSize } from '../../utils/transformSize';
import { isDevEnv } from '../../utils/isDevEnv';

import GhostLoader from '../../components/ghostLoader';
import Nodes from './Nodes/index';
import { Banner } from './Banner';
import { ReactComponent as TapIcon } from './assets/tap.svg';
import { DisconnectWalletModal } from '../../components/disconnectWalletModal';
import ShareStorage from './ShareStorage';
import PointCounter from './PointCounter/PointCounter';
import SystemModal from '../../components/SystemModal/SystemModal';
import NavigatItem from './Navigator/NavigatItem';
import Navigator from './Navigator/Navigator';
import { ReactComponent as LogoIcon } from '../../assets/ghost.svg';
import BannerSource from '../../assets/node-banner.webp';
import { runInitAnimation } from './animations';

import style from './style.module.css';
import navigatorStyle from './Navigator/Navigator.module.scss';

const initialNotificationState = {
  sender: { unread: [], readed: [] },
  recipient: []
};

export const StartPage = ({ tariffs }) => {
  const location = useLocation();
  const systemModalRef = useRef(null);
  const wrapperRef = useRef(null);
  const { t } = useTranslation('system');
  const [tasks, setTasks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [notifications, setNotifications] = useState(initialNotificationState);
  const [disconnectWalletModal, setDisconnectWalletModal] = useState(false);
  const allWorkspaces = useSelector(selectAllWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state?.user?.data);
  const navigate = useNavigate();
  const isDev = isDevEnv();
  const giftToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('storageGift');
  }, [location]);

  const getTasks = useCallback(async () => {
    try {
      const allTasks = await getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  }, []);

  const getStorageNotifications = useCallback(async () => {
    try {
      const data = await getStorageNotificationsEffect();
      setNotifications(data);
    } catch (error) {
      setNotifications(initialNotificationState);
    }
  }, []);

  useEffect(() => {
    getTasks();
    getStorageNotifications();
  }, [getTasks, getStorageNotifications]);

  useEffect(() => {
    if (!!notifications?.sender?.unread?.length && wrapperRef.current) {
      const notification = notifications?.sender?.unread[0];
      if (notification.text.includes('rejected')) {
        handleRejectNotification(notification);
      } else {
        handleAcceptNotification(notification);
      }
    }
  }, [notifications, wrapperRef.current]);

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
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
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
      {isDev ? (
        <Banner
          storageSize={user.space_total}
          onOpenShareModal={onOpenShareModal}
          data-animation="start-page-animation-2"
        />
      ) : (
        <div
          data-animation="start-page-animation-2"
          className={CN(style.card, style.banner)}>
          <img src={BannerSource} alt="banner" />
          <div className={style['banner-content']}>
            <div onClick={onOpenShareModal} className={style['banner-header']}>
              <div className={style['banner-header_img']}>
                <LogoIcon />
                <span className={style['banner-header-share-btn']}>
                  {t('share.share')}
                </span>
              </div>
              <h1>{transformSize(user.space_total)}</h1>
            </div>
          </div>
        </div>
      )}

      <PointCounter
        points={user?.points}
        className={style[`point-counter`]}
        rank={user?.rank}
      />
      <Navigator
        storage={storage}
        human={human}
        openDisconnectModal={setDisconnectWalletModal}
        tasks={tasks}
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
      {isDev && <Nodes wallet={user?.wallet} />}
      <footer className={style.footer}>
        <p className={style['footer-text']}>
          <span
            onClick={() => {
              openInNewTab('https://play.ghostdrive.com');
            }}>
            GhostDrive.com
          </span>
          . {t('dashboard.howEarn')}{' '}
        </p>
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
