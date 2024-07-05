import React, { useState, useEffect, useRef } from 'react';
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TelegramShareButton } from 'react-share';

import { tasks as tasksFromFile } from './tasks';
import { saveUserWallet } from '../../effects/userEffects';

import Menu from '../../components/Menu/Menu';
import Task from '../../components/Task/Task';
import EarnModal from './EarnModal/EarnModal';

import styles from './styles.module.css';
import { checkAllEarnTasks } from '../../effects/EarnEffect';

export default function EarnPage() {
  const [tasks, setTasks] = useState([]);
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const modalRef = useRef(null);
  const [modalSelectedTask, setModalSelectedTask] = useState(null);
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress(true);
  const wallet = useTonWallet();
  const user = useSelector((state) => state.user.data);
  const link = useSelector((state) => state.user.link);
  const navigate = useNavigate();

  const getTasks = async () => {
    try {
      const res = await checkAllEarnTasks();
      /** In this code you will see both backand and frontend hardcoded tasks
       * Hardcoded have img, title, some other props that are needed in frontend.
       * So here those 2 arrays are combined. 
       * It takes the hardcoded frontend array with its order,
       * and updates the information the code require
       */
      if (res) {
        const filteredTasks = tasksFromFile.filter((task) =>
          res.some((el) => task.id === el.action)
        );

        const updatedTasks = filteredTasks.map((task) => {
          const serverTask = res.find((el) => task.id === el.action);
          return {
            ...task,
            id: serverTask.action,
            points: serverTask.amount,
            isDone: serverTask.earn === 1
          };
        });
        setTasks(updatedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
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
      case 'DOWNLOAD_APP':
        setModalSelectedTask(task);
        setTimeout(() => {
          modalRef.current.open();
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

  return (
    <div className={styles.container}>
      <div className={styles['title-block']}>
        <img src="/assets/token.png" alt="Token" />
        <h1>Earn more points</h1>
      </div>

      <div className={styles['tasks-list']}>
        {tasks.map((task) => {
          if (animatedTaskIds.has(task.id)) {
            return task.id === 'INVITE_5_FRIENDS' ? (
              <TelegramShareButton
                url={link.copy}
                key={task.id}
                title={'Share this link with friends'}>
                <Task
                  onClick={() => handleClick(task)}
                  isDone={task.isDone}
                  title={task.title}
                  points={task.points}
                  imgUrl={task.imgUrl}
                  onTasksRequireCheck={getTasks}
                />
              </TelegramShareButton>
            ) : (
              <Task
                key={task.id}
                onClick={() => handleClick(task)}
                isDone={task.isDone}
                title={task.title}
                points={task.points}
                imgUrl={task.imgUrl}
                onTasksRequireCheck={getTasks}
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <Menu />

      <EarnModal ref={modalRef} item={modalSelectedTask} />
    </div>
  );
}
