import React, { useEffect } from 'react';
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TelegramShareButton } from 'react-share';
import gsap from 'gsap';

import { saveUserWallet } from '../../../effects/userEffects';
import useButtonVibration from '../../../hooks/useButtonVibration';

import Task from '../../../components/Task/Task';
import ListLoader from '../ListLoader/ListLoader';

import styles from './styles.module.css';

export default function Tasks({
  tasks,
  getTasks,
  setModalSelectedTask,
  earnModalRef,
  isLoading
}) {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress(true);
  const wallet = useTonWallet();
  const user = useSelector((state) => state.user.data);
  const link = useSelector((state) => state.user.link);
  const navigate = useNavigate();
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    /** Animation */
    if (!tasks || !tasks.length) return;

    gsap.fromTo(
      `[data-animation="task-animation-1"]`,
      {
        opacity: 0,
        x: window.innerWidth + 200,
        y: -window.innerHeight + 500,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(0.2)'
      }
    );
  }, [tasks]);

  useEffect(() => {
    if (user !== null && !user.wallet && address && wallet) {
      (async () => {
        const res = await saveUserWallet({
          account: {
            ...wallet?.account,
            uiAddress: address
          }
        });
        getTasks();
        console.log({ saveUserWallet: res });
      })();
    }
  }, [address, user, user?.wallet, wallet]);

  const handleClick = (task) => {
    switch (task.id) {
      case 'JOIN_YOUTUBE':
      case 'JOIN_TG_CHANNEL':
      case 'JOIN_TWITTER':
      case 'JOIN_INSTAGRAM':
      case 'JOIN_GITHUB':
      case 'WATCH_VIDEO':
      case 'JOIN_TG_NEWS_CHANNEL':
      case 'DOWNLOAD_APP':
        setModalSelectedTask(task);
        setTimeout(() => {
          earnModalRef.current.open();
        }, 10);
        break;

      case 'WALLET_CONNECTION':
        address && tonConnectUI.disconnect();
        tonConnectUI.openModal();
        break;

      case 'STORAGE_PURCHASE':
        navigate('/boost');
        break;

      case 'UPLOAD_10_FILES':
        navigate('/file-upload');
        break;

      default:
        console.log(task);
        break;
    }
  };

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <div className={styles['tasks-list']}>
      {tasks.map((task) => {
        return task.id === 'INVITE_5_FRIENDS' ? (
          <TelegramShareButton
            url={link.copy}
            key={task.id}
            title={'Share this link with friends'}
            onClick={handleVibrationClick()}>
            <Task
              onClick={() => handleClick(task)}
              isDone={task.isDone}
              points={task.points}
              imgUrl={task.imgUrl}
              translatePath={task.translatePath}
              onTasksRequireCheck={getTasks}
              className={styles['initial-state-for-animation']}
            />
          </TelegramShareButton>
        ) : (
          <Task
            key={task.id}
            onClick={handleVibrationClick(() => handleClick(task))}
            isDone={task.isDone}
            points={task.points}
            imgUrl={task.imgUrl}
            translatePath={task.translatePath}
            onTasksRequireCheck={getTasks}
            className={styles['initial-state-for-animation']}
          />
        );
      })}
    </div>
  );
}
