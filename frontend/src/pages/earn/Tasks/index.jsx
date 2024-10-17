import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TelegramShareButton } from 'react-share';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

import { vibrate } from '../../../utils/vibration';
import { runInitAnimation } from './animations';
import Task from '../../../components/Task/Task';
import ListLoader from '../ListLoader/ListLoader';
import { ConnectModal } from '../../../components/walletConnect/selectModal';
import { useWallet } from '../../../store/context/WalletProvider';

import styles from './styles.module.css';

export default function Tasks({
  tasks,
  getTasks,
  setModalSelectedTask,
  earnModalRef,
  isLoading
}) {
  const [isConnectModal, setIsConnectModal] = useState(false);
  const { useOKXAddress, disconnectWallet } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const okxAddress = useOKXAddress();
  const link = useSelector((state) => state.user.link);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tasks || !tasks.length) return;
    runInitAnimation();
  }, [tasks]);

  const handleConnectWallet = () => {
    address && tonConnectUI.disconnect();
    okxAddress && disconnectWallet();
    setIsConnectModal(true);
  }

  const onCloseWalletModal = () => {
    setIsConnectModal(false);
  }

  const handleClick = (task) => {
    vibrate();
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
        handleConnectWallet();
        break;

      case 'STORAGE_PURCHASE':
        navigate('/boost');
        break;

      case 'UPLOAD_10_FILES':
        navigate('/drive');
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
            onClick={() => {vibrate('soft')}}>
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
            onClick={() => handleClick(task)}
            isDone={task.isDone}
            points={task.points}
            imgUrl={task.imgUrl}
            translatePath={task.translatePath}
            onTasksRequireCheck={getTasks}
            className={styles['initial-state-for-animation']}
          />
        );
      })}
      <ConnectModal
        isOpen={isConnectModal}
        onClose={onCloseWalletModal}
        successCallback={getTasks}
      />
    </div>
  );
}
