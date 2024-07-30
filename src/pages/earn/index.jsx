import React, { useState, useEffect, useRef } from 'react';

import { tasks as tasksFromFile } from './tasks';
import { checkAllEarnTasks } from '../../effects/EarnEffect';

import Menu from '../../components/Menu/Menu';
import Tasks from './Tasks/index';
import Partners from './Partners';
import Mission from './Mission';
import EarnModal from './EarnModal/EarnModal';
import Segmented from '../../components/segmented';
import { Header } from '../../components/header';

import styles from './styles.module.css';

const DEFAULT_SEGMENT_OPTION = 'task'

export default function EarnPage() {
  const [tasks, setTasks] = useState([]);
  const [activeSegment, setActiveSegment] = useState(DEFAULT_SEGMENT_OPTION);
  const [modalSelectedTask, setModalSelectedTask] = useState(null);
  const modalRef = useRef(null);

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

  const segmentOption = [
    {
      title: 'Task',
      name: 'task',
      onClick: () => { setActiveSegment('task') }
    },
    {
      title: 'Partners',
      name: 'partner',
      onClick: () => { setActiveSegment('partner') }
    },
    {
      title: 'Missions',
      name: 'mission',
      onClick: () => { setActiveSegment('mission') }
    },
  ];

  const renderList = () => {
    switch (activeSegment) {
      case 'task':
        return (
          <Tasks
            tasks={tasks}
            modalRef={modalRef}
            getTasks={getTasks}
            setModalSelectedTask={setModalSelectedTask}
          />
        );
      case 'partner':
        return (
          <Partners
            getTasks={getTasks}
            setModalSelectedTask={setModalSelectedTask}
          />
        );
      case 'mission':
        return (
          <Mission
            setModalSelectedTask={setModalSelectedTask}
          />
        );
      default:
        <Tasks
          tasks={tasks}
          getTasks={getTasks}
          setModalSelectedTask={setModalSelectedTask}
        />
    }
  }

  return (
    <div className={styles.container}>
      <Header label="Ghost Drive App" />

      {/* <div className={styles['title-block']}>
        <img src="/assets/token.png" alt="Token" />
        <h1>{t('earn.earn')}</h1>
      </div> */}

      <h1 className={styles.title}>Earn more points</h1>
      <p className={styles.text}>You will get GDP points for each completed task</p>

      <Segmented
        options={segmentOption}
        active={activeSegment}
      />

      { renderList() }

      <Menu />

      <EarnModal ref={modalRef} item={modalSelectedTask} />
    </div>
  );
}
