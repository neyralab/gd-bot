import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';

import {
  checkTgChatJoin,
  checkTgJoin,
  checkXJoin,
  checkGithubJoin,
  checkWatchVideo,
  checkInstagramJoin,
  checkYoutubeJoin,
  trackSocial,
} from '../../../effects/EarnEffect';

import { ReactComponent as CloseIcon } from '../../../assets/close.svg';
import SystemModal from '../../../components/SystemModal/SystemModal';
import { SOCIAL } from '../../../config/contracts';

import classNames from 'classnames';
import styles from './EarnModal.module.css';

const socialDependence = {
  JOIN_TWITTER: 'TWITTER',
  JOIN_YOUTUBE: 'YOUTUBE',
  JOIN_INSTAGRAM: 'INSTAGRAM',
  JOIN_GITHUB: 'GITHUB',
  WATCH_VIDEO: 'WATCH'
}

const EarnModal = forwardRef(({ item, onTasksRequireCheck }, ref) => {
  const { t } = useTranslation('system');
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: open
  }));

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const checkSocials = async (id) => {
    let fn;

    switch (id) {
      case 'JOIN_TG_CHANNEL':
        fn = checkTgChatJoin;
        break;
      case 'JOIN_YOUTUBE':
        fn = checkYoutubeJoin;
        break;
      case 'JOIN_TWITTER':
        fn = checkXJoin;
        break;
      case 'JOIN_TG_NEWS_CHANNEL':
        fn = checkTgJoin;
        break;
      case 'JOIN_INSTAGRAM':
        fn = checkInstagramJoin;
        break;
      case 'JOIN_GITHUB':
        fn = checkGithubJoin;
        break;
      case 'WATCH_VIDEO':
        fn = checkWatchVideo;
        break;
      }

    const res = fn ? await fn() : null;
    runSystemModal(id, res);
  };

  const runSystemModal = (id, res) => {
    if (res === 'success') {
      let text = '';
      switch (id) {
        case 'JOIN_TG_CHANNEL':
          text = t('message.joinTg');
          break;
        case 'JOIN_YOUTUBE':
          text = t('message.joinYoutube');
          break;
        case 'JOIN_TWITTER':
          text = t('message.joinX');
          break;
        case 'JOIN_TG_NEWS_CHANNEL':
          text = t('message.joinTGnews');
          break;
        case 'JOIN_INSTAGRAM':
          text = t('message.joinInstagram');
          break;
        case 'JOIN_GITHUB':
          text = t('message.joinGithub');
          break;
        case 'WATCH_VIDEO':
          text = t('message.watchedVideo');
          break;
      }

      systemModalRef.current.open({
        title: t('message.success'),
        text: text,
        actions: [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
              onTasksRequireCheck?.();
            }
          }
        ]
      });
    } else if (res === 'You are not a member of this channel') {
      let text = '';
      switch (id) {
        case 'JOIN_TG_CHANNEL':
          text = t('message.notJoinTG');
          break;
        case 'JOIN_YOUTUBE':
          text = t('message.notJoinYoutube');
          break;
        case 'JOIN_TWITTER':
          text =  t('message.notJoinX');
          break;
        case 'JOIN_TG_NEWS_CHANNEL':
          text = t('message.notJoinTGnews');
          break;
        case 'JOIN_INSTAGRAM':
          text = t('message.notJoinInstagram');
          break;
        case 'JOIN_GITHUB':
          text = t('message.notJoinGithub');
          break;
        case 'WATCH_VIDEO':
          text = t('message.noWatchedVideo');
          break;
      }

      systemModalRef.current.open({
        title: t('message.oops'),
        text: text,
        actions: [
          {
            type: 'default',
            text: t('message.tryAgain'),
            onClick: () => {
              checkSocials(id);
              systemModalRef.current.close();
            }
          }
        ]
      });
    } else if (res === 'You have already received points') {
      systemModalRef.current.open({
        title: t('message.oops'),
        text: t('message.received'),
        actions: [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
              onTasksRequireCheck?.();
            }
          }
        ]
      });
    } else {
      systemModalRef.current.open({
        title: t('message.oops'),
        text: t('message.errorAndRetry'),
        actions: [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    }
  };

  const handleSocial = async () => {
    try {
      if (
        item.id !== 'DOWNLOAD_APP' &&
        item.id !== 'JOIN_TG_CHANNEL' &&
        item.id !== 'JOIN_TG_NEWS_CHANNEL'
      ) {
        await trackSocial(SOCIAL[socialDependence[item.id]]);
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const drawJoinButton = useMemo(() => {
    if (!item) return null;

    if (item.joinLink) {
      return (
        <a
          href={item.joinLink}
          target="_blank"
          className={classNames(styles.button, styles['join-button'])}
          onClick={handleSocial}>
          {item.id === 'DOWNLOAD_APP' ? 'Download' : 
            (item.id === 'WATCH_VIDEO' ? 'Watch' : 'Join' )
          }
        </a>
      );
    } else {
      return null;
    }
  }, [item]);

  const drawCheckButton = useMemo(() => {
    if (!item) return null;

    switch (item.id) {
      case 'JOIN_TG_CHANNEL':
      case 'JOIN_YOUTUBE':
      case 'JOIN_TWITTER':
      case 'JOIN_TG_NEWS_CHANNEL':
      case 'JOIN_INSTAGRAM':
      case 'JOIN_GITHUB':
      case 'WATCH_VIDEO':
        return (
          <button
            className={classNames(styles.button, styles['check-button'])}
            onClick={() => checkSocials(item.id)}>
            Check
          </button>
        );
      default:
        return null;
    }
  }, [item]);

  if (!item) return;

  return (
    <>
      <Sheet
        ref={modalRef}
        isOpen={isOpen}
        onClose={close}
        detent="content-height">
        <Sheet.Container className="react-modal-sheet-container">
          <Sheet.Header className="react-modal-sheet-header" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className={styles.container}>
                <div className={styles.header}>
                  <div className={styles.points}>
                    <span>{item.points.toLocaleString()}</span>
                    <img src="/assets/token.png" />
                  </div>
                  <div
                    className={styles.close}
                    onClick={close}>
                    <CloseIcon />
                  </div>
                </div>

                <div className={styles.content}>
                  <img src={item.imgUrl} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>

                <div className={styles.actions}>
                  {drawJoinButton}
                  {drawCheckButton}
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>

      <SystemModal ref={systemModalRef} />
    </>
  );
});

export default EarnModal;
