import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { tasks as tasksFromFile, tasksText } from './tasks';
import { isEnabledPartners } from '../../utils/featureFlags';
import { handlePartners, selectPartners } from '../../store/reducers/taskSlice';
import { checkAllEarnTasks, getAllPartners } from '../../effects/EarnEffect';
import { getAllTasks } from '../../effects/balanceEffect';
import { handleTasks } from '../../store/reducers/taskSlice';
import { runInitAnimation } from './animations';
import { isMobilePlatform } from '../../utils/client';

import Friends from '../friends';
import Tasks from './Tasks/index';
import Partners from './Partners';
import Mission from './Mission';
import EarnModal from './EarnModal/EarnModal';
import Segmented from '../../components/segmented';
import MenuControls from '../../components/MenuControls/MenuControls';
import { BackButton } from '../../components/backButton';

import styles from './styles.module.css';

const DEFAULT_SEGMENT_OPTION = 'friends';

export default function EarnPage() {
  const dispatch = useDispatch();
  const { tasks: partnerTasks } = useSelector(selectPartners);
  const { t } = useTranslation('game');
  const [tasks, setTasks] = useState([]);
  const [tasksAreLoading, setTasksAreLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [missionsAreLoading, setMissionsAreLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState(DEFAULT_SEGMENT_OPTION);
  const [modalSelectedTask, setModalSelectedTask] = useState(null);
  const earnModalRef = useRef(null);

  // const showWheel = useMemo(() => {
  //   const now = moment().unix();
  //   const last24Hours = now - 24 * 60 * 60;
  //   return earnedRecords.some((game) => {
  //     if (game.text !== 'Game tapping') {
  //       return false;
  //     }
  //     const gameEndsAt = parseInt(game.game.game_ends_at, 10);
  //     return gameEndsAt >= last24Hours && gameEndsAt <= now;
  //   });
  // }, [earnedRecords]);

  useEffect(() => {
    runInitAnimation();
  }, []);

  const getTasks = async () => {
    setTasksAreLoading(true);

    try {
      const res = await checkAllEarnTasks();
      /** In this code you will see both backend and frontend hardcoded tasks
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
        setTasksAreLoading(false);
      } else {
        setTasks([]);
        setTasksAreLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const getMission = async () => {
    setMissionsAreLoading(true);

    try {
      const allMissions = await getAllTasks();
      dispatch(handleTasks(allMissions));
      const realTasks = allMissions.map((task) => ({
        ...task,
        text: tasksText[task.action],
        done: !!task.earn
      }));
      setMissions(realTasks.sort((a, b) => a.amount - b.amount));
      setMissionsAreLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMissions([]);
      setMissionsAreLoading(false);
    }
  };

  useEffect(() => {
    if (!partnerTasks.length) {
      getAllPartners().then((data) => {
        dispatch(handlePartners(data));
      });
    }
  }, [partnerTasks]);

  useEffect(() => {
    getMission();
    getTasks();
  }, []);

  const segmentOption = useMemo(() => {
    const disabledTabs = [];
    !isEnabledPartners && disabledTabs.push('friends');
    return [
      {
        title: t('process.frens'),
        name: 'friends',
        onClick: () => {
          setActiveSegment('friends');
        }
      },
      {
        title: t('earn.task'),
        name: 'task',
        onClick: () => {
          setActiveSegment('task');
        }
      },
      {
        title: t('earn.partner'),
        name: 'partner',
        onClick: () => {
          setActiveSegment('partner');
        }
      }
    ].filter((tab) => !disabledTabs.includes(tab.name));
  }, [t]);

  const handlePartnersUpdate = useCallback(
    (data) => {
      dispatch(handlePartners(data));
    },
    [dispatch]
  );

  const renderList = () => {
    switch (activeSegment) {
      case 'task':
        return (
          <Tasks
            tasks={tasks}
            earnModalRef={earnModalRef}
            getTasks={getTasks}
            setModalSelectedTask={setModalSelectedTask}
            isLoading={tasksAreLoading}
          />
        );
      case 'partner':
        return (
          <Partners
            partners={partnerTasks}
            setPartners={handlePartnersUpdate}
          />
        );
      case 'friends':
        return <Friends />;
      default:
        <Friends />;
    }
  };

  return (
    <div className={styles.container}>
      {!isMobilePlatform && <BackButton />}
      <div className={styles['title-block']}>
        <div className={styles['title-inner-block']}>
          <span className={styles.spacer}></span>
          <h1 className={styles.title}>{t('earn.earn')}</h1>
          <span className={styles.spacer}></span>
        </div>

        <p className={styles.text}>{t('earn.getReward')}</p>
      </div>

      <Segmented options={segmentOption} active={activeSegment} />

      {renderList()}

      <EarnModal ref={earnModalRef} item={modalSelectedTask} />

      <MenuControls />
    </div>
  );
}
